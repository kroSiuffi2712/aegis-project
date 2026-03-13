import React from "react";
import { Card, Typography, theme, Tag } from "antd";

interface Props {
    reliability: {
        decision_reliability_score: number;
        confidence_variance: number;
        total_latency_ms: number;
    };
    governance: {
        operational_risk_index: number;
    };
}

const AIDecisionMetricsCard: React.FC<Props> = ({ reliability, governance }) => {
    const { token } = theme.useToken();

    const reliabilityScore = Math.round((reliability?.decision_reliability_score || 0) * 100);

    const variance = Math.round((reliability?.confidence_variance || 0) * 100);

    const riskIndex = governance?.operational_risk_index || 0;

    return (
        <Card
            styles={{ body: { padding: 10 } }}
            bordered={false}
            style={{
                background: token.colorBgContainer,
                borderRadius: 10
            }}
        >
            <Typography.Text
                strong
                style={{
                    fontSize: 13,
                    color: token.colorTextSecondary
                }}
            >
                AI Decision Metrics
            </Typography.Text>

            <div
                style={{
                    display: "flex",
                    marginTop: 5,
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                }}
            >
                {/* METRICS HORIZONTAL */}
                <div
                    style={{
                        display: "flex",
                        gap: 40
                    }}
                >
                    {/*  Reliability */}
                    <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Reliability
                        </Typography.Text>

                        <div style={{ fontSize: 12 }}>
                            <Tag style={{ fontSize: 14 }}>{reliabilityScore}%</Tag>
                        </div>
                    </div>
                    {/* Confidence Variance */}
                    <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Confidence Variance
                        </Typography.Text>

                        <div style={{ fontSize: 12 }}>
                            <Tag style={{ fontSize: 14 }}>{variance}%</Tag>
                        </div>
                    </div>

                    {/* Inference Latency */}
                    <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Inference Latency
                        </Typography.Text>

                        <div style={{ fontSize: 12 }}>
                            <Tag style={{ fontSize: 14 }}>
                                {reliability?.total_latency_ms
                                    ? reliability.total_latency_ms >= 1000
                                        ? `${(reliability.total_latency_ms / 1000).toFixed(2)} s`
                                        : `${reliability.total_latency_ms.toFixed(0)} ms`
                                    : "—"}
                            </Tag>
                        </div>
                    </div>

                    {/* Operational Risk */}
                    <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Operational Risk
                        </Typography.Text>

                        <div style={{ fontSize: 12 }}>
                            <Tag style={{ fontSize: 14 }}>{riskIndex.toFixed(2)}</Tag>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AIDecisionMetricsCard;
