"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentItem } from "./comment-item";
import { createComment } from "@/app/blog/[slug]/actions";
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Yorumlar ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Comment Input */}
                {isLoggedIn ? (
                    <div className="space-y-3">
                        {replyingTo && (
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Yoruma yanıt veriyorsunuz</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyingTo(null)}
                                    className="h-auto p-0 text-xs"
                                >
                                    İptal
                                </Button>
                            </div>
                        )}
                        <Textarea
                            id="comment-textarea"
                            placeholder={replyingTo ? "Yanıtınızı yazın..." : "Yorumunuzu yazın..."}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isSubmitting}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
                                {isSubmitting ? "Gönderiliyor..." : (replyingTo ? "Yanıtla" : "Yorum Yap")}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted-foreground">
                        Yorum yapmak için giriş yapmalısınız.
                    </div>
                )}

                {/* Comments List */}
                {topLevelComments.length > 0 ? (
                    <div className="space-y-4 divide-y">
                        {topLevelComments.map((comment) => (
                            <div key={comment.id} className="pt-4 first:pt-0">
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
                    <div className="text-center py-8 text-muted-foreground">
                        Henüz yorum yok. İlk yorumu siz yapın! 💬
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
