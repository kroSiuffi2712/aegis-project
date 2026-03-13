from app.core.database import get_database

class AgentRepository:
    
    def __init__(self):
        self.collection_name = "agents"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    async def get_all(self):
        collection = self.get_collection()
        return await collection.find().to_list(1000)

    async def get_by_id(self, agent_id: str):
        collection = self.get_collection()
        return await collection.find_one({"id": agent_id})