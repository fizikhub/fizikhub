"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { Zap, ArrowRight, Play } from "lucide-react";
import { StoryViewer } from "./story-viewer";

// High-quality demo content
const rapidScienceData = [
    {
        id: "rs-1",
        title: "Işık Hızı Aşılamaz Mı?",
        category: "Kozmos",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop",
        color: "from-blue-600 to-indigo-600",
        summary: "Evrenin trafik polisi Einstein: 'Buradan daha hızlı gidemezsin!' Ama neden? Kütle sonsuza giderken enerji de sonsuza gider.",
        author: { name: "FizikHub", avatar: "/icon.png" }
    },
    {
        id: "rs-2",
        title: "Zamanın Oku",
        category: "Entropi",
        image: "https://images.unsplash.com/photo-1501139083538-0139583c61ee?q=80&w=600&auto=format&fit=crop",
        color: "from-amber-600 to-orange-600",
        summary: "Neden bardağı kırabiliyoruz ama geri birleştiremiyoruz? Termodinamiğin ikinci yasası ve zamanın tek yönlü yolculuğu.",
        author: { name: "Entropy", avatar: "/images/avatars/entropy.png" }
    },
    {
        id: "rs-3",
        title: "Schrödinger'in Kedisi",
        category: "Kuantum",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop",
        color: "from-purple-600 to-pink-600",
        summary: "Bir kedi aynı anda hem ölü hem canlı olabilir mi? Gözlemci etkisi ve kuantum süperpozisyonunun garip dünyası.",
        author: { name: "QuantumCat", avatar: "/images/avatars/cat.png" }
    },
    {
        id: "rs-4",
        title: "Karanlık Madde",
        category: "Gizem",
        image: "https://images.unsplash.com/photo-1419242902251-862e0032624b?q=80&w=600&auto=format&fit=crop",
        color: "from-emerald-600 to-teal-600",
        summary: "Göremiyoruz, dokunamıyoruz ama orada olduğunu biliyoruz. Galaksileri bir arada tutan görünmez yapıştırıcı.",
        author: { name: "DarkMatter", avatar: "/images/avatars/dark.png" }
    },
    {
        id: "rs-5",
        title: "Büyük Patlama",
        category: "Başlangıç",
        image: "https://images.unsplash.com/photo-1419242902251-862e0032624b?q=80&w=600&auto=format&fit=crop", // Reusing for demo
        color: "from-red-600 to-rose-600",
        summary: "Her şey nasıl başladı? Tekillikten kozmik enflasyona, evrenin ilk anlarının hikayesi.",
        author: { name: "BigBang", avatar: "/images/avatars/bang.png" }
    }
];

export function QuickScienceRail() {
    const [selectedStory, setSelectedStory] = useState<any>(null);

    return (
        <section className="py-2 pl-4 md:pl-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pr-4">
                <div className="flex items-center gap-2">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-1 rounded-md">
                        <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                    </div>
                    <h2 className="text-sm font-bold tracking-tight text-foreground">
                        Hızlı Bilim
                    </h2>
                </div>
                {/* Optional: 'View All' link could go here */}
            </div>

            {/* Scrollable Rail */}
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-4">
                {rapidScienceData.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="snap-center shrink-0 relative group cursor-pointer"
                        style={{ width: 110, height: 196 }} // 9:16 Aspect Ratio (approx)
                        onClick={() => setSelectedStory(item)}
                    >
                        <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/10 shadow-sm bg-zinc-900">
                            {/* Image Background */}
                            <NextImage
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                            />

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${item.color} opacity-20 mix-blend-overlay`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                            {/* Content */}
                            <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                                {/* Category Badge */}
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm bg-white/10 text-white border border-white/10`}>
                                    {item.category}
                                </span>
                            </div>

                            {/* Unread Indicator Logic (Visual Only for Demo) */}
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse`} />

                            <div className="absolute bottom-3 left-2 right-2">
                                <h3 className="text-xs font-bold text-white leading-tight line-clamp-3 drop-shadow-md">
                                    {item.title}
                                </h3>
                            </div>
                        </div>

                        {/* Border Glow on Hover */}
                        <div className={`absolute -inset-[1px] rounded-[13px] bg-gradient-to-b ${item.color} opacity-0 group-hover:opacity-50 transition-opacity -z-10`} />
                    </motion.div>
                ))}
            </div>

            {/* Story Viewer Modal */}
            <StoryViewer
                isOpen={!!selectedStory}
                onClose={() => setSelectedStory(null)}
                story={selectedStory}
            />
        </section>
    );
}
