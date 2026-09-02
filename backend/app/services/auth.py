from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import User
from app.security import (
    create_token,
    decode_token,
    hash_password,
    password_fingerprint,
    verify_password,
)


class EmailAlreadyUsed(Exception):
    """Мұндай пошта тіркелген."""


class InvalidResetToken(Exception):
    """Сброс токені жарамсыз, мерзімі өткен немесе бұрын қолданылған."""


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    return await db.scalar(select(User).where(User.email == email))


async def register(db: AsyncSession, email: str, password: str) -> User:
    if await get_by_email(db, email):
        raise EmailAlreadyUsed

    user = User(email=email, password_hash=hash_password(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate(db: AsyncSession, email: str, password: str) -> User | None:
    user = await get_by_email(db, email)
    if user is None or not verify_password(password, user.password_hash):
        return None
    return user


def create_access_token(user: User) -> str:
    """Токен ағымдағы паролге байлаулы: пароль ауысса, сессиялар жабылады."""
    return create_token(
        str(user.id),
        timedelta(minutes=settings.access_token_ttl_minutes),
        ph=password_fingerprint(user.password_hash),
    )


def create_reset_token(user: User) -> str:
    """Токен ағымдағы паролге байланысты — пароль ауысқанда ол жарамсыз болады."""
    return create_token(
        str(user.id),
        timedelta(minutes=settings.reset_token_ttl_minutes),
        kind="reset",
        ph=password_fingerprint(user.password_hash),
    )


async def get_by_access_token(db: AsyncSession, token: str) -> User | None:
    payload = decode_token(token)
    if payload is None or payload.get("kind") is not None:
        return None

    user = await db.get(User, int(payload["sub"]))
    if user is None or payload.get("ph") != password_fingerprint(user.password_hash):
        return None
    return user


async def reset_password(db: AsyncSession, token: str, password: str) -> None:
    payload = decode_token(token)
    if payload is None or payload.get("kind") != "reset":
        raise InvalidResetToken

    user = await db.get(User, int(payload["sub"]))
    if user is None or payload.get("ph") != password_fingerprint(user.password_hash):
        raise InvalidResetToken

    user.password_hash = hash_password(password)
    await db.commit()
