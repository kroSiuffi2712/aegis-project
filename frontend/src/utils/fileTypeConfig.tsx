import { FilePdfOutlined, FileExcelOutlined, FileWordOutlined, FileOutlined } from "@ant-design/icons";

export type FileTypeConfig = {
    icon: JSX.Element;
    color: string;
    label: string;
};

export function getFileTypeConfig(fileName: string): FileTypeConfig {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
        case "pdf":
            return {
                icon: <FilePdfOutlined />,
                color: "#ff4d4f", // rojo PDF
                label: "Documento PDF"
            };

        case "xls":
        case "xlsx":
            return {
                icon: <FileExcelOutlined />,
                color: "#307a0aff", // verde Excel
                label: "Documento Excel"
            };

        case "doc":
        case "docx":
            return {
                icon: <FileWordOutlined />,
                color: "#1677ff", // azul Word
                label: "Documento Word"
            };

        default:
            return {
                icon: <FileOutlined />,
                color: "#8c8c8c", // gris default
                label: "Documento"
            };
    }
}
