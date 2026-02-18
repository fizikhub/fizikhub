"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Check } from "lucide-react";

export type TutorialStep = {
    targetId: string;
    title: string;
    description: string;
    position?: "top" | "bottom" | "left" | "right";
};

interface TutorialOverlayProps {
    steps: TutorialStep[];
    isActive: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

export function TutorialOverlay({ steps = [], isActive, onComplete, onSkip }: TutorialOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initial rect calculation
    useEffect(() => {
        if (!isActive || !steps[currentStep]) return;

        const updateRect = () => {
            const el = document.getElementById(steps[currentStep].targetId);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(updateRect, 100);
        window.addEventListener("resize", updateRect);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", updateRect);
        };
    }, [isActive, currentStep, steps]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            onComplete();
        }
    };

    if (!isActive || !targetRect) return null;
    
    // Safety check
    if (!steps[currentStep]) return null;
    
    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
            {/* Backdrop: 4 divs forming a cutout */}
            <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-[2px]" style={{ height: targetRect.top - 8 }} />
            <div className="absolute left-0 right-0 bottom-0 bg-black/80 backdrop-blur-[2px]" style={{ top: targetRect.bottom + 8 }} />
            <div className="absolute left-0 bottom-0 bg-black/80 backdrop-blur-[2px]" style={{ top: targetRect.top - 8, height: targetRect.height + 16, width: targetRect.left - 8 }} />
            <div className="absolute right-0 bottom-0 bg-black/80 backdrop-blur-[2px]" style={{ top: targetRect.top - 8, height: targetRect.height + 16, left: targetRect.right + 8 }} />

            {/* Spotlight Border */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={`spotlight-${currentStep}`}
                className="absolute border-2 border-[#FFC800] rounded-xl shadow-[0_0_30px_rgba(255,200,0,0.3)] pointer-events-none"
                style={{
                    top: targetRect.top - 8,
                    left: targetRect.left - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                }}
            />

            {/* Tutorial Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`card-${currentStep}`}
                className="absolute z-[1001] w-[90vw] max-w-sm"
                style={{
                    // Example placement logic: preferably below, flip if near bottom
                    top: targetRect.bottom + 24 > window.innerHeight - 200 
                         ? targetRect.top - 220 
                         : targetRect.bottom + 24,
                    // Center horizontally relative to target, but clamp to screen edges
                    left: Math.max(16, Math.min(window.innerWidth - 320 - 16, targetRect.left)),
                }}
            >
                <div className="bg-[#09090B] border-2 border-white/20 p-5 rounded-2xl shadow-[8px_8px_0px_#000] relative overflow-hidden group">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#4169E1 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
                    />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="text-[10px] bg-[#4169E1] text-white px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-black/50 shadow-sm">
                            ADIM {currentStep + 1}/{steps.length}
                        </span>
                        <button 
                            onClick={onSkip} 
                            className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 p-1 rounded-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2 relative z-10">
                        {step.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm font-medium mb-6 leading-relaxed relative z-10">
                        {step.description}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-end relative z-10">
                        <button
                            onClick={handleNext}
                            className="bg-[#FFC800] text-black px-4 py-2 rounded-xl font-black uppercase text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2 group/btn"
                        >
                            {currentStep === steps.length - 1 ? "TAMAMLA" : "SIRADAKİ"}
                            {currentStep === steps.length - 1 ? 
                                <Check className="w-3.5 h-3.5 stroke-[3px]" /> : 
                                <ChevronRight className="w-3.5 h-3.5 stroke-[3px] group-hover/btn:translate-x-0.5 transition-transform" />
                            }
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
