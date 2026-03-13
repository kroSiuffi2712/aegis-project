import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface SupervisorMetrics {
    supervisorId: string;
    zoneId: string;
    totalCases: number;
    effectiveness: number;
    avg_latency_ms: number;
    decisionReliability: number;
    operationalRiskIndex: number;
    statusBreakdown: {
        open: number;
        routed: number;
        closed: number;
    };
}

export interface SupervisorMetricsResponse {
    supervisor_id: string;
    zone_id: string;
    total_cases: number;
    effectiveness: number;
    avg_latency_ms: number;
    decision_reliability: number;
    operational_risk_index: number;
    status_breakdown: {
        open: number;
        routed: number;
        closed: number;
    };
}

export const getSupervisorMetricsRaw = async (supervisorId: string): Promise<SupervisorMetricsResponse> => {
    const { data } = await api.get<SupervisorMetricsResponse>(`/api/v1/supervisors/${supervisorId}/metrics`);

    return data;
};

export const useSupervisorMetrics = (supervisorId?: string) => {
    return useQuery<SupervisorMetricsResponse, Error, SupervisorMetrics>({
        queryKey: ["supervisor-metrics", supervisorId],
        queryFn: () => getSupervisorMetricsRaw(supervisorId!),
        enabled: !!supervisorId,

        select: data => ({
            supervisorId: data.supervisor_id,
            zoneId: data.zone_id,
            totalCases: data.total_cases,
            effectiveness: data.effectiveness,
            avg_latency_ms: data.avg_latency_ms,
            decisionReliability: data.decision_reliability,
            operationalRiskIndex: data.operational_risk_index,
            statusBreakdown: {
                open: data.status_breakdown.open,
                routed: data.status_breakdown.routed,
                closed: data.status_breakdown.closed
            }
        })
    });
};
