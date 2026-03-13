from app.repositories.provider_repository import ProviderRepository
from app.schemas.provider_schema import ProviderCreate
from app.data.providers_seed import PROVIDERS_SEED


class ProviderService:

    def __init__(self):
        self.repository = ProviderRepository()
    
    async def get_providers(self):

        providers = await self.repository.get_all_providers()

        for provider in providers:
            provider["id"] = str(provider["_id"])
            del provider["_id"]

        return providers

    async def create_provider(self, payload: ProviderCreate):

        collection = self.repository.get_collection()

        existing_provider = await collection.find_one({
            "name": payload.name
        })

        if existing_provider:
            return existing_provider

        provider_dict = payload.model_dump()

        await collection.insert_one(provider_dict)

        return provider_dict


    async def delete_provider(self, provider_id: str):
        return await self.repository.delete_provider(provider_id)


    async def seed_providers(self):

        collection = self.repository.get_collection()

        for provider in PROVIDERS_SEED:

            existing = await collection.find_one({
                "name": provider["name"]
            })

            if not existing:
                await collection.insert_one(provider)

        print("Providers seeded successfully")