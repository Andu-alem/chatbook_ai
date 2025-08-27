from motor.motor_asyncio import AsyncIOMotorCollection
from fastapi import HTTPException
from models import BookModel, BooksResponseModel
from typing import List
from bson import ObjectId

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

    async def get_book_by_id(self, id: str, session=None) -> BookModel:
        book = await self._book_collection.find_one(
            { "_id": ObjectId(id) },
            session=session
        )

        if book is None:
            return None
            
        return BookModel.from_doc(book)

