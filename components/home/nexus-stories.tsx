"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { StoryViewer } from "./story-viewer";

interface NexusStoriesProps {
    initialStories?: any[];
    initialGroups?: any[];
}

export function NexusStories({ initialStories = [], initialGroups = [] }: NexusStoriesProps) {
    const [mounted, setMounted] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [activeStories, setActiveStories] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const openGroup = (groupIndex: number) => {
        const group = initialGroups[groupIndex];

        // 2. Filter dynamic stories for this group
        const groupStories = initialStories.filter(s =>
            s.group_id === group.id
        ).map(s => ({
            id: s.id,
            title: s.name || s.title || "Hikaye",
            image: s.image,
            content: s.content || "",
            author: s.author,
            category: group.name, // Display group name as category
            author_id: s.author_id
        }));

        // 3. Just use the group stories
        setActiveStories(groupStories);
        setViewerOpen(true);
    };

    if (initialGroups.length === 0) {
        return null; // Or return a placeholder / default list
    }

    return (
        <section className="w-full pt-4 pb-0 mt-2 mb-0 sm:mb-4">
            <div className="flex overflow-x-auto gap-3 sm:gap-6 px-4 sm:px-0 scrollbar-hide snap-x snap-mandatory touch-pan-x">
                {initialGroups.map((group, index) => {
                    // Check if this group has updates (stories)
                    // If we want to show ring only for groups with stories?
                    // Or strictly highlights that always exist.
                    const hasStories = initialStories.some(s => s.group_id === group.id);

                    return (
                        <div
                            key={group.id}
                            className="flex-shrink-0 snap-start flex flex-col items-center gap-3 group cursor-pointer story-item"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => openGroup(index)}
                        >
                            {/* Outer Gradient Ring */}
                            <div className={cn(
                                "w-[82px] h-[82px] rounded-full p-[2px]",
                                "bg-gradient-to-tr",
                                // Highlight logic: If user hasn't seen? For now just random or based on existence
                                "from-purple-500 via-pink-500 to-orange-500", // Standard brand gradient
                                "border-[1.5px] border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] active:shadow-none transition-shadow duration-200"
                            )}>
                                {/* Inner Content Container */}
                                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-[1.5px] border-black flex items-center justify-center overflow-hidden relative shadow-inner">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        sizes="82px"
                                        className="object-cover"
                                        loading={index < 3 ? "eager" : "lazy"}
                                    />
                                </div>
                            </div>

                            <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-tighter text-zinc-600 dark:text-zinc-400 max-w-[80px] truncate text-center">
                                {group.name}
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
