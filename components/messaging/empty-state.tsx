import { MessageSquareDashed, Sparkles } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-3 border border-white/[0.06]">
                    <MessageSquareDashed className="h-9 w-9 text-[#FACC15]" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center transform rotate-12 border border-white/[0.06]">
                    <Sparkles className="h-4 w-4 text-[#FACC15]/60" />
                </div>
                <div className="absolute -inset-3 blur-2xl bg-[#FACC15]/5 -z-10 rounded-full" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-white mb-2 font-[family-name:var(--font-outfit)]">
                Mesajını Seç
            </h3>
            <p className="text-zinc-500 max-w-[280px] text-sm leading-relaxed">
                Sol taraftaki listeden bir konuşma seç veya birinin profilinden yeni sohbet başlat.
            </p>
        </div>
    );
}
