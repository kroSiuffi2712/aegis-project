from datetime import datetime
from app.db.mongo import db


class IncidentUpdateService:

    async def update_incident(self, incident_id: str, data: dict):

        data["updated_at"] = datetime.utcnow()

        await db.incidents.update_one(
            {"_id": incident_id},
            {"$set": data}
        )