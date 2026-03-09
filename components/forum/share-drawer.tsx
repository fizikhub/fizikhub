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
                            className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-[#18181b] border-t-[3px] border-x-[3px] border-black rounded-t-[24px] p-6 pb-12 shadow-[0_-4px_0_0_#000] sm:max-w-md sm:mx-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-black text-black dark:text-white uppercase tracking-tighter">
                                    Paylaş
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-10 w-10 border-2 border-black rounded-[8px] bg-neutral-100 dark:bg-black hover:bg-neo-pink hover:text-white shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                >
                                    <X className="h-5 w-5 stroke-[3px] text-black dark:text-white" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <motion.div whileTap={{ scale: 0.96 }}>
                                    <Button
                                        onClick={handleTwitterShare}
                                        className="w-full h-16 flex items-center justify-start gap-4 px-6 border-[3px] border-black bg-white dark:bg-[#27272a] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-[12px] shadow-[4px_4px_0_0_#000] transition-all text-black dark:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                    >
                                        <div className="bg-black text-white p-2 rounded-[8px] shadow-[2px_2px_0_0_#FFBD2E]">
                                            <Twitter className="h-5 w-5 fill-current" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-sm sm:text-base">X'te Paylaş</span>
                                    </Button>
                                </motion.div>

                                <motion.div whileTap={{ scale: 0.96 }}>
                                    <Button
                                        onClick={handleWhatsAppShare}
                                        className="w-full h-16 flex items-center justify-start gap-4 px-6 border-[3px] border-black bg-[#4ADE80] hover:bg-[#3ec46f] rounded-[12px] shadow-[4px_4px_0_0_#000] transition-all text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                    >
                                        <div className="bg-white text-black p-2 rounded-[8px] shadow-[2px_2px_0_0_#000]">
                                            <MessageCircle className="h-5 w-5 fill-current" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-sm sm:text-base">WhatsApp'ta Gönder</span>
                                    </Button>
                                </motion.div>

                                <motion.div whileTap={{ scale: 0.96 }}>
                                    <Button
                                        onClick={handleCopy}
                                        className="w-full h-16 flex items-center justify-start gap-4 px-6 border-[3px] border-black bg-[#FFBD2E] hover:bg-[#FFD268] rounded-[12px] shadow-[4px_4px_0_0_#000] transition-all text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                    >
                                        <div className="bg-black text-white p-2 rounded-[8px] shadow-[2px_2px_0_0_#fff]">
                                            <Copy className="h-5 w-5 stroke-[3px]" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-sm sm:text-base">Bağlantıyı Kopyala</span>
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
