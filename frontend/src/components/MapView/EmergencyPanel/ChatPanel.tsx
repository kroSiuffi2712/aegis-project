import React, { useState, useRef, useEffect } from "react";
import { Card, Input, Button, Typography, theme } from "antd";
import { AudioOutlined, SendOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Message {
    role: "user" | "assistant";
    content: string;
}

const ChatPanel: React.FC = () => {
    const { token } = theme.useToken();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello 👋 I'm your AI Emergency Assistant. How can I help?"
        }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            role: "user",
            content: input
        };

        setMessages(prev => [...prev, newMessage]);

        // Simulación respuesta IA
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Analyzing request... "
                }
            ]);
        }, 800);

        setInput("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Card
            bordered={false}
            styles={{ body: { padding: 0 } }}
            style={{
                minHeight: 480,
                display: "flex",
                flexDirection: "column",
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`
            }}
        >
            {/* HEADER */}
            <div
                style={{
                    padding: "14px 18px",
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    fontWeight: 600
                }}
            >
                AI Assistant
            </div>

            {/* MESSAGES */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            maxWidth: "75%",
                            background: msg.role === "user" ? token.colorPrimaryBg : "rgba(255,255,255,0.04)",
                            padding: "10px 14px",
                            borderRadius: 16,
                            border: msg.role === "assistant" ? `1px solid ${token.colorBorderSecondary}` : "none"
                        }}
                    >
                        <Text style={{ fontSize: 13 }}>{msg.content}</Text>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div
                style={{
                    padding: 14,
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                    display: "flex",
                    gap: 10,
                    alignItems: "center"
                }}
            >
                <Button
                    type="text"
                    icon={<AudioOutlined />}
                    style={{
                        fontSize: 18
                    }}
                />

                <Input.TextArea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    placeholder="Type a message..."
                    style={{
                        borderRadius: 18,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${token.colorBorderSecondary}`
                    }}
                />

                <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSend} />
            </div>
        </Card>
    );
};

export default ChatPanel;
