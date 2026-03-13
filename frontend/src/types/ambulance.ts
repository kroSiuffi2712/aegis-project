export type AmbulanceStatus = "AVAILABLE" | "EN_ROUTE" | "BUSY" | "OFFLINE";

export interface Ambulance {
  id: string;
  latitude: number;
  longitude: number;
  status: AmbulanceStatus;
  speed: number;
  eta?: number;
}
