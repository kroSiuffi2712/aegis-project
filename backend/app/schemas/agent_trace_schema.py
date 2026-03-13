from pydantic import BaseModel
from typing import List


class AgentDecisionStep(BaseModel):
    agent_name: str
    decision: str
    confidence: float
    latency_ms: float
    timestamp: str

class DecisionResponse(BaseModel):
    time:str
    confidence:int

class AgentTraceResponse(BaseModel):
    model_version: str
    inference_mode: str
    decision_stability_trend: List[DecisionResponse]
    decision_steps: List[AgentDecisionStep]
    evaluation_score: float