"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Reply } from "lucide-react";
import { deleteComment } from "@/app/makale/[slug]/actions";
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
            <div className="flex gap-3 sm:gap-4">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-black dark:border-zinc-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    <AvatarImage src={comment.profiles.avatar_url || ""} />
                    <AvatarFallback className="text-sm font-black bg-yellow-400 text-black">
                        {comment.profiles.full_name?.[0] || comment.profiles.username[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-base sm:text-lg tracking-tight text-foreground">
                            {comment.profiles.full_name || comment.profiles.username}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-black/10 dark:border-white/10">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReply(comment.id)}
                            className="h-auto p-1 px-2 -ml-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-[#FFC800] hover:bg-[#FFC800]/10 transition-colors"
                        >
                            <Reply className="h-4 w-4 mr-1.5 stroke-[3px]" />
                            Yanıtla
                        </Button>

                        {isAdmin && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="h-auto p-1 px-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-md"
                            >
                                <Trash2 className="h-4 w-4 mr-1.5 stroke-[3px]" />
                                {isDeleting ? "Siliniyor..." : "Sil"}
                            </Button>
                        )}
                    </div>

                    {/* Nested replies */}
                    {replies && replies.length > 0 && (
                        <div className="mt-4 ml-2 sm:ml-4 pl-4 sm:pl-6 space-y-5 border-l-[3px] border-black/10 dark:border-white/10">
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
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAllReplies(true)}
                                    className="mt-2 h-8 px-4 text-xs font-black uppercase tracking-widest border-2 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors rounded-lg"
                                >
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
