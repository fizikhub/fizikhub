"use client";

import { useState, useEffect } from "react";
import { getNotifications, markAsRead } from "@/app/notifications/actions";
import { useRouter } from "next/navigation";
import confetti from 'canvas-confetti';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { m as motion, AnimatePresence } from "framer-motion";

export default function GlobalAdminNotification() {
    const [adminNotification, setAdminNotification] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkNotifications = async () => {
            try {
                const notifications = await getNotifications();
                const adminNote = notifications?.find((n: any) =>
                    !n.is_read && n.content === "hazreti yüce müce admin soruna cevap verdi"
                );

                if (adminNote) {
                    setAdminNotification(adminNote);
                    setIsVisible(true);
                    confetti({ particleCount: 500, spread: 160, origin: { y: 0.2 } });
                }
            } catch (e) {
                console.error("Notification check failed", e);
            }
        };

        if ('requestIdleCallback' in window) {
            const idleId = window.requestIdleCallback(() => checkNotifications(), { timeout: 5000 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeout = setTimeout(checkNotifications, 2500);
        return () => clearTimeout(timeout);
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
