export interface Incident {
  id: string;
  code: string;
  type: string;
  zone: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  aiConfidence: number;
  status: "ROUTED" | "ANALYZING" | "DISPATCHED";
  coordinates: { lat: number; lng: number }[];
}

export const incidentsMock: Incident[] = [
  {
    id: "incident-1",
    code: "INC-2041",
    type: "Cardiac Emergency",
    zone: "North Bogotá",
    severity: "CRITICAL",
    aiConfidence: 87,
    status: "ROUTED",
    coordinates: [
      { lat: 4.7705, lng: -74.0305 },
      { lat: 4.7650, lng: -74.0100 },
      { lat: 4.7450, lng: -74.0150 },
    ],
  },
  {
    id: "incident-2",
    code: "INC-2042",
    type: "Trauma Case",
    zone: "Suba",
    severity: "HIGH",
    aiConfidence: 79,
    status: "ANALYZING",
    coordinates: [
      { lat: 4.755, lng: -74.09 },
      { lat: 4.74, lng: -74.08 },
    ],
  },
];