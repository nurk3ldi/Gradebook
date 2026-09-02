from pydantic import BaseModel, ConfigDict, EmailStr, Field

# bcrypt 72 байттан ұзын парольді қабылдамайды.
Password = Field(min_length=8, max_length=72)


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Password


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(max_length=72)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Password


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: str


class MessageResponse(BaseModel):
    message: str
    # Дев режимінде ғана: пошта жіберілмейтіндіктен токен осында қайтарылады.
    reset_token: str | None = None
