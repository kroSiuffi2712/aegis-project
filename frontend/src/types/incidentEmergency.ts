import { GeoPoint } from "./ambulance.types";

export interface GeoLocation {
    type: "Point";
    coordinates: [number, number];
}

export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";
export type IncidentStatus = "open" | "in_progress" | "closed";

export interface Patient {
    name: string;
    insurance_id: string;
    age: number;
    phone: string;
}

export interface EtaIntelligence {
    baseline_eta_minutes: number;
    ai_adjusted_eta_minutes: number;
    distance_km: number;
}

export interface ExternalImpact {
    traffic_severity_percent: number;
    weather_impact_percent: number;
}

export interface TransportProjection {
    baseline_score: number;
    adjusted_score: number;
    timeline: TransportProjectionPoint[];
}

export interface TransportProjectionPoint {
    minute: number;
    baseline: number;
    adjusted: number;
}

export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Zone {
    _id: string;
    name: string;
    coordinates: Coordinate[];
}

export interface Route {
    route_id: string;
    distance_meters: number;
    travel_time_seconds: number;
}

export interface Ambulance {
    id: string;
    plate: string;
    driver: string;
    status: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  location: GeoPoint;
}

export interface Incident {
    id: string;
    code: string;
    zone: Zone;
    ambulance:Ambulance;
    clinic:Clinic;
    severity: IncidentSeverity;
    patient: Patient;
    symptoms_summary: string;
    location: GeoLocation;
    risk_score: number;
    confidence: number;
    assigned_supervisor_id: string;
    status: IncidentStatus;
    assigned_clinic_id: string;
    estimated_distance: number;
    eta_intelligence?: EtaIntelligence;
    external_impact?: ExternalImpact;
    transport_projection?: TransportProjection;
    route: {route:Route};
    created_at: string;
    closed_at: string | null;
}

export interface Pagination {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
}

export interface GetIncidentsResponse {
    data: Incident[];
    pagination: Pagination;
}
