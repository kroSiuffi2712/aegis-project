export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export const severityColors: Record<Severity, string> = {
  CRITICAL: "red",
  HIGH: "orange",
  MEDIUM: "gold",
  LOW: "blue"
};

export const makerCenterColorsClass: Record<Severity, string> = {
  CRITICAL: "marker-center",
  HIGH: "orange-marker-center",
  MEDIUM: "yellow-marker-center",
  LOW: "blue-marker-center"
};

export const waveColorsClass: Record<Severity, string> = {
  CRITICAL: "wave",
  HIGH: "orange-wave",
  MEDIUM: "yellow-wave",
  LOW: "blue-wave"
};