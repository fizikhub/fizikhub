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
                {/* Visual placeholder for avatar alignment if needed, or just cleaner input */}
                <div className="flex-1 relative">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Yanıtını gönder..."
                        className="min-h-[40px] text-sm resize-none bg-white dark:bg-[#18181b] border-[3px] border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black transition-all rounded-[4px] px-3 py-2 placeholder:text-muted-foreground/70 shadow-[2px_2px_0_0_#000] focus:shadow-[4px_4px_0_0_#000]"
                    />

                    {/* Actions bar that appears when there is content or focused */}
                    <div className={content.trim() ? "flex justify-end gap-2 mt-3" : "hidden"}>
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-8 rounded-[4px] text-xs font-black uppercase hover:bg-muted border-[2px] border-transparent hover:border-black active:translate-x-[2px] active:translate-y-[2px] transition-all">
                            İptal
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="h-8 rounded-[4px] text-xs font-black uppercase bg-neo-pink text-white border-[2px] border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-neo-pink/90 transition-all">
                            {isSubmitting ? "..." : "Yanıtla"}
                        </Button>
                    </div>

                    {/* Always visible 'Send' icon for quick interaction if preferred, but standard tweet box is better */}
                </div>
            </div>
            {!content.trim() && (
                <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-muted-foreground/50 pl-1 font-bold">MARKDOWN DESTEKLENİR</span>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-7 px-3 rounded-[4px] text-xs font-black uppercase hover:bg-muted text-muted-foreground border-[2px] border-transparent hover:border-black active:translate-x-[2px] active:translate-y-[2px] transition-all">
                            İptal
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="h-7 px-4 rounded-[4px] text-xs font-black uppercase bg-neo-pink text-white border-[2px] border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none opacity-50 cursor-not-allowed transition-all">
                            Yanıtla
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
