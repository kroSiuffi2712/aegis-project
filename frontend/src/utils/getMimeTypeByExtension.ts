export const getMimeTypeByExtension = (extension?: string): string => {
    switch (extension) {
        case "pdf":
            return "application/pdf";
        case "doc":
            return "application/msword";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "xls":
            return "application/vnd.ms-excel";
        case "xlsx":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case "csv":
            return "text/csv";
        case "txt":
            return "text/plain";
        case "png":
            return "image/png";
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "zip":
            return "application/zip";
        default:
            return "application/octet-stream"; // genérico
    }
};
