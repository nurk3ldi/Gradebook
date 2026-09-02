from collections.abc import Sequence

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.roles import ADMIN, Role


async def list_users(db: AsyncSession, role: Role | None = None) -> Sequence[User]:
    query = select(User).order_by(User.id)
    if role is not None:
        query = query.where(User.role == role)
    return (await db.scalars(query)).all()


async def set_role(db: AsyncSession, user_id: int, role: Role) -> User | None:
    user = await db.get(User, user_id)
    if user is None:
        return None

    user.role = role
    await db.commit()
    await db.refresh(user)
    return user


async def delete_user(db: AsyncSession, user_id: int) -> bool:
    user = await db.get(User, user_id)
    if user is None:
        return False

    await db.delete(user)
    await db.commit()
    return True


async def ensure_admins(db: AsyncSession, emails: Sequence[str]) -> None:
    """Қосымша іске қосылғанда .env-тегі пошталарға admin рөлін береді."""
    if not emails:
        return

    await db.execute(
        update(User).where(User.email.in_(emails), User.role != ADMIN).values(role=ADMIN)
    )
    await db.commit()
