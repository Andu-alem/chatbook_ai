from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from models import (
    NewUser, UserModel, UserRegisterResponse, UserLoginResponse, BooksResponseModel
)
from databases.base import lifespan
from routes import projects, auth
from index_handler.db import vector_store

app = FastAPI(lifespan=lifespan, docs_url="/docs")

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

@app.get("/books", response_model=BooksResponseModel)
async def get_all_books():
    return await app.books.get_all_books()


@app.post("/books/{book_id}/chat")
async def ai_chat_interface(book_id: str, chat_query: str, current_user: UserModel = Depends(get_current_user)):
    results = vector_store.similarity_search(chat_query, k=3)
    
    relevant_text = ""
    for res in results:
        relevant_text += res.page_content

    return current_user