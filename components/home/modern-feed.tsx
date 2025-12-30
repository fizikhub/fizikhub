"use client";

import { NeoArticleCard, NeoBlogCard, NeoQuestionCard } from "@/components/ui/neo-cards";
import { CommunityInviteBanner } from "@/components/explore/community-invite-banner";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { SuggestedUsersCard } from "@/components/home/suggested-users-card";
import { WriterApplicationCard } from "@/components/home/writer-application-card";
import { motion } from "framer-motion";
import Masonry from 'react-masonry-css';
import "@/app/masonry.css"; // We will create this or use inline styles

/* -----------------------------------------------------------------------------------------------
 * FEED TYPES
 * -----------------------------------------------------------------------------------------------*/
export interface FeedItem {
    type: 'article' | 'blog' | 'question';
    data: any;
    sortDate: string;
}

interface ModernFeedProps {
    items: FeedItem[];
    suggestedUsers?: any[];
}

/* -----------------------------------------------------------------------------------------------
 * CONFIG
 * -----------------------------------------------------------------------------------------------*/
// Masonry breakpoints
const breakpointColumnsObj = {
    default: 2, // 2 columns on large screens
    1100: 2,
    768: 1 // 1 column on mobile/tablet
};

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as any // explicit cast to avoid strict typing issue with number[] vs Easing
        }
    })
};

/* -----------------------------------------------------------------------------------------------
 * COMPONENT
 * -----------------------------------------------------------------------------------------------*/
export function ModernFeed({ items, suggestedUsers = [] }: ModernFeedProps) {

    // Helper to render correct card based on type
    const renderCard = (item: FeedItem, index: number) => {
        switch (item.type) {
            case 'article':
                return <NeoArticleCard article={item.data} index={index} />;
            case 'blog':
                return <NeoBlogCard article={item.data} index={index} />;
            case 'question':
                return <NeoQuestionCard question={item.data} />;
            default:
                return null;
        }
    };

    // Helper to inject widgets at specific indices
    // Note: In masonry, strict index injection can be tricky visually, 
    // but we will insert them into the array flow.
    const getInjectedContent = (index: number) => {
        if (index === 1) return <div className="mb-6"><CommunityInviteBanner /></div>;
        if (index === 3) return <div className="mb-6"><DidYouKnow /></div>;
        if (index === 6) return (
            <div className="mb-6 border-2 border-black dark:border-white bg-[#ff90e8] dark:bg-[#7b2cbf] p-1 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <SuggestedUsersCard users={suggestedUsers} />
            </div>
        );
        if (index === 12) return <div className="mb-6"><WriterApplicationCard /></div>;
        return null;
    };

    return (
        <section className="w-full">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid flex w-auto -ml-6" // -ml-6 compensates for pl-6 in column class
                columnClassName="my-masonry-grid_column pl-6 bg-clip-padding"
            >
                {items.map((item, index) => (
                    <div key={`${item.type}-${item.data.id}-${index}`} className="mb-8">
                        {/* Check for injected content BEFORE the item */}
                        {getInjectedContent(index)}

                        <motion.div
                            custom={index % 10} // Reset delay per batch approx
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "50px" }}
                            variants={cardVariants}
                        >
                            {renderCard(item, index)}
                        </motion.div>

                    </div>
                ))}
            </Masonry>

            {/* If items are empty */}
            {items.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-black/20 dark:border-white/20 rounded-xl">
                    <p className="text-xl font-bold text-muted-foreground">Henüz içerik bulunamadı.</p>
                </div>
            )}
        </section>
    );
}
