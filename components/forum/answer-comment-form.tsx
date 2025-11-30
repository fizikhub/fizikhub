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
        <form onSubmit={handleSubmit} className="mt-4 pl-4 sm:pl-6 border-l-2 border-muted/50">
            <div className="space-y-2">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    className="min-h-[80px] text-sm resize-none bg-muted/20 focus:bg-background transition-colors"
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                        İptal
                    </Button>
                    <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="gap-2">
                        {isSubmitting ? "Gönderiliyor..." : (
                            <>
                                Gönder
                                <Send className="h-3 w-3" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
