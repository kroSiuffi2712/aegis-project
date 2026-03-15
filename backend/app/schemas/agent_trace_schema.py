from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional, Any


class AgentDecisionStep(BaseModel):
    agent_name: str
    agent_type: Optional[str] = None
    decision: str
    confidence: float
    latency_ms: float
    timestamp: str

class DecisionResponse(BaseModel):
    time:str
    confidence:int

class AgentTraceResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    model_version: str
    inference_mode: str
    decision_stability_trend: List[DecisionResponse]
    decision_steps: List[AgentDecisionStep]
    evaluation_score: float