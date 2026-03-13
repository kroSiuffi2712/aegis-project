import { theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd/es/config-provider/context";

export const lightTheme: ThemeConfig = {
    algorithm: antdTheme.defaultAlgorithm,
    components: {
        Menu: {
            itemSelectedBg: "#e6f4ff",
            itemSelectedColor: "#1677ff",
            itemHoverBg: "#f0f7ff",
            itemHoverColor: "#1677ff"
        },
        Layout: {
            triggerBg: "#ffffff",
            triggerColor: "#1677ff"
        },
        Card: {
            colorBgContainer: "#ffffff",
            colorText: "#1f2937",
            borderRadiusLG: 16,
            boxShadow: "0 10px 24px rgba(0,0,0,.1)"
        }
    }
};
