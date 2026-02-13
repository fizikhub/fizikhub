"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Share2, Heart } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface StoryViewerProps {
    isOpen: boolean;
    onClose: () => void;
    story: any;
}

export function StoryViewer({ isOpen, onClose, story }: StoryViewerProps) {
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-progress logic
    useEffect(() => {
        if (isOpen && !isPaused) {
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        // TODO: Auto-advance to next story logic could go here
                        return 100;
                    }
                    return prev + 0.5; // ~10 seconds
                });
            }, 50);
            return () => clearInterval(timer);
        }
    }, [isOpen, isPaused, story]);

    // Reset progress when story changes or opens
    useEffect(() => {
        if (isOpen) {
            setProgress(0);
            setIsPaused(false);
        }
    }, [isOpen, story]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen || !story) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center sm:bg-black/90 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full h-[100dvh] sm:w-[400px] sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-black shadow-2xl sm:border border-white/10"
                    >
                        {/* Background Image Layer */}
                        <div className="absolute inset-0">
                            {/* Standard img for simpler handling in this context, or NextImage with fill */}
                            <NextImage
                                src={story.image}
                                alt={story.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
                            {/* Color Tint Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-tr ${story.color} opacity-20 mix-blend-overlay`} />
                        </div>

                        {/* Progress Bar Container */}
                        <div className="absolute top-0 left-0 right-0 p-3 z-50 flex gap-1.5 pt-safe-top">
                            {/* Single bar for now, could become multiple for multiple stories */}
                            <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Header: User Info & Close */}
                        <div className="absolute top-6 left-0 right-0 px-4 py-2 z-50 flex items-center justify-between pt-safe-top-more">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border-2 border-white/20 shadow-sm">
                                    <AvatarImage src={story.author?.avatar || "/icon.png"} />
                                    <AvatarFallback>FH</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm shadow-black drop-shadow-md">
                                        {story.author?.name || "FizikHub"}
                                    </span>
                                    <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Sponsored / Bilim</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Interaction Areas (Tap left/right/hold) */}
                        <div
                            className="absolute inset-0 z-40 flex"
                            onTouchStart={() => setIsPaused(true)}
                            onTouchEnd={() => setIsPaused(false)}
                            onMouseDown={() => setIsPaused(true)}
                            onMouseUp={() => setIsPaused(false)}
                        >
                            <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); /* Previous Logic */ }} />
                            <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); /* Pause/Toggle Logic */ }} />
                            <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); /* Next Logic */ }} />
                        </div>


                        {/* Content Layer */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe-bottom z-50 flex flex-col gap-4">

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white mb-3">
                                    {story.category}
                                </span>
                                <h1 className="text-3xl font-black text-white leading-tight mb-3 drop-shadow-lg">
                                    {story.title}
                                </h1>
                                <p className="text-white/90 text-sm leading-relaxed font-medium drop-shadow-md bg-black/30 p-2 rounded-lg backdrop-blur-sm border border-white/5">
                                    {story.summary}
                                </p>
                            </motion.div>

                            {/* Action Bar */}
                            <div className="flex items-center gap-3 mt-2">
                                <Button
                                    className="flex-1 bg-white text-black hover:bg-white/90 font-bold rounded-xl h-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    onClick={() => alert("Detaylar yakında!")}
                                >
                                    Daha Fazla Oku <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                                <Button size="icon" variant="secondary" className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20">
                                    <Heart className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="secondary" className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
