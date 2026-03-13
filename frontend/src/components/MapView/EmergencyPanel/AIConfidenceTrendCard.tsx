import React from "react";
import { Card, Col, Row, theme, Typography } from "antd";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { AgentDecision } from "@/hooks/queries/useDecisionTrace";

const { Text } = Typography;

interface Props {
    agentLogs?: AgentDecision[];
}

const AIConfidenceTrendCard: React.FC<Props> = ({ agentLogs = [] }) => {
    const { token } = theme.useToken();
    const data = agentLogs.map(a => ({
        agent: a.agentName.replace("Agent", ""),
        confidence: Math.round(a.confidence * 100),
        latency: Number((a.latencyMS / 1000).toFixed(2))
    }));

    return (
        <Card
            style={{
                background: token.colorBgContainer,
                border: "1px solid #1f1f1f",
                marginTop: 0
            }}
            styles={{
                body: { padding: "0px 14px" }
            }}
        >
            <Typography.Text
                strong
                style={{
                    fontSize: 13,
                    color: token.colorTextSecondary
                }}
            >
                AI Agent Performance
            </Typography.Text>

            <Row gutter={16}>
                {/* CONFIDENCE */}
                <Col span={12}>
                    <Text style={{ color: "#6e6e6e", fontSize: 11, display: "block", textAlign:"center" }}>Confidence</Text>

                    <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={data}>
                            <XAxis dataKey="agent" tick={{ fill: "#6e6e6e", fontSize: 10 }} axisLine={{ stroke: "#2a2a2a" }} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "#6e6e6e", fontSize: 10 }} axisLine={{ stroke: "#2a2a2a" }} tickLine={false} width={28} />
                            <Tooltip
                                cursor={{ fill: "transparent" }}
                                contentStyle={{
                                    background: "#111",
                                    border: "1px solid #333",
                                    fontSize: 12
                                }}
                            />
                            <Bar dataKey="confidence" fill="#3f8cff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>

                {/* LATENCY */}
                <Col span={12}>
                    <Text style={{ color: "#6e6e6e", fontSize: 11, display: "block", textAlign:"center" }}>Latency</Text>

                    <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={data}>
                            <XAxis dataKey="agent" tick={{ fill: "#6e6e6e", fontSize: 10 }} axisLine={{ stroke: "#2a2a2a" }} tickLine={false} />
                            <YAxis tick={{ fill: "#6e6e6e", fontSize: 10 }} axisLine={{ stroke: "#2a2a2a" }} tickLine={false} width={28} />
                            <Tooltip
                                cursor={{ fill: "transparent" }}
                                contentStyle={{
                                    background: "#111",
                                    border: "1px solid #333",
                                    fontSize: 12
                                }}
                            />
                            <Bar dataKey="latency" fill="#49aa19" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </Card>
    );
};

export default AIConfidenceTrendCard;
