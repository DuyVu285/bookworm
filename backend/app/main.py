from contextlib import asynccontextmanager
from typing import Union
from fastapi import FastAPI

from app.db.db import init_db



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    print("Database initialized!")
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
