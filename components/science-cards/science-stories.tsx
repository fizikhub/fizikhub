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

            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory pt-2 custom-scrollbar px-1 no-scrollbar">
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
            className="snap-start shrink-0 w-[140px] h-[220px] md:w-[160px] md:h-[240px] relative rounded-xl overflow-hidden group cursor-pointer border border-white/10 shadow-lg bg-black"
            whileHover={{ scale: 0.98, y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
        >
            {/* Holographic Border Effect */}
            <div className="absolute inset-0 z-20 border border-white/5 group-hover:border-amber-500/50 transition-colors rounded-xl pointer-events-none" />

            {/* Image */}
            <NextImage
                src={story.image_url}
                alt={story.title}
                fill
                sizes="(max-width: 768px) 140px, 160px"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />

            {/* Tech Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />

            {/* Gradient Overlay - Dynamic based on story color */}
            <div className={`absolute inset-0 bg-gradient-to-t ${story.color || 'from-amber-900/80 to-transparent'} opacity-60 mix-blend-multiply transition-opacity group-hover:opacity-80`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

            {/* Top Badge */}
            <div className="absolute top-2 right-2 z-20">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-sm px-1.5 py-0.5 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-white/70 tracking-widest uppercase">DATA</span>
                </div>
            </div>

            {/* Author Avatar (Small & Techy) */}
            <div className="absolute top-2 left-2 z-20">
                <div className="w-6 h-6 rounded-sm border border-white/20 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
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
                <div className="h-[2px] w-8 bg-amber-500 mb-2 group-hover:w-full transition-all duration-500" />
                <h3 className="text-xs md:text-sm font-bold text-white leading-tight line-clamp-3 font-mono">
                    {story.title}
                </h3>
                <div className="mt-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <span className="text-[10px] text-amber-400 font-mono">OPEN_FILE_</span>
                    <ArrowRight className="w-3 h-3 text-amber-500" />
                </div>
            </div>
        </motion.div>
    );
}
