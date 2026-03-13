import React from "react";
import { Card, Typography } from "antd";
import { Incident } from "@/types/incidentEmergency";
import useAzureMap from "@/hooks/useAzureMap";
import { useZones } from "@/hooks/useZones ";

interface Props {
    incident: Incident | null | undefined;
}

const DecisionCenterMap: React.FC<Props> = ({ incident }) => {
    const { mapRef, mapInstance, mapReady } = useAzureMap();

    const zones = incident?.zone ? [incident.zone] : [];

    useZones({
        mapInstance,
        mapReady,
        zones
    });

    return (
        <Card
            size="small"
            bordered={false}
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0
            }}
            styles={{
                body: {
                    padding: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0
                }
            }}
        >
            <Typography.Text
                style={{
                    fontSize: 12,
                    padding: "8px 12px"
                }}
            >
                Satellite Zone Monitoring
            </Typography.Text>

            <div
                ref={mapRef}
                style={{
                    flex: 1,
                    minHeight: 220
                }}
            />
        </Card>
    );
};

export default DecisionCenterMap;
