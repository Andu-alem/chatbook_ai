from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from fastapi import FastAPI
from config import settings
from databases.users import UserRepository
from databases.projects import ProjectRepository

COLLECTION_NAMES = ["users", "books", "books_chunk"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startapp:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client.get_database(settings.DB_NAME)

    # Ensure the database is available
    pong = await database.command("ping")
    if int(pong["ok"]) != 1:
        raise Exception("Cluster connection is not okay!")

    users = database.get_collection(COLLECTION_NAMES[0])
    books = database.get_collection(COLLECTION_NAMES[1])

    app.users = UserRepository(users)
    app.projects = ProjectRepository(projects)

    # Yield back to FastAPI Application:
    yield

    ## Shutdown:
    client.close()

