from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import UserRegister, UserLogin
import sqlite3
import hashlib

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
conn = sqlite3.connect("users.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")
conn.commit()


# Helper - hash password
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@app.post("/register")
def register(user: UserRegister):
    hashed_pw = hash_password(user.password)
    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                       (user.username, user.email, hashed_pw))
        conn.commit()
        return {"message": "User registered successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")


@app.post("/login")
def login(user: UserLogin):
    hashed_pw = hash_password(user.password)
    cursor.execute("SELECT * FROM users WHERE email=? AND password=?", (user.email, hashed_pw))
    result = cursor.fetchone()
    if result:
        return {
            "message": "Login successful",
            "user": {
                "id": result[0],
                "username": result[1],
                "email": result[2]
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")
