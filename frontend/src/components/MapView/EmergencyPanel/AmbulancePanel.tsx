import React from "react";
import { Card, Typography, Row, Col, Progress, Tag, Space, theme, Statistic } from "antd";
import { CarOutlined, CloudOutlined } from "@ant-design/icons";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { TransportProjection } from "@/types/incidentEmergency";
import { getCrewLevel } from "@/utils/operationalMetrics";

const { Title, Text } = Typography;

interface Props {
    ambulance: {
        unitId: string;
        crewLevel: string;
        delay: number;
        stabilizationRate: number;
        distanceKm: number;
        baselineEta: number;
        adjustedEta: number;
        trafficIndex: number;
        weatherSeverity: number;
        transportProjection?: TransportProjection;
    };
}

const AmbulancePanel: React.FC<Props> = ({ ambulance }) => {
    const { token } = theme.useToken();

    return (
        <Card
            bordered={false}
            styles={{ body: { padding: 12 } }}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: token.borderRadiusLG,
                width: "100%"
            }}
        >
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
                {/* PROFILE + ETA INTELLIGENCE (MISMA ALTURA) */}
                <Row gutter={12} align="stretch">
                    {/* Ambulance Profile */}
                    <Col xs={24} md={12} style={{ display: "flex" }}>
                        <Card
                            size="small"
                            bordered={false}
                            styles={{ body: { padding: 12 } }}
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                borderRadius: token.borderRadius,
                                flex: 1,
                                height: "100%"
                            }}
                        >
                            <Title level={5} style={{ margin: 0, marginBottom: 10, textAlign: "center" }}>
                                Ambulance Profile
                            </Title>

                            <Row gutter={10}>
                                <Col span={12}>
                                    <Text type="secondary">Unit</Text>
                                    <br />
                                    <Text strong>{ambulance.unitId}</Text>
                                </Col>

                                <Col span={12}>
                                    <Text type="secondary">Crew Level</Text>
                                    <br />
                                    <Tag color="blue">{getCrewLevel(ambulance.crewLevel)}</Tag>
                                </Col>

                                <Col span={12} style={{ marginTop: 10 }}>
                                    <Statistic
                                        title="Delay"
                                        value={ambulance.delay > 0 ? ambulance.delay : "On Time"}
                                        prefix={ambulance.delay > 0 ? "+" : ""}
                                        suffix={ambulance.delay > 0 ? " min" : ""}
                                        valueStyle={{ fontSize: 16 }}
                                    />
                                </Col>

                                <Col span={12} style={{ marginTop: 10 }}>
                                    <Statistic
                                        title="Stabilization"
                                        value={ambulance.stabilizationRate}
                                        suffix="%"
                                        valueStyle={{
                                            fontSize: 16,
                                            color: token.colorSuccess
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Dynamic ETA Intelligence */}
                    <Col xs={24} md={12} style={{ display: "flex" }}>
                        <Card
                            size="small"
                            bordered={false}
                            styles={{ body: { padding: 12 } }}
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                borderRadius: token.borderRadius,
                                flex: 1,
                                height: "100%"
                            }}
                        >
                            <Title level={5} style={{ margin: 0, marginBottom: 10, textAlign: "center" }}>
                                Dynamic ETA Intelligence
                            </Title>

                            <Row gutter={10}>
                                <Col span={12}>
                                    <Statistic title="Baseline ETA" value={ambulance.baselineEta} suffix="min" />
                                </Col>

                                <Col span={12}>
                                    <Statistic
                                        title="AI Adjusted ETA"
                                        value={ambulance.adjustedEta}
                                        suffix="min"
                                        valueStyle={{
                                            color: ambulance.adjustedEta > ambulance.baselineEta ? token.colorWarning : token.colorSuccess
                                        }}
                                    />
                                </Col>

                                <Col span={24} style={{ marginTop: 10 }}>
                                    <Text type="secondary">
                                        Distance: <b>{ambulance.distanceKm} km</b>
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* External Impact Factors */}
                <Card
                    size="small"
                    bordered={false}
                    styles={{ body: { padding: 12 } }}
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: token.borderRadius
                    }}
                >
                    <Title level={5} style={{ margin: 0, marginBottom: 12, textAlign: "center" }}>
                        External Impact Factors
                    </Title>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Card
                                bordered={false}
                                size="small"
                                styles={{ body: { padding: 10 } }}
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    borderRadius: token.borderRadius
                                }}
                            >
                                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                                    <Space align="center">
                                        <CarOutlined style={{ color: token.colorWarning }} />
                                        <Text strong>Traffic Severity</Text>
                                    </Space>

                                    <Progress percent={ambulance.trafficIndex} strokeColor={token.colorWarning} size="small" />
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card
                                bordered={false}
                                size="small"
                                styles={{ body: { padding: 10 } }}
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    borderRadius: token.borderRadius
                                }}
                            >
                                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                                    <Space align="center">
                                        <CloudOutlined style={{ color: token.colorInfo }} />
                                        <Text strong>Weather Impact</Text>
                                    </Space>

                                    <Progress percent={ambulance.weatherSeverity} strokeColor={token.colorInfo} size="small" />
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </Card>

                {/* Transport Risk Projection */}
                <Card size="small" bordered={false} styles={{ body: { padding: 10 } }}>
                    <Title level={5} style={{ margin: 0, marginBottom: 6, textAlign: "center" }}>
                        Transport Risk Projection
                    </Title>

                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={ambulance.transportProjection?.timeline}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="minute" />
                            <YAxis domain={[50, 100]} />
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

                            <Line type="monotone" dataKey="baseline" stroke="#ff4d4f" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="adjusted" stroke={token.colorSuccess} strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>

                    <Text type="secondary" style={{ fontSize: 11 }}>
                        Red = Risk without advanced capability • Green = Risk adjusted by crew & equipment
                    </Text>
                </Card>
            </Space>
        </Card>
    );
};

export default AmbulancePanel;
