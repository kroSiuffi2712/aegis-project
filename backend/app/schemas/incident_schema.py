from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Literal



class GeoPoint(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float]



class PatientEmbedded(BaseModel):
    name: str
    insurance_id: str
    age: str
    phone: str



class AgentDecisionLog(BaseModel):
    agent_name: str
    decision: str
    confidence: float
    latency_ms: float
    timestamp: datetime


class ObservabilityLog(BaseModel):
    timestamp: str
    title: str
    status: Optional[str] = None
    score: Optional[float] = None
    severity: Optional[str] = None
    category: Optional[str] = None



class GovernanceMetrics(BaseModel):
    fairness: str                 
    safety: str                   
    privacy: str                  
    transparency: str             
    accountability: str           
    operational_risk_index: float
    human_override: bool = False
    override_reason: Optional[str] = None



class ReliabilityMetrics(BaseModel):
    decision_reliability_score: float
    explanation_available: bool
    confidence_variance: Optional[float] = None
    total_latency_ms: Optional[float] = None


class ETAIntelligence(BaseModel):
    baseline_eta_minutes: int
    ai_adjusted_eta_minutes: int
    distance_km: float


class ExternalImpact(BaseModel):
    traffic_severity_percent: int
    weather_impact_percent: int


class TransportTimelinePoint(BaseModel):
    minute: int
    baseline: int
    adjusted: int


class TransportProjection(BaseModel):
    baseline_score: int
    adjusted_score: int
    timeline: List[TransportTimelinePoint]


class IncidentCreate(BaseModel):
    zone_id: str
    severity: str
    patient: PatientEmbedded
    symptoms_summary: str
    location: GeoPoint
    victim_count: Optional[int] = 1


class IncidentResponse(BaseModel):
    id: str
    code: str
    zone_id: str
    severity: str

    risk_score: Optional[float] = None
    confidence: Optional[float] = None

    assigned_supervisor_id: str
    patient: PatientEmbedded
    symptoms_summary: str
    location: GeoPoint

    status: str
    assigned_ambulance_id: Optional[str] = None
    assigned_clinic_id: Optional[str] = None
    estimated_distance: Optional[float] = None

    #  AI Multi-Agent Observability
    agent_decisions: Optional[List[AgentDecisionLog]] = []
    governance: Optional[GovernanceMetrics] = None
    reliability: Optional[ReliabilityMetrics] = None

    # Transport Intelligence (Azure Maps AI Simulation)
    eta_intelligence: Optional[ETAIntelligence] = None
    external_impact: Optional[ExternalImpact] = None
    transport_projection: Optional[TransportProjection] = None

    created_at: datetime


class RouteInfo(BaseModel):
    route_id: str
    distance_meters: int
    travel_time_seconds: int

class OptimizedRoute(BaseModel):
    ambulance_id: str
    clinic_id: str
    eta_to_patient: int
    eta_to_clinic: int
    score: int
    route: RouteInfo
    best: bool

# DECISION TRACE RESPONSE
class DecisionTraceResponse(BaseModel):
    incident_id: str
    code: Optional[str] = None
    risk_score: Optional[float] = None
    confidence: Optional[float] = None

    governance: Optional[GovernanceMetrics] = None
    reliability: Optional[ReliabilityMetrics] = None
    agent_decisions: Optional[List[AgentDecisionLog]] = []

    observability_logs: Optional[List[ObservabilityLog]] = []
    optimized_routes: Optional[List[OptimizedRoute]] = []

    created_at: Optional[datetime] = None