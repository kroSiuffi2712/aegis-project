import React from "react";
import { Card, Row, Col, Typography, Progress, Tag, Table } from "antd";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Analytic } from "@/hooks/queries/useAnalytics";
import { DecisionTrace, OptimizedRoute } from "@/hooks/queries/useDecisionTrace";

const { Title, Text } = Typography;

const TOP_ROW_HEIGHT = 220;
const SECOND_ROW_HEIGHT = 190;

const getColumns = (bestScore: number) => [
    {
        title: "Route",
        key: "route",
        render: (_: any, __: any, index: number) => `#${index + 1}`
    },
    {
        title: "ETA Patient",
        dataIndex: "eta_to_patient",
        key: "eta_to_patient",
        render: (seconds: number) => `${Math.round(seconds / 60)} min`
    },
    {
        title: "ETA Clinic",
        dataIndex: "eta_to_clinic",
        key: "eta_to_clinic",
        render: (seconds: number) => `${Math.round(seconds / 60)} min`
    },
    {
        title: "Efficiency",
        key: "efficiency",
        render: (_: any, record: OptimizedRoute) => {
            const eff = Math.round((bestScore / record.score) * 100);

            return <Tag color={record.best ? "green" : "geekblue"}>{eff}%</Tag>;
        }
    }
];

const cardStyle: React.CSSProperties = {
    borderRadius: 14,
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column"
};

type RiskBreakdownChart = {
    name: string;
    value: number;
};

interface AgentAnalyticsPanelProps {
    incidentId: string;
    dataAnalytic?: Analytic;
    dataDecisionTrace?: DecisionTrace;
}

const AgentAnalyticsPanel: React.FC<AgentAnalyticsPanelProps> = ({ dataAnalytic, dataDecisionTrace }) => {
    const bestScore = Math.min(...(dataDecisionTrace?.optimized_routes?.map(r => r.score) ?? []));
    const columns = getColumns(bestScore);

    const mapRiskBreakdownToChart = (): RiskBreakdownChart[] => {
        return Object.entries(dataAnalytic?.risk_breakdown || {})
            .map(([name, value]) => ({
                name,
                value
            }))
            .sort((a, b) => b.value - a.value);
    };

    return (
        <div style={{ padding: 6 }}>
            <Title
                level={4}
                style={{
                    margin: 0,
                    marginBottom: 8,
                    textAlign: "center",
                    fontSize: 18
                }}
            >
                AI Route Intelligence
            </Title>

            {/* TOP ROW */}
            <Row gutter={[12, 12]}>
                <Col xs={24} md={12}>
                    <Card size="small" bordered={false} styles={{ body: { padding: 10, flex: 1 } }} style={{ ...cardStyle, height: TOP_ROW_HEIGHT }}>
                        <Title level={5} style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
                            Risk Projection
                        </Title>

                        <div style={{ flex: 1, minHeight: 140 }}>
                            <ResponsiveContainer width="100%" minHeight={160}>
                                <LineChart data={dataAnalytic?.risk_projection}>
                                    <XAxis dataKey="segment" />
                                    <YAxis />
                                    <Legend />
                                    <Line type="monotone" dataKey="risk" stroke="#8884d8" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="predictedRisk" stroke="#82ca9d" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card size="small" bordered={false} styles={{ body: { padding: 10, flex: 1 } }} style={{ ...cardStyle, height: TOP_ROW_HEIGHT }}>
                        <Title level={5} style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
                            Optimized Routes
                        </Title>

                        <div style={{ flex: 1 }}>
                            <Table
                                rowKey={(record, index) => index ?? 0}
                                columns={columns}
                                dataSource={dataDecisionTrace?.optimized_routes}
                                pagination={false}
                                size="small"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* SECOND ROW */}
            <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
                <Col xs={24} md={8}>
                    <Card size="small" bordered={false} styles={{ body: { padding: 12, flex: 1 } }} style={{ ...cardStyle, height: SECOND_ROW_HEIGHT }}>
                        <Title level={5} style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
                            Predictive Signals
                        </Title>

                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>Delay Risk</Text>
                                <Tag color="orange">{dataAnalytic?.predictive_signals.delay_risk}</Tag>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>Weather Delay Risk</Text>
                                <Tag color="green">{dataAnalytic?.predictive_signals.weather_delay_risk}</Tag>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>Incident Probability</Text>
                                <Tag color="green">{dataAnalytic?.predictive_signals.incident_probability}</Tag>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>Traffic</Text>
                                <Tag color="green">{dataAnalytic?.predictive_signals.traffic}</Tag>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>Idle &gt; 45s</Text>
                                <Tag color={dataAnalytic?.predictive_signals.idle_over_45s ? "red" : "green"}>
                                    {dataAnalytic?.predictive_signals.idle_over_45s ? "Yes" : "No"}
                                </Tag>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card
                        size="small"
                        bordered={false}
                        styles={{ body: { padding: 12, flex: 1, textAlign: "center" } }}
                        style={{ ...cardStyle, height: SECOND_ROW_HEIGHT }}
                    >
                        <Title level={5} style={{ margin: 0, fontSize: 14 }}>
                            Risk Score
                        </Title>

                        <div style={{ marginTop: 10 }}>
                            <Progress type="circle" percent={dataAnalytic?.risk_score} width={90} strokeColor="#52c41a" />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card size="small" bordered={false} styles={{ body:{padding: 10, flex: 1 }}} style={{ ...cardStyle, height: SECOND_ROW_HEIGHT }}>
                        <Title level={5} style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
                            Risk Breakdown
                        </Title>

                        <div style={{ flex: 1, minHeight: 140 }}>
                            <ResponsiveContainer width="100%" minHeight={160}>
                                <BarChart data={mapRiskBreakdownToChart()}>
                                    <XAxis axisLine={false} tickLine={false} tick={false} dataKey="name" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0d0d0e",
                                            border: "1px solid #374151",
                                            borderRadius: "8px"
                                        }}
                                        labelStyle={{ color: "#9ca3af" }}
                                        itemStyle={{ color: "#f9fafb" }}
                                        cursor={{ fill: "transparent" }}
                                    />
                                    <Bar dataKey="value" fill="#ff4d4f" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AgentAnalyticsPanel;
