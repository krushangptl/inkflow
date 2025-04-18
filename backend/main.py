from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import sqlite3
import hashlib
import os
import shutil

from models import UserRegister, UserLogin, UserUpdate, PasswordUpdate, BlogCreate

app = FastAPI()

# Allow frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production: replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
DATABASE = "users.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# ---------- INITIALIZE TABLES ----------
db = get_db()

# User Table
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

# Blog Table
db.execute("""
CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

db.commit()

# ---------- UTILS ----------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ---------- AUTH ----------
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
        return {"message": "User registered"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")

@app.post("/login")
def login(user: UserLogin):
    hashed_pw = hash_password(user.password)
    db = get_db()
    result = db.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
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
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ---------- USER ----------
@app.get("/user/{user_id}")
def get_user(user_id: int):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
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
    user = db.execute("SELECT password FROM users WHERE id=?", (user_id,)).fetchone()
    if not user or user["password"] != hash_password(data.current_password):
        raise HTTPException(status_code=400, detail="Current password incorrect")

    db.execute("UPDATE users SET password=? WHERE id=?", (hash_password(data.new_password), user_id))
    db.commit()
    return {"message": "Password changed"}

@app.delete("/user/{user_id}/delete")
def delete_user(user_id: int):
    db = get_db()
    db.execute("DELETE FROM users WHERE id=?", (user_id,))
    db.commit()
    return {"message": "User deleted"}

# ---------- PROFILE PICTURE ----------
@app.post("/user/{user_id}/upload-profile-picture")
def upload_profile_picture(user_id: int, file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[-1]
    filename = f"user_{user_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db = get_db()
    db.execute("UPDATE users SET profile_picture=? WHERE id=?", (file_path, user_id))
    db.commit()
    return {"message": "Profile picture uploaded", "path": file_path}

# ---------- BLOG ROUTES ----------
@app.post("/blogs")
def create_blog(blog: BlogCreate):
    db = get_db()
    db.execute(
        "INSERT INTO blogs (title, content) VALUES (?, ?)",
        (blog.title, blog.content)
    )
    db.commit()
    return {"message": "Blog posted successfully"}

@app.get("/blogs")
def get_all_blogs():
    try:
        db = get_db()
        blogs = db.execute("SELECT * FROM blogs ORDER BY created_at DESC").fetchall()
        return [dict(blog) for blog in blogs]
    except Exception as e:
        print("Error fetching blogs:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/blogs/latest")
def get_latest_blogs():
    db = get_db()
    blogs = db.execute("SELECT * FROM blogs ORDER BY created_at DESC LIMIT 3").fetchall()
    return [dict(blog) for blog in blogs]

@app.get("/blogs/{blog_id}")
def get_blog(blog_id: int):
    db = get_db()
    blog = db.execute("SELECT * FROM blogs WHERE id=?", (blog_id,)).fetchone()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return dict(blog)
