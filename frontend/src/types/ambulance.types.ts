// ==============================
// GeoJSON Point
// ==============================
export type GeoPoint = {
  type: "Point"; 
  coordinates: [number, number]; 
  // [longitude, latitude]
};


// ==============================
// Company Embedded Document
// ==============================
export interface CompanyInfo {
  nit: string;
  name: string;
  description?: string | null;
}


// ==============================
// Status (mejor tiparlo fuerte)
// ==============================
export type AmbulanceStatus = "available" | "en_route" | "busy";


// ==============================
// Create
// ==============================
export interface AmbulanceCreate {
  plate: string;
  driver_name: string;
  status?: AmbulanceStatus; 
  location: GeoPoint;
  company: CompanyInfo;
}


// ==============================
// Update (todo opcional)
// ==============================
export interface AmbulanceUpdate {
  plate?: string;
  driver_name?: string;
  status?: AmbulanceStatus;
  location?: GeoPoint;
  company?: CompanyInfo;
}


// ==============================
// Response
// ==============================
export interface AmbulanceResponse {
  id: string;
  plate: string;
  driver_name: string;
  status: AmbulanceStatus;
  location: GeoPoint;
  company: CompanyInfo;
  created_at: string;  
  updated_at?: string | null;
}