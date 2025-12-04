"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { getNotifications, markAsRead } from "@/app/notifications/actions";
import { useRouter } from "next/navigation";
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalAdminNotification() {
    const [adminNotification, setAdminNotification] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { width, height } = useWindowSize();
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    useEffect(() => {
        const checkNotifications = async () => {
            const notifications = await getNotifications();
            const adminNote = notifications?.find((n: any) =>
                !n.is_read && n.content === "hazreti yüce müce admin soruna cevap verdi"
            );

            if (adminNote) {
                setAdminNotification(adminNote);
                setIsVisible(true);
            }
        };

        checkNotifications();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('global-admin-notification')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                () => {
                    checkNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleDismiss = async () => {
        setIsVisible(false);
        if (adminNotification) {
            await markAsRead(adminNotification.id);
        }
    };

    const handleClick = async () => {
        if (adminNotification) {
            await markAsRead(adminNotification.id);
            setIsVisible(false);
            if (adminNotification.resource_type === 'question') {
                router.push(`/forum/soru/${adminNotification.resource_id}`);
            }
        }
    };

    if (!isVisible || !adminNotification) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <ReactConfetti width={width} height={height} numberOfPieces={500} recycle={false} />
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-black shadow-lg border-b-4 border-yellow-600"
                    >
                        <div className="container mx-auto px-2 md:px-4 py-2 md:py-3 flex items-center justify-between gap-2">
                            <div
                                className="flex-1 flex items-center justify-center gap-1 md:gap-2 cursor-pointer"
                                onClick={handleClick}
                            >
                                <span className="text-xl md:text-2xl animate-bounce">👑</span>
                                <span className="font-bold text-xs md:text-xl text-center animate-pulse leading-tight">
                                    hazreti yüce müce admin soruna cevap verdi! Tıklayın!
                                </span>
                                <span className="text-xl md:text-2xl animate-bounce">👑</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-black hover:bg-black/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDismiss();
                                }}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
