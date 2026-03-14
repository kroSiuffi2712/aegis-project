import React from "react";
import { Card, Table, Tag, Typography, theme } from "antd";
import { AgentDecision } from "@/hooks/queries/useDecisionTrace";

const { Text } = Typography;


interface Props {
    data?: AgentDecision[];
}

const minimalCell = {
    padding: "4px 8px",
    fontSize: 12
};

const minimalHeader = {
    padding: "4px 8px",
    fontSize: 12,
    fontWeight: 500
};

const AgentDecisionPipeline: React.FC<Props> = ({ data = [] }) => {
    const { token } = theme.useToken();
    const columns = [
        {
            title: "Agent",
            dataIndex: "agentName",
            key: "agentName",
            render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
            onHeaderCell: () => ({ style: minimalHeader }),
            onCell: () => ({ style: minimalCell })
        },
        {
            title: "Decision",
            dataIndex: "decision",
            key: "decision",
            alignText: "center",
            render: (text: string) => (
                <Text ellipsis={{ tooltip: text }} style={{ color: "#d4d4d4", maxWidth: 500, textAlign: "center" }}>
                    {text}
                </Text>
            ),
            onHeaderCell: () => ({ style: minimalHeader }),
            onCell: () => ({ style: minimalCell })
        },
        {
            title: "Confidence",
            dataIndex: "confidence",
            key: "confidence",
            width: 110,
            render: (value: number) => {
                const percent = Math.round(value * 100);

                return <Tag color="green">{percent}%</Tag>;
            },
            onHeaderCell: () => ({ style: minimalHeader }),
            onCell: () => ({ style: minimalCell })
        },
        {
            title: "Latency",
            key: "latency",
            width: 110,
            render: (_: any, record: AgentDecision) => {
                const value = Number(record?.latencyMS);

                if (!value) return "0";

                if (value >= 1000) {
                    return `${(value / 1000).toFixed(2)} s`;
                }

                return `${Math.round(value)} ms`;
            },
            onHeaderCell: () => ({ style: minimalHeader }),
            onCell: () => ({ style: minimalCell })
        }
    ];

    return (
        <Card
            style={{
                background: token.colorBgContainer,
                border: "1px solid #1f1f1f",
                margin: 0
            }}
            bodyStyle={{
                padding: 10
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
                    maxHeight: 220,
                    overflowY: "auto",
                    paddingTop: 3
                }}
                className="dark-scroll"
            >
                <Table columns={columns} dataSource={data} pagination={false} size="small" rowKey="agent_name" />
            </div>
        </Card>
    );
};

export default AgentDecisionPipeline;
