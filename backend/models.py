from pydantic import BaseModel, EmailStr
from typing import Optional, List
from bson import ObjectId

class NewUser(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: str

class UserModel(BaseModel):
    id: str
    name: Optional[str] = None
    email: EmailStr

    @staticmethod
    def from_doc(doc):
        return UserModel(
            id=str(doc["_id"]),
            name=doc["name"],
            email=doc["email"]
        )

class UserRegisterResponse(BaseModel):
    message: str

class Tokens(BaseModel):
    access_token: str
    refresh_token: str

class UserLoginResponse(BaseModel):
    message: str
    access_token: str

class RefreshTokenResponse(UserLoginResponse):
    pass
class BookModel(BaseModel):
    id: str
    title: str
    author: str
    genere: str

    @staticmethod
    def from_doc(doc):
        return BookModel(
            id=str(doc["_id"]),
            title=doc["title"],
            author=doc["author"],
            genere=doc["genere"]
        )

class BooksResponseModel(BaseModel):
    books: List[BookModel] = []

class ChatQuery(BaseModel):
    query: str
    