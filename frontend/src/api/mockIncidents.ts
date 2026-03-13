import { Incident } from "../types/incident";

export const getIncident = async (
  lat: number,
  lng: number
): Promise<Incident> => {
  return {
    incidentId: `INC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: "ACTIVE",

    geolocation: {
      latitude: lat,
      longitude: lng,
      city: "Bogotá",
      country: "Colombia",
    },

    patient: {
      id: "PAT-7782",
      name: "Carlos Ramirez",
      age: 67,
      insurance: "SURA",
    },

    medical: {
      symptoms: "Severe chest pain and shortness of breath",
      priority: "CRITICAL",
    },

    dispatch: {
      assignedAmbulance: "AMB-001",
      etaMinutes: 4,
      assignedHospital: "North Medical Center",
    },

    agentsInvolved: [
      {
        id: "AG-TRIAGE",
        name: "Triage AI Agent",
        model: "Azure OpenAI GPT-4o",
        decision: "Classified case as CRITICAL priority",
      },
      {
        id: "AG-DISPATCH",
        name: "Dispatch Agent",
        decision: "Selected closest available ambulance",
      },
      {
        id: "AG-ROUTE",
        name: "Routing Optimization Agent",
        decision: "Calculated fastest route avoiding traffic zones",
      },
      {
        id: "AG-INSURANCE",
        name: "Insurance Validation Agent",
        decision: "Validated hospital coverage compatibility",
      },
    ],
  };
};
