import React from "react";
import { Card, Typography, Tag, theme } from "antd";
import { Incident } from "@/types/incidentEmergency";
import { formatDateTime } from "@/utils/formatters";

interface Props {
    incident: Incident | null | undefined;
}

const AgentOverviewCard: React.FC<Props> = ({ incident }) => {
    const { token } = theme.useToken();

    return (
        <Card
            size="small"
            bordered={false}
            style={{
                background: token.colorBgContainer
            }}
            styles={{
                body: {
                    padding: 12
                }
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8
                }}
            >
                <div>
                    <Typography.Text strong style={{ fontSize: 13 }}>
                        {incident?.code}
                    </Typography.Text>
                    <div style={{ fontSize: 11, color: token.colorTextSecondary }}>Zone: {incident?.zone.name}</div>
                </div>

                {/*  Status */}
                <div style={{ textAlign: "center" }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Status
                    </Typography.Text>

                    <div style={{ fontSize: 12 }}>
                        <Tag color={incident?.status ? "red" : "blue"} style={{ margin: 0 }}>
                            {incident?.status}
                        </Tag>
                    </div>
                </div>
            </div>
            <div>
                <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                    created at: {incident?.created_at ? formatDateTime(incident?.created_at) : ""}
                </div>
            </div>
        </Card>
    );
};

export default AgentOverviewCard;
