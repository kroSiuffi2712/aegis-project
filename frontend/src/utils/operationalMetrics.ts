export const getCrewLevel = (severity?: string): string => {
    switch (severity?.toUpperCase()) {
        case "CRITICAL":
        case "HIGH":
            return "Critical Care";
        case "MEDIUM":
            return "Advanced Life Support";
        case "LOW":
        default:
            return "Basic Life Support";
    }
};
