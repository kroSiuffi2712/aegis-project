import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type MetricStatus = "NORMAL" | "ELEVATED" | "CRITICAL";

export interface CriticalMetricResponse {
    parameter: string;
    status: MetricStatus;
    risk_delta: number;
}

export interface AIAssessmentResponse {
    incident_id: string;
    agent_name: string;
    model_version: string;
    risk_score: number;
    urgency_level: UrgencyLevel;
    confidence: number;
    critical_metrics: CriticalMetricResponse[];
    factor_escalation_projection: FactorProjectionPoint[]
    created_at: string;
}

export interface CriticalMetric {
    parameter: string;
    status: MetricStatus;
    risk_delta: number;
}

export interface FactorProjectionMetric {
  parameter: string
  level: number
}

export interface FactorProjectionPoint {
  minute: number
  factors: FactorProjectionMetric[]
}

export interface AIAssessment {
    incidentId: string;
    agentName: string;
    modelVersion: string;
    riskScore: number;
    urgencyLevel: UrgencyLevel;
    confidence: number;
    criticalMetrics: CriticalMetric[];
    factor_escalation_projection: FactorProjectionPoint[]
    createdAt: string;
}

export const getAssessment = async (incidentId: string): Promise<AIAssessmentResponse> => {
    const { data } = await api.get<AIAssessmentResponse>(`/incidents/${incidentId}/ai-assessment`);

    return data;
};

export const useAssessment = (incidentId?: string) => {
    return useQuery<AIAssessmentResponse, Error, AIAssessment>({
        queryKey: ["ai-assessment", incidentId],
        queryFn: () => getAssessment(incidentId!),
        enabled: !!incidentId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,

        select: data => ({
            incidentId: data.incident_id,
            agentName: data.agent_name,
            modelVersion: data.model_version,
            riskScore: data.risk_score,
            urgencyLevel: data.urgency_level,
            confidence: data.confidence,
            criticalMetrics: [...data.critical_metrics],
            factor_escalation_projection: [...data.factor_escalation_projection],
            createdAt: data.created_at
        })
    });
};
