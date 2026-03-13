import React from "react";
import { Card, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ObservabilityLog } from "@/hooks/queries/useDecisionTrace";

interface Props {
    observabilityLog: ObservabilityLog[];
}

const AgentLogsPanel: React.FC<Props> = ({ observabilityLog }) => {
    const { token } = theme.useToken();

    const riskColor = (risk?: string) => {
        if (risk === "High") return token.colorError;
        if (risk === "Medium") return token.colorWarning;
        return token.colorSuccess;
    };

    const statusColor = (status?: string) => {
        if (status === "PASS") return token.colorSuccess;
        if (status === "FLAG") return token.colorError;
        return token.colorInfo;
    };

    const columns: ColumnsType<ObservabilityLog> = [
        {
            dataIndex: "title",
            key: "event",
            width: "65%",
            render: (_, record) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        whiteSpace: "nowrap"
                    }}
                >
                    <Typography.Text
                        style={{
                            fontSize: 10,
                            color: token.colorTextSecondary,
                            minWidth: 50
                        }}
                    >
                        [{record.timestamp}]
                    </Typography.Text>

                    <Typography.Text
                        style={{
                            fontSize: 12,
                            color: token.colorText,
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {record.title}
                    </Typography.Text>
                </div>
            )
        },
        {
            dataIndex: "score",
            key: "score",
            width: "15%",
            align: "right",
            render: value => (value ? <Tag style={{ margin: 0, fontSize: 10 }}>{value}%</Tag> : null)
        },
        {
            key: "severity",
            width: "20%",
            align: "right",
            render: (_, record) => {
                if (record.severity) {
                    return (
                        <Tag
                            style={{
                                margin: 0,
                                fontSize: 10,
                                background: riskColor(record.severity),
                                border: "none",
                                color: "#000"
                            }}
                        >
                            {record.severity}
                        </Tag>
                    );
                }

                if (record.status) {
                    return (
                        <Tag
                            style={{
                                margin: 0,
                                fontSize: 10,
                                background: statusColor(record.status),
                                border: "none",
                                color: "#000"
                            }}
                        >
                            {record.status}
                        </Tag>
                    );
                }

                return null;
            }
        }
    ];

    return (
        <Card
            size="small"
            bordered={false}
            style={{
                background: token.colorBgContainer,
                display: "flex",
                flexDirection: "column"
            }}
            styles={{
                body: {
                    padding: 8,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {/* Título conservado */}
            <Typography.Text
                strong
                style={{
                    fontSize: 12,
                    color: token.colorTextSecondary,
                    marginBottom: 8,
                    display: "block"
                }}
            >
                AI Observability Logs
            </Typography.Text>

            <Table
                columns={columns}
                dataSource={observabilityLog}
                pagination={false}
                size="small"
                rowKey="title"
                showHeader={false}
                scroll={{ y: 180 }}
                style={{
                    background: token.colorBgContainer,
                    flex: 1
                }}
            />
        </Card>
    );
};

export default AgentLogsPanel;
