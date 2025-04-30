from pydantic import BaseModel


class CategoryRead(BaseModel):
    category_name: str
    id: int


class CategoriesRead(BaseModel):
    data: list[CategoryRead]
