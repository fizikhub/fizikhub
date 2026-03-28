"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentItem } from "./comment-item";
import { createComment } from "@/app/makale/[slug]/actions";
import { toast } from "sonner";

interface Comment {
    id: number;
    content: string;
    created_at: string;
    parent_comment_id: number | null;
    profiles: {
        id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

interface CommentSectionProps {
    articleId: number;
    comments: Comment[];
    isLoggedIn: boolean;
    isAdmin: boolean;
    userAvatar?: string | null;
}

export function CommentSection({ articleId, comments, isLoggedIn, isAdmin, userAvatar }: CommentSectionProps) {
    const [content, setContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Organize comments into parent-child structure
    const topLevelComments = comments.filter(c => !c.parent_comment_id);
    const getReplies = (parentId: number) => comments.filter(c => c.parent_comment_id === parentId);

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.error("Yorum boş olamaz");
            return;
        }

        setIsSubmitting(true);
        const result = await createComment(articleId, content, replyingTo || undefined);

        if (result.success) {
            toast.success(replyingTo ? "Yanıt eklendi!" : "Yorum eklendi!");
            setContent("");
            setReplyingTo(null);
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setIsSubmitting(false);
    };

    const handleReply = (commentId: number) => {
        setReplyingTo(commentId);
        // Focus on textarea
        document.getElementById('comment-textarea')?.focus();
    };

    return (
        <div className="space-y-8">
            {/* Comment Input Container */}
            <div className="bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-zinc-700 p-5 sm:p-7 rounded-2xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
                {isLoggedIn ? (
                    <div className="space-y-4">
                        {replyingTo && (
                            <div className="flex items-center justify-between bg-yellow-400/10 border-2 border-yellow-500/30 p-3 rounded-lg text-sm text-foreground font-bold">
                                <span className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-yellow-600" />
                                    Bir yoruma yanıt veriyorsunuz
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyingTo(null)}
                                    className="h-auto p-1 px-3 text-xs font-black uppercase hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
                                >
                                    İptal
                                </Button>
                            </div>
                        )}
                        <Textarea
                            id="comment-textarea"
                            placeholder={replyingTo ? "Yanıtınızı çok net bir şekilde ifade edin..." : "Düşüncelerinizi paylaşın..."}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isSubmitting}
                            rows={4}
                            className="resize-none border-[3px] border-black dark:border-zinc-600 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] focus-visible:ring-0 focus-visible:border-[#FFC800] focus-visible:shadow-[4px_4px_0px_0px_#FFC800] transition-all text-base sm:text-lg font-medium p-4 bg-zinc-50 dark:bg-zinc-950/50"
                        />
                        <div className="flex justify-end pt-2">
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting || !content.trim()}
                                className="h-12 bg-[#FFC800] hover:bg-[#FFC800]/90 text-black font-black uppercase tracking-widest px-8 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                            >
                                <Send className="w-4 h-4 mr-2 stroke-[3px]" />
                                {isSubmitting ? "Gönderiliyor..." : (replyingTo ? "Yanıtla" : "Yorum Yap")}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 px-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border-2 border-dashed border-black/20 dark:border-white/20">
                        <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground stroke-[1.5px]" />
                        <h4 className="font-black text-lg text-foreground tracking-tight mb-2">Tartışmaya Katılın</h4>
                        <p className="text-sm font-medium text-muted-foreground">
                            Yorum yapmak ve düşüncelerinizi paylaşmak için giriş yapmalısınız.
                        </p>
                    </div>
                )}
            </div>

            {/* Comments List */}
             {topLevelComments.length > 0 ? (
                <div className="space-y-6">
                    {topLevelComments.map((comment) => (
                        <div key={comment.id} className="relative">
                            <CommentItem
                                comment={comment}
                                allComments={comments}
                                isAdmin={isAdmin}
                                onReply={handleReply}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/30">
                        <MessageSquare className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h4 className="font-black text-xl text-foreground tracking-tight mb-2">Henüz yorum yok</h4>
                    <p className="text-base font-medium text-muted-foreground">
                        Bu makale için ilk yorumu siz yapın ve tartışmayı başlatın!
                    </p>
                </div>
            )}
        </div>
    );
}
