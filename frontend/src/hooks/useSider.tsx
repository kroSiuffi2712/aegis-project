import type { MenuProps } from "antd";
import { DashboardOutlined, LogoutOutlined } from "@ant-design/icons";
import { Ambulance, Radar, UserRoundPen } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface MenuItem {
    key: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    type?: "group"; 
    children?: MenuItem[]; 
}

const useSider = () => {
    const menuItems: MenuProps["items"] = [
        {
            key: "map",
            icon: <Radar />,
            label: <Link to="/map">Map View</Link>
        },
        {
            key: "agents",
            icon: <DashboardOutlined style={{ fontSize: 24 }}/>,
            label: <Link to="/agents">AI Decision Center</Link>
        },
        {
            key: "ambulances",
            icon: <Ambulance />,
            label: <Link to="/ambulances">Ambulances Panel</Link>
        },
        {
            key: "patients",
            icon: <UserRoundPen />,
            label: <Link to="/patients">Patients Panel</Link>
        },
        {
            key: "Logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: () => console.log("Logout clicked")
        }
    ];

    return { menuItems };
};
export default useSider;
