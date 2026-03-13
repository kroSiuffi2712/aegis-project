from app.schemas.provider_schema import ProviderCreate
from app.core.database import get_database


class ProviderRepository:

    def __init__(self):
        self.collection_name = "providers"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    async def get_all_providers(self):
        collection = self.get_collection()
        providers = await collection.find().to_list(length=100)
        return providers

    async def get_provider_by_id(self, provider_id: str):
        collection = self.get_collection()
        return await collection.find_one({"_id": provider_id})

    async def delete_provider(self, provider_id: str):
        collection = self.get_collection()
        return await collection.delete_one({"_id": provider_id})