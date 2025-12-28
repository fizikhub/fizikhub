"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Cat, Crown, Star } from "lucide-react";
import { useEffect, useState } from "react";
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
    const [cats, setCats] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Lock body scroll
            document.body.style.overflow = 'hidden';
            setCats(Array.from({ length: 15 }, (_, i) => i));
        } else {
            document.body.style.overflow = 'unset';
            setCats([]);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Use placeholder cat images since we can't reliably get random "real" cat URLs without API
    // Using widely available placeholder services or generic stylized cats
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
                    {cats.map((i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -100, x: Math.random() * 100 - 50 + "%", opacity: 0.8, rotate: Math.random() * 360 }}
                            animate={{ y: "120vh", rotate: Math.random() * 720 }}
                            transition={{
                                duration: Math.random() * 2 + 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 2
                            }}
                            className="absolute top-0 pointer-events-none z-0"
                            style={{ left: `${Math.random() * 100}%` }}
                        >
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
                                <Image
                                    src={catImages[i % catImages.length]}
                                    alt="Falling Cat"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        className="relative max-w-md w-full bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 border-pink-400 overflow-hidden z-10 mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,_#ff9ecf_2px,_transparent_2px)] bg-[length:20px_20px]"></div>

                        <div className="relative z-10">
                            {/* Ostrich/Hiding Animation */}
                            <div className="mx-auto w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mb-6 border-4 border-pink-300 animate-bounce overflow-hidden relative">
                                {user ? (
                                    <div className="relative w-full h-full">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={user.avatar_url} className="object-cover" />
                                            <AvatarFallback className="text-4xl bg-pink-200 text-pink-700">
                                                {user.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* "Sand" Overlay simulating burying head */}
                                        <div className="absolute bottom-0 w-full h-1/2 bg-amber-200/90 backdrop-blur-sm flex items-end justify-center pb-2 border-t-4 border-amber-300">
                                            <span className="text-xs font-black text-amber-600 uppercase">Kuma Gömüldü</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-7xl">🙈</span>
                                )}
                            </div>

                            <h2 className="text-3xl font-black text-pink-600 mb-2 tracking-tight">
                                NOOO! YAKALANDIM!
                            </h2>

                            <p className="text-lg text-pink-800 font-medium mb-6 leading-relaxed">
                                Şu an bir devekuşu misali kafamı kuma gömüyorum...
                                <br />
                                <span className="text-sm opacity-75">Beni burada görmedin, tamam mı?</span> 🐫🏜️
                            </p>

                            {/* User Stats Card */}
                            {user && (
                                <div className="bg-pink-50 p-4 rounded-2xl border-2 border-pink-200 mb-6 flex flex-col gap-2 transform rotate-1 hover:rotate-0 transition-transform">
                                    <div className="flex items-center justify-center gap-2 text-pink-900 font-bold text-xl">
                                        <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                        <span>#{user.rank} Lider</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-pink-700 font-medium">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{user.reputation} Puan</span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[4px_4px_0px_0px_rgba(190,24,93,1)] border-2 border-pink-700 text-lg"
                            >
                                Tamam, Seni Görmedim! 🤫
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
