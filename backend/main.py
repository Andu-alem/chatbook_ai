from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.cors import CORSMiddleware
from models import (
    NewUser, UserModel, UserRegisterResponse, UserLoginResponse, BooksResponseModel, ChatQuery
)
from pydantic import BaseModel
from bson import ObjectId
from databases.base import lifespan
from databases.ingestion_db_init import vector_store
from utils.jwt_helpers import decode_token
from utils.query_helper import llm_response


app = FastAPI(lifespan=lifespan, docs_url="/docs")

app.add_middleware(
    middleware_class = CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserModel:
    payload = decode_token(token)
    email = payload.get("email")

    if not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user = await app.users.find_user(email)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.get("/")
def read_root():
    return "Hello, this is the project mangament backend entry point"

@app.post("/auth/register", response_model=UserRegisterResponse)
async def register_user(user: NewUser):
    return await app.users.create_user(user)

@app.post("/auth/login", response_model=UserLoginResponse)
async def login_user(user: NewUser):
    return await app.users.login_user(user)

@app.post("/auth/refresh-token")
async def refresh_token(token: str):
    return await app.users.refresh_access_token(token)


@app.get("/books", response_model=BooksResponseModel, dependencies=[Depends(get_current_user)])
async def get_all_books():
    return await app.books.get_all_books()

@app.post("/books/{book_id}/chat")
async def ai_chat_interface(book_id: str, chat_query: ChatQuery, current_user: UserModel = Depends(get_current_user)):
    book_title = await get_book_by_id(id)
    if book_title is None:
        raise HTTPException(status_code=404, detail="No book found")

    # Vector Search
    results = vector_store.similarity_search(
        chat_query.query, 
        k=3,
        pre_filter={ "book_id" : { "$eq": ObjectId(book_id) } }
    )

    if not results:
        raise HTTPException(status_code=404, detail="No relevant content found in book.")

    # Merge retrived documents
    relevant_text = " ".join([res.page_content for res in results])
    # Call llm on relevant context
    ai_response = llm_response(relevant_text, chat_query.query, book_title)

    return ai_response