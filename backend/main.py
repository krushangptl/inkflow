from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from models import Base, User

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency for db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "InkFlow API is running 🚀"}

@app.post("/api/register")
def register_user(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")
    username = data.get("username", email.split("@")[0])

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(password)
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "Registration successful ✅"}

@app.post("/api/login")
def login_user(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")
    user = db.query(User).filter(User.email == email).first()

    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful 🎉", "user": {"username": user.username, "email": user.email}}
