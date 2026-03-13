from app.core.database import get_database
import uuid


class DecisionTraceRepository:

    def __init__(self):
        self.collection_name = "decision_traces"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    # create a decision trace
    async def create_trace(self, trace_data: dict):

        collection = self.get_collection()

        trace_data["_id"] = str(uuid.uuid4())

        await collection.insert_one(trace_data)

        trace_data["id"] = trace_data.pop("_id")

        return trace_data

    # get trace by id
    async def get_by_incident_id(self, incident_id: str):

        collection = self.get_collection()

        decision_trace = await collection.find_one({
            "incident_id": incident_id
        })

        if not decision_trace:
            return None

        decision_trace["id"] = decision_trace.pop("_id")

        return decision_trace