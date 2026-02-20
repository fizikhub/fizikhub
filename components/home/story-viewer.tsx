"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Story {
    id: string;
    title: string;
    image: string;
    content: string;
    author: string;
    author_id?: string;
}

interface StoryViewerProps {
    stories: Story[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export function StoryViewer({ stories: initialStories, initialIndex, isOpen, onClose }: StoryViewerProps) {
    // Local state to handle deletions immediately
    const [stories, setStories] = useState(initialStories);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const STORY_DURATION = 5000; // 5 seconds per story

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const router = useRouter();

    useEffect(() => {
        setStories(initialStories);
        setCurrentIndex(initialIndex);
    }, [initialStories, initialIndex]);

    useEffect(() => {
        setMounted(true);
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        getUser();

        return () => setMounted(false);
    }, []);

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

    const handleDelete = async () => {
        const currentStory = stories[currentIndex];
        if (!currentStory?.id || !userId) return; // Should not happen if button is visible

        // Use a custom toast based confirmation or simple double check could be better, 
        // but for "premium" feel let's use a non-blocking UI or a toast action. 
        // For now, let's keep it simple but safe:
        // We will use a toast that requires a second click or a custom UI state. 
        // Actually, let's just use the `sonner` toast with an action button if possible, 
        // or a small discrete overlay. 
        // Since we are inside a full screen viewer, a native confirm is jarring.
        // Let's implement a "Click again to delete" pattern on the button itself.

        // For this first step, let's just remove the native confirm and handle it in the UI button
        // (We will modify the button in the JSX to handle "Are you sure?")

        try {
            setIsDeleting(true);
            const { error } = await supabase
                .from('stories')
                .delete()
                .eq('id', currentStory.id)
                .eq('author_id', userId); // Extra safety

            if (error) throw error;

            toast.success("Hikaye silindi.");

            // Remove from local list
            const newStories = stories.filter(s => s.id !== currentStory.id);
            if (newStories.length === 0) {
                onClose();
            } else {
                setStories(newStories);
                if (currentIndex >= newStories.length) {
                    setCurrentIndex(newStories.length - 1);
                }
                setProgress(0);
            }
            router.refresh();

        } catch (error: any) {
            toast.error("Silme işlemi başarısız oldu.");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (!isOpen || stories.length === 0 || isPaused) return;

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
    }, [isOpen, currentIndex, nextStory, stories.length, isPaused]);

    if (!isOpen || !mounted || stories.length === 0) return null;

    const currentStory = stories[currentIndex];
    const isOwner = userId && currentStory.author_id === userId;

    const content = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
            >
                <div
                    className="relative w-[92vw] h-[82vh] sm:max-w-md sm:h-[90vh] rounded-3xl overflow-hidden bg-zinc-900 flex flex-col shadow-2xl border border-white/5"
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >

                    {/* Progress Bars */}
                    <div className="absolute top-0 left-0 right-0 z-[100] p-2 pt-3 flex gap-1 px-4 sm:px-6 pointer-events-none">
                        {stories.map((_, index) => (
                            <div key={index} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
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
                    <div className="absolute top-7 left-0 right-0 z-[100] px-4 sm:px-6 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 to-orange-500">
                                <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden relative border border-black/50">
                                    <Image src={currentStory.image} alt={`${currentStory.title} profil`} fill className="object-cover" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-xs uppercase tracking-tight drop-shadow-md leading-none">
                                    {currentStory.title}
                                </span>
                                <span className="text-white/60 text-[9px] uppercase font-bold tracking-widest mt-0.5">
                                    {currentStory.author || "FizikHub"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pointer-events-auto">
                            {isOwner && (
                                <DeleteStoryButton
                                    onConfirm={handleDelete}
                                    isDeleting={isDeleting}
                                />
                            )}
                            <button
                                onClick={onClose}
                                aria-label="Hikayeyi kapat"
                                className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 z-[101]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="flex-1 relative">
                        <Image
                            src={currentStory.image}
                            alt={currentStory.title}
                            fill
                            className="object-cover"
                            priority
                            draggable={false}
                        />

                        {/* Dark Gradient Overlay for Legibility */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                        {/* Tap Zones for Navigation */}
                        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={!isPaused ? prevStory : undefined} />
                        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={!isPaused ? nextStory : undefined} />

                        {/* Navigation Arrows (Visible on Desktop) */}
                        <div className="absolute inset-y-0 left-4 hidden sm:flex items-center z-50">
                            <button onClick={prevStory} disabled={currentIndex === 0} aria-label="Önceki hikaye" className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors disabled:opacity-0">
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-4 hidden sm:flex items-center z-50">
                            <button onClick={nextStory} aria-label="Sonraki hikaye" className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
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
                                <p className="text-zinc-100 text-base sm:text-lg leading-relaxed font-medium drop-shadow-md font-grotesk tracking-wide">
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

function DeleteStoryButton({ onConfirm, isDeleting }: { onConfirm: () => void, isDeleting: boolean }) {
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (confirming) {
            const timer = setTimeout(() => setConfirming(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [confirming]);

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (confirming) {
                    onConfirm();
                } else {
                    setConfirming(true);
                    toast.warning("Silmek için tekrar dokun.", { duration: 2000 });
                }
            }}
            disabled={isDeleting}
            className={cn(
                "h-10 flex items-center justify-center bg-black/50 backdrop-blur-xl border border-white/10 rounded-full transition-all active:scale-95 z-[101]",
                confirming ? "w-auto px-4 bg-red-500/80 text-white" : "w-10 text-red-500 hover:bg-red-500/20"
            )}
        >
            {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : confirming ? (
                <span className="text-xs font-bold whitespace-nowrap">SİL?</span>
            ) : (
                <Trash2 className="w-5 h-5" />
            )}
        </button>
    );
}
