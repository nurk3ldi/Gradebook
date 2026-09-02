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
    reset_code_ttl_minutes: int = 15
    reset_code_max_attempts: int = 5

    debug: bool = True

    # SMTP. Бос болса — пошта жіберілмей, код серверлогына жазылады (дев режимі).
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""



settings = Settings()
