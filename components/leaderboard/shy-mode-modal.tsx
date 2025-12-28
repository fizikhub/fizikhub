"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Cat } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ShyModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShyModeModal({ isOpen, onClose }: ShyModeModalProps) {
    const [cats, setCats] = useState<number[]>([]);

    // Reset animations when opened
    useEffect(() => {
        if (isOpen) {
            setCats([1, 2, 3, 4, 5]);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-500/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative max-w-lg w-full bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-pink-400 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/kitty.png')]"></div>
                        </div>

                        {/* Floating Cats */}
                        {cats.map((cat, index) => (
                            <motion.div
                                key={cat}
                                initial={{ 
                                    x: Math.random() * 200 - 100, 
                                    y: Math.random() * 200 - 100, 
                                    opacity: 0, 
                                    scale: 0 
                                }}
                                animate={{ 
                                    x: Math.random() * 50 - 25, 
                                    y: Math.random() * 50 - 25, 
                                    opacity: 1, 
                                    scale: 1,
                                    rotate: Math.random() * 20 - 10 
                                }}
                                transition={{ 
                                    delay: index * 0.2, 
                                    duration: 0.5, 
                                    type: "spring" 
                                }}
                                className="absolute pointer-events-none text-6xl"
                                style={{
                                    top: `${Math.random() * 80 + 10}%`,
                                    left: `${Math.random() * 80 + 10}%`,
                                    zIndex: 0
                                }}
                            >
                                <Cat className="text-pink-400 h-16 w-16" />
                            </motion.div>
                        ))}

                        <div className="relative z-10">
                             <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6 border-4 border-pink-300 animate-bounce">
                                <span className="text-6xl">🙈</span>
                            </div>
                            
                            <h2 className="text-4xl font-black text-pink-600 mb-4 tracking-tight">
                                İNANAMIYORUM!
                            </h2>
                            
                            <p className="text-xl text-pink-800 font-bold mb-8">
                                Yakalandım! Çok utanıyorum... <br/>
                                <span className="text-sm font-normal text-pink-600">(Lütfen kimseye söyleme)</span>
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-200 transform rotate-2">
                                    <p className="text-pink-700 font-medium">"Birinci miyim? Yok canım..."</p>
                                </div>
                                <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-200 transform -rotate-2">
                                    <p className="text-pink-700 font-medium">"Keşke görünmez olsam!" 🙀</p>
                                </div>
                            </div>

                            <button 
                                onClick={onClose}
                                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(190,24,93,1)] border-2 border-pink-700"
                            >
                                Tamam, Görmedim Say!
                            </button>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-pink-100 rounded-full text-pink-500 hover:bg-pink-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
