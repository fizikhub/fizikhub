"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createAnswerComment } from "@/app/forum/actions";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface AnswerCommentFormProps {
    answerId: number;
    questionId: number;
    onCommentAdded: (comment: any) => void;
    onCancel: () => void;
}

export function AnswerCommentForm({ answerId, questionId, onCommentAdded, onCancel }: AnswerCommentFormProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const result = await createAnswerComment({
                content,
                answerId,
                questionId
            });

            if (result.success && result.data) {
                onCommentAdded(result.data);
                setContent("");
                toast.success("Yorum eklendi");
            } else {
                toast.error(result.error || "Hata oluştu");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2 pl-0 sm:pl-0">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Yanıtını yaz..."
                        className="min-h-[40px] text-sm resize-none bg-white dark:bg-[#1a1a1d] border-[2.5px] border-black dark:border-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFBD2E] dark:focus:border-[#FFBD2E] transition-all rounded-lg px-3 py-2.5 placeholder:text-neutral-400 dark:placeholder:text-zinc-600 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] focus:shadow-[3px_3px_0_0_#000] dark:focus:shadow-[3px_3px_0_0_rgba(255,255,255,0.08)] dark:text-zinc-200"
                    />

                    {/* Actions bar */}
                    <div className={content.trim() ? "flex justify-end gap-2 mt-2.5" : "hidden"}>
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-8 rounded-lg text-xs font-bold uppercase text-neutral-500 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 border-[2px] border-transparent hover:border-neutral-300 dark:hover:border-zinc-600 transition-all">
                            İptal
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="h-8 rounded-lg text-xs font-bold uppercase bg-[#FFBD2E] text-black border-[2px] border-black dark:border-zinc-600 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#000] hover:bg-[#FFD268] transition-all">
                            {isSubmitting ? "..." : "Yanıtla"}
                        </Button>
                    </div>

                    {/* Pre-submit hint */}
                </div>
            </div>
            {!content.trim() && (
                <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-600 pl-1 font-medium">Markdown desteklenir</span>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-7 px-3 rounded-lg text-xs font-bold uppercase text-neutral-400 dark:text-zinc-500 hover:bg-neutral-100 dark:hover:bg-zinc-800 border-[2px] border-transparent hover:border-neutral-300 dark:hover:border-zinc-600 transition-all">
                            İptal
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="h-7 px-4 rounded-lg text-xs font-bold uppercase bg-neutral-200 dark:bg-zinc-800 text-neutral-400 dark:text-zinc-600 border-[2px] border-neutral-300 dark:border-zinc-700 opacity-60 cursor-not-allowed transition-all">
                            Yanıtla
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
