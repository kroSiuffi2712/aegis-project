import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Menu, theme } from "antd";
import useSider from "@/hooks/useSider";

const { useToken } = theme;

const SiderComponent: React.FC = () => {
    const [collapsed, setCollapsed] = useState(true);
    const { menuItems } = useSider();
    const { token } = useToken();
    return (
        <>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
                style={{
                    background: token.colorBgContainer
                }}
            >
                {/* LOGO */}
                <div
                    style={{
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft:9
                    }}
                >
                    <img src="/img/aegis_logo_64x64.ico" alt="Logo" style={{ width: 64 }} />
                </div>
                <div className="demo-logo-vertical" />
                <Menu
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={menuItems}
                    style={{
                        background: token.colorBgContainer,
                        borderColor: token.colorBgContainer
                    }}
                />
            </Sider>
        </>
    );
};
export default SiderComponent;
