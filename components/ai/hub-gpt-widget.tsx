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
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        // Fetch user profile on mount
        const fetchUser = async () => {
            const { createClient } = await import('@/lib/supabase-client');
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUserProfile(profile);
                    // Update initial message to include name if available
                    setMessages(prev => {
                        if (prev.length === 1 && prev[0].role === 'ai') {
                            return [{ role: 'ai', content: `Selam ${profile.full_name?.split(' ')[0] || profile.username}! Ben HubGPT. Evrenin sırlarını çözmeye hazır mısın? Veya sadece sitede mi kayboldun?` }];
                        }
                        return prev;
                    });
                }
            }
        };
        fetchUser();
    }, []);

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
                    messages: [...messages, { role: 'user', content: userMessage }],
                    userProfile // Pass full profile to API
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.details || 'Sunucu hatası');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
        } catch (error: any) {
            console.error('Error:', error);
            const errorMessage = error.message || 'Üzgünüm, şu an kozmik bir parazit var. Biraz sonra tekrar dener misin?';
            setMessages(prev => [...prev, { role: 'ai', content: `⚠️ HATA: ${errorMessage}` }]);
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
                        className="fixed bottom-0 md:bottom-24 right-0 md:right-4 z-50 w-full md:w-[400px] h-[100dvh] md:h-[600px] md:max-h-[80vh] bg-[#0a0a0a] border-t-2 md:border-2 border-amber-500/50 md:rounded-2xl shadow-[8px_8px_0px_0px_rgba(245,158,11,0.2)] flex flex-col overflow-hidden backdrop-blur-sm"
                    >
                        {/* Header */}
                        <div className="bg-[#0a0a0a] p-4 border-b-2 border-amber-500 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                {/* Custom Logo */}
                                <div className="w-10 h-10 bg-amber-500 border-2 border-amber-600 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] shrink-0">
                                    <span className="font-black text-black text-xl italic tracking-tighter">H</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg tracking-tight flex items-center gap-2">
                                        HubGPT
                                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-black border border-black">BETA</span>
                                    </h3>
                                    <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest">Sanal Asistan</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center border-2 border-transparent hover:border-amber-500 hover:bg-amber-500/10 text-zinc-500 hover:text-amber-500 transition-all active:scale-95"
                            >
                                <X className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-neutral-950">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] relative group flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-4 text-sm font-bold leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 ${msg.role === 'user'
                                            ? 'bg-amber-500 text-black border-amber-600 rounded-none'
                                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 rounded-none' /* Neo-brutalist: No rounded corners */
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-zinc-600 px-1 font-mono uppercase font-bold">
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
                                    <div className="bg-zinc-900 p-4 border-2 border-zinc-800 flex gap-1.5 items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="w-2 h-2 bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 bg-amber-500 animate-bounce" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-black border-t-2 border-amber-500 pb-safe-area-bottom">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Bir şeyler sorun..."
                                    className="flex-1 bg-zinc-900 border-2 border-zinc-800 p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:bg-zinc-900/50 transition-all font-mono font-medium rounded-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="h-[46px] aspect-square p-0 bg-amber-500 border-2 border-amber-600 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] flex items-center justify-center text-black shrink-0 transition-all active:scale-95"
                                >
                                    <Send className="w-5 h-5" strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="text-center mt-3 mb-2 md:mb-0">
                                <p className="text-[10px] text-zinc-600 font-black tracking-widest uppercase opacity-50">
                                    FizikHub Stupid Intelligence
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
