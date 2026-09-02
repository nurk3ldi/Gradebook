from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Қосымша баптаулары. .env файлынан оқылады."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = (
        "postgresql+asyncpg://gradebook:gradebook@localhost:5432/gradebook"
    )
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
