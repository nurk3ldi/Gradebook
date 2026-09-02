from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import Db, get_current_user
from app.config import settings
from app.models import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from app.services import auth as auth_service
from app.services.auth import EmailAlreadyUsed, InvalidResetToken

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: Db) -> TokenResponse:
    try:
        user = await auth_service.register(db, data.email, data.password)
    except EmailAlreadyUsed:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Такая почта уже зарегистрирована"
        ) from None
    return TokenResponse(access_token=auth_service.create_access_token(user))


@router.post("/login")
async def login(data: LoginRequest, db: Db) -> TokenResponse:
    user = await auth_service.authenticate(db, data.email, data.password)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Неверная почта или пароль")
    return TokenResponse(access_token=auth_service.create_access_token(user))


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: Db) -> MessageResponse:
    user = await auth_service.get_by_email(db, data.email)

    # Пошта тіркелген-тіркелмегенін ашпаймыз: жауап әрқашан бірдей.
    response = MessageResponse(
        message="Если такая почта зарегистрирована, мы отправили ссылку для сброса пароля"
    )
    if user is not None and settings.debug:
        # TODO: прод режимде токенді поштаға жіберу керек (SMTP әлі жоқ).
        response.reset_token = auth_service.create_reset_token(user)
    return response


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: Db) -> MessageResponse:
    try:
        await auth_service.reset_password(db, data.token, data.password)
    except InvalidResetToken:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Ссылка недействительна или устарела"
        ) from None
    return MessageResponse(message="Пароль обновлён")


@router.get("/me")
async def me(user: Annotated[User, Depends(get_current_user)]) -> UserResponse:
    return UserResponse.model_validate(user)
