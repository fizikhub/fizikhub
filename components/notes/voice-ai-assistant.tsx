"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    Send,
    X,
    Loader2,
    Volume2,
    VolumeX,
    Trash2,
    Radio,
    Sparkles,
    MessageSquare,
} from "lucide-react";

interface VoiceAIAssistantProps {
    onInsertText: (text: string) => void;
    onInsertTitle: (title: string) => void;
    noteTitle: string;
    noteContent: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export function VoiceAIAssistant({
    onInsertText,
    onInsertTitle,
    noteTitle,
    noteContent,
}: VoiceAIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(12).fill(5));
    const [isMobile, setIsMobile] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeModel, setActiveModel] = useState<string>("Gemma 3");
    const [isLiveConnected, setIsLiveConnected] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
            const checkMobile = () => setIsMobile(window.innerWidth < 768);
            checkMobile();
            window.addEventListener("resize", checkMobile);
            return () => window.removeEventListener("resize", checkMobile);
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("fizikhub_neo_chat");
        if (saved) {
            try { setMessages(JSON.parse(saved).slice(-10)); } catch (e) { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("fizikhub_neo_chat", JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startVisualizer = (stream: MediaStream) => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 32;
            source.connect(analyzer);
            audioContextRef.current = audioContext;
            analyzerRef.current = analyzer;
            const dataArray = new Uint8Array(analyzer.frequencyBinCount);
            const animate = () => {
                analyzer.getByteFrequencyData(dataArray);
                const values = Array.from(dataArray.slice(0, 12)).map(v => (v / 255) * 24 + 4);
                setVisualizerData(values);
                animationFrameRef.current = requestAnimationFrame(animate);
            };
            animate();
        } catch (err) { }
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close().catch(() => { });
        setVisualizerData(new Array(12).fill(4));
    };

    const convertToPCM = async (audioBlob: Blob): Promise<string> => {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const targetSampleRate = 16000;
        const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * targetSampleRate, targetSampleRate);
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start();
        const resampledBuffer = await offlineContext.startRendering();
        const pcmData = resampledBuffer.getChannelData(0);
        const pcm16 = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
            pcm16[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32768));
        }
        const uint8Array = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
    };

    const startRecording = useCallback(async () => {
        setError(null);
        setActiveModel("Dinliyor...");
        setIsLiveConnected(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
            const supportedType = ['audio/webm', 'audio/ogg', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type)) || '';
            const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedType });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => event.data.size > 0 && audioChunksRef.current.push(event.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: supportedType });
                stream.getTracks().forEach((track) => track.stop());
                stopVisualizer();
                await processLiveAudio(audioBlob);
            };
            startVisualizer(stream);
            mediaRecorder.start();
            setIsRecording(true);
            if (synthRef.current?.speaking) synthRef.current.cancel();
        } catch (error) {
            setError("Mikrofon erişimi reddedildi");
            setActiveModel("Hata");
            setIsLiveConnected(false);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setActiveModel("İşleniyor...");
        }
    }, [isRecording]);

    const processLiveAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);
        setError(null);
        try {
            setActiveModel("Bağlanıyor...");
            const pcmBase64 = await convertToPCM(audioBlob);

            const response = await fetch("/api/gemini-live", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    audio: pcmBase64,
                    noteTitle,
                    noteContent: noteContent.replace(/<[^>]*>/g, "").slice(0, 1000),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "API Hatası");
            }

            const data = await response.json();
            setActiveModel(data.debug?.model?.includes("native") ? "Native Audio" : "Gemini");

            if (data.response) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response, timestamp: Date.now() }]);
                if (audioEnabled) speak(data.response);
            }
        } catch (error: any) {
            console.error("Live API error:", error);
            setError(error.message);
            setActiveModel("Hata");
            await fallbackToRegularAPI(audioBlob);
        } finally {
            setIsProcessing(false);
            setIsLiveConnected(false);
        }
    };

    const fallbackToRegularAPI = async (audioBlob: Blob) => {
        try {
            setActiveModel("Yedek Mod...");
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(",")[1];
                const response = await fetch("/api/notes-ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "audio",
                        audio: base64Audio,
                        noteTitle,
                        noteContent: noteContent.replace(/<[^>]*>/g, "").slice(0, 1500),
                        history: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
                    }),
                });
                const data = await response.json();
                if (data.debug?.model) setActiveModel(data.debug.model.split("-")[0]);
                if (data.response) {
                    setMessages(prev => [...prev, { role: "assistant", content: data.response, timestamp: Date.now() }]);
                    if (audioEnabled) speak(data.response);
                }
            };
        } catch (e) {
            setError("Bağlantı başarısız");
        }
    };

    const sendMessage = async (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText) return;
        setInputText("");
        setError(null);
        setMessages(prev => [...prev, { role: "user", content: messageText, timestamp: Date.now() }]);
        setIsProcessing(true);
        setActiveModel("Gemma 3...");
        try {
            const response = await fetch("/api/notes-ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "text",
                    message: messageText,
                    noteTitle,
                    noteContent: noteContent.replace(/<[^>]*>/g, "").slice(0, 1500),
                    history: messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
                }),
            });
            if (!response.ok) throw new Error("API Hatası");
            const data = await response.json();
            if (data.debug?.model) setActiveModel(data.debug.model.includes("gemma") ? "Gemma 3" : data.debug.model.split("-")[0]);
            if (data.response) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response, timestamp: Date.now() }]);
                if (audioEnabled) speak(data.response);
            }
            if (data.action === "insert_text" && data.text) onInsertText(data.text);
            else if (data.action === "insert_title" && data.title) onInsertTitle(data.title);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = (text: string) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\[ACTION:.*?\]/g, ""));
        utterance.lang = "tr-TR";
        utterance.rate = 1.1;
        synthRef.current.speak(utterance);
    };

    return (
        <>
            {/* NEO-BRUTALIST FAB BUTTON */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50",
                    "w-14 h-14 rounded-xl",
                    "bg-amber-400 text-black border-[3px] border-black",
                    "shadow-[4px_4px_0px_0px_#000]",
                    "flex items-center justify-center",
                    "hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]",
                    "active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                    "transition-all duration-150"
                )}
                whileTap={{ scale: 0.95 }}
            >
                <Sparkles className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={cn(
                            "fixed z-[60] flex flex-col overflow-hidden",
                            isMobile
                                ? "bottom-0 left-0 right-0 h-[75vh] rounded-t-2xl"
                                : "bottom-6 right-6 w-[380px] h-[520px] rounded-2xl",
                            "bg-white dark:bg-zinc-900",
                            "border-[3px] border-black dark:border-white",
                            "shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]"
                        )}
                    >
                        {/* NEO-BRUTALIST HEADER */}
                        <div className="flex items-center justify-between px-4 h-14 border-b-[3px] border-black dark:border-white bg-amber-400">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-3 h-3 rounded-full border-2 border-black",
                                    isLiveConnected ? "bg-green-500 animate-pulse" : "bg-white"
                                )} />
                                <div className="flex flex-col">
                                    <span className="font-black text-sm text-black uppercase tracking-tight">AI Asistan</span>
                                    <span className="text-[10px] font-bold text-black/70">{activeModel}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={cn(
                                        "p-2 rounded-lg border-2 border-black transition-all",
                                        audioEnabled ? "bg-white" : "bg-black/10"
                                    )}
                                >
                                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => { setMessages([]); localStorage.removeItem("fizikhub_neo_chat"); }}
                                    className="p-2 rounded-lg border-2 border-black bg-white hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg border-2 border-black bg-white hover:bg-zinc-100 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* CHAT AREA */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50 dark:bg-zinc-800">
                            {messages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 bg-amber-400 border-[3px] border-black rounded-xl flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_#000]">
                                        <MessageSquare className="w-8 h-8 text-black" />
                                    </div>
                                    <p className="font-bold text-lg text-black dark:text-white mb-1">Merhaba!</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-[200px]">
                                        Sesli veya yazılı olarak notlarınla ilgili yardım isteyebilirsin.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                        {["Özetle", "Çevir", "Düzenle"].map((action) => (
                                            <button
                                                key={action}
                                                onClick={() => sendMessage(action === "Özetle" ? "Notu özetle" : action === "Çevir" ? "İngilizce'ye çevir" : "Dil bilgisi hatalarını düzelt")}
                                                className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-zinc-700 border-2 border-black dark:border-white rounded-lg shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                                    >
                                        <div className={cn(
                                            "max-w-[85%] px-3 py-2 rounded-xl text-sm border-2",
                                            msg.role === "user"
                                                ? "bg-amber-400 text-black border-black shadow-[2px_2px_0px_0px_#000]"
                                                : "bg-white dark:bg-zinc-700 text-black dark:text-white border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="px-3 py-2 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-xs font-bold">Düşünüyor...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mx-4 mb-2 px-3 py-2 bg-red-100 border-2 border-red-500 rounded-lg text-xs font-bold text-red-700">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* NEO-BRUTALIST INPUT AREA */}
                        <div className="p-4 border-t-[3px] border-black dark:border-white bg-white dark:bg-zinc-900">
                            {isRecording ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-end gap-1 h-8">
                                        {visualizerData.map((v, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: v }}
                                                className="w-2 bg-amber-400 border border-black rounded-sm"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={stopRecording}
                                        className="w-full py-3 bg-red-500 text-white font-black text-sm uppercase tracking-wide border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                    >
                                        Kaydı Durdur
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={startRecording}
                                        disabled={isProcessing}
                                        className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-xl",
                                            "bg-green-400 text-black border-[3px] border-black",
                                            "shadow-[3px_3px_0px_0px_#000]",
                                            "hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]",
                                            "transition-all disabled:opacity-50"
                                        )}
                                    >
                                        <Mic className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="Mesajını yaz..."
                                        disabled={isProcessing}
                                        className={cn(
                                            "flex-1 px-4 py-2 rounded-xl text-sm font-medium",
                                            "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white",
                                            "border-[3px] border-black dark:border-white",
                                            "placeholder:text-zinc-500",
                                            "focus:outline-none focus:ring-2 focus:ring-amber-400",
                                            "disabled:opacity-50"
                                        )}
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!inputText.trim() || isProcessing}
                                        className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-xl",
                                            "bg-amber-400 text-black border-[3px] border-black",
                                            "shadow-[3px_3px_0px_0px_#000]",
                                            "hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]",
                                            "transition-all disabled:opacity-50"
                                        )}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
