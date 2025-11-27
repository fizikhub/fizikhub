"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Reply } from "lucide-react";
import { deleteComment } from "@/app/blog/[slug]/actions";
import { toast } from "sonner";

interface CommentItemProps {
    comment: {
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
    };
    allComments: CommentItemProps['comment'][];
    isAdmin: boolean;
    onReply: (commentId: number) => void;
}

export function CommentItem({ comment, allComments, isAdmin, onReply }: CommentItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAllReplies, setShowAllReplies] = useState(false);

    // Find replies for this comment
    const replies = allComments.filter(c => c.parent_comment_id === comment.id);

    // Determine which replies to show
    const visibleReplies = showAllReplies ? replies : replies.slice(0, 2);
    const hiddenReplyCount = replies.length - visibleReplies.length;

    // Debug logs
    if (replies.length > 0) {

    }

    const handleDelete = async () => {
        if (!confirm("Bu yorumu silmek istediğinizden emin misiniz?")) return;

        setIsDeleting(true);
        const result = await deleteComment(comment.id);

        if (result.success) {
            toast.success("Yorum silindi");
        } else {
            toast.error(result.error || "Bir hata oluştu");
            setIsDeleting(false);
        }
    };

    return (
        <div className="group">
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles.avatar_url || ""} />
                    <AvatarFallback className="text-xs">
                        {comment.profiles.full_name?.[0] || comment.profiles.username[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                            {comment.profiles.full_name || comment.profiles.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    <p className="text-sm">{comment.content}</p>

                    <div className="flex items-center gap-4 pt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReply(comment.id)}
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Yanıtla
                        </Button>

                        {isAdmin && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                {isDeleting ? "Siliniyor..." : "Sil"}
                            </Button>
                        )}
                    </div>

                    {/* Nested replies */}
                    {replies && replies.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3 border-l-2 border-border pl-3">
                            {visibleReplies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    allComments={allComments}
                                    isAdmin={isAdmin}
                                    onReply={onReply}
                                />
                            ))}

                            {hiddenReplyCount > 0 && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setShowAllReplies(true)}
                                    className="h-auto p-0 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 mt-2"
                                >
                                    <div className="w-4 h-[1px] bg-primary/50"></div>
                                    Diğer {hiddenReplyCount} yanıtı gör
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
