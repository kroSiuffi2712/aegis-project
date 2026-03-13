import React from "react";
import { Layout } from "antd";

import AgentsDashboard from "./AgentDashboard";


const { Content } = Layout;

const ContentComponent: React.FC = () => {
    return (
        <Content
            style={{
                flex: 1, 
                minHeight: 0, 
                overflow: "hidden",
                padding: 0,
            }}
        >
            <AgentsDashboard />
        </Content>
    );
};

export default ContentComponent;