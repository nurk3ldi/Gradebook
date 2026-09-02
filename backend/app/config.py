from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Қосымша баптаулары. .env файлынан оқылады."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = (
        "postgresql+asyncpg://gradebook:gradebook@localhost:5432/gradebook"
    )
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:5174"]

    secret_key: str = "dev-secret-key-change-me-in-production-32b"
    access_token_ttl_minutes: int = 60 * 24
    reset_token_ttl_minutes: int = 30

    # Дев режимі: пошта жіберілмейтіндіктен, сброс токені жауапта қайтарылады.
    debug: bool = True


settings = Settings()
