from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

settings = get_settings()

client: Optional[AsyncIOMotorClient] = None


def connect_to_mongo():
    global client

    if client is None:

        print("Initializing MongoDB connection...")

        mongo_uri = settings.mongo_uri

        print(f"Running environment: {settings.ENVIRONMENT}")
        print(f"Database name: {settings.DATABASE_NAME}")

        if settings.ENVIRONMENT == "local":
            print("Using LOCAL MongoDB")
        else:
            print("Using AZURE CosmosDB (Mongo API)")

        client = AsyncIOMotorClient(mongo_uri)

        print("MongoDB connection initialized")


def close_mongo_connection():
    global client

    if client:
        client.close()
        print("MongoDB connection closed")


def get_database():

    if client is None:
        raise Exception("Database not initialized.")

    return client[settings.DATABASE_NAME]