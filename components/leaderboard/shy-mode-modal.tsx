"use client";

import { m as motion, AnimatePresence } from "framer-motion";
import { X, Crown, Star } from "lucide-react";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ShyUser {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    reputation: number;
    rank: number;
}

interface ShyModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: ShyUser | null;
}

export function ShyModeModal({ isOpen, onClose, user }: ShyModeModalProps) {
    const cats = useMemo(() => Array.from({ length: 15 }, (_, i) => i), []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Use placeholder cat images
    const catImages = [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1495360019602-e001c276375f?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1529778873920-4da4926a7071?w=200&h=200&fit=crop"
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 h-[100dvh] w-screen touch-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-pink-500/90 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Rain of Cats */}
                    {cats.map((i) => {
                        const startX = ((i * 13) % 100) - 50;
                        const startRotate = (i * 47) % 360;
                        const animRotate = startRotate + 360 + ((i * 31) % 360);
                        const duration = ((i * 7) % 3) + 3;
                        const delay = ((i * 11) % 5) * 0.4;
                        const leftPos = (i * 83) % 100;
                        return (
                            <motion.div
                                key={i}
                                initial={{ y: -120, x: `${startX}%`, opacity: 0.8, rotate: startRotate }}
                                animate={{ y: "120vh", rotate: animRotate }}
                                transition={{
                                    duration: duration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: delay
                                }}
                                className="absolute top-0 pointer-events-none z-0"
                                style={{ left: `${leftPos}%` }}
                            >
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
                                    <Image
                                        src={catImages[i % catImages.length]}
                                        alt="Falling Cat"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            </motion.div>
                        );
                    })}

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        className="relative max-w-md w-full bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 border-pink-400 overflow-hidden z-10 mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="relative z-10">
                            {/* Header Section */}
                            <h2 className="text-4xl font-black text-pink-600 mb-2 tracking-tight uppercase">
                                YAKALANDIM
                            </h2>

                            {/* Profile & Info Row */}
                            {user && (
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    {/* Avatar */}
                                    <div className="w-16 h-16 bg-pink-100 rounded-full border-4 border-pink-300 overflow-hidden flex-shrink-0">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={user.avatar_url} className="object-cover" />
                                            <AvatarFallback className="text-xl bg-pink-200 text-pink-700">
                                                {user.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-1 text-pink-900 font-bold text-lg">
                                            <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                            <span>#{user.rank} Lider</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-pink-700 font-medium text-sm">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{user.reputation} Puan</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!user && (
                                <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6 border-4 border-pink-300 animate-bounce">
                                    <span className="text-6xl">🙈</span>
                                </div>
                            )}

                            <p className="text-lg text-pink-800 font-medium mb-8 leading-relaxed">
                                Beni burada görmedin tamam mı?
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[4px_4px_0px_0px_rgba(190,24,93,1)] border-2 border-pink-700 text-lg"
                            >
                                Tamam Seni Görmedim
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-pink-100 rounded-full text-pink-500 hover:bg-pink-200 transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
