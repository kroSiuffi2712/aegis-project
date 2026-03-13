import React from "react";
import { Card, theme, Typography } from "antd";
import { AgentDecision } from "@/hooks/queries/useDecisionTrace";

const { Text } = Typography;
interface Props {
    agentLogs?: AgentDecision[];
}

const formatAgent = (name: string) => name.replace("Agent", "");

const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
};

const AgentExecutionFlow: React.FC<Props> = ({ agentLogs = [] }) => {
    const { token } = theme.useToken();
    return (
        <Card
            style={{
                background: token.colorBgContainer,
                border: "1px solid #1f1f1f",
                marginTop: 1
            }}
            bodyStyle={{ padding: "14px 8px" }}
        >
            <Typography.Text
                strong
                style={{
                    fontSize: 13
                }}
            >
                Execution Flow
            </Typography.Text>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 2
                }}
            >
                {agentLogs.map((agent, index) => (
                    <React.Fragment key={index}>
                        <div style={{ textAlign: "center", minWidth: 110 }}>
                            <Text style={{ color: "#e6e6e6", fontSize: 13 }}>{formatAgent(agent.agentName)}</Text>

                            <div>
                                <Text style={{ color: "#6e6e6e", fontSize: 11 }}> {formatTime(agent.timestamp)}</Text>
                            </div>
                        </div>

                        {index < agentLogs.length - 1 && (
                            <div
                                style={{
                                    flex: 1,
                                    height: 2,
                                    background: "#2a2a2a",
                                    margin: "0 10px"
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
};

export default AgentExecutionFlow;
