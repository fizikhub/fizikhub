"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Reply } from "lucide-react";
import { deleteComment } from "@/app/makale/[slug]/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CommentItemProps {
    comment: {
        id: number;
        content: string;
        created_at: string;
        parent_comment_id: number | null;
        profiles: {
            username: string;
            full_name: string | null;
            avatar_url: string | null;
        };
    };
    allComments: CommentItemProps['comment'][];
    isAdmin: boolean;
    currentUsername?: string | null;
    onReply: (commentId: number) => void;
    isReply?: boolean;
    replyingToUsername?: string | null;
}

// Helper to recursively collect all descendants of a comment to flatten them under the top-level parent
const getAllDescendants = (parentId: number, list: any[]): any[] => {
    const directReplies = list.filter(c => c.parent_comment_id === parentId);
    return directReplies.reduce((acc, reply) => {
        return [...acc, reply, ...getAllDescendants(reply.id, list)];
    }, [] as any[]).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};

export function CommentItem({ 
    comment, 
    allComments, 
    isAdmin, 
    currentUsername, 
    onReply, 
    isReply = false,
    replyingToUsername = null 
}: CommentItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine replies list:
    // If this is a reply itself, we flatten the tree and do not render sub-replies recursively.
    // If it's a top-level comment, we collect all descendants in its tree.
    const replies = !isReply ? getAllDescendants(comment.id, allComments) : [];

    // Determine which replies to show in the flat list
    const visibleReplies = showAllReplies ? replies : replies.slice(0, 3);
    const hiddenReplyCount = replies.length - visibleReplies.length;

    // Check ownership & delete rights
    const isOwner = currentUsername && comment.profiles.username === currentUsername;
    const canDelete = isAdmin || isOwner;

    const handleDelete = async () => {
        if (!confirm("Bu yorumu silmek istediğinizden emin misiniz?")) return;

        setIsDeleting(true);
        const result = await deleteComment(comment.id);

        if (result.success) {
            toast.success("Yorum silindi");
            router.refresh(); // Refresh page to reflect deletion immediately
        } else {
            toast.error(result.error || "Bir hata oluştu");
            setIsDeleting(false);
        }
    };

    return (
        <div className="group">
            <div className="flex gap-3 sm:gap-4">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-black dark:border-zinc-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] flex-shrink-0">
                    <AvatarImage src={comment.profiles.avatar_url || ""} />
                    <AvatarFallback className="text-sm font-black bg-yellow-400 text-black">
                        {comment.profiles.full_name?.[0] || comment.profiles.username[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-[15px] sm:text-lg tracking-tight text-foreground leading-none">
                            {comment.profiles.full_name || comment.profiles.username}
                        </span>
                        
                        {replyingToUsername && (
                            <span className="text-[10px] font-extrabold text-[#23A9FA] dark:text-[#EAB308] bg-[#23A9FA]/10 dark:bg-[#EAB308]/10 border border-[#23A9FA]/20 dark:border-[#EAB308]/20 px-2 py-0.5 rounded-md text-xs">
                                @{replyingToUsername} kullanıcısına yanıt
                            </span>
                        )}

                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-black/10 dark:border-white/10 mt-[2px]">
                            {mounted 
                                ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })
                                : "..."
                            }
                        </span>
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-foreground sm:text-lg break-words">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-2 sm:gap-4 pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReply(comment.id)}
                            className="min-h-[44px] min-w-[44px] p-2 px-3 -ml-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-[#EAB308] hover:bg-[#EAB308]/10 transition-colors"
                        >
                            <Reply className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 stroke-[3px]" />
                            Yanıtla
                        </Button>

                        {canDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="min-h-[44px] min-w-[44px] p-2 px-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all rounded-md"
                            >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 stroke-[3px]" />
                                {isDeleting ? "Siliniyor..." : "Sil"}
                            </Button>
                        )}
                    </div>

                    {/* Flat list of replies (indented only once, perfectly responsive on mobile) */}
                    {replies && replies.length > 0 && (
                        <div className="mt-4 ml-2 sm:ml-4 pl-4 sm:pl-6 space-y-5 border-l-[3px] border-black/10 dark:border-white/10">
                            {visibleReplies.map((reply) => {
                                const parent = allComments.find(c => c.id === reply.parent_comment_id);
                                const parentUser = parent ? (parent.profiles.full_name || parent.profiles.username) : null;
                                
                                return (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        allComments={allComments}
                                        isAdmin={isAdmin}
                                        currentUsername={currentUsername}
                                        onReply={onReply}
                                        isReply={true}
                                        replyingToUsername={parentUser}
                                    />
                                );
                            })}

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
