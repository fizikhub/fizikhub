"use client";

import { FeedItem } from "@/components/home/unified-feed";
import { BentoHero } from "./bento-hero";
import { SwipeFeed } from "./swipe-feed";
import { motion } from "framer-motion";

interface MobileHomeV2Props {
    items: FeedItem[];
    suggestedUsers: any[];
}

export function MobileHomeV2({ items, suggestedUsers }: MobileHomeV2Props) {
    return (
        <div className="md:hidden pb-24 bg-background min-h-screen relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-[#FF90E8]/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-[#00E6CC]/20 blur-[100px] rounded-full pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 pt-20">
                <BentoHero />

                <div className="mt-4 mb-8">
                    <SwipeFeed items={items} />
                </div>

                {/* Stats / Mini Feed could go here if needed later */}
                {/* <div className="px-4">
                     <h3 className="font-black text-sm uppercase text-zinc-400 mb-4">Öne Çıkan Yazarlar</h3>
                    ...
                </div> */}
            </div>
        </div>
    );
}

