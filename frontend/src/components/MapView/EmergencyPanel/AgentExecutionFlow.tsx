import React from "react";
import { Card, theme, Timeline, Typography } from "antd";
import { AgentDecision } from "@/hooks/queries/useDecisionTrace";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Text } = Typography;
interface Props {
    agentLogs?: AgentDecision[];
}

//const formatAgent = (name: string) => name.replace("Agent", "");

const formatAgent = (name: string) => {
    if (!name) return "";

    return name
        .replace(/agent$/i, "") // elimina Agent o agent al final
        .replace(/([A-Z])/g, " $1") // separa palabras camelCase
        .trim();
};

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
                Agent Execution Flow
            </Typography.Text>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 2
                }}
            >
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Timeline
                        orientation="horizontal"
                        style={{
                            width: "100%",
                            padding: 0,
                            margin: 0
                        }}
                        items={agentLogs.map(agent => ({
                            dot: (
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: "#1677ff"
                                    }}
                                />
                            ),

                            children: (
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: 120
                                    }}
                                >
                                    <div style={{ fontSize: 12, color: "#e6e6e6" }}>{formatAgent(agent.agentName)}</div>

                                    <div style={{ fontSize: 10, color: "#7a7a7a" }}>{agent.confidence}</div>
                                </div>
                            )
                        }))}
                    />
                </div>
            </div>
        </Card>
    );
};

export default AgentExecutionFlow;
