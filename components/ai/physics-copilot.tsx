"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Sparkles, Atom, BookOpen, Calculator, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Message {
    role: "user" | "model";
    content: string;
}

const PRESETS = [
    {
        title: "Görelilik Teorisi",
        description: "$E = mc^2$ denklemini fiziksel olarak açıkla.",
        prompt: "$E = mc^2$ denklemini ve kütle-enerji eşdeğerliği kavramını fiziksel ve sezgisel olarak açıkla.",
        icon: Atom,
        color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500",
    },
    {
        title: "Kuantum Tünelleme",
        description: "Parçacıkların engelleri nasıl aşabildiğini anlat.",
        prompt: "Kuantum tünelleme nedir? Potansiyel engelini aşan parçacıkların olasılık dalga fonksiyonu $\\Psi(x)$ üzerinden adım adım anlat.",
        icon: Sparkles,
        color: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500",
    },
    {
        title: "Entropi ve Zaman",
        description: "Termodinamiğin 2. Yasası ve zamanın oku.",
        prompt: "Termodinamiğin İkinci Yasası, entropi kavramı ve 'zamanın oku' arasındaki ilişkiyi açıkla. Entropinin makro ve mikro durumlarını karşılaştır.",
        icon: BookOpen,
        color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500",
    },
    {
        title: "Kara Delikler",
        description: "Hawking ışıması ve olay ufku.",
        prompt: "Hawking Işıması nedir? Sanal parçacık çiftleri ve kara deliğin olay ufku üzerinden bu ışımanın nasıl gerçekleştiğini, kütle kaybını formülleriyle açıkla.",
        icon: Calculator,
        color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500",
    }
];

export function PhysicsCopilot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Load chat history from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("fizikhub_copilot_chat");
        if (stored) {
            try {
                setMessages(JSON.parse(stored));
            } catch (e) {
                console.error("Error loading chat history:", e);
            }
        }
    }, []);

    // 2. Save chat history to localStorage when messages change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("fizikhub_copilot_chat", JSON.stringify(messages));
        }
    }, [messages, mounted]);

    // 3. Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: textToSend };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/copilot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Sunucuyla iletişim kurulurken kuantum hatası oluştu.");
            }

            const modelMessage: Message = { role: "model", content: data.content };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error: any) {
            toast.error(error?.message || "Bir şeyler ters gitti.");
            // Remove the failed message to keep the thread clean
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Konuşma geçmişini sıfırlamak istediğine emin misin?")) {
            setMessages([]);
            localStorage.removeItem("fizikhub_copilot_chat");
            toast.success("Kuantum geçmişi temizlendi!");
        }
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col md:grid md:grid-cols-12 gap-6 min-h-[calc(100vh-140px)]">
            
            {/* Sidebar with presets and actions */}
            <div className="md:col-span-4 flex flex-col gap-6">
                
                {/* Copilot Intro Card */}
                <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 rounded-2xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-500 border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_0px_#000]">
                            <Atom className="h-6 w-6 animate-spin" style={{ animationDuration: '6s' }} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-sans text-black dark:text-white leading-none">Fizik Copilotu</h2>
                            <span className="text-xs text-muted-foreground font-semibold">Gemini 2.5 Flash Entegrasyonu</span>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                        Fizikhub'ın elite yapay zeka asistanı ile kuantum mekaniğini, kara delikleri veya termodinamiği keşfet. Formülleri sor, problem çözüm adımlarını al!
                    </p>
                    
                    {messages.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="w-full py-2.5 px-4 bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[2px_2px_0px_0px_#000]"
                        >
                            <Trash2 className="h-4 w-4" />
                            Geçmişi Sıfırla
                        </button>
                    )}
                </div>

                {/* Preset Suggestions */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold font-sans tracking-wide text-zinc-500 uppercase px-1">Keşif Başlangıç Noktaları</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {PRESETS.map((preset, index) => {
                            const IconComponent = preset.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSendMessage(preset.prompt)}
                                    disabled={isLoading}
                                    className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-2 border-black dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl flex items-start gap-3.5 text-left transition-all hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] group disabled:opacity-50"
                                >
                                    <div className={`p-2.5 rounded-lg border-2 border-black flex items-center justify-center shrink-0 ${preset.color} shadow-[1px_1px_0px_0px_#000]`}>
                                        <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm text-black dark:text-white leading-tight mb-1">{preset.title}</h4>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                            {preset.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Chat Box Area */}
            <div className="md:col-span-8 flex flex-col bg-zinc-50 dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 rounded-2xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden min-h-[500px]">
                
                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-h-[calc(100vh-270px)] custom-scrollbar">
                    
                    <AnimatePresence initial={false}>
                        {messages.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[350px]"
                            >
                                <div className="p-5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500 border-2 border-emerald-500 rounded-full mb-4 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)]">
                                    <Atom className="h-10 w-10 animate-bounce" />
                                </div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-2">Hazır mısın fizikçi?</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                                    Sol taraftaki keşif şablonlarından birini seçerek başlayabilir veya aşağıya merak ettiğin herhangi bir fizik sorusunu yazabilirsin.
                                </p>
                            </motion.div>
                        ) : (
                            messages.map((message, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] rounded-2xl p-4 md:p-5 border-2 border-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] ${
                                        message.role === "user"
                                            ? "bg-emerald-500 text-black font-medium"
                                            : "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                                    }`}>
                                        
                                        {message.role === "user" ? (
                                            <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                                        ) : (
                                            <MarkdownRenderer 
                                                content={message.content} 
                                                fontSize="base" 
                                                fontFamily="sans"
                                                className="prose-emerald dark:prose-invert max-w-none text-sm md:text-base leading-relaxed" 
                                            />
                                        )}
                                        
                                    </div>
                                </motion.div>
                            ))
                        )}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white dark:bg-zinc-950 max-w-[85%] rounded-2xl p-5 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-500">
                                        Kuantum dalga fonksiyonu çözümleniyor...
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border-t-4 border-black dark:border-zinc-800">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(input);
                        }}
                        className="flex gap-3 relative"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Entropi nedir? Formüllerle açıklar mısın..."
                            className="flex-1 py-3.5 px-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 focus:border-emerald-500 focus:outline-none font-medium text-sm rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] disabled:opacity-50 text-black dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="py-3.5 px-5 bg-emerald-400 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-black border-2 border-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none transition-all"
                        >
                            <Send className="h-4 w-4" />
                            <span className="hidden sm:inline">Gönder</span>
                        </button>
                    </form>
                    <div className="flex justify-between items-center mt-2 px-1">
                        <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                            <RotateCcw className="h-3 w-3" /> Konuşma geçmişi tarayıcında saklanır.
                        </span>
                        <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-amber-500" /> Formülleri LaTeX olarak render eder.
                        </span>
                    </div>
                </div>

            </div>

        </div>
    );
}
