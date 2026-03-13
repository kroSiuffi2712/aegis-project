import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";


interface predictiveSignals {
    delay_risk: number;
    weather_delay_risk: number;
    incident_probability: string;
    traffic: string;
    idle_over_45s: boolean;
}

export interface RiskBreakdown {
    traffic: number;
    weather: number;
    distance: number;
    urban_density: number;
}

export interface Analytic {
    predictive_signals: predictiveSignals;
    risk_score: number;
    risk_projection: RiskProjectionSegment[];
    risk_breakdown: RiskBreakdown;
}

interface predictiveSignalsResponse {
    delay_risk: number;
    weather_delay_risk: number;
    incident_probability: string;
    traffic: string;
    idle_over_45s: boolean;
}

export interface RiskProjectionSegment {
    segment: string;
    risk: number;
    predictedRisk: number;
}

export interface RiskBreakdownResponse {
    name: string;
    value: string;
}

export interface AnalyticResponse {
    predictive_signals: predictiveSignalsResponse;
    risk_score: number;
    risk_projection: RiskProjectionSegment[];
    risk_breakdown: RiskBreakdown;
}

export const getMetricsRaw = async (incidentId: string): Promise<AnalyticResponse> => {
    const { data } = await api.get<AnalyticResponse>(`/incidents/${incidentId}/analytics`);

    return data;
};

export const useAnalyticMetrics = (incidentId?: string) => {
    return useQuery<AnalyticResponse, Error, Analytic>({
        queryKey: ["analytic-metrics", incidentId],
        queryFn: () => getMetricsRaw(incidentId!),
        enabled: !!incidentId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,

        select: data => ({
            predictive_signals: {
                delay_risk: data.predictive_signals.delay_risk,
                weather_delay_risk: data.predictive_signals.weather_delay_risk,
                incident_probability: data.predictive_signals.incident_probability,
                traffic: data.predictive_signals.traffic,
                idle_over_45s: data.predictive_signals.idle_over_45s
            },
            risk_score: data.risk_score,
            risk_projection: data.risk_projection,
            risk_breakdown: data.risk_breakdown
        })
    });
};
