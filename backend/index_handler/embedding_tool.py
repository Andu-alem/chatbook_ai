from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os
import time

load_dotenv()


embedding_model = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

def embed_chunks(chunks):
    texts = [chunk.page_content for chunk in chunks]

    embeddings = []
    for text in texts:
        print(f"Generating embedding for: {text[:30]}...")
        embedding = embedding_model.embed_query(text)
        embeddings.append(embedding)
        time.sleep(3)  # To avoid hitting rate limits

    return list(zip(texts, embeddings))

def embed_text(text):
    print(f"Generating embedding for: {text[:30]}...")
    embedding = embedding_model.embed_query(text)
    time.sleep(3)  # To avoid hitting rate limits
    return embedding
