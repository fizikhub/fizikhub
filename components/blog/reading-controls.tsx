"use client";

import { useState, useEffect } from "react";
import {
    Type,
    Maximize2,
    Minimize2,
    Minus,
    Plus,
    Settings2,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingControlsProps {
    onZenModeChange: (isZen: boolean) => void;
    onFontSizeChange: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
    onFontFamilyChange: (font: 'sans' | 'serif') => void;
}

export function ReadingControls({
    onZenModeChange,
    onFontSizeChange,
    onFontFamilyChange
}: ReadingControlsProps) {
    const [isZenMode, setIsZenMode] = useState(false);
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');

    // Handle Zen Mode toggle
    const toggleZenMode = () => {
        const newMode = !isZenMode;
        setIsZenMode(newMode);
        onZenModeChange(newMode);
    };

    // Handle Font Size
    const steps: ('sm' | 'base' | 'lg' | 'xl')[] = ['sm', 'base', 'lg', 'xl'];
    const increaseFont = () => {
        const currentIndex = steps.indexOf(fontSize);
        if (currentIndex < steps.length - 1) {
            const newSize = steps[currentIndex + 1];
            setFontSize(newSize);
            onFontSizeChange(newSize);
        }
    };
    const decreaseFont = () => {
        const currentIndex = steps.indexOf(fontSize);
        if (currentIndex > 0) {
            const newSize = steps[currentIndex - 1];
            setFontSize(newSize);
            onFontSizeChange(newSize);
        }
    };

    // Handle Font Family
    const toggleFontFamily = () => {
        const newFont = fontFamily === 'sans' ? 'serif' : 'sans';
        setFontFamily(newFont);
        onFontFamilyChange(newFont);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isZenMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-0"
                    >
                        <Button
                            variant="destructive"
                            size="lg"
                            className="rounded-full shadow-[4px_4px_0px_#000] border-[2px] border-black font-bold tracking-wider"
                            onClick={toggleZenMode}
                        >
                            <Minimize2 className="h-5 w-5 mr-2" />
                            AYRIL
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isZenMode && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-[2px] border-black/10 dark:border-white/20 p-1.5 rounded-full shadow-[8px_8px_40px_rgba(0,0,0,0.2)]"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300">
                                <Type className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="end" className="w-72 glass-panel border-[2px] border-black/10 dark:border-white/10 backdrop-blur-3xl p-5 rounded-2xl shadow-xl mb-4">
                            <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
                                {/* Font Size Control */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">YAZI BOYUTU</span>
                                        <span className="text-xs font-bold font-mono bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                                            {fontSize === 'sm' && 'KÜÇÜK'}
                                            {fontSize === 'base' && 'NORMAL'}
                                            {fontSize === 'lg' && 'BÜYÜK'}
                                            {fontSize === 'xl' && 'DEV'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-white/5 rounded-xl p-1.5 border border-black/5 dark:border-white/5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={decreaseFont}
                                            disabled={fontSize === 'sm'}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>

                                        {/* Visual Indicator */}
                                        <div className="flex-1 flex gap-1 h-1.5 justify-center">
                                            {steps.map((step) => (
                                                <div
                                                    key={step}
                                                    className={cn(
                                                        "flex-1 rounded-full transition-colors",
                                                        steps.indexOf(step) <= steps.indexOf(fontSize) ? "bg-[#FFC800]" : "bg-neutral-300 dark:bg-neutral-700"
                                                    )}
                                                />
                                            ))}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={increaseFont}
                                            disabled={fontSize === 'xl'}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Font Family Control */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">YAZI TİPİ</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={fontFamily === 'sans' ? 'default' : 'outline'}
                                            size="sm"
                                            className={cn(
                                                "font-sans border-2 relative overflow-hidden",
                                                fontFamily === 'sans' ? "bg-black text-white hover:bg-black/90 border-black" : "border-neutral-200 dark:border-white/10 hover:bg-neutral-50"
                                            )}
                                            onClick={() => {
                                                setFontFamily('sans');
                                                onFontFamilyChange('sans');
                                            }}
                                        >
                                            {fontFamily === 'sans' && <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFC800]" />}
                                            MODERN
                                        </Button>
                                        <Button
                                            variant={fontFamily === 'serif' ? 'default' : 'outline'}
                                            size="sm"
                                            className={cn(
                                                "font-serif border-2 relative overflow-hidden",
                                                fontFamily === 'serif' ? "bg-black text-white hover:bg-black/90 border-black" : "border-neutral-200 dark:border-white/10 hover:bg-neutral-50"
                                            )}
                                            onClick={() => {
                                                setFontFamily('serif');
                                                onFontFamilyChange('serif');
                                            }}
                                        >
                                            {fontFamily === 'serif' && <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFC800]" />}
                                            KLASİK
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="w-px h-5 bg-neutral-200 dark:bg-white/20" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-10 h-10 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 group"
                        onClick={toggleZenMode}
                        title="Zen Modu"
                    >
                        <Maximize2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
