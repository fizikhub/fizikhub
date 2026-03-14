"use client";

import { useState, useEffect } from "react";
import { Copy, Twitter, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareDrawerProps {
    url: string;
    title: string;
    children: React.ReactNode;
}

export function ShareDrawer({ url, title, children }: ShareDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toast.success("Bağlantı kopyalandı!");
        setIsOpen(false);
    };

    const handleTwitterShare = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        setIsOpen(false);
    };

    const handleWhatsAppShare = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, '_blank');
        setIsOpen(false);
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer ml-auto sm:ml-0">
                <div className="pointer-events-none">
                    {children}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-[#1e1e21] border-t-[2.5px] border-x-[2.5px] border-black dark:border-zinc-700 rounded-t-[20px] p-6 pb-12 shadow-[0_-4px_0_0_#000] dark:shadow-[0_-4px_0_0_rgba(255,255,255,0.06)] sm:max-w-md sm:mx-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-[family-name:var(--font-outfit)] text-xl font-black text-black dark:text-white uppercase tracking-tight">
                                    Paylaş
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-9 w-9 border-[2px] border-black dark:border-zinc-600 rounded-lg bg-neutral-100 dark:bg-zinc-800 hover:bg-[#FFBD2E] hover:text-black shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000]"
                                >
                                    <X className="h-4 w-4 stroke-[3px] text-black dark:text-zinc-300" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <Button
                                        onClick={handleTwitterShare}
                                        className="w-full h-14 flex items-center justify-start gap-4 px-5 border-[2.5px] border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-700 rounded-[10px] shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)] transition-all text-black dark:text-zinc-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000]"
                                    >
                                        <div className="bg-black text-white p-1.5 rounded-lg shadow-[2px_2px_0_0_#FFBD2E]">
                                            <Twitter className="h-4 w-4 fill-current" />
                                        </div>
                                        <span className="font-bold uppercase tracking-wider text-sm">X'te Paylaş</span>
                                    </Button>
                                </motion.div>

                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <Button
                                        onClick={handleWhatsAppShare}
                                        className="w-full h-14 flex items-center justify-start gap-4 px-5 border-[2.5px] border-black dark:border-zinc-600 bg-[#4ADE80] hover:bg-[#3ec46f] rounded-[10px] shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)] transition-all text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000]"
                                    >
                                        <div className="bg-white text-black p-1.5 rounded-lg shadow-[2px_2px_0_0_#000]">
                                            <MessageCircle className="h-4 w-4 fill-current" />
                                        </div>
                                        <span className="font-bold uppercase tracking-wider text-sm">WhatsApp'ta Gönder</span>
                                    </Button>
                                </motion.div>

                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <Button
                                        onClick={handleCopy}
                                        className="w-full h-14 flex items-center justify-start gap-4 px-5 border-[2.5px] border-black dark:border-zinc-600 bg-[#FFBD2E] hover:bg-[#FFD268] rounded-[10px] shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)] transition-all text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000]"
                                    >
                                        <div className="bg-black text-white p-1.5 rounded-lg shadow-[2px_2px_0_0_#fff]">
                                            <Copy className="h-4 w-4 stroke-[3px]" />
                                        </div>
                                        <span className="font-bold uppercase tracking-wider text-sm">Bağlantıyı Kopyala</span>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
