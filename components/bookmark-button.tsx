"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    type: "article" | "question";
    itemId: number;
    initialBookmarked?: boolean;
    className?: string;
}

export function BookmarkButton({
    type,
    itemId,
    initialBookmarked = false,
    className
}: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isLoading, setIsLoading] = useState(false);
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());

    const toggleBookmark = async () => {
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Kaydetmek için giriş yapmalısınız");
                setIsLoading(false);
                return;
            }

            const tableName = type === "article" ? "article_bookmarks" : "question_bookmarks";
            const columnName = type === "article" ? "article_id" : "question_id";

            if (isBookmarked) {
                // Remove bookmark
                const { error } = await supabase
                    .from(tableName)
                    .delete()
                    .eq("user_id", user.id)
                    .eq(columnName, itemId);

                if (error) throw error;

                setIsBookmarked(false);
                toast.success("Kaydedilenlerden çıkarıldı");
            } else {
                // Add bookmark
                const { error } = await supabase
                    .from(tableName)
                    .insert({
                        user_id: user.id,
                        [columnName]: itemId
                    });

                if (error) throw error;

                setIsBookmarked(true);
                toast.success("Kaydedilenlere eklendi");
            }
        } catch (error: any) {
            console.error("Bookmark error:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            disabled={isLoading}
            className={cn("gap-2", className)}
        >
            <Bookmark
                className={cn(
                    "h-4 w-4 transition-all",
                    isBookmarked && "fill-current"
                )}
            />
            <span className="hidden sm:inline">
                {isBookmarked ? "Kaydedildi" : "Kaydet"}
            </span>
        </Button>
    );
}
