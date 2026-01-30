"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

// Welcome message shown before any API interaction
const WELCOME_MESSAGE = {
    id: "welcome",
    role: "assistant" as const,
    content: "Selam şef! Ben HubGPT. Fizik, evren veya kodlama... Aklına ne takıldıysa sor, parçalayalım!"
};

export function HubGPTChat({ onClose }: { onClose?: () => void }) {
    const [input, setInput] = useState("");
    const { messages, status, stop, setMessages, sendMessage } = useChat({
        id: "hubgpt-chat",
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const isLoading = status === "streaming" || status === "submitted";

    // Combine welcome message with actual messages
    const displayMessages = messages.length === 0
        ? [WELCOME_MESSAGE]
        : messages;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayMessages]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        await sendMessage({ text: userMessage });
    };

    const getMessageContent = (m: any): string => {
        if (typeof m.content === 'string') return m.content;
        if (Array.isArray(m.parts)) {
            return m.parts
                .filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('');
        }
        return '';
    };

    return (
        <div className="flex flex-col h-full bg-[#111] text-white font-sans overflow-hidden border-[3px] border-black sm:rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#FFC800] border-b-[3px] border-black text-black">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-[#FFC800] flex items-center justify-center rounded-lg border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg leading-none uppercase tracking-wide">HubGPT</h3>
                        <p className="text-xs font-bold opacity-70">Gemini-Powered Asistan</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMessages([])}
                        className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                        title="Sohbeti Temizle"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-black/10 rounded-lg transition-colors md:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-grid-white/[0.05]">
                {displayMessages.map((m) => (
                    <div
                        key={m.id}
                        className={cn(
                            "flex gap-3 max-w-[90%]",
                            m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]",
                            m.role === "user" ? "bg-white text-black" : "bg-[#FFC800] text-black"
                        )}>
                            {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className={cn(
                            "p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] text-sm sm:text-base whitespace-pre-wrap",
                            m.role === "user"
                                ? "bg-white text-black"
                                : "bg-[#222] text-white border-white/20"
                        )}>
                            {m.role === "assistant" ? (
                                <Markdown
                                    components={{
                                        code({ node, className, children, ...props }: any) {
                                            return <code className={`${className} bg-black/30 px-1 py-0.5 rounded font-mono text-[#FFC800]`} {...props}>{children}</code>
                                        }
                                    }}
                                >
                                    {getMessageContent(m)}
                                </Markdown>
                            ) : (
                                getMessageContent(m)
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 mr-auto max-w-[80%]">
                        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border-[2px] border-black bg-[#FFC800] text-black">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="p-3 bg-[#222] border-[2px] border-white/20 rounded-xl text-white/50 text-sm animate-pulse">
                            Düşünüyor...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleFormSubmit} className="p-4 bg-[#111] border-t-[3px] border-black">
                <div className="relative flex items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Bir şeyler sor... (Fizik, Evren, Hayat?)"
                        className="w-full pl-4 pr-12 py-3 bg-[#222] border-[2px] border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFC800] focus:ring-1 focus:ring-[#FFC800] transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-[#FFC800] text-black rounded-lg border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-[10px] text-center mt-2 text-white/30 font-mono">
                    Yapay zeka hatalı bilgi verebilir. Her zaman kontrol et.
                </div>
            </form>
        </div>
    );
}
