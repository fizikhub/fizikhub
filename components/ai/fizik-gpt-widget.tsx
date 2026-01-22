"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, ArrowUp, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FizikGPTWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: 'Merhaba! Ben FizikGPT. Sitedeki içeriklerle ilgili aklına takılan herhangi bir şeyi bana sorabilirsin.' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Mock response generator - in a real app this would call an API
    const generateResponse = async (query: string) => {
        setIsTyping(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let response = "Çok ilginç bir soru! Bununla ilgili makalelerimizi tarıyorum...";

        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes("kara delik")) {
            response = "Kara delikler, kütleçekim kuvvetinin o kadar güçlü olduğu uzay-zaman bölgeleridir ki, ışık bile onlardan kaçamaz. Sitemizde 'Sessiz Bir Varsayım: Yerçekimi' makalesinde bu konuya değiniliyor.";
        } else if (lowerQuery.includes("kuantum")) {
            response = "Kuantum mekaniği, atom altı parçacıkların davranışlarını inceler. Bu alanda belirsizlik ilkesi ve süperpozisyon gibi kavramlar öne çıkar.";
        } else if (lowerQuery.includes("görelilik") || lowerQuery.includes("einstein")) {
            response = "Einstein'ın Görelilik Teorisi, zamanın ve uzayın mutlak olmadığını, gözlemciye göre değişebileceğini söyler. Bu konuda detaylı bir yazı hazırlığındayız!";
        } else if (lowerQuery.includes("merhaba") || lowerQuery.includes("selam")) {
            response = "Selam! Bugün hangi fizik gizemini çözmek istersin?";
        }

        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'ai', content: response }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
        const query = inputValue;
        setInputValue("");
        generateResponse(query);
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center border-2 border-white/20"
                >
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-24 right-4 z-50 w-[90vw] md:w-[400px] h-[500px] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-600/20 to-transparent p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">FizikGPT</h3>
                                    <p className="text-xs text-white/40">AI Asistan</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-amber-600 text-white rounded-br-none'
                                            : 'bg-white/10 text-gray-200 rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none flex gap-1">
                                        <span className="w-2 h-2 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-black/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Bir şeyler sor..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-1 top-1 p-2 bg-amber-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-500 transition-colors text-white"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
