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
    Volume2,
    VolumeX,
    ListTodo,
    Trash2,
    Languages,
    Zap,
    AlertCircle,
    Activity,
    Cpu,
    ChevronDown,
    ChevronUp,
    Radio,
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
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(15).fill(5));
    const [isMobile, setIsMobile] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeModel, setActiveModel] = useState<string>("NATIVE_AUDIO_DIALOG");
    const [isExpanded, setIsExpanded] = useState(true);
    const [isLiveConnected, setIsLiveConnected] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
            audioPlayerRef.current = new Audio();
            const checkMobile = () => setIsMobile(window.innerWidth < 768);
            checkMobile();
            window.addEventListener("resize", checkMobile);
            return () => window.removeEventListener("resize", checkMobile);
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("fizikhub_live_chat");
        if (saved) {
            try { setMessages(JSON.parse(saved).slice(-15)); } catch (e) { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("fizikhub_live_chat", JSON.stringify(messages));
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
            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const animate = () => {
                analyzer.getByteFrequencyData(dataArray);
                const values = Array.from(dataArray.slice(0, 15)).map(v => (v / 255) * 30 + 2);
                setVisualizerData(values);
                animationFrameRef.current = requestAnimationFrame(animate);
            };
            animate();
        } catch (err) { }
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close().catch(() => { });
        setVisualizerData(new Array(15).fill(2));
    };

    // Convert audio blob to PCM base64 for Live API
    const convertToPCM = async (audioBlob: Blob): Promise<string> => {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Resample to 16kHz mono
        const targetSampleRate = 16000;
        const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * targetSampleRate, targetSampleRate);
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start();

        const resampledBuffer = await offlineContext.startRendering();
        const pcmData = resampledBuffer.getChannelData(0);

        // Convert to 16-bit PCM
        const pcm16 = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
            pcm16[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32768));
        }

        // Convert to base64
        const uint8Array = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
    };

    const startRecording = useCallback(async () => {
        setError(null);
        setActiveModel("LISTENING...");
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
            setError("MIC_ACCESS_DENIED");
            setActiveModel("SYSTEM_ERROR");
            setIsLiveConnected(false);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setActiveModel("PROCESSING_AUDIO...");
        }
    }, [isRecording]);

    // Process audio via Live API
    const processLiveAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);
        setError(null);
        try {
            setActiveModel("CONNECTING_LIVE_API...");
            const pcmBase64 = await convertToPCM(audioBlob);

            setActiveModel("STREAMING_TO_GEMINI...");
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
                throw new Error(errorData.error || "LIVE_API_ERROR");
            }

            const data = await response.json();
            setActiveModel(data.debug?.model?.split('/').pop()?.toUpperCase() || "NATIVE_AUDIO");

            if (data.response) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response, timestamp: Date.now() }]);

                // Play audio response if available
                if (data.audio && audioPlayerRef.current) {
                    const audioUrl = `data:audio/pcm;base64,${data.audio}`;
                    audioPlayerRef.current.src = audioUrl;
                    audioPlayerRef.current.play().catch(() => {
                        // Fallback to TTS if audio playback fails
                        if (audioEnabled) speak(data.response);
                    });
                } else if (audioEnabled) {
                    speak(data.response);
                }
            }

            // Handle actions
            const actionMatch = data.response?.match(/\[ACTION:INSERT_TEXT\]([\s\S]*?)\[\/ACTION\]/);
            const titleMatch = data.response?.match(/\[ACTION:INSERT_TITLE\]([\s\S]*?)\[\/ACTION\]/);
            if (actionMatch) onInsertText(actionMatch[1].trim());
            if (titleMatch) onInsertTitle(titleMatch[1].trim());

        } catch (error: any) {
            console.error("Live API error:", error);
            setError(error.message);
            setActiveModel("ERROR");

            // Fallback to regular API
            await fallbackToRegularAPI(audioBlob);
        } finally {
            setIsProcessing(false);
            setIsLiveConnected(false);
        }
    };

    // Fallback to regular REST API if Live API fails
    const fallbackToRegularAPI = async (audioBlob: Blob) => {
        try {
            setActiveModel("FALLBACK_MODE...");
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
                if (data.debug?.model) setActiveModel(data.debug.model.toUpperCase());
                if (data.response) {
                    setMessages(prev => [...prev, { role: "assistant", content: data.response, timestamp: Date.now() }]);
                    if (audioEnabled) speak(data.response);
                }
            };
        } catch (e) {
            setError("COMPLETE_FAILURE");
        }
    };

    // Text message still uses regular API (Live API is audio-only)
    const sendMessage = async (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText) return;
        setInputText("");
        setError(null);
        setMessages(prev => [...prev, { role: "user", content: messageText, timestamp: Date.now() }]);
        setIsProcessing(true);
        setActiveModel("PROCESSING_TEXT...");
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
            if (!response.ok) throw new Error("API_ERROR");
            const data = await response.json();
            if (data.debug?.model) setActiveModel(data.debug.model.toUpperCase());
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
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => { setIsSpeaking(false); };
        synthRef.current.speak(utterance);
    };

    const quickActions = [
        { icon: Zap, label: "ÖZETLE", action: "Notu özetle." },
        { icon: Languages, label: "ÇEVİR", action: "İngilizce'ye çevir." },
        { icon: ListTodo, label: "PLAN", action: "Eylem planı çıkar." },
    ];

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50",
                    "w-14 h-14 rounded-full",
                    "bg-slate-950 text-cyan-400 border border-cyan-500/50",
                    "flex items-center justify-center",
                    "shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]",
                    "transition-all duration-300 group"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Radio className="w-6 h-6 group-hover:animate-pulse" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 20 }}
                        className={cn(
                            "fixed z-[60] flex flex-col overflow-hidden transition-all duration-500 font-mono",
                            isMobile
                                ? "bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl border-t border-cyan-500/30"
                                : "bottom-6 right-6 w-[400px] h-[550px] rounded-xl border border-cyan-500/20",
                            "bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-black",
                            !isExpanded && isMobile && "h-[80px]"
                        )}
                    >
                        {/* HUD Header */}
                        <div className="flex items-center justify-between px-4 h-14 border-b border-cyan-500/10 bg-black/40">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-2 h-2 rounded-full shadow-[0_0_8px]",
                                    isLiveConnected ? "bg-green-500 shadow-green-500/80 animate-pulse" : "bg-cyan-500 shadow-cyan-500/80"
                                )} />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest leading-none">
                                        {isLiveConnected ? "LIVE_STREAM" : "AI_CORE"}
                                    </span>
                                    <span className="text-[11px] text-white/90 truncate max-w-[150px]">{activeModel}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isMobile && (
                                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-cyan-500/50 hover:text-cyan-400">
                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                    </button>
                                )}
                                <button onClick={() => setAudioEnabled(!audioEnabled)} className={cn("p-1.5 transition-colors", audioEnabled ? "text-cyan-400" : "text-slate-600")}>
                                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                </button>
                                <button onClick={() => { setMessages([]); localStorage.removeItem("fizikhub_live_chat"); }} className="p-1.5 text-slate-600 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-600 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Scanner Line */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-[1px] bg-cyan-500/10 z-10 pointer-events-none"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                        />

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide flex flex-col">
                            {messages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-10">
                                    <Cpu className="w-12 h-12 text-cyan-500 mb-4 animate-pulse" />
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-6">NATIVE_AUDIO_READY</p>
                                    <div className="grid grid-cols-1 gap-2 w-full max-w-[180px]">
                                        {quickActions.map((qa, i) => (
                                            <button key={i} onClick={() => sendMessage(qa.action)} className="px-3 py-2 border border-cyan-500/20 text-[10px] text-cyan-500 hover:bg-cyan-500/10 transition-all uppercase tracking-widest">
                                                {qa.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn("flex flex-col max-w-[90%]", msg.role === "user" ? "self-end items-end" : "self-start items-start")}
                                    >
                                        <div className={cn(
                                            "px-3 py-2 text-[12px] leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-cyan-500/10 text-cyan-100 border-r-2 border-cyan-500/40 rounded-l-lg"
                                                : "bg-slate-900/50 text-white/90 border-l-2 border-slate-500/40 rounded-r-lg"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {isProcessing && (
                                <div className="flex items-center gap-2 px-2 opacity-60">
                                    <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />
                                    <span className="text-[9px] uppercase tracking-widest text-cyan-400">streaming...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mx-4 p-2 bg-red-950/30 border-l border-red-500 text-[10px] text-red-400 uppercase tracking-tighter mb-2">
                                ERR: {error}
                            </div>
                        )}

                        {/* Controls */}
                        <div className="p-4 bg-black/40 border-t border-cyan-500/10">
                            {isRecording ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-end gap-1 h-8">
                                        {visualizerData.map((v, i) => (
                                            <motion.div key={i} animate={{ height: v }} className="w-1 bg-green-400/80 rounded-full" />
                                        ))}
                                    </div>
                                    <button onClick={stopRecording} className="w-full py-2 bg-red-500/20 border border-red-500/40 text-red-400 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-red-500/30 transition-all">
                                        STOP_STREAM
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={startRecording} disabled={isProcessing} className="w-12 h-12 flex items-center justify-center border border-green-500/30 bg-green-500/5 text-green-400 hover:bg-green-500/10 transition-all disabled:opacity-30">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="TEXT_INPUT..."
                                        disabled={isProcessing}
                                        className="flex-1 bg-transparent border-b border-cyan-500/20 text-white text-[12px] px-2 focus:border-cyan-500 outline-none placeholder:text-slate-700 transition-all"
                                    />
                                    <button onClick={() => sendMessage()} disabled={!inputText.trim() || isProcessing} className="w-12 h-12 flex items-center justify-center text-cyan-400 hover:text-cyan-300 disabled:opacity-30">
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
