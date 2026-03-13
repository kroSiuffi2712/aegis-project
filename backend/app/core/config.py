from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Aegis Backend"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str
    CORS_ORIGINS: str

    # Local MongoDB connection string
    MONGO_URI: str

    # Azure Cosmos DB connection string
    MONGO_URI_AZURE: str

    # Database name
    DATABASE_NAME: str = "aegis_db"

    # Azure services
    AZURE_OPENAI_ENDPOINT: str = "demo"
    AZURE_OPENAI_KEY: str = "demo"
    AZURE_MONITOR_CONNECTION_STRING: str = "demo"
    AZURE_MAPS_KEY: str
    AZURE_MAPS_URL: str
    AZURE_SEARCH_ENDPOINT: str
    AZURE_SEARCH_INDEX: str
    AZURE_SEARCH_KEY: str

    OPENAI_API_KEY: str
    OPENAI_MODEL: str

    @property
    def mongo_uri(self) -> str:

        if self.ENVIRONMENT == "local":
            print("Using LOCAL MongoDB")
            return self.MONGO_URI

        if self.ENVIRONMENT in ["development", "production"]:
            print("Using AZURE CosmosDB (Mongo API)")
            return self.MONGO_URI_AZURE

        raise ValueError(f"Unknown environment: {self.ENVIRONMENT}")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()