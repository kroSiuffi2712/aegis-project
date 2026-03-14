import React from "react";
import { Popover, Card, Typography, Avatar, Button, theme } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { getInitialsString } from "@/utils/stringFunctions";
import { useMsal } from "@azure/msal-react";

const { Text } = Typography;
const { useToken } = theme;

const ChromeProfilePopover: React.FC = () => {
    const { token } = useToken();
    const { accounts, instance } = useMsal();

    const name = accounts[0]?.name || "";
    const email = accounts[0]?.username || "";

    const initials = name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();

    const content = (
        <Card style={{ width: 250, borderRadius: 12, padding: 0, border: "none" }}>
            <div
                style={{
                    textAlign: "center",
                    paddingBottom: 5,
                    paddingTop: 5,
                    background: token.colorBgContainer,
                    borderRadius: 12
                }}
            >
                <Avatar size={64}>{initials}</Avatar>

                <div style={{ marginTop: 10 }}>
                    <Text strong style={{ fontSize: 16 }}>
                        {name}
                    </Text>
                </div>

                <div>
                    <Text type="secondary">{email}</Text>
                </div>
            </div>

            {/* Logout */}
            <Button
                color="default"
                variant="text"
                block
                icon={<LogoutOutlined />}
                style={{
                    marginTop: 12
                }}
                onClick={() => {
                    instance.logoutRedirect({
                        postLogoutRedirectUri: import.meta.env.VITE_APP_URL
                    });
                }}
            >
                Cerrar sesión
            </Button>
        </Card>
    );

    return (
        <Popover placement="bottomRight" content={content} trigger="click">
            <Avatar style={{ cursor: "pointer" }}>{getInitialsString("Carolina Ruiz")}</Avatar>
        </Popover>
    );
};

export default ChromeProfilePopover;
