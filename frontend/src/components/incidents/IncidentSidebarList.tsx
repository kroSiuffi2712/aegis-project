import React from "react";
import { List, Typography, theme, Tag } from "antd";

import "@/styles/dark-list-scroll.css";
import { Incident } from "@/types/incidentEmergency";

interface Props {
    incidents: Incident[] | undefined;
    selectedIncident: Incident | null | undefined;
    onSelect: (incident: Incident) => void;
}

const IncidentsSidebarList: React.FC<Props> = ({ incidents, selectedIncident, onSelect }) => {
    const { token } = theme.useToken();

    const severityColor = (severity: string) => {
        switch (severity) {
            case "Critical":
                return "#ff4d4f";
            case "High":
                return "#fa8c16";
            case "Moderate":
                return "#2db7f5";
            default:
                return "#52c41a";
        }
    };

    return (
        <div
            className="agents-scroll-container"
            style={{
                height: "calc(100vh - 136px)",
                overflowY: "auto",
                background: token.colorBgContainer,
                paddingRight: 4
            }}
        >
            <List
                size="small"
                bordered={false}
                dataSource={incidents}
                renderItem={incident => (
                    <List.Item
                        onClick={() => onSelect(incident)}
                        style={{
                            cursor: "pointer",
                            padding: "12px 10px",
                            background:
                                selectedIncident?.id === incident.id
                                    ? token.colorFillSecondary
                                    : "transparent",
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            {/* LEFT SIDE */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4
                                }}
                            >
                                <Typography.Text
                                    style={{
                                        color: token.colorText,
                                        fontWeight: 500
                                    }}
                                >
                                    {incident.code}
                                </Typography.Text>

                                <Typography.Text
                                    style={{
                                        fontSize: 12,
                                        color: token.colorTextSecondary
                                    }}
                                >
                                    {incident.zone?.name}
                                </Typography.Text>
                            </div>

                            {/* RIGHT SIDE */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: 6
                                }}
                            >
                                <Tag
                                    bordered
                                    style={{
                                        color: severityColor(incident.severity),
                                        borderColor: severityColor(incident.severity),
                                        background: "transparent",
                                        fontSize: 11
                                    }}
                                >
                                    {incident.severity}
                                </Tag>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default IncidentsSidebarList;