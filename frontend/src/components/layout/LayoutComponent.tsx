import React from "react";
import { ConfigProvider, Layout } from "antd";
import HeaderComponent from "./HeaderComponent";
import SiderComponent from "./SiderComponent";
import ContentComponent from "./ContentComponent";
//import { lightTheme } from "@/theme/light";
import { darkTheme } from "@/theme/dark";

const { Footer } = Layout;

const App: React.FC = () => {
    return (
        <ConfigProvider theme={darkTheme}>
            <Layout style={{ height: "100vh ", margin: 0, padding: 0, overflow: "hidden" }}>
                <SiderComponent />
                <Layout
                    style={{
                        display: "flex",
                        flexDirection: "column",
                         height: "100vh",
                       
                    }}
                >
                    <HeaderComponent />
                    <ContentComponent />
                    <Footer
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "center"
                        }}
                    >
                        AEGIS ©{new Date().getFullYear()} Real-time emergency response
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default App;
