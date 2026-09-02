from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.roles import Role, STUDENT


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str | None
    role: Role
    created_at: datetime


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: str | None = Field(default=None, max_length=255)
    role: Role = STUDENT


class UpdateUserRequest(BaseModel):
    """Тек жіберілген өрістер өзгереді (exclude_unset)."""

    email: EmailStr | None = None
    full_name: str | None = Field(default=None, max_length=255)
    role: Role | None = None
    password: str | None = Field(default=None, min_length=8, max_length=72)


class UpdateProfileRequest(BaseModel):
    # ФИО тұтас бір өріске жазылады.
    full_name: str | None = Field(default=None, max_length=255)
