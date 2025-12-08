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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isZenMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mb-2"
                    >
                        <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full shadow-lg"
                            onClick={toggleZenMode}
                        >
                            <Minimize2 className="h-5 w-5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isZenMode && (
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                                <Type className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="end" className="w-64 glass-panel border-white/10 dark:border-white/10 backdrop-blur-xl p-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Yazı Boyutu</span>
                                    <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-lg p-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={decreaseFont}
                                            disabled={fontSize === 'sm'}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium w-16 text-center">
                                            {fontSize === 'sm' && 'Küçük'}
                                            {fontSize === 'base' && 'Normal'}
                                            {fontSize === 'lg' && 'Büyük'}
                                            {fontSize === 'xl' && 'Dev'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={increaseFont}
                                            disabled={fontSize === 'xl'}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Yazı Tipi</span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={fontFamily === 'sans' ? 'default' : 'outline'}
                                            size="sm"
                                            className="flex-1 font-sans"
                                            onClick={() => {
                                                setFontFamily('sans');
                                                onFontFamilyChange('sans');
                                            }}
                                        >
                                            Modern
                                        </Button>
                                        <Button
                                            variant={fontFamily === 'serif' ? 'default' : 'outline'}
                                            size="sm"
                                            className="flex-1 font-serif"
                                            onClick={() => {
                                                setFontFamily('serif');
                                                onFontFamilyChange('serif');
                                            }}
                                        >
                                            Klasik
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="w-px h-4 bg-border/50" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-primary/10 hover:text-primary"
                        onClick={toggleZenMode}
                        title="Zen Modu"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
