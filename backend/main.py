from fastapi import FastAPI, Depends, HTTPException, Response, Request
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.cors import CORSMiddleware
from models import (
    NewUser, UserModel, UserRegisterResponse, UserLoginResponse, BooksResponseModel, ChatQuery, BookModel, Tokens, RefreshTokenResponse
)
from databases.base import lifespan
from utils.jwt_helpers import decode_token
from rag_pipeline_handler import llm_response


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
    return "Hello, this is the talkbook ai project backend entry point"

@app.get("/health")
def health_check():
    return "OK"

@app.post("/auth/register", response_model=UserRegisterResponse)
async def register_user(user: NewUser):
    return await app.users.create_user(user)

@app.post("/auth/login", response_model=UserLoginResponse)
async def login_user(user: NewUser, response: Response):
    login_tokens: Tokens = await app.users.login_user(user)
    
    response.set_cookie(
        key="refresh_token",
        value=login_tokens.refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )
    
    return UserLoginResponse(
        message="Logged-in successfully",
        access_token=login_tokens.access_token
    )

@app.post("/auth/refresh-token", response_model=RefreshTokenResponse)
async def refresh_token(request: Request):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    
    new_tokens: Tokens = await app.users.refresh_access_token(token)
    
    return RefreshTokenResponse(
        new_access_token=new_tokens.access_token
    )


@app.get("/books", response_model=BooksResponseModel, dependencies=[Depends(get_current_user)])
async def get_all_books():
    return await app.books.get_all_books()

@app.post("/books/{book_id}/chat")
async def ai_chat_interface(
    book_id: str, 
    chat_query: ChatQuery, 
    current_user: UserModel = Depends(get_current_user)
) -> str:
    book: BookModel = await app.books.get_book_by_id(book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="No book found")

    # Call rag pipeline handler with user question and important datas
    ai_response = llm_response(
        question=chat_query.query, 
        user_name=current_user.name,
        user_id=current_user.id,
        book_id=book_id,
        book_title=book.title
    )

    return ai_response