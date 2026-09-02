from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import CurrentUser, Db, require_role
from app.models import User
from app.roles import ADMIN
from app.schemas.user import CreateUserRequest, SetRoleRequest, UserResponse
from app.services import auth as auth_service, user as user_service
from app.services.auth import EmailAlreadyUsed

router = APIRouter()

AdminUser = Annotated[User, Depends(require_role(ADMIN))]


@router.get("")
async def list_users(db: Db, admin: AdminUser) -> list[UserResponse]:
    users = await user_service.list_users(db)
    return [UserResponse.model_validate(user) for user in users]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_user(
    data: CreateUserRequest, db: Db, admin: AdminUser
) -> UserResponse:
    try:
        user = await auth_service.register(
            db, data.email, data.password, data.role, data.full_name
        )
    except EmailAlreadyUsed:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Такая почта уже зарегистрирована"
        ) from None
    return UserResponse.model_validate(user)


@router.patch("/{user_id}/role")
async def set_role(
    user_id: int, data: SetRoleRequest, db: Db, admin: AdminUser
) -> UserResponse:
    if user_id == admin.id:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Нельзя изменить собственную роль"
        )

    user = await user_service.set_role(db, user_id, data.role)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")
    return UserResponse.model_validate(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Db, admin: AdminUser) -> None:
    if user_id == admin.id:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Нельзя удалить собственный аккаунт"
        )

    if not await user_service.delete_user(db, user_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")


@router.get("/me")
async def me(user: CurrentUser) -> UserResponse:
    return UserResponse.model_validate(user)
