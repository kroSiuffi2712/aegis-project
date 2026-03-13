export interface Incident {
    incidentId: string;
    insurance: string;
    assignedClinic: string;
    priority: string;
    eta: string;
    agents: string[];
    timestamp: string;
    status: "ACTIVE" | "RESOLVED";

    geolocation: {
        latitude: number;
        longitude: number;
        city: string;
        country: string;
    };

    patient: {
        id: string;
        name: string;
        age: number;
        insurance: string;
    };

    medical: {
        symptoms: string;
        priority: "LOW" | "MEDIUM" | "CRITICAL";
    };

    dispatch: {
        assignedAmbulance: string;
        etaMinutes: number;
        assignedHospital: string;
    };

    agentsInvolved: {
        id: string;
        name: string;
        decision: string;
        model?: string;
    }[];
}
