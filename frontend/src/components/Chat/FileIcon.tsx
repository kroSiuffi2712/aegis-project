
import { POLICIES } from "@/constants/policies";
import { FilePdfOutlined, FileWordOutlined, DownloadOutlined } from "@ant-design/icons";
import { Card, Button, Space } from "antd";

const FileIcon = ({ type }: { type: string }) =>
    type === "pdf" ? <FilePdfOutlined style={{ color: "#cf1322", fontSize: 20 }} /> : <FileWordOutlined style={{ color: "#2f54eb", fontSize: 20 }} />;

export const PolicyList = ({ onDownload }: { onDownload: (id: string) => void }) => (
    <Space orientation="vertical" style={{ width: "100%" }}>
        {POLICIES.map(policy => (
            <Card
                key={policy.id}
                size="small"
                style={{
                    borderRadius: 8,
                    border: "1px solid #f0f0f0"
                }}
            >
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space>
                        <FileIcon type={policy.type} />
                        <span>{policy.label}</span>
                    </Space>

                    <Button type="link" icon={<DownloadOutlined />} onClick={() => onDownload(policy.id)}>
                        Descargar
                    </Button>
                </Space>
            </Card>
        ))}
    </Space>
);
