"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { StoryViewer } from "./story-viewer";

const storiesData = [
    {
        name: "Kuantum",
        image: "/stories/quantum.png",
        href: "/blog?kategori=Kuantum",
        color: "from-blue-500 to-indigo-600",
        content: "Kuantum mekaniği, atom altı parçacıkların tuhaf dünyasını inceler. Dalga-parçacık ikiliği ve dolanıklık gibi kavramlar modern teknolojinin temelidir.",
        author: "FizikHub"
    },
    {
        name: "Astrofizik",
        image: "/stories/blackhole.png",
        href: "/blog?kategori=Astrofizik",
        color: "from-orange-500 to-red-600",
        content: "Kara delikler, evrenin en gizemli ve güçlü yapılarından biridir. Işığın bile kaçamadığı bu devler, zaman ve uzayın sınırlarını zorlar.",
        author: "FizikHub"
    },
    {
        name: "Mars",
        image: "/stories/mars.png",
        href: "/blog?kategori=Teknoloji",
        color: "from-red-500 to-orange-700",
        content: "Kızıl gezegende insanlık için yeni bir yuva kurma hayali gerçeğe dönüşüyor. Mars kolonizasyonu ve keşif görevleri tüm hızıyla devam ediyor.",
        author: "FizikHub"
    },
    {
        name: "Biyoloji",
        image: "/stories/dna.png",
        href: "/blog?kategori=Biyoloji",
        color: "from-teal-500 to-emerald-600",
        content: "Yaşamın şifresi DNA sarmalları arasında gizlidir. Genetik mühendisliği ve biyoteknoloji, geleceğin tıp dünyasını şekillendiriyor.",
        author: "FizikHub"
    },
    {
        name: "Kimya",
        image: "/stories/quantum.png",
        href: "/blog?kategori=Kimya",
        color: "from-yellow-400 to-orange-500",
        content: "Maddenin yapısını ve etkileşimlerini keşfedin. Reaksiyonlar dünyasında yolculuğa çıkın.",
        author: "FizikHub"
    },
    {
        name: "Fizik",
        image: "/stories/blackhole.png",
        href: "/blog?kategori=Fizik",
        color: "from-rose-500 to-pink-600",
        content: "Evrenin temel yasalarını öğrenin. Hareket, kuvvet ve enerji arasındaki devasa ilişki.",
        author: "FizikHub"
    },
];

export function NexusStories() {
    const [mounted, setMounted] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const openViewer = (index: number) => {
        setSelectedStoryIndex(index);
        setViewerOpen(true);
    };

    return (
        <section className="w-full py-4 mt-[-20px] mb-4">
            <div className="flex overflow-x-auto gap-3 sm:gap-6 px-4 sm:px-0 scrollbar-hide snap-x snap-mandatory">
                {storiesData.map((story, index) => (
                    <div
                        key={story.name}
                        className="flex-shrink-0 snap-start flex flex-col items-center gap-3 group cursor-pointer story-item"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => openViewer(index)}
                    >
                        {/* Outer Gradient Ring (Instagram-like) */}
                        <div className={cn(
                            "w-[82px] h-[82px] rounded-full p-[2px]",
                            "bg-gradient-to-tr",
                            story.color,
                            "border-[1.5px] border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] active:shadow-none transition-shadow duration-200"
                        )}>
                            {/* Inner Content Container */}
                            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-[1.5px] border-black flex items-center justify-center overflow-hidden relative shadow-inner">
                                <Image
                                    src={story.image}
                                    alt={story.name}
                                    fill
                                    sizes="82px"
                                    className="object-cover"
                                    loading={index < 3 ? "eager" : "lazy"}
                                />
                                {/* Subtle Inner Glow Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                            </div>
                        </div>

                        <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-tighter text-zinc-600 dark:text-zinc-400">
                            {story.name}
                        </span>
                    </div>
                ))}
            </div>

            <StoryViewer
                stories={storiesData.map(s => ({
                    id: s.name,
                    title: s.name,
                    image: s.image,
                    content: s.content,
                    author: s.author
                }))}
                initialIndex={selectedStoryIndex}
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
            />
        </section>
    );
}
