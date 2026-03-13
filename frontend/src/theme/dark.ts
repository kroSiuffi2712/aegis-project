import { theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd/es/config-provider/context";

export const darkTheme: ThemeConfig = {
    algorithm: antdTheme.darkAlgorithm,
    components: {
        Menu: {
            itemBg: "transparent",
            itemSelectedBg: "#585858ff",
            itemSelectedColor: "#ffffff",
            itemHoverBg: "#585858ff",
            itemHoverColor: "#ffffff",
            itemActiveBg: "#3e3f3fff",
            activeBarBorderWidth: 0,
        },
        Layout: {
            triggerBg: "#3e3f3fff",
            triggerColor: "#ffffff"
        },
        Card: {
            colorBgContainer: "#3e3f3fff",
            colorText: "#e5e7eb",
            borderRadiusLG: 16,
            boxShadow: "0 20px 40px rgba(0,0,0,.45)"
        },
        Popover: {
            colorBgElevated: "#313030",  
            colorText: "#ffffff",
            boxShadow: "0 20px 40px rgba(0,0,0,.45)"
        }
    }
};