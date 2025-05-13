from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session

from app.db.db import init_db, engine

from app.models.user_model import User
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.book_model import Book
from app.models.category_model import Category

from app.api.main_route import router
from app.db.elastic_search import ElasticService


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    print("✅ Database initialized!")

    session = Session(engine)

    try:
        elastic = ElasticService(session=session)
        if elastic.check_connection():
            print("✅ Elasticsearch is connected")
            elastic.init_index()
            count = elastic.es.count(index=elastic.index)["count"]
            if count == 0:
                print("📥 Elasticsearch index is empty. Syncing books...")
                elastic.sync_books()
        else:
            print("⚠️ Elasticsearch is not available")
    except Exception as e:
        print(f"❌ Error connecting to Elasticsearch: {e}")
        app.state.elastic = None

    yield

    print("Shutting down...")
    session.close()


app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173"]

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
