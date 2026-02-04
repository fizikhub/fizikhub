"use client";

import { motion, useScroll, useAnimation, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsVisible(latest > 400); // Show after 400px
        });
    }, [scrollY]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="
                        fixed bottom-24 right-6 z-40
                        w-12 h-12
                        bg-black text-[#FACC15]
                        border-2 border-white
                        shadow-[4px_4px_0px_#FACC15]
                        rounded-xl
                        flex items-center justify-center
                        cursor-pointer
                        md:bottom-8
                    "
                >
                    <ArrowUp className="w-6 h-6 stroke-[3px]" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
