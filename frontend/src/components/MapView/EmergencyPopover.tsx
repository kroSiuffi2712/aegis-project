import { Popover, Typography, Tag, Button, Space, theme } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { EmergencyPopoverProps } from "@/types/emergencyPopover";

const { Title, Text } = Typography;

const EmergencyPopover: React.FC<EmergencyPopoverProps> = ({ incident, open, setOpen }) => {
    const { token } = theme.useToken();
    return (
        <Popover
            open={open}
            placement="top"
            onOpenChange={() => setOpen(!open)}
            trigger={"click"}
            style={{
                background: token.colorBgElevated,
                borderColor: token.colorBgElevated
            }}
        >
            <Space style={{ minWidth: 260, backgroundColor: token.colorBgElevated }} orientation="vertical" size={0}>
                <Space style={{ width: "100%", justifyContent: "space-between", background: token.colorBgContainer }}>
                    <Title level={5} style={{ margin: 0 }}>
                        Emergency
                    </Title>
                    <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => setOpen(false)} />
                </Space>

                <Text>
                    <strong>Patient:</strong> {incident.patient.name} ({incident.patient.age})
                </Text>

                <Text>
                    <strong>Insurance:</strong> {incident.insurance}
                </Text>

                <Text>
                    <strong>Hospital:</strong> {incident.dispatch.assignedHospital}
                </Text>

                <Text>
                    <strong>Priority:</strong> <Tag color={incident.medical.priority === "CRITICAL" ? "red" : "orange"}>{incident.medical.priority}</Tag>
                </Text>

                <Text>
                    <strong>ETA:</strong> {incident.dispatch.etaMinutes} min
                </Text>

                <Text>
                    <strong>Location:</strong> {incident.geolocation.city}, {incident.geolocation.country}
                </Text>
            </Space>
        </Popover>
    );
};

export default EmergencyPopover;
