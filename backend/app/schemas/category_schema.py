from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    category_name: str
    category_description: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

