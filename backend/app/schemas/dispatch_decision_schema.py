from pydantic import BaseModel

class DispatchDecision(BaseModel):
    selected_ambulance_index: int
    selected_clinic_index: int
    reasoning: str
    confidence: float