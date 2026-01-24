"use client";

import { cn } from "@/lib/utils";

interface ProfileAboutCardProps {
    bio?: string;
    fullName?: string;
    role?: string;
}

export function ProfileAboutCard({ bio, fullName, role }: ProfileAboutCardProps) {
    return (
        <div className="w-full bg-[#FAF9F6] dark:bg-[#09090b] border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                Hakkımda
                <div className="h-1 flex-1 bg-black dark:bg-white rounded-full opacity-20" />
            </h2>

            {bio ? (
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-medium">
                        {bio}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
                    <p className="font-bold">Henüz bir biyografi eklenmemiş.</p>
                </div>
            )}
        </div>
    );
}
