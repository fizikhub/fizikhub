"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Bot, MessageCircle } from "lucide-react";

export function HubGPTWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: 'Selam! Ben HubGPT. Evrenin sırlarını çözmeye hazır mısın? Veya sadece sitede mi kayboldun?' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage = inputValue.trim();
        setInputValue("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }]
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { role: 'ai', content: 'Üzgünüm, şu an kozmik bir parazit var. Biraz sonra tekrar dener misin?' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 z-40 w-16 h-16 bg-neutral-900 border-2 border-amber-500 rounded-full shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] flex items-center justify-center group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors" />
                    <MessageCircle className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-4 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-[#0a0a0a] border-2 border-amber-500/50 rounded-2xl shadow-[8px_8px_0px_0px_rgba(245,158,11,0.2)] flex flex-col overflow-hidden backdrop-blur-sm"
                    >
                        {/* Header */}
                        <div className="bg-neutral-900/90 p-4 border-b border-amber-500/20 flex items-center justify-between backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center relative overflow-hidden">
                                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-500/0 to-amber-500/20" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white tracking-tight flex items-center gap-2">
                                        HubGPT
                                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-500 rounded border border-amber-500/30">BETA</span>
                                    </h3>
                                    <p className="text-xs text-neutral-400 font-medium">Sanal Asistan</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-all hover:rotate-90 duration-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[url('/noise.png')] bg-repeat opacity-95">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] relative group ${msg.role === 'user' ? 'items-end' : 'items-start'
                                        } flex flex-col gap-1`}>
                                        <div className={`p-4 text-sm font-medium leading-relaxed shadow-lg backdrop-blur-sm border ${msg.role === 'user'
                                            ? 'bg-amber-600 text-white rounded-2xl rounded-tr-sm border-amber-500'
                                            : 'bg-neutral-900/80 text-gray-200 rounded-2xl rounded-tl-sm border-white/10'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-white/20 px-2 font-mono uppercase">
                                            {msg.role === 'user' ? 'Siz' : 'HubGPT'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-neutral-900/50 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1.5 items-center">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-neutral-900 border-t border-amber-500/20">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                <div className="relative flex items-center bg-black/50 rounded-xl border border-white/10 focus-within:border-amber-500/50 transition-colors">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Bir şeyler sorun..."
                                        className="w-full bg-transparent py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-neutral-500 focus:outline-none font-medium"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isTyping}
                                        className="absolute right-2 p-2 bg-amber-600 rounded-lg hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-600 transition-all active:scale-95"
                                    >
                                        <Send className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-neutral-600 font-mono">
                                    Powered by Gemini &bull; FizikHub Intelligence
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
