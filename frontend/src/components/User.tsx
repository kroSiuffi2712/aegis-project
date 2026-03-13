import React from "react";
import { Space } from "antd";
import UserPopoverComponent from "./UserPopoverComponent";

const UserComponent: React.FC = () => (
    <Space orientation="vertical" size={16}>
        <Space wrap size={16}>
            <UserPopoverComponent />
        </Space>
    </Space>
);

export default UserComponent;
