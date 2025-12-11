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
        <div className="space-y-3 mt-4">
            {comments.map((comment) => (
                <div key={comment.id} className="group bg-secondary/30 rounded-lg p-3 border-2 border-border/40 hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-2.5">
                        <Link href={`/kullanici/${comment.profiles?.username}`}>
                            <Avatar className="h-7 w-7 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                <AvatarImage src={comment.profiles?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                                    {comment.profiles?.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Link
                                    href={`/kullanici/${comment.profiles?.username}`}
                                    className="font-heading font-bold text-xs hover:text-primary transition-colors"
                                >
                                    @{comment.profiles?.username || "Anonim"}
                                </Link>
                                {comment.profiles?.is_verified && (
                                    <BadgeCheck className="h-3 w-3 text-blue-500 fill-blue-500/10" />
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                    • {formatDistanceToNow(new Date(comment.created_at), { locale: tr })}
                                </span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed mb-2">
                                {comment.content}
                            </p>

                            {/* Like button */}
                            <CommentLikeButton
                                commentId={comment.id}
                                initialLikeCount={comment.likeCount || 0}
                                initialIsLiked={comment.isLiked || false}
                                isLoggedIn={!!currentUserId}
                            />
                        </div>

                        {(currentUserId === comment.author_id || isAdmin) && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive border-2 border-transparent hover:border-destructive/40 rounded-lg active:scale-95"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
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
            ))}
        </div>
    );
}
