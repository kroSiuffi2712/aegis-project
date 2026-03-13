import React, { useState } from "react";
import AgentOverviewCard from "./AgentOverviewCard";
import AgentDecisionPanel from "./AgentDecisionPanel";
import { useDecisionTrace } from "@/hooks/queries/useDecisionTrace";
import IncidentSidebarList from "../incidents/IncidentSidebarList";
import { useIncidents } from "@/hooks/queries/useIncidents";
import { Incident } from "@/types/incidentEmergency";
import AIDecisionMetricsCard from "./AIDecisionMetricsCard";
import AgentDecisionPipeline from "../MapView/EmergencyPanel/AgentDecisionPipeline";
import AgentExecutionFlow from "../MapView/EmergencyPanel/AgentExecutionFlow";
import AIConfidenceTrendCard from "../MapView/EmergencyPanel/AIConfidenceTrendCard";

const AgentsDashboard: React.FC = () => {

    const page = 1;

    const incidentList = useIncidents(page);

    const [selectedIncident, setSelectedIncident] =
        useState<Incident | null>(
            incidentList.data?.data?.length
                ? incidentList.data.data[0]
                : null
        );

    const { data } = useDecisionTrace(selectedIncident?.id);

    return (
        <div
            style={{
                height: "100%",
                padding: 12,
                background: "#1f1f1f",
                display: "grid",
                gridTemplateColumns: "260px 1fr 1fr",
                gridTemplateRows: "auto auto",
                gap: 5
            }}
        >
            {/* INCIDENTS SIDEBAR */}
            <div
                style={{
                    gridRow: "1 / span 2",
                    overflowY: "auto"
                }}
            >
                <IncidentSidebarList
                    incidents={incidentList.data?.data}
                    selectedIncident={selectedIncident}
                    onSelect={setSelectedIncident}
                />
            </div>

            {/* CENTER COLUMN */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}
            >
                {selectedIncident && (
                    <>
                        <AgentOverviewCard incident={selectedIncident} />

                        <AIDecisionMetricsCard
                            reliability={{
                                decision_reliability_score:
                                    data?.reliability?.decisionReliability_score ?? 0,
                                confidence_variance:
                                    data?.reliability?.confidenceVariance ?? 0,
                                total_latency_ms:
                                    data?.reliability?.totalLatencyMS ?? 0
                            }}
                            governance={{
                                operational_risk_index:
                                    data?.governance?.operationalRisk_index ?? 0
                            }}
                        />

                        <AgentExecutionFlow
                            agentLogs={data?.agentDecisions}
                        />
                    </>
                )}
            </div>

            {/* RIGHT COLUMN */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                }}
            >
                {selectedIncident && (
                    <>
                        <AIConfidenceTrendCard
                            agentLogs={data?.agentDecisions}
                        />

                        <AgentDecisionPanel
                            governance={data?.governance}
                            reliability={data?.reliability}
                        />
                    </>
                )}
            </div>

            {/* PIPELINE BELOW CENTER + RIGHT */}
            <div
                style={{
                    gridColumn: "2 / span 2"
                }}
            >
                <AgentDecisionPipeline
                    data={data?.agentDecisions}
                />
            </div>
        </div>
    );
};

export default AgentsDashboard;