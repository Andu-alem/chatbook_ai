from index_handler.db import books_meta_collection, books_chunk_collection
from bson import ObjectId
from datetime import datetime

def store_embeddings(embedded_chunks, _id: ObjectId):
    docs = []
    for i, (text, embedding) in enumerate(embedded_chunks):
        doc = {
            "book_id": _id,
            "text": text,
            "embedding": embedding,
            "create_at": datetime.utcnow()
        }
        docs.append(doc)
    books_chunk_collection.insert_many(docs)

    return True


def store_book_meta(book_data: dict):
    book = books_meta_collection.insert_one({
        "title": book_data["title"],
        "author": book_data["author"],
        "genere": book_data["genere"]
    })

    if book is None:
        raise Exception("can not add a book")

    return book.inserted_id