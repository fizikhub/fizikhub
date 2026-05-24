"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Target, AlertCircle } from "lucide-react";
import { askAiAssistant } from "@/app/simulasyonlar/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AiAssistantProps {
    simId: string;
    parameters: Record<string, unknown>;
    color?: string;
}

type Message = {
    sender: "user" | "ai";
    text: string;
    isMission?: boolean;
};

export function AiAssistant({ simId, parameters, color = "#FFBD2E" }: AiAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "ai", text: `FizikHub Yapay Zeka Laboratuvarına hoş geldin! Ben senin sanal asistanınım. Şu anki deney parametrelerini okuyabiliyorum. Bana sistem hakkında soru sorabilir veya sana özel bir deney görevi üretmemi isteyebilirsin! 🚀` }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Mission States
    const [activeMission, setActiveMission] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState("");

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const text = inputValue.trim();
        setInputValue("");
        setMessages(prev => [...prev, { sender: "user", text }]);
        setIsLoading(true);

        try {
            const response = await askAiAssistant({
                simId,
                parameters,
                message: text,
                mode: "chat"
            });
            setMessages(prev => [...prev, { sender: "ai", text: response.text }]);
        } catch {
            toast.error("Cevap alınamadı.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateMission = async () => {
        setIsLoading(true);
        setActiveMission(null);
        setUserAnswer("");

        try {
            const response = await askAiAssistant({
                simId,
                parameters,
                mode: "generate_mission"
            });

            if (response.mission) {
                setActiveMission(response.mission.question);
                setMessages(prev => [
                    ...prev,
                    { sender: "ai", text: `YENİ GÖREV OLUŞTURULDU: \n\n${response.mission!.question}`, isMission: true }
                ]);
                toast.success("Deney görevi oluşturuldu! 🎉");
            }
        } catch {
            toast.error("Görev oluşturulamadı.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim() || !activeMission || isLoading) return;

        setIsLoading(true);
        try {
            const response = await askAiAssistant({
                simId,
                parameters,
                mode: "evaluate_answer",
                userAnswer: userAnswer.trim(),
                missionQuestion: activeMission
            });

            if (response.evaluation) {
                setMessages(prev => [
                    ...prev,
                    { sender: "user", text: `Cevabım: ${userAnswer}` },
                    { sender: "ai", text: `${response.evaluation!.isCorrect ? '✅ BAŞARILI!' : '❌ REVİZYON GEREKLİ:'}\n\n${response.evaluation!.feedback}` }
                ]);

                if (response.evaluation.isCorrect) {
                    toast.success(`Tebrikler! ${response.evaluation.pointsEarned} İtibar Puanı Kazandın! 🏆`);
                    setActiveMission(null);
                    setUserAnswer("");
                } else {
                    toast.error("Cevabınız eksik veya hatalı görünüyor. Lütfen tekrar deneyin!");
                }
            }
        } catch {
            toast.error("Değerlendirme yapılamadı.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] lg:h-[600px] bg-zinc-950 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_#000] overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-[#111] border-b-[3px] border-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 stroke-[2.5px]" style={{ color }} />
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">AI Deney Ortağı</span>
                </div>
                <button
                    onClick={handleGenerateMission}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black border-2 border-black rounded-md text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
                >
                    <Target className="w-3.5 h-3.5" />
                    Görev Üret
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex flex-col max-w-[85%] rounded-lg p-3 border-2 border-black shadow-[2px_2px_0px_#000] font-[family-name:var(--font-inter)] text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-line",
                            msg.sender === "user"
                                ? "ml-auto bg-white text-black"
                                : msg.isMission
                                    ? "bg-blue-600/10 border-blue-600 text-blue-300 shadow-[2px_2px_0px_rgba(37,99,235,0.4)]"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-200"
                        )}
                    >
                        {msg.text}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-wider animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI Lab Asistanı Düşünüyor...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Mission Submission Area */}
            {activeMission && (
                <div className="p-3 bg-zinc-900 border-t-[3px] border-black flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#FFBD2E]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Aktif Deney Görevi Çözülüyor
                    </div>
                    <form onSubmit={handleSubmitAnswer} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Gözlemini ve açıklamanı buraya yaz..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 h-11 bg-black border-2 border-black rounded-lg px-3 text-xs sm:text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userAnswer.trim()}
                            className="px-4 h-11 bg-blue-600 text-white font-black border-2 border-black rounded-lg text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
                        >
                            Cevapla
                        </button>
                    </form>
                </div>
            )}

            {/* Chat Input Area */}
            {!activeMission && (
                <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900 border-t-[3px] border-black flex gap-2">
                    <input
                        type="text"
                        placeholder="Yerçekimini azaltırsam ne olur?..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                        className="flex-1 h-11 bg-black border-2 border-black rounded-lg px-3 text-xs sm:text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FFBD2E]"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="w-11 h-11 bg-[#FFBD2E] text-black font-black border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
                    >
                        <Send className="w-4 h-4 stroke-[3px]" />
                    </button>
                </form>
            )}
        </div>
    );
}
