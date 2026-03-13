from pydantic import BaseModel
from typing import List


class AgentSummary(BaseModel):
    id: str
    name: str
    zone: str
    active_cases: int


class AgentMetricsResponse(BaseModel):
    effectiveness: float
    total_cases: int
    critical_cases: int
    avg_latency_ms: int
    decision_reliability: float
    operational_risk_index: float