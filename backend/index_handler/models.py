from pydantic import BaseModel, EmailStr
from typing import Optional, List
from bson import ObjectId

class Token(BaseModel):
    token: str

class NewUser(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: str

class UserModel(NewUser):
    id: str

    @staticmethod
    def from_doc(doc):
        return UserModel(
            id=str(doc["_id"]),
            name=doc["name"],
            email=doc["email"],
            password=doc["password"]
        )

class UserRegisterResponse(BaseModel):
    message: str

class UserLoginResponse(BaseModel):
    access_token: str
    refresh_token: str

class NewTask(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False

class TaskStatusUpdate(BaseModel):
    is_completed: bool

class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    is_completed: bool = False

class NewProject(BaseModel):
    title: str
    description: Optional[str] = None
    tasks: List[NewTask] = []

class Project(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    tasks: List[Task] = []

    @staticmethod
    def from_doc(doc):
        return Project(
            id = str(doc["_id"]),
            title = doc["title"],
            description = doc["description"],
            tasks = doc["tasks"]
        )

class SingleProjectResponse(BaseModel):
    project: Project

class ProjectsListResponse(BaseModel):
    projects: List[Project]

class CreateProjectResponse(BaseModel):
    project_id: str