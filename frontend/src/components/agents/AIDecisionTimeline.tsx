import React from "react";
import { Card, Tag, Row, Col } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { AgentDecision } from "@/hooks/queries/useDecisionTrace";

interface Props {
    decisions: AgentDecision[];
}

const getAgentColor = (agent: string) => {
    switch (agent) {
        case "RiskAgent":
            return "red";
        case "RoutingAgent":
            return "blue";
        case "ResourceAgent":
            return "green";
        case "GovernanceAgent":
            return "purple";
        default:
            return "gray";
    }
};

const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
};

const AIDecisionTimeline: React.FC<Props> = ({ decisions }) => {
    return (
        <Row gutter={12}>
            {decisions?.map((d, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                    <Card
                        size="small"
                        style={{
                            background: "#141414",
                            border: "1px solid #303030",
                            height: "100%"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <RobotOutlined />
                            <Tag color={getAgentColor(d.agentName)}>{d.agentName}</Tag>
                        </div>

                        <div style={{ marginTop: 8, color: "#e8e8e8", fontSize: 14 }}>{d.decision}</div>

                        <div
                            style={{
                                marginTop: 8,
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12
                            }}
                        >
                            <span style={{ color: "#52c41a" }}>{(d.confidence * 100).toFixed(0)}%</span>

                            <span style={{ color: "#1890ff" }}>{d.latencyMS} ms</span>
                        </div>

                        <div style={{ marginTop: 6, fontSize: 11, color: "#8c8c8c" }}>{formatTime(d.timestamp)}</div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default AIDecisionTimeline;
