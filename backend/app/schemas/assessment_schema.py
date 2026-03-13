from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime
import uuid


class CriticalMetric(BaseModel):
    parameter: str
    status: Literal["NORMAL", "WARNING", "CRITICAL"]
    risk_delta: float

class FactorProjectionMetric(BaseModel):
    parameter: str
    level: float

class FactorProjectionPoint(BaseModel):
    minute: int
    factors: List[FactorProjectionMetric]

class AIAssessment(BaseModel):
    incident_id: str
    agent_name: str = "RiskAgent"
    model_version: str = "v1.0"

    risk_score: float
    urgency_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    confidence: float
    critical_metrics: List[CriticalMetric]

    created_at: datetime = Field(default_factory=datetime.utcnow)

class CriticalMetricResponse(BaseModel):
    parameter: str
    status: Literal["NORMAL", "ELEVATED", "CRITICAL"]
    risk_delta: float


class AIAssessmentResponse(BaseModel):
    incident_id: str
    agent_name: str
    model_version: Optional[str] = None
    risk_score: float
    urgency_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    confidence: float
    critical_metrics: List[CriticalMetricResponse]
    factor_escalation_projection: Optional[List[FactorProjectionPoint]] = []
    created_at: datetime