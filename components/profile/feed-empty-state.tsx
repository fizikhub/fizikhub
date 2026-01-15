"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeedEmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeedEmptyState({ icon: Icon, title, description }: FeedEmptyStateProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center select-none"
        >
            <div className="bg-foreground/5 p-4 rounded-full mb-4">
                <Icon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-foreground/80 font-medium mb-1 text-sm md:text-base">
                {title}
            </h3>
            <p className="text-muted-foreground/60 text-xs md:text-sm max-w-[250px] leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
