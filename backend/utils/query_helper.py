from langchain.prompts import ChatPromptTemplate
from llm_setup import llm

# Prompt template for RAG
from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""
You are now speaking as the author of the book "{book_title}". 
Answer the user's questions as if you yourself wrote the book.

Book context (for your reference only, do not mention it explicitly):
{context}

User question:
{question}

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



def llm_response(context, question, book_title):
    formatted_prompt = prompt.format(context=context, question=question, book_title=book_title)
    print("Formatted Prompt:", formatted_prompt)
    response = llm.invoke(formatted_prompt)
    return response.content
