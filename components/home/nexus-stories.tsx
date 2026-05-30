"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamic import for StoryViewer to defer framer-motion and supabase/ssr
const StoryViewer = dynamic(() => import("./story-viewer").then(mod => mod.StoryViewer), {
    ssr: false,
});

interface NexusStoriesProps {
    initialStories?: StoryItem[];
    initialGroups?: StoryGroup[];
}

interface StoryItem {
    id: string | number;
    name?: string;
    title?: string;
    image: string;
    content?: string;
    author?: string;
    author_id?: string;
    group_id?: string | number | null;
}

interface StoryGroup {
    id: string | number;
    name: string;
    image: string;
    ring_color?: string;
}

interface ViewerStory {
    id: string;
    title: string;
    image: string;
    content: string;
    author: string;
    author_id?: string;
}

export function NexusStories({ initialStories = [], initialGroups = [] }: NexusStoriesProps) {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [activeStories, setActiveStories] = useState<ViewerStory[]>([]);

    const openGroup = (groupIndex: number) => {
        const group = groupsWithStories[groupIndex];

        // Filter dynamic stories for this group
        const groupStories = initialStories.filter(s =>
            String(s.group_id) === String(group.id)
        ).map(s => ({
            id: String(s.id),
            title: s.name || s.title || "Hikaye",
            image: s.image,
            content: s.content || "",
            author: s.author || "FizikHub",
            category: group.name,
            author_id: s.author_id
        }));

        if (groupStories.length > 0) {
            setActiveStories(groupStories);
            setViewerOpen(true);
        }
    };

    // Only show groups that have at least one valid story associated
    const groupsWithStories = initialGroups.filter(group =>
        initialStories.some(s => String(s.group_id) === String(group.id))
    );

    if (groupsWithStories.length === 0) {
        return null;
    }

    return (
        <section className="w-full pt-4 pb-0 mt-[-8px] mb-0 sm:mb-4">
            <div className="flex overflow-x-auto gap-3 sm:gap-6 px-4 sm:px-0 scrollbar-hide snap-x snap-mandatory touch-pan-x scroll-smooth">
                {groupsWithStories.map((group, index) => {
                    return (
                        <motion.div
                            key={group.id}
                            className="flex-shrink-0 snap-start flex flex-col items-center gap-2.5 group cursor-pointer"
                            onClick={() => openGroup(index)}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, type: "spring", stiffness: 350, damping: 25 }}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {/* Outer Gradient Ring with framer-motion physics */}
                            <motion.div
                                className={cn(
                                    "w-[86px] h-[86px] rounded-full p-[3px] relative overflow-hidden flex items-center justify-center",
                                    "border-[3px] border-black bg-black"
                                )}
                                variants={{
                                    hover: { scale: 1.05, rotate: 3, boxShadow: "4px 4px 0px 0px #000" },
                                    tap: { scale: 0.92, rotate: -3, boxShadow: "0px 0px 0px 0px #000" }
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 20, mass: 1 }}
                            >
                                {/* Hard-stop Conic Gradient for a "Tech Dial" feel */}
                                <div 
                                    className="absolute inset-[-50%] animate-spin-slow opacity-100"
                                    style={{
                                        backgroundImage: group.ring_color 
                                            ? `conic-gradient(from 0deg, ${group.ring_color} 0%, #000 20%, ${group.ring_color} 40%, #000 60%, ${group.ring_color} 80%, #000 100%)` 
                                            : `conic-gradient(from 0deg, #facc15 0%, #000 25%, #FF90E8 50%, #000 75%, #facc15 100%)`
                                    }}
                                />

                                {/* Inner Content Container with Noise Texture */}
                                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-[3px] border-black flex items-center justify-center overflow-hidden relative shadow-inner z-10 noise-bg">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        sizes="82px"
                                        className="object-cover transition-transform duration-300 group-hover:scale-110 grayscale-[25%] contrast-125 group-hover:grayscale-0"
                                        loading={index < 2 ? "eager" : "lazy"}
                                        fetchPriority={index < 2 ? "low" : "auto"}
                                        quality={60}
                                    />
                                </div>
                            </motion.div>

                            <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-tighter text-zinc-600 dark:text-zinc-400 max-w-[80px] truncate text-center group-hover:text-yellow-400 transition-colors drop-shadow-sm">
                                {group.name}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {viewerOpen && (
                <StoryViewer
                    stories={activeStories}
                    initialIndex={0}
                    isOpen={viewerOpen}
                    onClose={() => setViewerOpen(false)}
                />
            )}
        </section>
    );
}
