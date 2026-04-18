"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Square, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { m as motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Helper function to strip markdown and HTML before reading
function stripMarkdown(text: string) {
    if (!text) return "";

    // 1. Remove HTML tags
    let cleanText = text.replace(/<[^>]*>?/gm, '');

    // 2. Remove Markdown Headings
    cleanText = cleanText.replace(/^#{1,6}\s+/gm, '');

    // 3. Remove Images and Links
    cleanText = cleanText.replace(/!\[.*?\]\(.*?\)/g, ''); // Images
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Links

    // 4. Remove Bold/Italic formatting
    cleanText = cleanText.replace(/(\*\*|__)(.*?)\1/g, '$2');
    cleanText = cleanText.replace(/(\*|_)(.*?)\1/g, '$2');

    // 5. Remove Strikethrough
    cleanText = cleanText.replace(/~~(.*?)~~/g, '$1');

    // 6. Remove Blockquotes
    cleanText = cleanText.replace(/^>\s+/gm, '');

    // 7. Remove Code Blocks (both inline and multi-line)
    cleanText = cleanText.replace(/`{3}[\s\S]*?`{3}/g, ' (Kod Bloğu Atlandı) ');
    cleanText = cleanText.replace(/`.+?`/g, '');

    // 8. Special handling for some meta tags or shortcodes if any
    cleanText = cleanText.replace(/<!--[\s\S]*?-->/g, '');

    // Normalize spacing
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim();

    return cleanText;
}

interface TTSReaderProps {
    content: string;
    title: string;
    className?: string;
}

export function TTSReader({ content, title, className }: TTSReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [voicesLoaded, setVoicesLoaded] = useState(false);

    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize Speech Synthesis
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            synthRef.current = window.speechSynthesis;

            // Handle cross-browser voice loading quirks
            const handleVoicesChanged = () => {
                setVoicesLoaded(true);
                setIsReady(true);
            };

            // Check if voices are already available
            try {
                if (synthRef.current.getVoices().length > 0) {
                    handleVoicesChanged();
                } else {
                    synthRef.current.onvoiceschanged = handleVoicesChanged;
                }
            } catch (e) {
                console.warn("SpeechSynthesis error:", e);
                // Gracefully fail instead of crashing
                setIsReady(false);
            }
        } else {
            // Speech synthesis not supported
            setIsReady(false);
        }

        return () => {
            if (synthRef.current) {
                try { synthRef.current.cancel(); } catch (e) {}
            }
        };
    }, []);

    const speak = () => {
        if (!synthRef.current || !content) return;

        if (isPaused) {
            synthRef.current.resume();
            setIsPlaying(true);
            setIsPaused(false);
            return;
        }

        const cleanText = `${title}. \n\n ${stripMarkdown(content)}`;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utteranceRef.current = utterance;

        // Find a Turkish voice if available, fallback to default
        const voices = synthRef.current.getVoices();
        const trVoice = voices.find(v => v.lang.startsWith('tr'));

        if (trVoice) {
            utterance.voice = trVoice;
        }

        utterance.lang = 'tr-TR';
        utterance.rate = 0.95; // Slightly slower for better readability
        utterance.pitch = 1;

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsPlaying(false);
            setIsPaused(false);
        };

        synthRef.current.cancel(); // Cancel any ongoing speech
        synthRef.current.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
    };

    const pause = () => {
        if (synthRef.current) {
            synthRef.current.pause();
            setIsPlaying(false);
            setIsPaused(true);
        }
    };

    const stop = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsPlaying(false);
            setIsPaused(false);
        }
    };

    if (!isReady) {
        return (
            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium border border-border/50", className)}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Ses Motoru Yükleniyor...</span>
            </div>
        );
    }

    return (
        <div className={cn("inline-flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm", className)}>
            {!isPlaying && !isPaused ? (
                // Initial State: Play Button Only
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={speak}
                    className="h-8 md:h-9 rounded-full px-3 md:px-4 gap-2 hover:bg-emerald-500 hover:text-white transition-all group"
                >
                    <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-xs md:text-sm tracking-tight">Makaleyi Dinle</span>
                </Button>
            ) : (
                // Active State: Controls & Wave Animation
                <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                    {isPlaying ? (
                        <Button
                            variant="default"
                            size="icon"
                            onClick={pause}
                            className="h-8 w-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                        >
                            <Pause className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={speak}
                            className="h-8 w-8 rounded-full"
                        >
                            <Play className="w-4 h-4 ml-0.5" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={stop}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Square className="w-3.5 h-3.5" />
                    </Button>

                    <div className="flex items-end gap-0.5 h-4 px-3 opacity-80">
                        {[...Array(isPlaying ? 4 : 2)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-emerald-500 rounded-t-sm"
                                animate={{
                                    height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%",
                                }}
                                transition={{
                                    duration: isPlaying ? 0.8 + (i * 0.2) : 0,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                        {isPlaying && <span className="text-[10px] ml-2 text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase hidden sm:inline-block">Okunuyor</span>}
                        {isPaused && <span className="text-[10px] ml-2 text-muted-foreground font-bold tracking-widest uppercase hidden sm:inline-block">Durduruldu</span>}
                    </div>
                </div>
            )}
        </div>
    );
}
