"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleLike } from "@/app/blog/[slug]/actions";
import { motion } from "framer-motion";

interface LikeButtonProps {
    articleId: number;
    initialLiked: boolean;
    initialCount: number;
}

export function LikeButton({ articleId, initialLiked, initialCount }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        // Optimistic update
        const previousLiked = liked;
        const previousCount = count;

        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);
        setIsLoading(true);

        const result = await toggleLike(articleId);

        if (!result.success) {
            // Revert on error
            setLiked(previousLiked);
            setCount(previousCount);
            toast.error(result.error || "Bir hata oluştu");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLoading}
                className="gap-2 group"
            >
                <motion.div
                    animate={liked ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <Heart
                        className={`h-5 w-5 transition-all ${liked
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground group-hover:text-red-500"
                            }`}
                    />
                </motion.div>
                <span className="text-sm font-medium">{count}</span>
            </Button>
        </div>
    );
}
