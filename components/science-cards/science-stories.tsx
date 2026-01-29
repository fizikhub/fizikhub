"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase-client";
import { StoryModal } from "./story-modal";

// Dummy fallback stories if DB is empty
const fallbackStories = [
    {
        id: "mock1",
        title: "Işık Hızı Aşılamaz Mı?",
        image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop",
        summary: "Einstein'ın izafiyet teorisine göre kütlesi olan hiçbir cisim ışık hızına ulaşamaz. Peki ya takyonlar?",
        color: "from-blue-600 to-purple-600",
        author: { username: "fizikhub", avatar_url: "/icon.png" }
    },
    {
        id: "mock2",
        title: "Schrödinger'in Kedisi",
        image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop",
        summary: "Bir kedi hem ölü hem canlı olabilir mi? Kuantum süperpozisyonu dünyamızı nasıl değiştiriyor?",
        color: "from-amber-600 to-red-600",
        author: { username: "kuantum", avatar_url: null }
    },
    {
        id: "mock3",
        title: "Karanlık Madde Nedir?",
        image_url: "https://images.unsplash.com/photo-1419242902251-862e0032624b?q=80&w=600&auto=format&fit=crop",
        summary: "Evrenin %85'ini oluşturan ama göremediğimiz gizemli madde. Sadece kütleçekimiyle etkileşime giriyor.",
        color: "from-emerald-600 to-cyan-600",
        author: { username: "astrofizik", avatar_url: null }
    }
];

export function ScienceStories() {
    const [stories, setStories] = useState<any[]>([]);
    const [selectedStory, setSelectedStory] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchStories() {
            try {
                // Try to fetch from real DB
                const { data, error } = await supabase
                    .from('stories')
                    .select('*, author:profiles(username, avatar_url)')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (!error && data && data.length > 0) {
                    setStories(data);
                } else {
                    // Fallback if no table or empty
                    setStories(fallbackStories);
                }
            } catch (e) {
                setStories(fallbackStories);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStories();
    }, []);

    return (
        <section className="py-2">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-md font-bold text-foreground flex items-center gap-2 tracking-tight">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    Hızlı Bilim
                </h2>
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium border border-border px-2 py-0.5 rounded-full">Snack Content</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory pt-2 custom-scrollbar px-4 sm:px-0 no-scrollbar items-center">
                {isLoading ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[140px] h-[220px] bg-muted/40 rounded-2xl animate-pulse" />
                    ))
                ) : (
                    stories.map((story) => (
                        <FeatureCard
                            key={story.id}
                            story={story}
                            onClick={() => setSelectedStory(story)}
                        />
                    ))
                )}
            </div>

            {/* Immersive Viewer */}
            <StoryModal
                isOpen={!!selectedStory}
                onClose={() => setSelectedStory(null)}
                story={selectedStory}
            />
        </section>
    );
}

function FeatureCard({ story, onClick }: { story: any, onClick: () => void }) {
    return (
        <motion.div
            className="snap-center shrink-0 w-[140px] h-[220px] md:w-[160px] md:h-[240px] relative rounded-2xl overflow-hidden group cursor-pointer bg-zinc-900"
            whileHover={{ scale: 0.98, y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
        >
            {/* GRADIENT RING - INSTAGRAM STYLE BUT SCI-FI */}
            <div className="absolute inset-0 p-[2px] rounded-2xl bg-gradient-to-tr from-[#FFC800] via-[#ff0080] to-[#7928ca] z-0 opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* INNER CONTENT CONTAINER */}
            <div className="absolute inset-[2px] rounded-[14px] overflow-hidden bg-zinc-900 z-10 relative">
                {/* Image */}
                <NextImage
                    src={story.image_url}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 140px, 160px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${story.color || 'from-amber-900/80 to-transparent'} opacity-30 mix-blend-overlay transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90" />

                {/* Top Writer Badge */}
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full border-[1.5px] border-white/50 overflow-hidden relative shadow-sm ring-2 ring-black/20">
                        <NextImage
                            src={story.author?.avatar_url || "/images/default-avatar.png"}
                            alt="Author"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="absolute bottom-0 left-0 w-full p-3 z-20">
                    <h3 className="font-[family-name:var(--font-outfit)] text-[13px] font-bold text-white leading-[1.2] line-clamp-3 mb-1 drop-shadow-md">
                        {story.title}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
}
