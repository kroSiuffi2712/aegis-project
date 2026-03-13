import { Layout, theme } from "antd";
import UserComponent from "../User";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
    const {
        token: { colorBgContainer }
    } = theme.useToken();
    return (
        <>
            <Header style={{ display: "flex", justifyContent: "flex-end", paddingRight: 20, background: colorBgContainer }}>
                <UserComponent />
            </Header>
        </>
    );
};
export default HeaderComponent;
