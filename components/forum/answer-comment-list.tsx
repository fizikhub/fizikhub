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
        <div className="space-y-0 relative mt-1">
            {comments.map((comment, index) => {
                const isLast = index === comments.length - 1;
                return (
                    <div key={comment.id} className="group relative p-3 sm:p-4 mb-3 border-[2px] border-black bg-white dark:bg-[#18181b] rounded-[4px] shadow-[2px_2px_0_0_#000]">
                        <div className="flex items-start gap-2 sm:gap-3 h-full">

                            {/* Avatar & Thread Line Column */}
                            <div className="flex flex-col items-center shrink-0 h-full">
                                <Link prefetch={false} href={`/kullanici/${comment.profiles?.username}`} className="relative z-10 shrink-0">
                                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-[2px] border-black rounded-[4px]">
                                        <AvatarImage src={comment.profiles?.avatar_url || ""} className="rounded-[2px] object-cover" />
                                        <AvatarFallback className="text-[10px] font-black bg-[#FFBD2E] text-black">
                                            {comment.profiles?.username?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>

                                {!isLast && (
                                    <div className="w-[3px] bg-black/20 group-hover:bg-neo-pink transition-colors grow mt-2 mb-[-12px] sm:mb-[-16px] hidden sm:block" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5">
                                {/* Comment Header */}
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <Link prefetch={false} href={`/kullanici/${comment.profiles?.username}`}
                                        className="font-black text-sm hover:text-neo-pink transition-colors uppercase tracking-wide flex items-center gap-1"
                                    >
                                        @{comment.profiles?.username || "Anonim"}
                                        {comment.profiles?.is_verified && (
                                            <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                        )}
                                    </Link>
                                    <span className="text-black/30 dark:text-zinc-500 text-xs font-black">/</span>
                                    <span className="text-xs text-muted-foreground font-bold tracking-wider uppercase">
                                        {formatDistanceToNow(new Date(comment.created_at), { locale: tr })}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words font-medium">
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
                                                <button className="text-xs text-red-500 font-bold tracking-widest uppercase hover:underline underline-offset-4 decoration-[2px]">
                                                    Sil
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="border-[3px] border-black rounded-[4px] shadow-[8px_8px_0_0_#000]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="font-black uppercase text-xl">Yorumu silmek istiyor musunuz?</AlertDialogTitle>
                                                    <AlertDialogDescription className="font-bold">
                                                        Bu işlem geri alınamaz ve neo-dünyadan temelli silinir.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="border-[2px] border-black rounded-[4px] font-black uppercase shadow-[2px_2px_0_0_#000]">İptal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(comment.id)}
                                                        className="bg-red-500 text-white hover:bg-red-600 border-[2px] border-black rounded-[4px] font-black uppercase shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
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
                );
            })}
        </div>
    );
}
