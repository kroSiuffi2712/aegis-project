from app.core.database import get_database
import uuid


class IncidentRepository:

    def __init__(self):
        self.collection_name = "incidents"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    # create a incident
    async def create_incident(self, data: dict):
        collection = self.get_collection()

        data["_id"] = str(uuid.uuid4())

        await collection.insert_one(data)

        return data

    # get a incident by id
    async def get_by_id(self, incident_id: str):
        collection = self.get_collection()
        return await collection.find_one({"_id": incident_id})

    # update a incident
    async def update_incident(self, incident_id: str, update_data: dict):
        collection = self.get_collection()

        await collection.update_one(
            {"_id": incident_id},
            {"$set": update_data}
        )

        return await collection.find_one({"_id": incident_id})

    async def search_incidents(
        self,
        status: str = None,
        severity: str = None,
        zone_id: str = None,
        insurance_id: str = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ):
        collection = self.get_collection()

        query = {}

        if status:
            query["status"] = status

        if severity:
            query["severity"] = severity

        if zone_id:
            query["zone_id"] = zone_id

        if insurance_id:
            query["patient.insurance_id"] = insurance_id

        direction = -1 if sort_order == "desc" else 1
        skip = (page - 1) * page_size

        pipeline = [
            {"$match": query},

            # join zones
            {
                "$lookup": {
                    "from": "zones",
                    "localField": "zone_id",
                    "foreignField": "_id",
                    "as": "zone"
                }
            },
            {"$unwind": {"path": "$zone", "preserveNullAndEmptyArrays": True}},

            # join ambulances
            {
                "$lookup": {
                    "from": "ambulances",
                    "localField": "assigned_ambulance_id",
                    "foreignField": "_id",
                    "as": "ambulance"
                }
            },
            {
                "$unwind": {
                    "path": "$ambulance",
                    "preserveNullAndEmptyArrays": True
                }
            },

            # join clinics
            {
                "$lookup": {
                    "from": "clinics",
                    "localField": "assigned_clinic_id",
                    "foreignField": "_id",
                    "as": "clinic"
                }
            },
            {
                "$unwind": {
                    "path": "$clinic",
                    "preserveNullAndEmptyArrays": True
                }
            },

            {"$sort": {sort_by: direction}},
            {"$skip": skip},
            {"$limit": page_size}
        ]

        cursor = collection.aggregate(pipeline)

        incidents = []

        async for incident in cursor:
            incidents.append({
                "id": str(incident["_id"]),
                "code": incident.get("code"),

                "zone": {
                    "_id": str(incident["zone"]["_id"]),
                    "name": incident["zone"]["name"],
                    "coordinates": [
                        {
                            "lat": coord[1],
                            "lng": coord[0]
                        }
                        for coord in incident["zone"]
                        .get("geometry", {})
                        .get("coordinates", [[]])[0]
                    ]
                } if incident.get("zone") else None,

                "ambulance": {
                    "id": str(incident["ambulance"]["_id"]),
                    "plate": incident["ambulance"].get("plate"),
                    "driver": incident["ambulance"].get("driver"),
                    "status": incident["ambulance"].get("status")
                } if incident.get("ambulance") else None,

                "clinic": {
                    "id": str(incident["clinic"]["_id"]),
                    "name": incident["clinic"].get("name"),
                    "address": incident["clinic"].get("address"),
                    "phone": incident["clinic"].get("phone"),
                    "location": incident["clinic"].get("location")
                } if incident.get("clinic") else None,

                "severity": incident.get("severity"),
                "risk_score": incident.get("risk_score"),
                "confidence": incident.get("confidence"),
                "assigned_supervisor_id": str(incident.get("assigned_supervisor_id")) if incident.get("assigned_supervisor_id") else None,
                "patient": incident.get("patient"),
                "symptoms_summary": incident.get("symptoms_summary"),
                "location": incident.get("location"),
                "status": incident.get("status"),
                "estimated_distance": incident.get("estimated_distance"),

                # Azure Routing Intelligence
                "eta_intelligence": incident.get("eta_intelligence"),
                "external_impact": incident.get("external_impact"),
                "transport_projection": incident.get("transport_projection"),
                "route": incident.get("route"),

                "created_at": incident.get("created_at"),
                "closed_at": incident.get("closed_at")
            })

        total_records = await collection.count_documents(query)

        return {
            "data": incidents,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_records": total_records,
                "total_pages": (total_records + page_size - 1) // page_size
            }
        }

    async def get_by_supervisor_id(self, supervisor_id: str):
        collection = self.get_collection()
        return await collection.find(
            {"assigned_supervisor_id": supervisor_id}
        ).to_list(length=None)

    async def count_by_supervisor_id(self, supervisor_id: str):
        collection = self.get_collection()
        return await collection.count_documents(
            {"assigned_supervisor_id": supervisor_id}
        )