import { ChatMessage } from "@/types/messageModel";
import { List, Card, Typography } from "antd";

interface Props {
    messages: ChatMessage[];
}

export const ChatHistory = ({ messages }: Props) => {
    return (
        <List
            dataSource={messages}
            style={{ padding: 16, overflowY: "auto", flex: 1 }}
            renderItem={msg => (
                <List.Item
                    style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                    }}
                >
                    <Card
                        size="small"
                        style={{
                            maxWidth: "70%",
                            backgroundColor: msg.role === "user" ? "#1677ff" : "#ffffff",
                            color: msg.role === "user" ? "#fff" : "#000",
                            borderRadius: 12
                        }}
                    >
                        <Typography.Text>{msg.content}</Typography.Text>
                    </Card>
                </List.Item>
            )}
        />
    );
};
