from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.runnables import RunnablePassthrough
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import MessagesPlaceholder, ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from config import settings
from llm_setup import llm
from databases.ingestion_db_init import vector_store
from bson import ObjectId

def get_session_history(session_id: str) -> MongoDBChatMessageHistory:
    return MongoDBChatMessageHistory(
        connection_string=settings.MONGODB_URI,
        database_name=settings.DB_NAME,
        collection_name="chat_history_memory",
        session_id=session_id
    )
    
def llm_response(question, book_title=None, user_name=None, user_id=None, book_id=None):
    # Create a prompt to generate standalone questions from follow-up questions based on chat history
    standalone_system_prompt = """
    Given a chat history and a follow-up question, rephrase the follow-up question to be a standalone question.
    Do NOT answer the question, just reformulate it if needed, otherwise return it as is.
    Only return the final standalone question.
    """
    standalone_question_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", standalone_system_prompt),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}"),
        ]
    )
    # Create a question rephrase chain that processes the user question for efficient retrival operation
    question_rephrase_chain = standalone_question_prompt | llm | StrOutputParser()

    # Create a retriever
    retriever = vector_store.as_retriever(
        search_type="similarity", 
        search_kwargs={ "k": 3, "pre_filter": { "book_id" : { "$eq": ObjectId(book_id) } } },
    )
    
    # Create a retriever chain that processes the question with history and retrieves documents
    retriever_chain = RunnablePassthrough.assign(
        context=question_rephrase_chain | retriever | (lambda docs: "\n\n".join([d.page_content for d in docs]))
    )

    # Create a prompt template that includes the retrieved context and chat history
    rag_system_prompt = """
    You are now speaking as the author of the book "{book_title}". 
    Answer the user, called {user_name}, as if you yourself wrote the book.

    Book context (for your reference only,  do not mention it explicitly):
    {context}

    Instructions:
    - Speak in the first person as the author (e.g., "I argue...", "In my work, I describe...").
    - Do not say "the book says", "the context mentions", or "the provided text".
    - For factual questions: Base your answer only on the book context. 
    If the context does not contain the answer, reply exactly: "I couldn’t find that in the book context."
    - For summarization requests: Provide a concise overview of the book’s main ideas. 
    If the context is limited, you may include your general knowledge of "{book_title}" — but only if you are certain.
    - If the question is opinion-based, respond as the author would, using the ideas present in the context or widely known themes of the book.
    - Keep answers clear and concise (3–5 sentences unless the user explicitly asks for more detail).
    """


    rag_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", rag_system_prompt),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}"),
        ]
    )
    # Build the RAG chain
    rag_chain = (
        retriever_chain
        | rag_prompt
        | llm
        | StrOutputParser()
    )

    # Wrap the chain with message history
    rag_with_memory = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="history",
    )

    # Create session id by combining user and book ids to differentiate chat histories
    session_id = f"{user_id}_{book_id}" if user_id and book_id else "default_session"
    
    # Invoke the chain with user question and appropriate placeholder datas and return the output
    response = rag_with_memory.invoke(
        { "question": question, "book_title": book_title, "user_name": user_name or "User" },
        {"configurable": {"session_id": session_id}}
    )
    
    return response