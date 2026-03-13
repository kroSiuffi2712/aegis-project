import React, { useMemo } from "react";
import { Card, Typography, Tag, theme } from "antd";
import { GovernanceMetrics, ReliabilityMetrics } from "@/hooks/queries/useDecisionTrace";

interface Props {
    governance?: GovernanceMetrics;
    reliability?: ReliabilityMetrics;
}

const AgentDecisionPanel: React.FC<Props> = ({ governance }) => {
    const { token } = theme.useToken();

    // Responsible AI status
    const rai = useMemo(() => {
        return {
            Fairness: governance?.fairness ?? "FLAG",
            Reliability: governance?.accountability ?? "PASS",
            Safety: governance?.safety ?? "FLAG",
            Privacy: governance?.privacy ?? "FLAG",
            Transparency: governance?.transparency ?? "FLAG",
            Accountability: governance?.accountability ?? "PASS"
        };
    }, [governance]);

    const tagColor = (status: string) => {
        if (status === "PASS") return token.colorSuccess;
        if (status === "WARNING") return token.colorWarning;
        return token.colorError;
    };

    return (
        <Card
            size="small"
            bordered={false}
            style={{
                background: token.colorBgContainer,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
            styles={{
                body: {
                    padding: 12,
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {/* Responsible AI */}
            <div>
                <Typography.Text
                    strong
                    style={{
                        fontSize: 12,
                        color: token.colorTextSecondary,
                        display: "block",
                        marginBottom: 6
                    }}
                >
                    Responsible AI Compliance
                </Typography.Text>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 6
                    }}
                >
                    {Object.entries(rai).map(([key, value]) => (
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12
                            }}
                        >
                            <span>{key}</span>
                            <Tag
                                style={{
                                    margin: 0,
                                    fontSize: 10,
                                    background: tagColor(value),
                                    border: "none",
                                    color: "#000"
                                }}
                            >
                                {value}
                            </Tag>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default AgentDecisionPanel;
