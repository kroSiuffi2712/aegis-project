import { Tooltip, Card } from "antd";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
//import { useState } from "react";
import { truncateText } from "@/utils/text";
import { getFileTypeConfig } from "@/utils/fileTypeConfig";

type Props = {
    file: {
        name: string;
    };
    onClick?: (e: React.MouseEvent) => Promise<void>;
    isDownloading?: boolean;
    downloadingIcon?: boolean;
    icon?: boolean;
    label?: boolean;
};

export default function BadgeCard({ file, onClick, isDownloading, downloadingIcon, icon, label }: Props) {
    const fileConfig = getFileTypeConfig(file.name);

    return (
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Tooltip title={file.name} color="#fcf9f9ff" placement="bottomLeft">
                <Card
                    hoverable
                    onClick={onClick}
                    style={{
                        width: 230,
                        borderRadius: 14,
                        border: `1px solid ${fileConfig.color}`
                    }}
                    styles={{
                        body: {
                            padding: 5,
                            display: "flex",
                            alignItems: "center",
                            gap: 5
                        }
                    }}
                >
                    {/* Ícono dinámico */}
                    <div
                        style={{
                            fontSize: 22,
                            color: fileConfig.color
                        }}
                    >
                        {icon ? fileConfig.icon : <></>}
                    </div>

                    {/* Texto */}
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: 12,
                                maxWidth: 160,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer"
                            }}
                        >
                            {file.name.length > 30 ? truncateText(file.name, 30) : file.name}
                        </div>

                        <div style={{ fontSize: 10, color: "#888" }}>{label ? fileConfig.label : ""}</div>
                    </div>

                    {/* Acción */}
                    {downloadingIcon && (
                        <div onClick={onClick}>
                            {isDownloading ? (
                                <LoadingOutlined
                                    style={{
                                        color: fileConfig.color,
                                        fontSize: 18,
                                        margin: 5
                                    }}
                                />
                            ) : (
                                <DownloadOutlined
                                    style={{
                                        color: fileConfig.color,
                                        fontSize: 18,
                                        margin: 5
                                    }}
                                />
                            )}
                        </div>
                    )}
                </Card>
            </Tooltip>
        </motion.div>
    );
}
