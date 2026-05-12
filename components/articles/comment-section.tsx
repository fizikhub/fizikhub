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
        <div className="space-y-6 sm:space-y-8">
            {/* Comment Input Container */}
            <div className="bg-white dark:bg-zinc-900 border-2 sm:border-[3px] border-black dark:border-zinc-700 p-4 sm:p-7 rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] sm:dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
                {isLoggedIn ? (
                    <div className="space-y-3 sm:space-y-4">
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
                            rows={3}
                            className="resize-none border-2 sm:border-[3px] border-black dark:border-zinc-600 rounded-lg sm:rounded-xl shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] sm:dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] focus-visible:ring-0 focus-visible:border-[#FFC800] focus-visible:shadow-[3px_3px_0px_0px_#FFC800] sm:focus-visible:shadow-[4px_4px_0px_0px_#FFC800] transition-all text-sm sm:text-lg font-medium p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-950/50"
                        />
                        <div className="flex justify-end pt-1 sm:pt-2">
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting || !content.trim()}
                                className="h-10 sm:h-12 bg-[#FFC800] hover:bg-[#FFC800]/90 text-black font-black uppercase tracking-widest px-6 sm:px-8 border-2 sm:border-[3px] border-black rounded-lg sm:rounded-xl shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] sm:hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] sm:hover:translate-x-[2px] hover:translate-y-[1px] sm:hover:translate-y-[2px] active:shadow-none active:translate-x-[2px] sm:active:translate-x-[4px] active:translate-y-[2px] sm:active:translate-y-[4px] transition-all text-xs sm:text-base"
                            >
                                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 stroke-[3px]" />
                                {isSubmitting ? "Gönderiliyor..." : (replyingTo ? "Yanıtla" : "Yorum Yap")}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 sm:py-8 px-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg sm:rounded-xl border-2 border-dashed border-black/20 dark:border-white/20">
                        <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-muted-foreground stroke-[1.5px]" />
                        <h4 className="font-black text-base sm:text-lg text-foreground tracking-tight mb-2">Tartışmaya Katılın</h4>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
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
                <div className="text-center py-10 sm:py-12 px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-yellow-500/30">
                        <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                    </div>
                    <h4 className="font-black text-lg sm:text-xl text-foreground tracking-tight mb-2">Henüz yorum yok</h4>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground">
                        Bu makale için ilk yorumu siz yapın ve tartışmayı başlatın!
                    </p>
                </div>
            )}
        </div>
    );
}
