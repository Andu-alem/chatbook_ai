from utils.pdf_handler import PdfHandler
from utils.books_meta import books_data
from databases.ingestion_db_init import vector_store, books_meta_collection
from langchain_core.documents import Document
import time
from bson import ObjectId


def store_book_meta(book_data: dict) -> ObjectId:
    # Check whether book existance, if it exist return its id
    existing_book = books_meta_collection.find_one({"title": book_data["title"]})
    if existing_book:
        return existing_book["_id"]

    # Store a book and return its id
    book = books_meta_collection.insert_one({
        "title": book_data["title"],
        "author": book_data["author"],
        "genere": book_data["genere"]
    })

    if book is None:
        raise Exception("can not add a book")

    return book.inserted_id

# Full Workflow
if __name__ == "__main__":
    for book_data in books_data:

        handler = PdfHandler(book_data)

        chunks = handler.chunk_documents()

        if chunks:
            print("Creating embeddings for ....", book_data["title"])
            book_id = store_book_meta(book_data)
            print("creating documents for book id ....", book_id)
            documents = [ Document(
                page_content=chunk.page_content,
                metadata={"book_id": book_id}) for chunk in chunks]

            batch_size = 10
            docs_length = len(documents)
            for i in range(0, docs_length, batch_size):
                batch = documents[i:i + batch_size]
                try:
                    vector_store.add_documents(batch)
                    print(f"Added batch {i // batch_size + 1} of {docs_length // batch_size + 1} batches")
                    time.sleep(10)
                except Exception as e:
                    print(f"Error adding batch {i // batch_size + 1}: {e}")

            print("Documents added successfully")
