"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { StoryViewer } from "./story-viewer";

const storiesData = [
    {
        name: "Genel",
        image: "/stories/feyman.png", // Stand-in for General/Recent if needed, or maybe just use logo
        href: "/blog",
        color: "from-gray-500 to-zinc-600",
        content: "FizikHub'dan en son güncellemeler ve paylaşımlar.",
        author: "FizikHub"
    },
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

interface NexusStoriesProps {
    initialStories?: any[];
}

export function NexusStories({ initialStories = [] }: NexusStoriesProps) {
    const [mounted, setMounted] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [activeStories, setActiveStories] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const openCategory = (categoryIndex: number) => {
        const category = storiesData[categoryIndex];

        // 1. Get the "Intro" story from static data
        const introStory = {
            id: `intro-${category.name}`,
            title: category.name,
            image: category.image,
            content: category.content,
            author: category.author,
            category: category.name
        };

        // 2. Filter dynamic stories for this category
        // Normalizing to lowercase for comparison just in case, or exact match
        const categoryStories = initialStories.filter(s =>
            s.category === category.name ||
            (category.name === "Genel" && !s.category) // Fallback for uncategorized
        ).map(s => ({
            id: s.id,
            title: s.title || "Hikaye",
            image: s.media_url,
            content: s.content || "",
            author: "Üye", // We might want to fetch author name if joined, but keeping simple
            category: s.category,
            author_id: s.author_id
        }));

        // 3. Combine them
        const playlist = [introStory, ...categoryStories];

        setActiveStories(playlist);
        setViewerOpen(true);
    };

    return (
        <section className="w-full py-4 mt-[-20px] mb-4">
            <div className="flex overflow-x-auto gap-3 sm:gap-6 px-4 sm:px-0 scrollbar-hide snap-x snap-mandatory touch-pan-x">
                {storiesData.map((story, index) => {
                    // Check if this category has new updates (dynamic stories)
                    const hasUpdates = initialStories.some(s =>
                        s.category === story.name ||
                        (story.name === "Genel" && !s.category)
                    );

                    return (
                        <div
                            key={story.name + index}
                            className="flex-shrink-0 snap-start flex flex-col items-center gap-3 group cursor-pointer story-item"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => openCategory(index)}
                        >
                            {/* Outer Gradient Ring (Instagram-like) */}
                            <div className={cn(
                                "w-[82px] h-[82px] rounded-full p-[2px]",
                                "bg-gradient-to-tr",
                                hasUpdates ? "from-pink-500 via-red-500 to-yellow-500 animate-spin-slow" : story.color, // Highlight if updates? Or just keep standard brands
                                // Reverting to standard brand colors but keeping the structure
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
                                    {/* Clean look, no dark overlay */}
                                </div>
                            </div>

                            <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-tighter text-zinc-600 dark:text-zinc-400 max-w-[80px] truncate text-center">
                                {story.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            <StoryViewer
                stories={activeStories}
                initialIndex={0}
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
            />
        </section>
    );
}
