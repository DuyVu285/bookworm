from fastapi import APIRouter

from app.api.routes.user_route import router as user_router
from app.api.routes.book_route import router as book_router
from app.api.routes.author_route import router as author_router

router = APIRouter()

router.include_router(user_router)
router.include_router(book_router)
router.include_router(author_router)

