import { getMimeTypeByExtension } from "./getMimeTypeByExtension";

export const downloadBase64ByExtension = (base64: string, fileName: string): void => {
    if (!base64 || !fileName) {
        console.error(" Base64 o nombre de archivo inválido");
        return;
    }

    const extension = fileName.split(".").pop()?.toLowerCase();

    const mimeType = getMimeTypeByExtension(extension);

    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
