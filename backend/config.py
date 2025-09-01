import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    DB_NAME: str = os.getenv("DB_NAME")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")


settings = Settings()