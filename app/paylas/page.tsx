"use client";

import { NeoGridCard } from "@/components/share/neo-grid-card";
import {
    FileText,
    MessageCircle,
    FlaskConical,
    BookOpen,
    Library,
    PenTool
} from "lucide-react";

export default function PaylasPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] w-full bg-background font-sans flex flex-col items-center justify-center p-4">

            <div className="w-full max-w-md space-y-6">

                {/* Minimal Header */}
                <div className="flex items-center justify-between px-2">
                    <h1 className="font-heading text-xl font-black uppercase tracking-tight text-foreground">
                        Paylaş
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-muted-foreground">ONLINE</span>
                    </div>
                </div>

                {/* Ultra-Compact Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 1. Article - Yellow */}
                    <NeoGridCard
                        title="MAKALE"
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-[#FACC15]"
                    />

                    {/* 2. Question - Pink */}
                    <NeoGridCard
                        title="SORU"
                        href="/forum"
                        icon={MessageCircle}
                        color="bg-[#FB7185]"
                    />

                    {/* 3. Experiment - Green */}
                    <NeoGridCard
                        title="DENEY"
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]"
                    />

                    {/* 4. Blog - Orange */}
                    <NeoGridCard
                        title="BLOG"
                        href="/blog"
                        icon={PenTool}
                        color="bg-orange-400"
                    />

                    {/* 5. Book - Blue */}
                    <NeoGridCard
                        title="KİTAP"
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]"
                    />

                    {/* 6. Term - Purple */}
                    <NeoGridCard
                        title="TERİM"
                        href="/sozluk"
                        icon={BookOpen}
                        color="bg-[#C084FC]"
                    />
                </div>
            </div>
        </div>
    );
}
