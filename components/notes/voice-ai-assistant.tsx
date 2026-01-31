"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    MicOff,
    Send,
    X,
    Loader2,
    Sparkles,
    MessageSquare,
    Volume2,
    VolumeX,
    Wand2,
    FileText,
    ListTodo,
    Lightbulb,
    BookOpen,
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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [audioEnabled, setAudioEnabled] = useState(true);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                stream.getTracks().forEach((track) => track.stop());
                await processAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Mikrofon erişimi başarısız:", error);
            alert("Mikrofon erişimi için izin verin.");
        }
    }, []);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    // Process audio with Gemini
    const processAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            // Convert audio to base64
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);

            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(",")[1];

                // Send to API
                const response = await fetch("/api/notes-ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "audio",
                        audio: base64Audio,
                        noteTitle,
                        noteContent: noteContent.replace(/<[^>]*>/g, "").slice(0, 2000),
                    }),
                });

                const data = await response.json();

                if (data.transcription) {
                    setMessages((prev) => [...prev, { role: "user", content: data.transcription }]);
                }

                if (data.response) {
                    setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
                    if (audioEnabled) speak(data.response);
                }

                if (data.action === "insert_text" && data.text) {
                    onInsertText(data.text);
                } else if (data.action === "insert_title" && data.title) {
                    onInsertTitle(data.title);
                }
            };
        } catch (error) {
            console.error("Ses işleme hatası:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Send text message
    const sendMessage = async (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText) return;

        setInputText("");
        setMessages((prev) => [...prev, { role: "user", content: messageText }]);
        setIsProcessing(true);

        try {
            const response = await fetch("/api/notes-ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "text",
                    message: messageText,
                    noteTitle,
                    noteContent: noteContent.replace(/<[^>]*>/g, "").slice(0, 2000),
                    history: messages.slice(-10),
                }),
            });

            const data = await response.json();

            if (data.response) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
                if (audioEnabled) speak(data.response);
            }

            if (data.action === "insert_text" && data.text) {
                onInsertText(data.text);
            } else if (data.action === "insert_title" && data.title) {
                onInsertTitle(data.title);
            }
        } catch (error) {
            console.error("Mesaj gönderme hatası:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Bir hata oluştu. Lütfen tekrar deneyin." },
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Text-to-speech
    const speak = (text: string) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "tr-TR";
        utterance.rate = 1.1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    // Quick actions
    const quickActions = [
        { icon: FileText, label: "Özet çıkar", action: "Bu notun özetini çıkar" },
        { icon: ListTodo, label: "Yapılacaklar", action: "Bu nottan yapılacaklar listesi oluştur" },
        { icon: Lightbulb, label: "Fikir ver", action: "Bu konu hakkında fikirler ver" },
        { icon: BookOpen, label: "Açıkla", action: "Bu konuyu daha detaylı açıkla" },
    ];

    return (
        <>
            {/* Floating AI Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50",
                    "w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-purple-600 to-indigo-600",
                    "text-white shadow-lg shadow-purple-500/30",
                    "flex items-center justify-center",
                    "hover:scale-110 active:scale-95 transition-transform"
                )}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <Sparkles className="w-6 h-6" />
            </motion.button>

            {/* AI Assistant Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 sm:bottom-6 sm:right-6 sm:left-auto z-50",
                            "sm:w-[400px] h-[70vh] sm:h-[500px] sm:rounded-2xl",
                            "bg-gradient-to-b from-slate-900 to-slate-950",
                            "border-t-2 sm:border-2 border-purple-500/30",
                            "flex flex-col overflow-hidden",
                            "shadow-2xl shadow-purple-500/20"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <Wand2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">FizikHub AI</h3>
                                    <p className="text-xs text-purple-300">Not asistanın</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        audioEnabled ? "text-purple-400" : "text-gray-500"
                                    )}
                                >
                                    {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {messages.length === 0 && (
                            <div className="p-4 border-b border-purple-500/10">
                                <p className="text-xs text-purple-400 mb-3">Hızlı İşlemler</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(action.action)}
                                            className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 text-sm transition-colors"
                                        >
                                            <action.icon className="w-4 h-4" />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <MessageSquare className="w-12 h-12 text-purple-500/30 mb-3" />
                                    <p className="text-gray-400 text-sm">
                                        Sesli veya yazılı olarak benimle konuş!
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Not almanda, düzenlemende yardımcı olabilirim
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex",
                                            msg.role === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm",
                                                msg.role === "user"
                                                    ? "bg-purple-600 text-white rounded-br-md"
                                                    : "bg-slate-800 text-gray-200 rounded-bl-md"
                                            )}
                                        >
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-800">
                                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-purple-500/20 bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                {/* Voice button */}
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled={isProcessing}
                                    className={cn(
                                        "p-3 rounded-xl transition-all",
                                        isRecording
                                            ? "bg-red-500 text-white animate-pulse"
                                            : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                                    )}
                                >
                                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>

                                {/* Text input */}
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder={isRecording ? "Dinliyorum..." : "Mesaj yaz..."}
                                    disabled={isRecording || isProcessing}
                                    className={cn(
                                        "flex-1 px-4 py-2.5 rounded-xl",
                                        "bg-slate-800 text-white placeholder:text-gray-500",
                                        "border border-purple-500/20 focus:border-purple-500/50",
                                        "outline-none transition-colors"
                                    )}
                                />

                                {/* Send button */}
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!inputText.trim() || isProcessing}
                                    className={cn(
                                        "p-3 rounded-xl transition-all",
                                        inputText.trim()
                                            ? "bg-purple-600 text-white hover:bg-purple-700"
                                            : "bg-slate-800 text-gray-500"
                                    )}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Recording indicator */}
                            {isRecording && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-2 mt-3 text-red-400 text-sm"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    Kayıt yapılıyor... Durdurmak için mikrofon butonuna bas
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
