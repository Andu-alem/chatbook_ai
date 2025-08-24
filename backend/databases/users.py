from motor.motor_asyncio import AsyncIOMotorCollection
from fastapi import HTTPException
from pydantic import BaseModel
from bson import ObjectId
from utils.jwt_helpers import (
    get_password_hash, create_access_token, create_refresh_token, verify_password, decode_token
)   
from models import NewUser, UserModel, UserLoginResponse, UserRegisterResponse

class UserRepository:
    def __init__(self, user_collection: AsyncIOMotorCollection):
        self._user_collection = user_collection

    async def find_user(self, email: str, session=None):
        user = await self._user_collection.find_one(
            { "email": email },
            session=session
        )
        if user is None:
            return None

        return UserModel.from_doc(user)

    async def create_user(self, user: NewUser):
        hashed_password = get_password_hash(user.password)
        existing_user = await self.find_user(user.email)

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User already registered"
            )

        new_user = await self._user_collection.insert_one({
            "name": user.name,
            "email": user.email,
            "password": hashed_password,
            "refresh_token": ""
        })

        if new_user is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to create user"
            )
        
        return UserRegisterResponse(message="User successfully registered")

    async def update_refresh_token(self, id: str, token: str, session=None):
        await self._user_collection.update_one(
            { "_id": ObjectId(id) },
            { "$set": { "refresh_token": token } },
            session=session
        )
        return True
    
    async def login_user(self, user: NewUser):
        hashed_password = get_password_hash(user.password)
        userData = await self.find_user(user.email)

        if not userData or not verify_password(user.password, userData.password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )
        
        access_token = create_access_token({
            "sub": userData.id,
            "email": userData.email
        })

        refresh_token = create_refresh_token({
            "sub": userData.id,
            "email": userData.email
        })
        if not refresh_token or not access_token:
            # If token creation fails, raise an error
            raise HTTPException(
                status_code=500,
                detail="Failed to create refresh token"
            )

        # Update the user's refresh token in the database
        if not await self.update_refresh_token(userData.id, refresh_token):
            raise HTTPException(
                status_code=500,
                detail="Failed to update refresh token"
            )
        # Return the access and refresh tokens
        return UserLoginResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )

    async def refresh_access_token(self, token: str):
        # Decode the refresh token to get user information
        payload = decode_token(token)
        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id or not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        user = await self.find_user(email)
        if not user or user.id != user_id:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        # Create a new access token
        access_token = create_access_token({
            "sub": user.id,
            "email": user.email
        })

        return UserLoginResponse(
            access_token=access_token,
            refresh_token=token  # Return the same refresh token
        )
