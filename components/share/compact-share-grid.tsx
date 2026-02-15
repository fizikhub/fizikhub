"use client";

import { CompactShareCard } from "./compact-share-card";
import {
    FileText,
    MessageCircle,
    FlaskConical,
    BookOpen,
    Library,
    PenTool
} from "lucide-react";

export function CompactShareGrid() {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Article - Yellow */}
            <CompactShareCard
                title="MAKALE"
                description="Derinlemesine bilimsel içerik üret."
                href="/makale/yeni"
                icon={FileText}
                color="bg-[#FACC15]"
            />

            {/* 2. Question - Pink */}
            <CompactShareCard
                title="SORU"
                description="Topluluğa danış, tartışma başlat."
                href="/forum"
                icon={MessageCircle}
                color="bg-[#FB7185]"
            />

            {/* 3. Experiment - Green */}
            <CompactShareCard
                title="DENEY"
                description="Gözlemlerini ve sonuçlarını paylaş."
                href="/deney/yeni"
                icon={FlaskConical}
                color="bg-[#4ADE80]"
            />

            {/* 4. Blog - Orange */}
            <CompactShareCard
                title="BLOG"
                description="Serbest, kişisel yazılar yaz."
                href="/blog"
                icon={PenTool}
                color="bg-orange-400"
            />

            {/* 5. Book - Blue */}
            <CompactShareCard
                title="KİTAP"
                description="Okuduklarını incele ve puanla."
                href="/kitap-inceleme/yeni"
                icon={Library}
                color="bg-[#60A5FA]"
            />

            {/* 6. Term - Purple */}
            <CompactShareCard
                title="TERİM"
                description="Sözlüğe yeni bir kavram ekle."
                href="/sozluk"
                icon={BookOpen}
                color="bg-[#C084FC]"
            />
        </div>
    );
}
