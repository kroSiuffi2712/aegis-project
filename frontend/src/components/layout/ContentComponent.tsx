import { Content } from "antd/es/layout/layout";

import { Outlet } from "react-router-dom";

const ContentComponent: React.FC = () => {

    return (
        <>
            <Content style={{ height: "calc(100vh - 64px)", padding: 0, margin: "0 2px" }}>
                <Outlet />
            </Content>
        </>
    );
};

export default ContentComponent;
