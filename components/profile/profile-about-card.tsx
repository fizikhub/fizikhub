"use client";

import { cn } from "@/lib/utils";

interface ProfileAboutCardProps {
    bio?: string;
    fullName?: string;
    role?: string;
}

export function ProfileAboutCard({ bio, fullName, role }: ProfileAboutCardProps) {
    return (
        <div className="w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] p-6 mb-6">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
                Hakkımda
                <div className="h-0.5 flex-1 bg-black/10 rounded-full" />
            </h2>

            {bio ? (
                <div className="prose prose-zinc max-w-none">
                    <p className="text-zinc-800 whitespace-pre-wrap leading-relaxed font-medium">
                        {bio}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50">
                    <p className="font-bold text-sm">Biyografi yok.</p>
                </div>
            )}
        </div>
    );
}
