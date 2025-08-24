from langchain.prompts import ChatPromptTemplate
from llm_setup import llm

# Prompt template for RAG
from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""
You are an AI assistant helping the user understand the book "{book_title}".

Book context:
{context}

User question:
{question}

Instructions:
- If the user asks a factual question, answer based only on the book context.
- If the user asks for a summary (e.g. "summarize", "main idea", "overview"), provide a concise summary of the book context, highlighting key themes and ideas.
- If the context does not contain the answer, reply: "I couldn’t find that in the book context."
- Always keep answers clear and concise.
""")

def llm_response(context, question, book_title):
    formatted_prompt = prompt.format(context=context, question=question, book_title=book_title)
    print("Formatted Prompt:", formatted_prompt)
    response = llm.invoke(formatted_prompt)
    return response.content
