import { Input, Button, Space } from "antd";
import { AudioOutlined, SendOutlined } from "@ant-design/icons";
import { useState } from "react";

interface Props {
    onSendText: (text: string) => void;
    onToggleAudio: () => void;
    listening: boolean;
}

export const ChatInput = ({ onSendText, onToggleAudio, listening }: Props) => {
    const [value, setValue] = useState("");

    const send = () => {
        if (!value.trim()) return;
        onSendText(value);
        setValue("");
    };

    return (
        <Space
            style={{
                width: "100%",
                padding: 12,
                borderTop: "1px solid #f0f0f0"
            }}
        >
            <Input
                value={value}
                disabled={listening}
                placeholder={listening ? "Escuchando..." : "Escribe un mensaje"}
                onChange={e => setValue(e.target.value)}
                onPressEnter={send}
            />

            <Button icon={<SendOutlined />} onClick={send} disabled={listening} />

            <Button type={listening ? "primary" : "default"} danger={listening} icon={<AudioOutlined />} onClick={onToggleAudio} />
        </Space>
    );
};
