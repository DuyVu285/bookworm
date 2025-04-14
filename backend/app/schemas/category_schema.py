from pydantic import BaseModel


class CategoryBase(BaseModel):
    category_name: str
    category_description: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int

    class Config:
        orm_mode = True
