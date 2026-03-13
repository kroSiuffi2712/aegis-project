export type AmbulanceStatus = "available" | "en_route" | "busy" | "offline";

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface CompanyInfo {
    _id: string;
    nit: string;
    name: string;
    description?: string | null;
}

export interface Ambulance {
    _id: string;
    plate: string;
    driver_name: string;
    status: AmbulanceStatus;
    location: GeoLocation;
    company: CompanyInfo;
    createdAt: string;
    updatedAt?: string | null;
}

export interface Pagination {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
}

export interface GetAmbulancesResponse {
    data: Ambulance[];
    pagination: Pagination;
}
