import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

// ==============================
// Agent Decision
// ==============================
export interface AgentDecisionResponse {
    agent_name: string;
    decision: string;
    confidence: number;
    latency_ms: number;
    timestamp: string; // ISO date
}
// ==============================
// Governance
// ==============================

export type GovernanceStatus = "PASS" | "FAIL" | "FLAG";

export interface GovernanceMetricsResponse {
    fairness: GovernanceStatus;
    safety: GovernanceStatus;
    privacy: GovernanceStatus;
    transparency: GovernanceStatus;
    accountability: GovernanceStatus;
    operational_risk_index: number;
    human_override: boolean;
    override_reason: string | null;
}

// ==============================
// Reliability
// ==============================
export interface ReliabilityMetricsResponse {
    decision_reliability_score: number;
    explanation_available: boolean;
    confidence_variance: number;
    total_latency_ms: number;
}

// ==============================
// Observability Logs
// ==============================
export type ObservabilityCategory = "ResponsibleAI" | "Explainability" | "Security" | "Performance" | "ModelMonitoring" | "ContentSafety";

export type ObservabilityStatus = "PASS" | "FAIL" | "FLAG" | "INFO" | null;

export type ObservabilitySeverity = "Low" | "Medium" | "High" | null;

export interface ObservabilityLog {
    timestamp: string;
    title: string;
    status: ObservabilityStatus;
    score: number | null;
    severity: ObservabilitySeverity;
    category: ObservabilityCategory;
}

// ==============================
// Main Decision Trace Response
// ==============================

export interface DecisionTraceResponse {
    incident_id: string;
    code: string;
    risk_score: number;
    confidence: number;
    governance: GovernanceMetricsResponse;
    reliability: ReliabilityMetricsResponse;
    agent_decisions: AgentDecisionResponse[];
    observability_logs: ObservabilityLog[];
    optimized_routes?: OptimizedRoute[];
    created_at: string;
}
// ==============================
// Governance Metrics
// ==============================

export interface GovernanceMetrics {
    fairness: GovernanceStatus;
    safety: GovernanceStatus;
    privacy: GovernanceStatus;
    transparency: GovernanceStatus;
    accountability: GovernanceStatus;
    operationalRisk_index: number;
    humanOverride: boolean;
    overrideReason: string | null;
}

// ==============================

export interface ReliabilityMetrics {
    decisionReliability_score: number;
    explanationAvailable: boolean;
    confidenceVariance: number;
    totalLatencyMS: number;
}

export interface AgentDecision {
    agentName: string;
    decision: string;
    confidence: number;
    latencyMS: number;
    timestamp: string;
}

export interface RouteInfo {
    route_id: string;
    distance_meters: number;
    travel_time_seconds: number;
}

export interface OptimizedRoute {
    ambulance_id: string;
    clinic_id: string;
    eta_to_patient: number;
    eta_to_clinic: number;
    score: number;
    route: RouteInfo;
    best: boolean;
}

export interface DecisionTrace {
    incidentId: string;
    code: string;
    riskScore: number;
    confidence: number;
    governance: GovernanceMetrics;
    reliability: ReliabilityMetrics;
    agentDecisions: AgentDecision[];
    observabilityLogs: ObservabilityLog[];
    optimized_routes?: OptimizedRoute[];
    createdAt: string;
}

export const getDecisionTrace = async (incidentId: string): Promise<DecisionTraceResponse> => {
    const { data } = await api.get<DecisionTraceResponse>(`/incidents/${incidentId}/decision-trace`);

    return data;
};

export const useDecisionTrace = (incidentId?: string) => {
    return useQuery<DecisionTraceResponse, Error, DecisionTrace>({
        queryKey: ["decisions-traces", incidentId],
        queryFn: () => getDecisionTrace(incidentId!),
        enabled: !!incidentId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,

        select: data => ({
            incidentId: data.incident_id,
            code: data.code,
            riskScore: data.risk_score,
            confidence: data.confidence,

            governance: {
                fairness: data?.governance?.fairness,
                safety: data?.governance?.safety,
                privacy: data?.governance?.privacy,
                transparency: data?.governance?.transparency,
                accountability: data?.governance?.accountability,
                operationalRisk_index: data?.governance?.operational_risk_index,
                humanOverride: data?.governance?.human_override,
                overrideReason: data?.governance?.override_reason
            },

            reliability: data?.reliability
                ? {
                      decisionReliability_score: data.reliability.decision_reliability_score,
                      explanationAvailable: data.reliability.explanation_available,
                      confidenceVariance: data.reliability.confidence_variance,
                      totalLatencyMS: data.reliability.total_latency_ms
                  }
                : {
                      decisionReliability_score: 0,
                      explanationAvailable: false,
                      confidenceVariance: 0,
                      totalLatencyMS: 0
                  },

            agentDecisions:
                data.agent_decisions?.map(ad => ({
                    agentName: ad.agent_name,
                    decision: ad.decision,
                    confidence: ad.confidence,
                    latencyMS: ad.latency_ms,
                    timestamp: ad.timestamp
                })) ?? [],
            observabilityLogs: data.observability_logs ?? [],
            optimized_routes: data.optimized_routes ?? [],
            createdAt: data.created_at
        })
    });
};
