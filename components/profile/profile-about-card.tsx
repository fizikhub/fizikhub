"use client";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface ProfileAboutCardProps {
    bio?: string;
    fullName?: string;
    role?: string;
}

export function ProfileAboutCard({ bio, fullName, role }: ProfileAboutCardProps) {
    return (
        <div className="w-full bg-[#050505] border-[3px] border-white rounded-[1.5rem] shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-8 mb-8 relative overflow-hidden">

            {/* Header with Icon */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#FFC800] border-2 border-white flex items-center justify-center text-black">
                    <User className="w-5 h-5 stroke-[3px]" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                    HAKKIMDA
                </h2>
                <div className="h-0.5 flex-1 bg-white/20" />
            </div>

            {bio ? (
                <div className="relative z-10">
                    <p className="text-lg text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap">
                        {bio}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-500 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="font-bold">Henüz biyografi eklenmemiş.</p>
                </div>
            )}

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC800] blur-[80px] opacity-5 pointer-events-none" />
        </div>
    );
}
