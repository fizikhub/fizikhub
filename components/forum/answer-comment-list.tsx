"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, BadgeCheck } from "lucide-react";
import { deleteAnswerComment } from "@/app/forum/actions";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CommentLikeButton } from "./comment-like-button";

interface Comment {
    id: number;
    content: string;
    created_at: string;
    author_id: string;
    likeCount?: number;
    isLiked?: boolean;
    profiles?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        is_verified?: boolean | null;
    } | null;
}

interface AnswerCommentListProps {
    comments: Comment[];
    currentUserId?: string;
    questionId: number;
    onDelete: (commentId: number) => void;
}

export function AnswerCommentList({ comments, currentUserId, questionId, onDelete }: AnswerCommentListProps) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const isAdmin = currentUserId === 'barannnbozkurttb.b@gmail.com';

    const handleDelete = async (commentId: number) => {
        setIsDeleting(commentId);
        try {
            const result = await deleteAnswerComment(commentId, questionId);
            if (result.success) {
                toast.success("Yorum silindi");
                onDelete(commentId);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsDeleting(null);
        }
    };

    if (comments.length === 0) return null;

    return (
        <div className="space-y-0 relative">
            {/* Vertical line connecting comments - purely visual for the group */}
            <div className="absolute left-[30px] top-0 bottom-4 w-0.5 bg-border/40 -z-10 hidden sm:block" />

            {comments.map((comment) => (
                <div key={comment.id} className="group relative pl-0 sm:pl-0 py-3 first:pt-0">
                    <div className="flex items-start gap-3">
                        <Link href={`/kullanici/${comment.profiles?.username}`} className="relative z-10 shrink-0">
                            <Avatar className="h-8 w-8 ring-2 ring-background group-hover:ring-primary/20 transition-all">
                                <AvatarImage src={comment.profiles?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                                    {comment.profiles?.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>

                        <div className="flex-1 min-w-0 pt-1">
                            {/* Comment Header */}
                            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                <Link
                                    href={`/kullanici/${comment.profiles?.username}`}
                                    className="font-bold text-sm hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    @{comment.profiles?.username || "Anonim"}
                                    {comment.profiles?.is_verified && (
                                        <BadgeCheck className="h-3 w-3 text-blue-500 fill-blue-500/10" />
                                    )}
                                </Link>
                                <span className="text-muted-foreground text-xs font-medium">·</span>
                                <span className="text-xs text-muted-foreground hover:underline decoration-muted-foreground/50 underline-offset-2 transition-all">
                                    {formatDistanceToNow(new Date(comment.created_at), { locale: tr })}
                                </span>
                            </div>

                            {/* Content */}
                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words font-medium">
                                {comment.content}
                            </p>

                            {/* Actions Footer */}
                            <div className="flex items-center gap-4 mt-2">
                                <CommentLikeButton
                                    commentId={comment.id}
                                    initialLikeCount={comment.likeCount || 0}
                                    initialIsLiked={comment.isLiked || false}
                                    isLoggedIn={!!currentUserId}
                                />

                                {(currentUserId === comment.author_id || isAdmin) && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="text-xs text-muted-foreground hover:text-destructive font-medium transition-colors">
                                                Sil
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Yorumu silmek istiyor musunuz?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bu işlem geri alınamaz.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    disabled={isDeleting === comment.id}
                                                >
                                                    {isDeleting === comment.id ? "Siliniyor..." : "Sil"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
