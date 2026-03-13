import React from "react";
import { Card, Row, Col, Typography, Progress, Table, theme, Statistic, Space } from "antd";
import { RobotOutlined, ThunderboltOutlined, SafetyOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from "recharts";
import { AgentResponse, AgentTrace } from "@/hooks/queries/useAgentTrace";
import { formatToMinutesSeconds } from "@/utils/formatters";

const { Text, Title } = Typography;

interface Props {
    agentName: string;
    agentTrace?: AgentTrace;
}

const AgentPanel: React.FC<Props> = ({ agentName, agentTrace }) => {
    const { token } = theme.useToken();

    const totalAnalysisTime = agentTrace?.decisionSteps?.reduce((acc: number, step: AgentResponse) => acc + (step.latency_ms || 0), 0) ?? 0;
    const confidence = agentTrace?.evaluationScore ? agentTrace?.evaluationScore * 100 : 0;

    const formatLatency = (value: number) => {
        if (!value) return "0 ms";
        if (value > 1000) return `${(value / 1000).toFixed(2)} s`;
        return `${value.toFixed(0)} ms`;
    };

    const formatTotalTime = (value: number) => {
        if (!value) return 0;
        if (value > 1000) return (value / 1000).toFixed(2);
        return value.toFixed(0);
    };

    const totalTimeSuffix = totalAnalysisTime > 1000 ? "s" : "ms";

    const columns = [
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
            render: (value: string) => formatToMinutesSeconds(value)
        },
        {
            title: "Action",
            dataIndex: "decision",
            key: "decision"
        },
        {
            title: "Confidence %",
            dataIndex: "confidence",
            key: "confidence",
            render: (value: number) => {
                const percent = (value || 0) * 100;

                return <Progress percent={percent} size="small" strokeColor={token.colorPrimary} format={() => `${percent.toFixed(0)}%`} />;
            }
        },
        {
            title: "Latency",
            dataIndex: "latency_ms",
            key: "latency_ms",
            render: (value: number) => formatLatency(value)
        }
    ];

    return (
        <div>
            {/* TOP SECTION */}
            <Row gutter={[12, 12]} align="stretch">
                {/* LEFT CARD */}
                <Col xs={24} lg={12}>
                    <Card
                        size="small"
                        style={{
                            height: "100%",
                            background: token.colorBgContainer,
                            borderRadius: 14
                        }}
                        styles={{ body: { padding: 14 } }}
                    >
                        <Space direction="vertical" size={10} style={{ width: "100%" }}>
                            <div>
                                <Title
                                    level={5}
                                    style={{
                                        color: token.colorText,
                                        margin: 0,
                                        textAlign: "center"
                                    }}
                                >
                                    <RobotOutlined /> {agentName} {agentTrace?.modelVersion}
                                </Title>

                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Autonomous Emergency Decision Engine
                                </Text>
                            </div>

                            <Row gutter={8}>
                                <Col span={12}>
                                    <Statistic
                                        title={<span style={{ fontSize: 11 }}>Total Analysis Time</span>}
                                        value={formatTotalTime(totalAnalysisTime)}
                                        suffix={totalTimeSuffix}
                                        prefix={<ThunderboltOutlined />}
                                        valueStyle={{ fontSize: 16 }}
                                    />
                                </Col>

                                <Col span={12}>
                                    <Statistic
                                        title={<span style={{ fontSize: 11 }}>Decision Confidence</span>}
                                        value={confidence.toFixed(1)}
                                        suffix="%"
                                        prefix={<SafetyOutlined />}
                                        valueStyle={{ fontSize: 16 }}
                                    />
                                </Col>
                            </Row>

                            <Progress percent={Number(confidence.toFixed(1))} strokeColor={token.colorPrimary} size="small" style={{ marginTop: 4 }} />
                        </Space>
                    </Card>
                </Col>

                {/* RIGHT CARD */}
                <Col xs={24} lg={12}>
                    <Card
                        size="small"
                        style={{
                            height: "100%",
                            background: token.colorBgContainer,
                            borderRadius: 14
                        }}
                        styles={{ body: { padding: 14 } }}
                    >
                        <Title
                            level={5}
                            style={{
                                color: token.colorText,
                                margin: 0,
                                marginBottom: 8,
                                textAlign: "center"
                            }}
                        >
                            Decision Stability Trend
                        </Title>

                        <ResponsiveContainer width="100%" height={140}>
                            <LineChart data={agentTrace?.decisionStability_trend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip
                                    labelFormatter={value => {
                                        const date = new Date(value);
                                        return date.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit"
                                        });
                                    }}
                                    contentStyle={{
                                        backgroundColor: "#0d0d0e",
                                        border: "1px solid #374151",
                                        borderRadius: "8px"
                                    }}
                                    labelStyle={{ color: "#9ca3af" }}
                                    itemStyle={{ color: "#f9fafb" }}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Line type="monotone" dataKey="confidence" stroke={token.colorPrimary} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* BOTTOM SECTION */}
            <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                <Col span={24}>
                    <Card
                        size="small"
                        style={{
                            background: token.colorBgContainer,
                            borderRadius: 14
                        }}
                        styles={{
                            body: {
                                padding: "12px 14px 14px 14px"
                            }
                        }}
                    >
                        <Title
                            level={5}
                            style={{
                                color: token.colorText,
                                margin: 0,
                                marginBottom: 10,
                                textAlign: "center"
                            }}
                        >
                            Agent Decision Log
                        </Title>

                        <Table dataSource={agentTrace?.decisionSteps} columns={columns} pagination={false} rowKey="timestamp" size="small" />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AgentPanel;
