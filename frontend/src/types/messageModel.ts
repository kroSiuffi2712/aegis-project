export type MessageRole = "user" | "assistant";
export type MessageSource = "text" | "audio";

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    source: MessageSource;
}
