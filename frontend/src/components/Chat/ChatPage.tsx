import React, { useEffect, useRef, useState } from "react";
import { Button, Input, List, Typography, Card, Tooltip, ConfigProvider } from "antd";
import { InputRef, theme } from "antd";
import { Mic, AudioLines, Pause } from "lucide-react";
import { Avatar } from "antd";
import { RobotOutlined } from "@ant-design/icons";

import useRealtimeAudio from "@/hooks/useRealtimeAudio";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ChatWelcome } from "./ChatWelcome";
import { GroundingFiles } from "../ui/grounding-files";
import { Files, FilesBySession, GroundingFile } from "@/types";
import { downloadBase64ByExtension } from "@/utils/downloadFiles";
//import { mockGroundingFiles } from "@/mocks/groundingFiles.mock";

const { Text } = Typography;

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    type?: "text" | "menu";
    policies?: string[];
    files?: FilesBySession[];
    options?: GroundingFile[];
};

export interface MenuOption {
    id: string;
    label: string;
}

const ChatPage: React.FC = () => {
    const sessionIdRef = useRef<string>(crypto.randomUUID());
    const hasInitialized = useRef(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [files, setFiles] = useState<Files[]>([]);
    const [isDownloading, setIsDownloading] = useState(false);
    const {
        token: { colorBgContainer }
    } = theme.useToken();

    // refs
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const lastAssistantRef = useRef<HTMLDivElement | null>(null);
    const inputWrapperRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<InputRef>(null);

    const [inputHeight, setInputHeight] = useState(0);

    useEffect(() => {
        if (!sessionIdRef || hasInitialized.current) return;
        hasInitialized.current = true;
        sendMessageByOptions("start");
    }, [sessionIdRef]);

    const handleOnSelected = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        console.log("Archivo seleccionado ID:", id);
        const file = files.find(f => f.id === id);

        if (!file) {
            console.error("Archivo no encontrado");
            return;
        }

        try {
            setIsDownloading(true);

            // Deja respirar el UI antes del trabajo pesado
            await new Promise(resolve => setTimeout(resolve, 50));

            downloadBase64ByExtension(file.content, file.name);
        } catch (error) {
            console.error("Error descargando archivo", error);
        } finally {
            setIsDownloading(false);
        }
    };

    /* ---------------------------
     medir altura del input
    ---------------------------- */
    useEffect(() => {
        if (inputWrapperRef.current) {
            setInputHeight(inputWrapperRef.current.offsetHeight);
        }
    }, []);

    /* ---------------------------
     Audio realtime
    ---------------------------- */
    const handleUserMessage = React.useCallback((text: string) => {
        setMessages(prev => [...prev, { role: "user", content: text }]);
    }, []);

    const handleAssistantMessage = React.useCallback((text: string) => {
        setMessages(prev => [...prev, { role: "assistant", content: text }]);
        setLoading(false); // ⬅️ SOLO aquí se apaga loading
    }, []);
    /*const { isRecording, toggle, groundingFiles, selectedFile, setSelectedFile } = useRealtimeAudio({*/
    const { isRecording, toggle } = useRealtimeAudio({
        onUserMessage: handleUserMessage,
        onAssistantMessage: handleAssistantMessage,

        onThinkingStart: () => {
            setLoading(true);
        },

        onThinkingEnd: () => {
            // no apagar loading aquí
        },

        onAudioStart: () => {
            setIsSpeaking(true);
        },

        onAudioEnd: () => {
            setIsSpeaking(false);
        }
    });

    /* ---------------------------
     Texto
    ---------------------------- */
    const sendMessageByOptions = async (option: string) => {
        console.log("Opción de menú seleccionada:", option);
        if (!option.trim() || loading) return;

        const userText = option;
        //setMessages(prev => [...prev, { role: "user", content: userText }]);
        setLoading(true);

        console.log("Sending message to backend:", userText);
        console.log(option);
        try {
            const response = await fetch("http://localhost:8765/assist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionIdRef.current,
                    user_id: "u123",
                    message: userText
                })
            });

            const data = await response.json();
            data?.response?.files ? setFiles([...files, ...data.response.files]) : [];
            const filesBySession: FilesBySession[] = data?.response?.files.map((file: FilesBySession) => ({ id: file.id, name: file.name }));
            const menuOptions: GroundingFile[] = data?.response?.options.map((option: MenuOption) => ({
                id: option.id,
                name: option.label
            }));
            console.log("----- data -------");
            console.log(data);
            console.log("----- files -------");
            console.log(data?.response?.files);
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response.message || "No response",
                    type: data.response.type ? data.response.type : "text",
                    files: filesBySession,
                    options: menuOptions
                }
            ]);

            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userText = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userText }]);
        setLoading(true);

        console.log("Sending message to backend:", userText);
        try {
            const response = await fetch("http://localhost:8765/assist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionIdRef.current,
                    user_id: "u123",
                    message: userText
                })
            });

            const data = await response.json();
            data?.response?.files ? setFiles([...files, ...data.response.files]) : [];
            const filesBySession: FilesBySession[] = data?.response?.files.map((file: FilesBySession) => ({ id: file.id, name: file.name }));
            const menuOptions: GroundingFile[] = data?.response?.options.map((option: MenuOption) => ({
                id: option.id,
                name: option.label
            }));
            console.log("----- data -------");
            console.log(data);
            console.log("----- files -------");
            console.log(data?.response?.files);
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response.message || "No response",
                    type: data.response.type ? data.response.type : "text",
                    files: filesBySession,
                    options: menuOptions
                }
            ]);

            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    /* ---------------------------
     Scroll exacto al último asistente
    ---------------------------- */
    /*
    useEffect(() => {
        if (!lastAssistantRef.current) return;

        lastAssistantRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, [messages]);
    */
    /* ---------------------------
     Mantener foco
    ---------------------------- */
    useEffect(() => {
        inputRef.current?.focus();
    }, [loading, isSpeaking]);

    return (
        <Card
            style={{
                maxWidth: 800,
                margin: "0 auto",
                border: "none",
                display: "flex",
                flexDirection: "column",
                background: colorBgContainer,
                minHeight:"80vh"
            }}
        >
            {/* Header */}
            <ChatWelcome name="Carolina" />

            {/* Conversación */}
            <div
                ref={scrollContainerRef}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: "30vh"
                }}
            >
                <List
                    split={false}
                    dataSource={messages}
                    locale={{ emptyText: <div /> }}
                    renderItem={(item, index) => {
                        const lastAssistantIndex = [...messages]
                            .map((m, i) => ({ m, i }))
                            .filter(x => x.m.role === "assistant")
                            .pop()?.i;

                        const isLastAssistant = item.role === "assistant" && index === lastAssistantIndex;

                        return (
                            <List.Item
                                style={{
                                    justifyContent: item.role === "user" ? "flex-end" : "flex-start"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 8,
                                        flexDirection: item.role === "user" ? "row-reverse" : "row"
                                    }}
                                >
                                    {/* Avatar */}
                                    <Avatar
                                        size={"large"}
                                        style={{
                                            background: item.role === "user" ? "#f4f6f7ff" : "#ffffff",
                                            border: "1px solid #d9d9d9",
                                            color: "#000",
                                            flexShrink: 0
                                        }}
                                    >
                                        {item.role === "user" ? "Carolina Ruiz".charAt(0).toUpperCase() : <RobotOutlined />}
                                    </Avatar>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        {/* Mensaje */}
                                        <div
                                            ref={isLastAssistant ? lastAssistantRef : null}
                                            style={{
                                                background: item.role === "user" ? "#f4f6f7ff" : "#ffffff",
                                                color: "#000000",
                                                border: "1px solid #d9d9d9",
                                                padding: "10px 14px",
                                                borderRadius: 12,
                                                scrollMarginBottom: inputHeight,
                                                lineHeight: 1.5,
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
                                            }}
                                        >
                                            <Text>{item.content}</Text>
                                        </div>
                                        {item.type === "menu" && item.options?.length ? (
                                            <GroundingFiles
                                                files={item.options}
                                                isDownloading={isDownloading}
                                                downloadingIcon={false}
                                                label={false}
                                                icon={false}
                                                onClick={async (e: React.MouseEvent, id: string, name?: string) => {
                                                    id === undefined && name ? sendMessageByOptions(name) : sendMessageByOptions(id);
                                                    console.log(e);
                                                    console.log("option:", name);
                                                }}
                                            />
                                        ) : null}
                                        {item.files && (
                                            <GroundingFiles
                                                files={item.files}
                                                onClick={handleOnSelected}
                                                isDownloading={isDownloading}
                                                downloadingIcon={true}
                                                label={false}
                                                icon={true}
                                            />
                                        )}
                                    </div>
                                </div>
                            </List.Item>
                        );
                    }}
                />

                {loading && <LoadingSpinner loading={loading} />}
            </div>

            {/* Input */}
            <div
                ref={inputWrapperRef}
                style={{
                    marginTop: "auto",
                    position: "sticky",
                    bottom: 0,
                    background: colorBgContainer,
                }}
            >
                <ConfigProvider
                    theme={{
                        components: {
                            Input: {
                                activeBorderColor: "#d9d9d9",
                                hoverBorderColor: "#d9d9d9",
                                activeShadow: "none"
                            }
                        },
                        token: {
                            controlOutline: "none"
                        }
                    }}
                    tooltip={{ unique: true }}
                >
                    <Input
                        ref={inputRef}
                        placeholder="Ask me about recent incidents, locations, or response times...."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onPressEnter={sendMessage}
                        size="large"
                        style={{
                            borderRadius: 999,
                            height: 48,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
                        }}
                        suffix={
                            <div style={{ display: "flex", gap: 8 }}>
                                <Tooltip title={isRecording ? "Pausar Dictado" : "Dictar"}>
                                    <Button shape="circle" icon={<Mic size={18} />} onClick={toggle} disabled/>
                                </Tooltip>
                                <Tooltip title={isRecording ? "Pausar Voz" : "Modo Voz"}>
                                    <Button
                                        shape="circle"
                                        danger={isRecording}
                                        icon={isRecording ? <Pause size={18} /> : <AudioLines size={18} />}
                                        onClick={toggle}
                                        disabled
                                    />
                                </Tooltip>
                            </div>
                        }
                    />
                </ConfigProvider>

                <div style={{ marginTop: 8, fontSize: 12, color: "#999", background: colorBgContainer }}>
                    session_id: {sessionIdRef.current}
                    <br />
                    audio: {isRecording ? "ON" : "OFF"}
                </div>
            </div>
        </Card>
    );
};

export default ChatPage;
