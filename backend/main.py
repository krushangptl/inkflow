from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3
import hashlib
import os
import shutil
from typing import Optional

app = FastAPI()

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for uploaded images
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

DATABASE = "users.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# ---------- MODELS ----------
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

# ---------- INIT DB ----------
db = get_db()
db.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT '',
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    bio TEXT DEFAULT '',
    password TEXT NOT NULL,
    profile_picture TEXT DEFAULT ''
)
""")
# Add column if it doesn't exist (safe migration)
try:
    db.execute("ALTER TABLE users ADD COLUMN profile_picture TEXT DEFAULT ''")
    db.commit()
except sqlite3.OperationalError:
    pass

# ---------- HELPERS ----------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ---------- AUTH ROUTES ----------
@app.post("/register")
def register(user: UserRegister):
    hashed_pw = hash_password(user.password)
    try:
        db = get_db()
        db.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (user.username, user.email, hashed_pw)
        )
        db.commit()
        return {"message": "User registered successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")

@app.post("/login")
def login(user: UserLogin):
    hashed_pw = hash_password(user.password)
    db = get_db()
    result = db.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (user.email, hashed_pw)
    ).fetchone()

    if result:
        return {
            "message": "Login successful",
            "user": {
                "id": result["id"],
                "username": result["username"],
                "email": result["email"],
                "name": result["name"],
                "bio": result["bio"],
                "profile_picture": result["profile_picture"]
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# ---------- USER ROUTES ----------
@app.get("/user/{user_id}")
def get_user(user_id: int):
    db = get_db()
    user = db.execute("""
        SELECT id, name, username, email, bio, profile_picture
        FROM users WHERE id = ?
    """, (user_id,)).fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return dict(user)

@app.post("/user/{user_id}/update")
def update_user(user_id: int, data: UserUpdate):
    db = get_db()
    db.execute("""
        UPDATE users SET name=?, username=?, email=?, bio=? WHERE id=?
    """, (data.name, data.username, data.email, data.bio, user_id))
    db.commit()
    return {"message": "User updated"}

@app.post("/user/{user_id}/password")
def update_password(user_id: int, data: PasswordUpdate):
    db = get_db()
    user = db.execute("SELECT password FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user or user["password"] != hash_password(data.current_password):
        raise HTTPException(status_code=400, detail="Current password incorrect")

    db.execute("UPDATE users SET password = ? WHERE id = ?", (hash_password(data.new_password), user_id))
    db.commit()
    return {"message": "Password updated"}

@app.delete("/user/{user_id}/delete")
def delete_user(user_id: int):
    db = get_db()
    db.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()
    return {"message": "User deleted"}

# ---------- FILE UPLOAD ROUTE ----------
@app.post("/user/{user_id}/upload-profile-picture")
def upload_profile_picture(user_id: int, file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[-1]
    filename = f"user_{user_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save file path to DB
    db = get_db()
    db.execute("UPDATE users SET profile_picture = ? WHERE id = ?", (file_path, user_id))
    db.commit()

    return {"message": "Profile picture uploaded", "path": file_path}
