import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface Agent {
    agent_name: string;
    decision: string;
    confidence: number;
    latency_ms: number;
}

export interface AgentTrace {
    modelVersion: string;
    inferenceMode: string;
    decisionStability_trend: number[];
    decisionSteps: Agent[];
    evaluationScore: number;
}

export interface AgentResponse {
    agent_name: string;
    decision: string;
    confidence: number;
    latency_ms: number;
}

export interface AgentTraceResponse {
    model_version: string;
    inference_mode: string;
    decision_stability_trend: number[];
    decision_steps: AgentResponse[];
    evaluation_score: number;
}

export const getMetricsRaw = async (incidentId: string): Promise<AgentTraceResponse> => {
    const { data } = await api.get<AgentTraceResponse>(`/incidents/${incidentId}/agent-trace`);

    return data;
};

export const useAgentTraceMetrics = (incidentId?: string) => {
    return useQuery<AgentTraceResponse, Error, AgentTrace>({
        queryKey: ["agent-trace-metrics", incidentId],
        queryFn: () => getMetricsRaw(incidentId!),
        enabled: !!incidentId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,

        select: data => ({
            modelVersion: data.model_version,
            inferenceMode: data.inference_mode,
            decisionStability_trend: [...data.decision_stability_trend],
            decisionSteps: [...data.decision_steps],
            evaluationScore: data.evaluation_score
        })
    });
};
