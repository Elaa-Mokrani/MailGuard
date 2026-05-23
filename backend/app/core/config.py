from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "MailGuard Backend"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    debug: bool = False

    host: str = "0.0.0.0"
    port: int = 8000

    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )

    models_dir: Path = Field(default_factory=lambda: BACKEND_DIR / "models_complete_lstm")
    dataset_path: Path = Field(default_factory=lambda: BACKEND_DIR / "dataset" / "dataset_complet.csv")
    gemini_api_key: str | None = None
    max_batch_size: int = 32
    max_upload_size_mb: int = 50

    @field_validator("models_dir", "dataset_path", mode="after")
    @classmethod
    def resolve_backend_relative_path(cls, value: Path) -> Path:
        if value.is_absolute():
            return value
        return (BACKEND_DIR / value).resolve()

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
