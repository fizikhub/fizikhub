"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

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
        const group = groupsWithStories[groupIndex]; // Use the filtered array!

        // 2. Filter dynamic stories for this group (loose equality for uuid/number mismatches just in case)
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
        <section className="w-full pt-3 pb-0 mt-[-4px] mb-0 sm:mb-3">
            <div className="flex overflow-x-auto gap-3 sm:gap-5 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory touch-pan-x scroll-px-3">
                {groupsWithStories.map((group, index) => {
                    return (
                        <button
                            type="button"
                            key={group.id}
                            aria-label={`${group.name} hikayelerini aç`}
                            className="flex-shrink-0 snap-start flex flex-col items-center gap-2.5 group cursor-pointer story-item touch-manipulation"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => openGroup(index)}
                        >
                            {/* Outer Gradient Ring */}
                            <div
                                className={cn(
                                    "w-[78px] h-[78px] sm:w-[82px] sm:h-[82px] rounded-full p-[2px]",
                                    !group.ring_color && "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500",
                                    "border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] active:shadow-none transition-shadow duration-200"
                                )}
                                style={group.ring_color ? { background: group.ring_color } : undefined}
                            >
                                {/* Inner Content Container */}
                                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 border-[1.5px] border-black flex items-center justify-center overflow-hidden relative shadow-inner">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        sizes="82px"
                                        className="object-cover"
                                        loading={index < 2 ? "eager" : "lazy"}
                                        fetchPriority={index < 2 ? "low" : "auto"}
                                        quality={50}
                                    />
                                </div>
                            </div>

                            <span className="text-[11px] sm:text-[12px] font-black uppercase text-zinc-400 group-hover:text-zinc-100 max-w-[82px] truncate text-center transition-colors">
                                {group.name}
                            </span>
                        </button>
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
