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
                        className="min-h-[40px] h-[40px] focus:min-h-[80px] text-sm resize-none bg-transparent border-b-2 border-transparent focus:border-primary/50 focus:bg-muted/10 transition-all rounded-none px-0 py-2 focus:ring-0 placeholder:text-muted-foreground/70"
                    />

                    {/* Actions bar that appears when there is content or focused (we'll just show it for simplicity or check content) */}
                    <div className={content.trim() ? "flex justify-end gap-2 mt-2" : "hidden"}>
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-8 rounded-full text-xs font-bold hover:bg-muted">
                            İptal
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="h-8 rounded-full text-xs font-bold gap-2">
                            {isSubmitting ? "..." : "Yanıtla"}
                        </Button>
                    </div>

                    {/* Always visible 'Send' icon for quick interaction if preferred, but standard tweet box is better */}
                </div>
            </div>
            {!content.trim() && (
                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-muted-foreground/50 pl-0">Markdown desteklenir</span>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-7 px-3 rounded-full text-xs hover:bg-muted text-muted-foreground">
                            Vazgeç
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="h-7 px-4 rounded-full text-xs font-bold">
                            Yanıtla
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
