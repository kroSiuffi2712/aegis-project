import React, { useState } from "react";
import { Drawer, Spin } from "antd";
import DrawerIconMenu from "./DrawerIconMenu";
import AgentAnalyticsPanel from "./AgentAnalyticsPanel";
import PatientPanel from "./PatientPanel";
import "@/styles/scroll-dark-style.css";
import "@/styles/dark-drawer-scroll.css";
import AmbulancePanel from "./AmbulancePanel";
import AIAgentPanel from "./AIAgentPanel";
import ChatPage from "@/components/Chat/ChatPage";
import { Incident } from "@/types/incidentEmergency";
import { Severity } from "@/types/severiry";
import { useAnalyticMetrics } from "@/hooks/queries/useAnalytics";
import { useDecisionTrace } from "@/hooks/queries/useDecisionTrace";
import { useAgentTraceMetrics } from "@/hooks/queries/useAgentTrace";

interface Props {
    incident: Incident | null;
    openEmergencyDrawer: boolean;
    setOpenEmergencyDrawer: (open: boolean) => void;
}

const SearchPanel: React.FC = () => <div style={{ padding: 20 }}>🔎 Search Module</div>;

const EmergencyPanel: React.FC<Props> = ({ incident, openEmergencyDrawer, setOpenEmergencyDrawer }) => {
    const [activeTab, setActiveTab] = useState<string>("analytics");
    const analyticMetrics = useAnalyticMetrics(incident?.id);
    const decisionTrace = useDecisionTrace(incident?.id);
    const agentMetrics = useAgentTraceMetrics(incident?.id);

    const baseline = incident?.eta_intelligence?.baseline_eta_minutes ?? 0;
    const adjusted = incident?.eta_intelligence?.ai_adjusted_eta_minutes ?? 0;

    const delayMinutes = baseline > 0 ? Math.max(adjusted - baseline, 0) : 0;

    const isLoading =
        analyticMetrics.isLoading ||
        decisionTrace.isLoading ||
        agentMetrics.isLoading ||
        analyticMetrics.isFetching ||
        decisionTrace.isFetching ||
        agentMetrics.isFetching;

    if (!incident) return null;

    const renderContent = (): React.ReactNode => {
        switch (activeTab) {
            case "patient":
                return (
                    <PatientPanel
                        patient={{
                            name: incident?.patient?.name ?? "",
                            age: incident?.patient?.age ?? 0,
                            hospital: incident?.clinic?.name,
                            severity: (incident?.severity?.toUpperCase() as Severity) ?? "LOW",
                            eta: 4,
                            location: "Bogotá, Colombia",
                            symptoms: incident?.symptoms_summary
                        }}
                        incidentId={incident.id}
                    />
                );
            case "ambulance":
                return (
                    <AmbulancePanel
                        ambulance={{
                            unitId: "AMB-204",
                            crewLevel: incident.severity,
                            delay: delayMinutes,
                            stabilizationRate: Math.round(
                                ((incident.transport_projection?.adjusted_score ?? 0) / (incident.transport_projection?.baseline_score ?? 1)) * 100
                            ),
                            distanceKm: incident?.route?.distance_meters ? parseFloat((incident.route.distance_meters / 1000).toFixed(1)) : 0,
                            baselineEta: incident.transport_projection?.baseline_score ?? 0,
                            adjustedEta: incident.transport_projection?.adjusted_score ?? 0,
                            trafficIndex: incident.external_impact?.traffic_severity_percent ?? 0,
                            weatherSeverity: incident.external_impact?.weather_impact_percent ?? 0,
                            transportProjection: incident?.transport_projection
                        }}
                    />
                );
            case "analytics":
                return <AgentAnalyticsPanel incidentId={incident.id} dataAnalytic={analyticMetrics.data} dataDecisionTrace={decisionTrace.data} />;
            case "agent":
                return <AIAgentPanel agentName="Emergency Cognitive Agent" agentTrace={agentMetrics.data} />;
            case "chat":
                return <ChatPage />;
            case "search":
                return <SearchPanel />;
            default:
                return <AgentAnalyticsPanel incidentId={incident.id} dataAnalytic={analyticMetrics.data} dataDecisionTrace={decisionTrace.data} />;
        }
    };

    return (
        <Drawer
            size={700}
            styles={{ body: { padding: 5, overflowY: "auto", height: "100%" } }}
            title="Incident Centric View"
            placement="right"
            onClose={() => setOpenEmergencyDrawer(false)}
            open={openEmergencyDrawer}
        >
            <DrawerIconMenu selectedKey={activeTab} onChange={(key: string) => setActiveTab(key)} />

            <div style={{ marginTop: 5, position: "relative", minHeight: 300 }}>
                {isLoading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(10,10,15,0.65)",
                            backdropFilter: "blur(4px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 20
                        }}
                    >
                        <Spin size="large" tip="Loading AI analytics..." />
                    </div>
                )}

                {renderContent()}
            </div>
        </Drawer>
    );
};

export default EmergencyPanel;
