from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.db import init_db

from app.models.user_model import User
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.book_model import Book
from app.models.category_model import Category

from app.api.main_route import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    print("Database initialized!")
    yield
    print("Shutting down...")


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(router)


@app.get("/")
def read_root():
    return {"Welcome to Bookstore Server!"}
