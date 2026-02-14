"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface Story {
    id: string;
    title: string;
    image: string;
    content: string;
    author: string;
}

interface StoryViewerProps {
    stories: Story[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export function StoryViewer({ stories, initialIndex, isOpen, onClose }: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const STORY_DURATION = 5000; // 5 seconds per story

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const nextStory = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    }, [currentIndex, stories.length, onClose]);

    const prevStory = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        }
    }, [currentIndex]);

    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    nextStory();
                    return 0;
                }
                return prev + (100 / (STORY_DURATION / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isOpen, currentIndex, nextStory]);

    if (!isOpen) return null;

    const currentStory = stories[currentIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[1000] bg-black flex items-center justify-center sm:p-4"
            >
                <div className="relative w-full h-full max-w-[500px] sm:h-[90vh] sm:rounded-2xl overflow-hidden bg-zinc-900 border-2 border-white/10 flex flex-col">

                    {/* Progress Bars */}
                    <div className="absolute top-0 left-0 right-0 z-50 p-4 flex gap-1">
                        {stories.map((_, index) => (
                            <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%"
                                    }}
                                    transition={{ duration: index === currentIndex ? 0.1 : 0 }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="absolute top-8 left-0 right-0 z-50 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white p-[1px]">
                                <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden relative">
                                    <Image src={currentStory.image} alt="" fill className="object-cover" />
                                </div>
                            </div>
                            <span className="text-white font-black text-sm uppercase tracking-tight shadow-md">
                                {currentStory.title}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Story Image */}
                    <div className="flex-1 relative">
                        <Image
                            src={currentStory.image}
                            alt={currentStory.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Content Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8 pt-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={currentIndex}
                                className="space-y-4"
                            >
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                                    {currentStory.title}
                                </h2>
                                <p className="text-zinc-300 text-sm leading-relaxed font-medium line-clamp-4">
                                    {currentStory.content}
                                </p>
                                <div className="pt-4">
                                    <button className="px-6 py-2 bg-white text-black font-black uppercase text-xs rounded-full shadow-lg hover:bg-yellow-400 transition-colors">
                                        Devamını Oku
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute inset-y-0 left-0 w-1/4 z-40 cursor-pointer" onClick={prevStory} />
                    <div className="absolute inset-y-0 right-0 w-1/4 z-40 cursor-pointer" onClick={nextStory} />

                    <button
                        onClick={prevStory}
                        disabled={currentIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white opacity-0 hover:opacity-100 transition-opacity disabled:hidden"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextStory}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white opacity-0 hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
