// src/hooks/useRealtimeAudio.ts
import { useRef, useState } from "react";
import useAudioRecorder from "./useAudioRecorder";
import useAudioPlayer from "./useAudioPlayer";
import { FilesBySession, GroundingFile, ToolResult } from "@/types";
import useRealTime from "./useRealtime";

type Params = {
    onUserMessage?: (text: string) => void;
    onAssistantMessage?: (text: string) => void;
    onThinkingStart?: () => void; 
    onThinkingEnd?: () => void; 
    onAudioStart?: () => void; 
    onAudioEnd?: () => void;
};

export default function useRealtimeAudio(params?: Params) {
    const [isRecording, setIsRecording] = useState(false);
    const [groundingFiles, setGroundingFiles] = useState<GroundingFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<FilesBySession | null>(null);

    // buffer para juntar el texto del asistente
    const assistantTextBuffer = useRef("");
    const isRecordingRef = useRef(false);
    const lastUserTextRef = useRef<string | null>(null);

    const { reset: resetAudioPlayer, play: playAudio, stop: stopAudioPlayer } = useAudioPlayer();

    const { startSession, addUserAudio, inputAudioBufferClear } = useRealTime({
        enableInputAudioTranscription: true,
        // MANTENEMOS TODO LO QUE YA FUNCIONA
        onWebSocketOpen: () => console.log("WS open"),
        onWebSocketClose: () => console.log("WS close"),
        onWebSocketError: e => console.error("WS error", e),

        onReceivedResponseAudioDelta: message => {
            if (isRecording) {
                playAudio(message.delta);
            }
        },

        // CLAVE: cuando el modelo empieza a hablar
        onReceivedInputAudioBufferSpeechStarted: () => {
            stopAudioPlayer();
            params?.onThinkingStart?.(); //ACTIVA LOADING
        },

        onReceivedExtensionMiddleTierToolResponse: message => {
            const result: ToolResult = JSON.parse(message.tool_result);
            const files: GroundingFile[] = result.sources.map(x => {
                return { id: x.chunk_id, name: x.title, content: x.chunk };
            });
            console.log("🗂️ Archivos de fundamentación actualizados:", files);
            setGroundingFiles(prev => [...prev, ...files]);
        },

        // NUEVO: transcripción del usuario (audio → texto)
        onReceivedInputAudioTranscriptionCompleted: message => {
            const text = (message as any)?.transcript?.trim();

            if (text) {
                console.log("🗣️ AUDIO USER:", text);
                params?.onUserMessage?.(text);
            }
        },

        // NUEVO: vamos acumulando el texto del asistente
        onReceivedResponseAudioTranscriptDelta: message => {
            assistantTextBuffer.current += message.delta;
        },

        // CLAVE: el turno terminó (respuesta completa)
        onReceivedResponseDone: () => {
            const finalText = assistantTextBuffer.current.trim();

            if (finalText) {
                params?.onAssistantMessage?.(finalText);
            }

            assistantTextBuffer.current = "";
            lastUserTextRef.current = null;
            params?.onThinkingEnd?.(); // APAGA LOADING

            if (!isRecordingRef.current) {
                inputAudioBufferClear();
            }
        }
    });

    const { start: startRecording, stop: stopRecording } = useAudioRecorder({
        onAudioRecorded: addUserAudio
    });

    const start = async () => {
        isRecordingRef.current = true;
        startSession(); // activa server_vad
        resetAudioPlayer();
        await startRecording();
        setIsRecording(true);
    };

    const stop = async () => {
        isRecordingRef.current = false;
        await stopRecording();
        stopAudioPlayer();
        //inputAudioBufferClear(); // MUY IMPORTANTE
        setIsRecording(false);
    };

    const toggle = async () => {
        if (!isRecording) {
            await start();
        } else {
            await stop();
        }
    };

    return {
        isRecording,
        toggle,
        groundingFiles,
        selectedFile,
        setSelectedFile
    };
}
