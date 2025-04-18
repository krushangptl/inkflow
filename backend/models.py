from pydantic import BaseModel

# User-related
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: str
    username: str
    email: str
    bio: str

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

# Blog-related
class BlogCreate(BaseModel):
    title: str
    content: str