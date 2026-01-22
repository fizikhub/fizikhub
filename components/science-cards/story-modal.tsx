"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, User } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    story: any;
}

export function StoryModal({ isOpen, onClose, story }: StoryModalProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setProgress(0);
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        // Optional: Auto close or go to next
                        // onClose(); 
                        return 100;
                    }
                    return prev + 1; // 5 seconds roughly (100 * 50ms)
                });
            }, 50);

            return () => clearInterval(timer);
        }
    }, [isOpen, story]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen || !story) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-0 md:p-8"
                onClick={onClose} // Close on backdrop click
            >
                <button
                    className="absolute top-4 right-4 z-50 text-white/50 hover:text-white transition-colors"
                    onClick={onClose}
                >
                    <X className="w-8 h-8" />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full h-full md:w-[400px] md:h-[80vh] md:max-h-[800px] bg-black rounded-none md:rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()} // Prevent close on content click
                >
                    {/* Progress Bar */}
                    <div className="absolute top-4 left-4 right-4 z-30 flex gap-1 h-1">
                        <div className="flex-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Header Info */}
                    <div className="absolute top-8 left-4 right-4 z-30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 border border-white/20">
                                <AvatarImage src={story.author?.avatar_url} />
                                <AvatarFallback>{story.author?.username?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-white text-sm font-semibold drop-shadow-md">
                                {story.author?.username || "Yazar"}
                            </div>
                            <span className="text-white/40 text-xs">• 1s</span>
                        </div>
                    </div>

                    {/* Main Content Image */}
                    <div className="absolute inset-0">
                        {/* Use standard img to avoid Next.js Image issues in modal context */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={story.image_url}
                            alt={story.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className={`inline-block w-8 h-1 mb-4 rounded-full bg-gradient-to-r ${story.color}`} />
                            <h2 className="text-2xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
                                {story.title}
                            </h2>
                            <p className="text-white/80 text-base leading-relaxed line-clamp-4 font-medium">
                                {story.summary}
                            </p>

                            <div className="mt-6 flex justify-center">
                                <div className="flex flex-col items-center animate-bounce opacity-50">
                                    <span className="text-xs text-white/60 mb-1">Kaydır</span>
                                    <div className="w-1 h-8 bg-white/20 rounded-full relative overflow-hidden">
                                        <div className="absolute top-0 w-full h-1/2 bg-white rounded-full animate-slide-down" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
