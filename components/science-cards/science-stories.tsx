"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
            className="snap-start shrink-0 w-[140px] h-[220px] md:w-[160px] md:h-[240px] relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 shadow-lg"
            whileHover={{ scale: 0.98, y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
        >
            <Image
                src={story.image_url}
                alt={story.title}
                fill
                sizes="(max-width: 768px) 140px, 160px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Neo-filters */}
            <div className={`absolute inset-0 bg-gradient-to-b ${story.color || 'from-amber-500 to-orange-600'} opacity-30 mix-blend-overlay`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Profile Ring (Instagram style) */}
            <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-purple-600">
                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden relative">
                    <Image
                        src={story.author?.avatar_url || "/images/default-avatar.png"}
                        alt="Author"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-1">
                    <ArrowRight className="w-3 h-3 text-white" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 p-3 w-full">
                <h3 className="text-sm font-bold text-white mb-1 leading-tight line-clamp-3 drop-shadow-sm">
                    {story.title}
                </h3>
            </div>
        </motion.div>
    );
}
