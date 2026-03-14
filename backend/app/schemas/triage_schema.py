from pydantic import BaseModel, Field
from typing import List


class CriticalMetric(BaseModel):
    parameter: str
    status: str
    risk_delta: float


class TriageResult(BaseModel):
    incident_type: str
    category: str
    criticality_level: int = Field(ge=1, le=4)
    confidence: float = Field(ge=0, le=1)
    guideline_reference: str
    critical_metrics: List[CriticalMetric]