import React from "react";
import { Card, Typography, Row, Col, Tag, Space, theme, Table } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { CartesianGrid, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip, Bar } from "recharts";
import { Severity, severityColors } from "@/types/severiry";
import { useAssessment } from "@/hooks/queries/useAssessment";

const { Title, Text } = Typography;

interface Props {
    patient: {
        name: string;
        age: number;
        hospital: string;
        severity: Severity;
        eta: number;
        location: string;
        symptoms: string;
    };
    incidentId: string;
}

const EmergencyPatientPanel: React.FC<Props> = ({ patient, incidentId }) => {
    const { token } = theme.useToken();

    const assessment = useAssessment(incidentId);

    const chartColors = ["#5794F2", "#FF9830", "#73BF69", "#F2495C", "#B877D9", "#56B9F2"];
    const projectionData =
        assessment.data?.factor_escalation_projection?.map(step => {
            const row: any = { minute: step.minute };

            step.factors.forEach(factor => {
                row[factor.parameter] = factor.level;
            });

            return row;
        }) ?? [];

    const factorKeys = assessment.data?.factor_escalation_projection?.[0]?.factors?.map(f => f.parameter) ?? [];

    const columns = [
        {
            title: "Factor",
            dataIndex: "parameter",
            key: "parameter",
            ellipsis: true
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                if (status === "CRITICAL") return <Tag color="red">{status}</Tag>;
                if (status === "ELEVATED") return <Tag color="orange">{status}</Tag>;
                return <Tag color="blue">{status}</Tag>;
            }
        },
        {
            title: "Δ Risk",
            dataIndex: "risk_delta",
            key: "risk_delta",
            render: (value: number) => (value ? <Tag style={{ margin: 0, fontSize: 10 }}>{(value * 100).toFixed(0)}%</Tag> : 0)
        }
    ];

    return (
        <Card
            bordered={false}
            styles={{ body: { padding: "8px 10px" } }}
            style={{
                background: "rgba(20,20,20,0.75)",
                backdropFilter: "blur(14px)",
                borderRadius: token.borderRadiusLG,
                boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.05)",
                width: "100%"
            }}
        >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                {/* HEADER compacto */}
                <Card
                    bordered={false}
                    styles={{ body: { padding: "6px 10px" } }}
                    style={{
                        background: severityColors[patient.severity.toUpperCase() as Severity],
                        borderRadius: 10,
                        textAlign: "center"
                    }}
                >
                    <Space size={6} align="center">
                        <WarningOutlined style={{ fontSize: 16, color: "#fff" }} />
                        <Text strong style={{ color: "#fff", fontSize: 14 }}>
                            EMERGENCY STATUS
                        </Text>
                        <Tag color={severityColors[(patient.severity.toUpperCase() as Severity) ?? "LOW"]} style={{ marginLeft: 4 }}>
                            {patient.severity}
                        </Tag>
                    </Space>
                </Card>

                {/* GRID */}
                <Row gutter={[12, 12]} align="stretch">
                    {/* PACIENTE */}
                    <Col xs={24} md={12} style={{ display: "flex" }}>
                        <Card
                            size="small"
                            bordered={false}
                            styles={{ body: { padding: 14 } }}
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: token.borderRadiusLG,
                                width: "100%",
                                height: "100%"
                            }}
                        >
                            <Space direction="vertical" size={10} style={{ width: "100%" }}>
                                <Title style={{ margin: 0, fontSize: 14, textAlign: "center" }}>Patient Overview</Title>

                                {/* Data rows */}
                                <Row justify="space-between">
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Name
                                    </Text>
                                    <Text strong>
                                        {patient.name} ({patient.age})
                                    </Text>
                                </Row>

                                <Row justify="space-between">
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Hospital
                                    </Text>
                                    <Text strong>{patient.hospital}</Text>
                                </Row>

                                <Row justify="space-between">
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        ETA
                                    </Text>
                                    <Text strong style={{ color: token.colorWarning }}>
                                        {patient.eta} min
                                    </Text>
                                </Row>

                                <Row justify="space-between">
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Location
                                    </Text>
                                    <Text strong>{patient.location}</Text>
                                </Row>

                                {/* Symptoms Section */}
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Symptoms Summary
                                    </Text>

                                    <div
                                        style={{
                                            marginTop: 6,
                                            maxHeight: 80,
                                            overflowY: "auto",
                                            padding: 8,
                                            borderRadius: 8,
                                            background: "rgba(0,0,0,0.35)",
                                            border: "1px solid rgba(255,255,255,0.05)",
                                            fontSize: 12,
                                            lineHeight: 1.4
                                        }}
                                        className="dark-scroll"
                                    >
                                        {patient.symptoms}
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    {/* CLINICAL DATA */}
                    <Col xs={24} md={12} style={{ display: "flex" }}>
                        <Card
                            size="small"
                            bordered={false}
                            styles={{ body: { padding: 12 } }}
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: token.borderRadiusLG,
                                width: "100%",
                                height: "100%"
                            }}
                        >
                            <Space direction="vertical" size={6} style={{ width: "100%", textAlign: "center" }}>
                                <Text strong style={{ fontSize: 14 }}>
                                    Critical Metrics
                                </Text>

                                <Table
                                    columns={columns}
                                    dataSource={assessment.data?.criticalMetrics}
                                    pagination={false}
                                    size="small"
                                    bordered={false}
                                    style={{ width: "100%" }}
                                    rowClassName={() => "compact-table-row"}
                                />
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>

            {/* PROJECTION CARD */}
            <Card
                bordered={false}
                styles={{ body: { padding: 10 } }}
                style={{
                    borderRadius: 14,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                    width: "100%",
                    marginTop: 8
                }}
            >
                <Title
                    level={5}
                    style={{
                        margin: 0,
                        marginBottom: 8,
                        fontSize: 14,
                        textAlign: "center"
                    }}
                >
                    AI Risk Escalation Projection
                </Title>

                <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                            <XAxis dataKey="minute" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />

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
                            <Legend iconType="circle" />

                            {factorKeys.map((factor, index) => (
                                <Bar key={factor} dataKey={factor} fill={chartColors[index % chartColors.length]} radius={[4, 4, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* METRICS compactas */}
            <Row justify="space-between" align="middle" style={{ marginTop: 4 }}>
                <Col>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Time Elapsed: <b style={{ color: token.colorWarning }}>03:30</b>
                    </Text>
                </Col>
                <Col>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Critical Remaining: <b style={{ color: token.colorError }}>3:50</b>
                    </Text>
                </Col>
            </Row>
        </Card>
    );
};

export default EmergencyPatientPanel;
