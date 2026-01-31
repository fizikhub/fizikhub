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
    Waves,
    History,
    Trash2,
    Languages,
    Zap,
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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(20).fill(10));
    const [isMobile, setIsMobile] = useState(false);

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
        // Load chat history from local storage if needed
        const saved = localStorage.getItem("fizikhub_ai_chat");
        if (saved) {
            try {
                setMessages(JSON.parse(saved).slice(-20));
            } catch (e) { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("fizikhub_ai_chat", JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle visualizer
    const startVisualizer = (stream: MediaStream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 64;
        source.connect(analyzer);

        audioContextRef.current = audioContext;
        analyzerRef.current = analyzer;

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const animate = () => {
            analyzer.getByteFrequencyData(dataArray);
            const values = Array.from(dataArray.slice(0, 20)).map(v => (v / 255) * 40 + 5);
            setVisualizerData(values);
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
        setVisualizerData(new Array(20).fill(5));
    };

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
                stopVisualizer();
                await processAudio(audioBlob);
            };

            startVisualizer(stream);
            mediaRecorder.start();
            setIsRecording(true);

            // Stop TTS if speaking
            if (synthRef.current?.speaking) synthRef.current.cancel();
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
                        noteContent: noteContent.replace(/<[^>]*>/g, "").slice(0, 2000),
                        history: messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
                    }),
                });

                const data = await response.json();

                if (data.transcription) {
                    setMessages((prev) => [...prev, { role: "user", content: data.transcription, timestamp: Date.now() }]);
                }

                if (data.response) {
                    setMessages((prev) => [...prev, { role: "assistant", content: data.response, timestamp: Date.now() }]);
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
        setMessages((prev) => [...prev, { role: "user", content: messageText, timestamp: Date.now() }]);
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
                    history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await response.json();

            if (data.response) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.response, timestamp: Date.now() }]);
                if (audioEnabled) speak(data.response);
            }

            if (data.action === "insert_text" && data.text) {
                onInsertText(data.text);
            } else if (data.action === "insert_title" && data.title) {
                onInsertTitle(data.title);
            }
        } catch (error) {
            console.error("Mesaj gönderme hatası:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = (text: string) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();

        // Clean text from actions
        const cleanText = text.replace(/\[ACTION:.*?\]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "tr-TR";
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const clearChat = () => {
        if (confirm("Sohbet geçmişini silmek istediğine emin misin?")) {
            setMessages([]);
            localStorage.removeItem("fizikhub_ai_chat");
        }
    };

    const quickActions = [
        { icon: Wand2, label: "Güzelleştir", action: "Bu notu daha profesyonel ve düzenli hale getir" },
        { icon: Languages, label: "Çevir (EN)", action: "Bu notu İngilizce'ye çevir" },
        { icon: Zap, label: "Ana Fikir", action: "Bu notun ana fikrini tek cümleyle söyle" },
        { icon: ListTodo, label: "Plan Yap", action: "Bu notu bir eylem planına dönüştür" },
    ];

    return (
        <>
            {/* Floating AI Button - Enhanced */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50",
                    "w-16 h-16 rounded-2xl",
                    "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500",
                    "text-white shadow-xl shadow-purple-500/40",
                    "flex items-center justify-center",
                    "border-2 border-white/20",
                    "hover:scale-110 active:scale-95 transition-all duration-300"
                )}
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                animate={{
                    boxShadow: ["0 0 0px rgba(168,85,247,0)", "0 0 20px rgba(168,85,247,0.5)", "0 0 0px rgba(168,85,247,0)"]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <div className="relative">
                    <Sparkles className="w-7 h-7" />
                    <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                </div>
            </motion.button>

            {/* AI Assistant Panel - Enhanced UX */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, x: isMobile ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, x: isMobile ? 0 : 20 }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 sm:bottom-6 sm:right-6 sm:left-auto z-50",
                            "sm:w-[420px] h-[85vh] sm:h-[600px] sm:rounded-3xl",
                            "bg-slate-950/95 backdrop-blur-xl",
                            "border-t-2 sm:border-2 border-purple-500/40",
                            "flex flex-col overflow-hidden",
                            "shadow-[0_0_50px_rgba(139,92,246,0.3)]"
                        )}
                    >
                        {/* Glass Header */}
                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    {isSpeaking && (
                                        <motion.div
                                            className="absolute -bottom-1 -right-1"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 0.5 }}
                                        >
                                            <Volume2 className="w-5 h-5 text-cyan-400" />
                                        </motion.div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg tracking-tight">Gemini Native Audio</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-[10px] font-bold uppercase text-purple-300 tracking-wider">AI Canlı Asistan</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={clearChat}
                                    title="Geçmişi Sil"
                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={cn(
                                        "p-2 rounded-xl transition-all",
                                        audioEnabled ? "text-indigo-400 bg-indigo-500/10" : "text-gray-500 bg-gray-500/10"
                                    )}
                                >
                                    {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-purple-500/20">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white/5 rounded-3xl border border-white/5 mx-2">
                                    <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                                        <Waves className="w-10 h-10 text-purple-500 animate-pulse" />
                                    </div>
                                    <h4 className="text-white font-bold mb-2 text-lg">Merhaba Baran!</h4>
                                    <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed">
                                        Ben senin akıllı asistanınım. Sesli konuşabilir, notlarını düzenlememi isteyebilirsin.
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 w-full mt-8">
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(action.action)}
                                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all group border border-white/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <action.icon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                                                    <span>{action.label}</span>
                                                </div>
                                                <Sparkles className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "flex flex-col",
                                            msg.role === "user" ? "items-end" : "items-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[88%] px-5 py-3.5 rounded-3xl text-[14px] leading-relaxed shadow-sm",
                                                msg.role === "user"
                                                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none border-b-2 border-indigo-700/50"
                                                    : "bg-slate-900 border border-white/10 text-gray-100 rounded-tl-none"
                                            )}
                                        >
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-gray-600 mt-1.5 px-2 font-medium">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </motion.div>
                                ))
                            )}
                            {isProcessing && (
                                <div className="flex justify-start items-center gap-3">
                                    <div className="px-5 py-4 rounded-3xl rounded-tl-none bg-slate-900 border border-white/10">
                                        <div className="flex gap-1.5">
                                            <motion.div className="w-2 h-2 bg-purple-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                                            <motion.div className="w-2 h-2 bg-indigo-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                            <motion.div className="w-2 h-2 bg-pink-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input & Record Area - Modern Design */}
                        <div className="p-6 bg-slate-950 border-t border-white/10">
                            {isRecording ? (
                                <div className="flex flex-col items-center gap-4 py-4">
                                    {/* Visualizer Animation */}
                                    <div className="flex items-end justify-center gap-1 h-12 w-full">
                                        {visualizerData.map((val, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: val }}
                                                className="w-1.5 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={stopRecording}
                                        className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl shadow-red-600/20 transition-all scale-110"
                                    >
                                        <MicOff className="w-5 h-5 animate-pulse" />
                                        Durdur ve Analiz Et
                                    </button>
                                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">Seni dinliyorum...</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={startRecording}
                                        disabled={isProcessing}
                                        className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20",
                                            "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                                        )}
                                    >
                                        <Mic className="w-6 h-6" />
                                    </motion.button>

                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                            placeholder="Fikir sor, not aldır..."
                                            disabled={isProcessing}
                                            className={cn(
                                                "w-full px-5 py-4 rounded-2xl",
                                                "bg-white/5 text-white placeholder:text-gray-500",
                                                "border border-white/10 focus:border-purple-500/50",
                                                "outline-none transition-all duration-300"
                                            )}
                                        />
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => sendMessage()}
                                        disabled={!inputText.trim() || isProcessing}
                                        className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                            inputText.trim()
                                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                                                : "bg-white/5 text-gray-600 border border-white/5"
                                        )}
                                    >
                                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
