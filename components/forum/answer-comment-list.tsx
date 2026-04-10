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
import { isAdminEmail } from "@/lib/admin";

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
    currentUserEmail?: string;
    questionId: number;
    onDelete: (commentId: number) => void;
}

export function AnswerCommentList({ comments, currentUserId, currentUserEmail, questionId, onDelete }: AnswerCommentListProps) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const isAdmin = isAdminEmail(currentUserEmail);

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
                    <div key={comment.id} className="group relative p-3 sm:p-4 mb-2.5 border-[2px] border-black/15 dark:border-zinc-700/60 bg-neutral-50/80 dark:bg-zinc-900/40 rounded-lg">
                        <div className="flex items-start gap-2 sm:gap-3 h-full">

                            {/* Avatar & Thread Line Column */}
                            <div className="flex flex-col items-center shrink-0 h-full">
                                <Link prefetch={false} href={`/kullanici/${comment.profiles?.username}`} className="relative z-10 shrink-0">
                                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-[2px] border-black/20 dark:border-zinc-600 rounded-full">
                                        <AvatarImage src={comment.profiles?.avatar_url || ""} className="object-cover" />
                                        <AvatarFallback className="text-[10px] font-black bg-[#FFBD2E]/30 text-black dark:text-zinc-100 dark:bg-[#FFBD2E]/20">
                                            {comment.profiles?.username?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>

                                {!isLast && (
                                    <div className="w-[2px] bg-neutral-200 dark:bg-zinc-700/50 grow mt-2 mb-[-10px] sm:mb-[-14px] hidden sm:block rounded-full" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5">
                                {/* Comment Header */}
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <Link prefetch={false} href={`/kullanici/${comment.profiles?.username}`}
                                        className="font-bold text-sm hover:text-[#FFBD2E] transition-colors flex items-center gap-1"
                                    >
                                        @{comment.profiles?.username || "Anonim"}
                                        {comment.profiles?.is_verified && (
                                            <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                        )}
                                    </Link>
                                    <span className="text-neutral-300 dark:text-zinc-600 text-xs">·</span>
                                    <span className="text-[11px] text-neutral-400 dark:text-zinc-500 font-medium">
                                        {formatDistanceToNow(new Date(comment.created_at), { locale: tr, addSuffix: true })}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                                    {comment.content}
                                </p>

                                {/* Actions Footer */}
                                <div className="flex items-center gap-4 mt-1.5">
                                    <CommentLikeButton
                                        commentId={comment.id}
                                        initialLikeCount={comment.likeCount || 0}
                                        initialIsLiked={comment.isLiked || false}
                                        isLoggedIn={!!currentUserId}
                                    />

                                    {(currentUserId === comment.author_id || isAdmin) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="text-xs text-red-400 dark:text-red-500/60 font-bold hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                                    Sil
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.06)]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="font-black uppercase text-xl">Yorumu silmek istiyor musunuz?</AlertDialogTitle>
                                                    <AlertDialogDescription className="font-medium text-neutral-500 dark:text-zinc-400">
                                                        Bu işlem geri alınamaz.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="border-[2px] border-black dark:border-zinc-600 rounded-lg font-bold uppercase shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)]">İptal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(comment.id)}
                                                        className="bg-red-500 text-white hover:bg-red-600 border-[2px] border-black dark:border-red-600 rounded-lg font-bold uppercase shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#000] transition-all"
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
