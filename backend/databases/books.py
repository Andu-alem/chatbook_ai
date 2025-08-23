from motor.motor_asyncio import AsyncIOMotorCollection
from fastapi import HTTPException
from models import BookModel, BooksResponseModel
from typing import List

class BookRepository:
    def __init__(self, book_collection: AsyncIOMotorCollection):
        self._book_collection = book_collection

    async def get_all_books(self, session=None):
        books = []
        async for doc in self._book_collection.find(session=session):
            books.append(
                BookModel.from_doc(doc)
            )

        if not books:
            raise HTTPException(
                status_code=404,
                detail="No books found"
            )

        return BooksResponseModel(
            books = books
        )

