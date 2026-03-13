import { Ambulance } from "../types/ambulance";

export const getAmbulances = async (): Promise<Ambulance[]> => {
  return [
    {
      id: "AMB-001",
      latitude: 4.711,
      longitude: -74.0721,
      status: "AVAILABLE",
      speed: 60,
    },
    {
      id: "AMB-002",
      latitude: 4.721,
      longitude: -74.0621,
      status: "AVAILABLE",
      speed: 50,
    },
  ];
};
