from pydantic import BaseModel, HttpUrl, Field, ValidationError
from typing import Optional

class ArticleSchema(BaseModel):
    thumbnail: Optional[HttpUrl] = None  # Tidak wajib, default None
    title: str = Field(..., min_length=3)
    content: str = Field(..., min_length=10)
    author_id: str
    category_id: str
    is_live: bool

def validate_article(data):
    try:
        validated_article = ArticleSchema(**data)
        return validated_article, None
    except ValidationError as e:
        errors = [{"field": err["loc"][0], "message": err["msg"]} for err in e.errors()]
        return None, errors
