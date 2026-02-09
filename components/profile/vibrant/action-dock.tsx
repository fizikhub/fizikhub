"use client";

import { cn } from "@/lib/utils";
import { Settings, Share2, Edit3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionDockProps {
    className?: string;
    isOwnProfile: boolean;
}

export function ActionDock({ className, isOwnProfile }: ActionDockProps) {
    if (!isOwnProfile) return null;

    return (
        <div className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
            "flex items-center gap-3 p-2",
            "bg-black/90 backdrop-blur-md border-2 border-white/20 rounded-full shadow-2xl",
            className
        )}>
            <ActionButton icon={Edit3} label="Düzenle" onClick={() => { }} />
            <ActionButton icon={Share2} label="Paylaş" onClick={() => { }} />
            <ActionButton icon={Settings} label="Ayarlar" onClick={() => { }} />
            <div className="w-px h-6 bg-white/20 mx-1" />
            <ActionButton icon={LogOut} label="Çıkış" onClick={() => { }} variant="danger" />
        </div>
    );
}

function ActionButton({
    icon: Icon,
    label,
    onClick,
    variant = "default"
}: {
    icon: any,
    label: string,
    onClick: () => void,
    variant?: "default" | "danger"
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative p-3 rounded-full transition-all duration-300",
                "hover:-translate-y-1",
                variant === "danger" ? "hover:bg-red-500/20 text-red-400" : "hover:bg-white/10 text-white"
            )}
        >
            <Icon className="w-5 h-5" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </button>
    );
}
