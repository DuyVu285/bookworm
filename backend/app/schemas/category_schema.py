from pydantic import BaseModel


class CategoryBase(BaseModel):
    category_name: str
    category_description: str


class CategoryRead(CategoryBase):
    id: int


class CategoriesRead(BaseModel):
    data: list[CategoryRead]
