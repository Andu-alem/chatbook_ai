from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain_mongodb import MongoDBChatMessageHistory
from langchain.chains import LLMChain
from llm_setup import llm
from config import settings

prompt = ChatPromptTemplate.from_template("""
You are now speaking as the author of the book "{book_title}". 
Answer the user, called {user_name}, questions as if you yourself wrote the book.

Book context (for your reference only, do not mention it explicitly):
{context}

Previouse chat history (for your reference only, do not mention it explicitly):
{chat_history}
User: {question}
As the author of "{book_title}", I respond:

Instructions:
- Speak in the first person as the author (e.g., "I argue...", "In my work, I describe...").
- Do not say "the book says", "the context mentions", or "the provided text".
- For factual questions: Base your answer only on the book context. 
  If the context does not contain the answer, reply exactly: "I couldn’t find that in the book context."
- For summarization requests: Provide a concise overview of the book’s main ideas. 
  If the context is limited, you may include your general knowledge of "{book_title}" — but only if you are certain. 
- If the question is opinion-based, respond as the author would, using the ideas present in the context or widely known themes of the book.
- Keep answers clear and concise (3–5 sentences unless the user explicitly asks for more detail).
""")



def llm_response(context, question, book_title, user_name=None, user_id=None, book_id=None):
    # initialise messsage history
    message_history = MongoDBChatMessageHistory(
        connection_string=settings.MONGODB_URI,
        database_name=settings.DB_NAME,
        collection_name="chat_history",
        session_id=f"{user_id}_{book_id}" if user_id and book_id else "default_session"
    )
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        chat_memory=message_history,
        input_key="question",
        return_messages=True
    )
    
    # formatted_prompt = prompt.format(context=context, question=question, book_title=book_title)
    # print("Formatted Prompt:", formatted_prompt)
    chain = LLMChain(llm=llm, prompt=prompt, memory=memory)
    # chain = memory | prompt | llm
    
    response = chain.invoke({
        "context": context,
        "question": question,
        "book_title": book_title,
        "user_name": user_name or "User"
    })
    # response = llm.invoke(formatted_prompt)
    return response["text"]
