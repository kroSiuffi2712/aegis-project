from pydantic import BaseModel
from typing import List


class RouteOption(BaseModel):
    route_name: str
    eta_minutes: int
    traffic_level: str
    score: int


class PredictiveSignals(BaseModel):
    delay_risk: int
    weather_delay_risk: int
    incident_probability: str
    traffic: str
    idle_over_45s: bool

class RiskFactors(BaseModel):
    traffic: int
    weather: int
    distance: int


class RiskProjectionSegment(BaseModel):
    segment: str
    risk: int
    predictedRisk: int

class RiskBreakdown(BaseModel):
    traffic: int
    weather: int
    distance: int
    urban_density: int

class IncidentAnalyticsResponse(BaseModel):
    optimized_routes: List[RouteOption]
    predictive_signals: PredictiveSignals
    risk_projection: List[RiskProjectionSegment]
    risk_score: int
    risk_breakdown: RiskBreakdown