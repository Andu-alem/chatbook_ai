from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient
from dotenv import load_dotenv
from config import settings
from index_handler.embedding_tool import embedding_model


client = MongoClient(settings.MONGODB_URI)
db = client[settings.DB_NAME]

books_meta_collection = db["books"]
books_chunk_collection = db["books_chunk"]

vector_store = MongoDBAtlasVectorSearch(
    collection=books_chunk_collection,
    embedding=embedding_model,
    index_name="default",
    relevance_score_fn="cosine"
)