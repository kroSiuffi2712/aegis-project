from app.core.database import get_database


class HealthRepository:

    def __init__(self):
        db = get_database()
        self.incidents = db["incidents"]
        self.zones = db["zones"]

    async def get_zone_capacity(self, zone_id: str):
        zone = await self.zones.find_one({"_id": zone_id})

        if not zone:
            raise Exception("Zone not found")

        return {
            "zone_name": zone["name"],
            "incident_limit": zone["incident_limit"],
            "active_incidents_zone": zone.get("active_incidents", 0)
        }

    async def get_incident_metrics(self, zone_id: str = None):

        query = {}
        if zone_id:
            query["zone_id"] = zone_id

        active = await self.incidents.count_documents(
            {**query, "status": {"$in": ["open", "routed"]}}
        )

        closed = await self.incidents.count_documents(
            {**query, "status": "closed"}
        )

        pipeline_avg = [
            {"$match": {**query, "status": {"$in": ["open", "routed"]}}},
            {"$group": {"_id": None, "avgRisk": {"$avg": "$risk_score"}}}
        ]

        result_avg = await self.incidents.aggregate(pipeline_avg).to_list(1)
        avg_risk = round(result_avg[0]["avgRisk"], 2) if result_avg else 0

        return {
            "active_incidents": active,
            "closed_incidents": closed,
            "avg_risk_score": avg_risk
        }