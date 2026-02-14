"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

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
    const [mounted, setMounted] = useState(false);
    const STORY_DURATION = 5000; // 5 seconds per story

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

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

    if (!isOpen || !mounted) return null;

    const currentStory = stories[currentIndex];

    const content = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
            >
                <div className="relative w-full h-full sm:max-w-md sm:h-[90vh] sm:rounded-3xl overflow-hidden bg-zinc-900 flex flex-col">

                    {/* Progress Bars */}
                    <div className="absolute top-0 left-0 right-0 z-[100] p-4 pt-6 flex gap-1.5 px-4 sm:px-6">
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
                    <div className="absolute top-10 left-0 right-0 z-[100] px-4 sm:px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-orange-500">
                                <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden relative border border-black/50">
                                    <Image src={currentStory.image} alt="" fill className="object-cover" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-sm uppercase tracking-tight drop-shadow-md leading-none">
                                    {currentStory.title}
                                </span>
                                <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                                    FizikHub
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Story Content */}
                    <div className="flex-1 relative">
                        <Image
                            src={currentStory.image}
                            alt={currentStory.title}
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Dark Gradient Overlay for Legibility */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                        {/* Tap Zones for Navigation */}
                        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={prevStory} />
                        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={nextStory} />

                        {/* Navigation Arrows (Visible on Desktop) */}
                        <div className="absolute inset-y-0 left-4 hidden sm:flex items-center z-50">
                            <button onClick={prevStory} disabled={currentIndex === 0} className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors disabled:opacity-0">
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-4 hidden sm:flex items-center z-50">
                            <button onClick={nextStory} className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Text & Action Overlay */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={currentIndex}
                                className="space-y-4 max-w-sm pointer-events-auto"
                            >
                                <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-xl">
                                    {currentStory.title}
                                </h2>
                                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-medium drop-shadow-md">
                                    {currentStory.content}
                                </p>
                                <div className="pt-6">
                                    <button className="w-full sm:w-auto px-10 py-4 bg-white text-black font-black uppercase text-sm rounded-2xl shadow-2xl hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all">
                                        Hemen Keşfet
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
