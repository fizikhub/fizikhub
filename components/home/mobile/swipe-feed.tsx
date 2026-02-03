"use client";

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { useState } from "react";
import { FeedItem } from "@/components/home/unified-feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface SwipeFeedProps {
    items: FeedItem[];
}

export function SwipeFeed({ items }: SwipeFeedProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Safety check
    if (!items || items.length === 0) return null;

    // Show top 3 cards for stack effect
    const visibleItems = items.slice(currentIndex, currentIndex + 3).reverse();

    const handleSwipe = (direction: 'left' | 'right') => {
        setCurrentIndex(prev => prev + 1);
    };

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden px-4">
            <div className="absolute top-0 left-0 w-full px-4 pt-2 pb-4 z-10 bg-gradient-to-b from-background to-transparent">
                <h2 className="text-xl font-black italic uppercase tracking-tight">
                    GÜNLÜK <span className="text-[#FF5C00] decoration-wavy underline">AKIŞ</span>
                </h2>
            </div>

            <div className="relative w-full h-[420px] max-w-sm">
                {visibleItems.map((item, index) => {
                    const isTop = index === visibleItems.length - 1;
                    return (
                        <SwipeCard
                            key={item.data.id || index} // Fallback key
                            item={item}
                            isTop={isTop}
                            onSwipe={handleSwipe}
                            index={index}
                        />
                    );
                })}
                {currentIndex >= items.length && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-zinc-100 rounded-3xl border-2 border-dashed border-zinc-300">
                        <span className="text-4xl mb-4">🎉</span>
                        <h3 className="font-bold text-lg">Mola Verme Zamanı!</h3>
                        <p className="text-zinc-500 text-sm mt-2">Şimdilik tüm içerikleri tükettin. Yarın tekrar gel!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SwipeCard({ item, isTop, onSwipe, index }: { item: FeedItem; isTop: boolean; onSwipe: (dir: 'left' | 'right') => void; index: number }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const scale = isTop ? 1 : 0.9 + (index * 0.05);
    const y = isTop ? 0 : -20 * (2 - index); // Stack effect

    const controls = useAnimation();

    const handleDragEnd = async (event: any, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            await controls.start({ x: 500, opacity: 0 });
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            await controls.start({ x: -500, opacity: 0 });
            onSwipe('left');
        } else {
            controls.start({ x: 0 });
        }
    };

    const colorMap: Record<string, string> = {
        article: "bg-white",
        question: "bg-[#FFF4E5]",
        term: "bg-[#E6F4FF]",
        experiment: "bg-[#F0FFF4]"
    };

    // Helper to get safe string values
    const getAvatar = () => item.data.author?.avatar_url || item.data.profiles?.avatar_url || "";
    const getUsername = () => item.data.author?.username || item.data.profiles?.username || "Anonim";
    const getTitle = () => item.data.title || "Adsız İçerik";
    const getContent = () => item.data.summary || item.data.content || "";
    const getCategory = () => item.type === 'question' ? 'SORU' : (item.data.category || 'GENEL');

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity: isTop ? opacity : 1,
                zIndex: index
            }}
            animate={controls}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale, y }}
            className={cn(
                "absolute top-0 left-0 w-full h-[400px] rounded-3xl p-5 border-[3px] border-black shadow-[8px_8px_0px_rgba(0,0,0,0.2)]",
                "flex flex-col justify-between cursor-grab active:cursor-grabbing",
                colorMap[item.type] || "bg-white"
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-black">
                    <AvatarImage src={getAvatar() || `https://api.dicebear.com/7.x/notionists/svg?seed=${getUsername()}`} />
                    <AvatarFallback>FH</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold text-sm leading-none">{getUsername()}</p>
                    <p className="text-[10px] uppercase font-black tracking-wider text-black/50 mt-1">
                        {formatDistanceToNow(new Date(item.sortDate), { addSuffix: true, locale: tr })}
                    </p>
                </div>
                <div className="ml-auto px-2 py-1 rounded-full border border-black bg-black text-white text-[10px] font-bold uppercase">
                    {getCategory()}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 mt-4 overflow-hidden mask-linear-fade">
                <h3 className="font-black text-2xl leading-tight mb-2 line-clamp-3">
                    {getTitle()}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed line-clamp-6">
                    {getContent()}
                </p>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t-2 border-black/10 flex justify-between items-end">
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5 stroke-[2.5px]" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5 stroke-[2.5px]" />
                    </button>
                </div>

                <div className="text-xs font-bold text-black/40 uppercase tracking-widest">
                    {item.type === 'question' ? 'TARTIŞMA' : 'OKU'} →
                </div>
            </div>

            {/* Swipe Indicators */}
            {isTop && (
                <>
                    <motion.div style={{ opacity: useTransform(x, [50, 150], [0, 1]) }} className="absolute top-8 left-8 -rotate-12 border-[4px] border-emerald-500 text-emerald-500 rounded-lg px-4 py-2 font-black text-2xl uppercase bg-white/80 backdrop-blur-sm z-50 pointer-events-none">
                        BEĞENDİM
                    </motion.div>
                    <motion.div style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }} className="absolute top-8 right-8 rotate-12 border-[4px] border-red-500 text-red-500 rounded-lg px-4 py-2 font-black text-2xl uppercase bg-white/80 backdrop-blur-sm z-50 pointer-events-none">
                        GEÇ
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
