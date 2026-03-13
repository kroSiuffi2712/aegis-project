import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { User, Ambulance, BarChart3, Bot, MessagesSquare } from "lucide-react";

export interface DrawerIconMenuProps {
    selectedKey: string;
    onChange: (key: string) => void;
}

const DrawerIconMenu: React.FC<DrawerIconMenuProps> = ({ selectedKey, onChange }) => {
    const items: MenuProps["items"] = [
        { key: "patient", icon: <User size={20} />, label: "Patient" },
        { key: "ambulance", icon: <Ambulance size={20} />, label: "Ambulance" },
        { key: "analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
        { key: "agent", icon: <Bot size={20} />, label: "Agent" },
        { key: "chat", icon: <MessagesSquare size={20} />, label: "Chat" },
    ];

    const handleClick: MenuProps["onClick"] = e => {
        onChange(e.key);
    };

    return (
        <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={[selectedKey]}
            onClick={handleClick}
            items={items}
            style={{
                background: "transparent",
                borderBottom: "none"
            }}
        />
    );
};

export default DrawerIconMenu;
