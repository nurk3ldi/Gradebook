"""ORM модельдері. Alembic автогенерациясы үшін бәрі осында импортталады."""

from app.db import Base
from app.models.user import User

__all__ = ["Base", "User"]
