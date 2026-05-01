from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Base schema with shared attributes
class IssueBase(BaseModel):
    title: str
    description: str
    wing: str
    image_url: Optional[str] = None  # Optional for now


# What we expect to RECEIVE from the user to create an issue
class IssueCreate(IssueBase):
    pass


# What we SEND back to the user (includes ID and timestamp)
class IssueResponse(IssueBase):
    id: int
    status: str
    created_at: datetime
    # reporter_id: int # We will uncomment this when we add Auth


# --- User Schemas ---


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str

    class Config:
        # Public signup: don't allow clients to set role / other unexpected fields
        extra = "forbid"


class UserResponse(UserBase):
    id: int
    role: str
    is_warden: bool

    class Config:
        orm_mode = True


# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None

    class Config:
        orm_mode = True  # Tells Pydantic to read data from SQLAlchemy models
