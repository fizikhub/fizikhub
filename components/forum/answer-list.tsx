"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
const MarkdownEditor = lazy(() => import("@/components/markdown-editor").then(mod => ({ default: mod.MarkdownEditor })));
import dynamic from "next/dynamic";
const MarkdownRenderer = dynamic(() => import("@/components/markdown-renderer").then(mod => mod.MarkdownRenderer), {
    loading: () => <p className="text-sm text-muted-foreground animate-pulse">İçerik yükleniyor...</p>
});
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { User, MessageSquare, BadgeCheck, CheckCircle2, ThumbsUp, ArrowBigUp, ArrowBigDown, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAnswer, toggleAnswerAcceptance } from "@/app/forum/actions";
import { Database } from "@/types/database";
import { DeleteAnswerButton } from "@/components/forum/delete-answer-button";
import { ReportDialog } from "@/components/report-dialog";
import { Flag } from "lucide-react";
import { AnswerLikeButton } from "@/components/forum/answer-like-button";
import { RealtimeCommentList } from "@/components/forum/realtime-comment-list";
import { AnswerCommentForm } from "@/components/forum/answer-comment-form";
import { cn } from "@/lib/utils";

type Answer = Database['public']['Tables']['answers']['Row'] & {
    is_accepted: boolean | null;
    profiles: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        is_verified?: boolean | null;
    } | null;
    likeCount?: number;
    isLiked?: boolean;
    comments?: any[];
};

interface AnswerListProps {
    questionId: number;
    initialAnswers: Answer[];
    questionAuthorId: string;
    currentUser: any;
}

export function AnswerList({ questionId, initialAnswers, questionAuthorId, currentUser }: AnswerListProps) {
    const sortedAnswers = [...initialAnswers].sort((a, b) => {
        if (a.is_accepted === b.is_accepted) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return a.is_accepted ? -1 : 1;
    });

    const [answers, setAnswers] = useState<Answer[]>(sortedAnswers);
    const [newAnswer, setNewAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(currentUser);
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const [expandedAnswers, setExpandedAnswers] = useState<Record<number, boolean>>({});
    const [supabase] = useState(() => createClient());

    const toggleAnswerExpand = (answerId: number) => {
        setExpandedAnswers(prev => ({
            ...prev,
            [answerId]: !prev[answerId]
        }));
    };

    const toggleComments = (answerId: number) => {
        setExpandedComments(prev => ({
            ...prev,
            [answerId]: !prev[answerId]
        }));
    };

    const handleCommentAdded = (answerId: number, comment: any) => {
        setAnswers(prev => prev.map(a => {
            if (a.id === answerId) {
                return {
                    ...a,
                    comments: [...(a.comments || []), comment]
                };
            }
            return a;
        }));
        setExpandedComments(prev => ({ ...prev, [answerId]: false }));
    };

    const handleCommentDeleted = (answerId: number, commentId: number) => {
        setAnswers(prev => prev.map(a => {
            if (a.id === answerId) {
                return {
                    ...a,
                    comments: (a.comments || []).filter(c => c.id !== commentId)
                };
            }
            return a;
        }));
    };

    useEffect(() => {
        // Only verify session on client side if props are stale (though props update on navigation)
        // But mainly listen for changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        const channel = supabase
            .channel(`answers_${questionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'answers',
                    filter: `question_id=eq.${questionId}`
                },
                async (payload) => {
                    const { data: newAnswer } = await supabase
                        .from('answers')
                        .select(`
                            *,
                            profiles (
                                username,
                                full_name,
                                avatar_url,
                                is_verified
                            )
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (newAnswer) {
                        setAnswers((current) => {
                            if (current.some(a => a.id === newAnswer.id)) return current;
                            return [...current, { ...newAnswer, comments: [] }];
                        });
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'answers',
                    filter: `question_id=eq.${questionId}`
                },
                (payload) => {
                    setAnswers((current) =>
                        current.map((a) =>
                            a.id === payload.new.id
                                ? { ...a, ...payload.new }
                                : a
                        )
                    );
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'answers',
                    filter: `question_id=eq.${questionId}`
                },
                (payload) => {
                    setAnswers((current) =>
                        current.filter((a) => a.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, [supabase, questionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Cevap yazmak için giriş yapmalısınız.");
            return;
        }
        if (!newAnswer.trim()) return;

        setIsSubmitting(true);
        try {
            const result = await createAnswer({
                content: newAnswer,
                questionId: questionId
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            if (result.data) {
                setAnswers([...answers, result.data]);
            }
            setNewAnswer("");
            toast.success("Cevabınız gönderildi!");
        } catch (error: any) {
            toast.error("Hata: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleAccept = async (answerId: number) => {
        try {
            const result = await toggleAnswerAcceptance(answerId, questionId);
            if (!result.success) throw new Error(result.error);

            setAnswers(answers.map(a => {
                if (a.id === answerId) {
                    return { ...a, is_accepted: !a.is_accepted };
                }
                if (!answers.find(ans => ans.id === answerId)?.is_accepted) {
                    return { ...a, is_accepted: false };
                }
                return a;
            }).sort((a, b) => {
                if (a.id === answerId && !a.is_accepted) return -1;
                if (b.id === answerId && !b.is_accepted) return 1;
                if (a.is_accepted === b.is_accepted) return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                return a.is_accepted ? -1 : 1;
            }));

            toast.success("İşlem başarılı!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-0">
            {/* New Answer Form - MOVED TO TOP */}
            {user ? (
                <div id="answer-form" className="mb-8 pt-2 sm:px-0">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="hidden sm:block">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-[3px] border-black rounded-full shadow-[2px_2px_0_0_#000] bg-white">
                                <AvatarImage src={user.user_metadata?.avatar_url || ""} className="object-cover" />
                                <AvatarFallback className="bg-white text-black font-black">
                                    {user.user_metadata?.username?.[0]?.toUpperCase() || "S"}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                            {/* Simplified Header */}
                            <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black mb-3 text-black dark:text-white uppercase tracking-tighter">
                                Senin Görüşün Ne?
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="border-[3px] border-black bg-white dark:bg-black rounded-[8px] overflow-hidden focus-within:shadow-[4px_4px_0_0_#000] transition-all shadow-[2px_2px_0_0_#000]">
                                    <Suspense fallback={<div className="p-4 text-black dark:text-white font-bold uppercase text-xs">Editör yükleniyor...</div>}>
                                        <MarkdownEditor
                                            value={newAnswer}
                                            onChange={setNewAnswer}
                                            placeholder="Tartışmaya katıl..."
                                            minHeight="140px"
                                        />
                                    </Suspense>
                                </div>
                                <div className="flex justify-end">
                                    <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !newAnswer.trim()}
                                            className="w-full px-8 py-6 rounded-[8px] font-black uppercase tracking-widest bg-neo-pink text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm sm:text-base"
                                        >
                                            {isSubmitting ? "GÖNDERİLİYOR..." : "YANITLA"}
                                        </Button>
                                    </motion.div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-6 bg-white dark:bg-[#18181b] border-[3px] border-black rounded-[8px] text-center shadow-[4px_4px_0_0_#000]">
                    <div className="max-w-sm mx-auto space-y-4">
                        <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-black uppercase text-black dark:text-white">Tartışmaya Katıl</h3>
                        <p className="text-black dark:text-zinc-400 font-bold uppercase text-xs tracking-wider">Bu soruya cevap vermek veya yorum yapmak için giriş yapmalısın.</p>
                        <Button className="w-full font-black uppercase tracking-widest rounded-[4px] h-12 bg-white text-black border-[3px] border-black shadow-[2px_2px_0_0_#000] hover:bg-[#FFBD2E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" asChild>
                            <a href="/login">Giriş Yap / Kayıt Ol</a>
                        </Button>
                    </div>
                </div>
            )}

            {/* Answer List */}
            <div className="relative space-y-4">
                <AnimatePresence mode="popLayout">
                    {answers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="py-12 bg-white dark:bg-[#27272a] border-[3px] border-black rounded-[8px] shadow-[4px_4px_0_0_#000] text-center"
                        >
                            <div className="bg-[#FFBD2E] border-[3px] border-black w-14 h-14 rounded-[8px] flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0_0_#000] -rotate-3">
                                <MessageSquare className="h-6 w-6 text-black stroke-[3px]" />
                            </div>
                            <h3 className="font-[family-name:var(--font-outfit)] text-xl font-black uppercase text-black dark:text-zinc-50 mb-1">Henüz cevap yok</h3>
                            <p className="text-black dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">İlk cevabı sen ver!</p>
                        </motion.div>
                    ) : (
                        answers.map((answer, index) => (
                            <motion.div
                                key={answer.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.05}
                                whileDrag={{ scale: 0.98, zIndex: 10 }}
                                id={`answer-${answer.id}`}
                                className={cn(
                                    "group relative transition-all duration-300 mb-6 bg-white dark:bg-[#27272a] border-[3px] border-black rounded-[8px] shadow-[4px_4px_0_0_#000]",
                                    answer.is_accepted && "bg-[#E5F5E0] dark:bg-[#1A251B] border-green-600"
                                )}
                            >
                                {/* Thread Line - Connecting to next item if needed, currently just visual marker */}
                                {/* <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-border/40 group-hover:bg-border/60 transition-colors" /> */}

                                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 py-4 px-4 sm:px-5">
                                    {/* Left: Avatar column */}
                                    <div className="hidden sm:flex flex-col items-center shrink-0">
                                        <Link prefetch={false} href={`/kullanici/${answer.profiles?.username}`} className="relative z-10">
                                            <Avatar className={cn(
                                                "h-10 w-10 border-[3px] border-black rounded-full shadow-[2px_2px_0_0_#000] bg-white transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000]"
                                            )}>
                                                <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                                <AvatarFallback className="bg-white text-black font-black text-sm">
                                                    {answer.profiles?.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>

                                        {/* Thread Line - Connecting answer to comments */}
                                        {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                            <div className="w-[3px] bg-black dark:bg-zinc-700 grow mt-4 mb-2 rounded-full hidden sm:block" />
                                        )}
                                    </div>

                                    {/* Right: Content column */}
                                    <div className="flex-1 min-w-0 flex flex-col pt-1 sm:pt-0 pb-1">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center flex-wrap gap-2">
                                                {/* Mobile Avatar (Visible only on small screens next to name) */}
                                                <Link prefetch={false} href={`/kullanici/${answer.profiles?.username}`} className="sm:hidden relative z-10">
                                                    <Avatar className="h-8 w-8 border-[2px] border-black rounded-full shadow-[1px_1px_0_0_#000] bg-white">
                                                        <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                                        <AvatarFallback className="bg-white text-black font-black text-xs">
                                                            {answer.profiles?.username?.[0]?.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Link>

                                                <Link prefetch={false} href={`/kullanici/${answer.profiles?.username}`}
                                                    className="font-black text-sm uppercase text-black dark:text-zinc-50 hover:bg-[#FFBD2E] hover:text-black transition-colors px-1 -ml-1 rounded flex items-center gap-1"
                                                >
                                                    @{answer.profiles?.username || "Anonim"}
                                                    {answer.profiles?.is_verified && (
                                                        <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                                    )}
                                                </Link>
                                                <span className="text-black dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest hidden sm:inline">·</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-zinc-400">
                                                    {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}
                                                </span>
                                                {answer.is_accepted && (
                                                    <span className="flex items-center gap-1 text-black bg-[#4ADE80] border-2 border-black border-dashed px-2 py-0.5 rounded-[4px] text-[10px] sm:text-xs font-black uppercase ml-1 sm:ml-2 shadow-[2px_2px_0_0_#000]">
                                                        <CheckCircle2 className="h-3 w-3 stroke-[3px]" />
                                                        ÇÖZÜM
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions Menu */}
                                            <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity gap-1">
                                                {(user?.id === questionAuthorId || ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'].includes(user?.email?.toLowerCase())) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggleAccept(answer.id)}
                                                        className={cn(
                                                            "h-8 w-8 rounded-[4px] border-2 border-black transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none shadow-[1px_1px_0_0_#000]",
                                                            answer.is_accepted ? "bg-[#4ADE80] text-black" : "bg-white text-black hover:bg-green-100"
                                                        )}
                                                        title={answer.is_accepted ? "Çözümü kaldır" : "Çözüm olarak işaretle"}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 stroke-[3px]" />
                                                    </Button>
                                                )}

                                                {(user?.id === answer.author_id || user?.email?.includes('admin')) && (
                                                    <DeleteAnswerButton
                                                        answerId={answer.id}
                                                        questionId={questionId}
                                                        authorId={answer.author_id}
                                                    />
                                                )}

                                                <ReportDialog
                                                    resourceId={answer.id}
                                                    resourceType="answer"
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-black bg-white border-2 border-black rounded-[4px] hover:bg-neo-pink hover:text-white shadow-[1px_1px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                                            <Flag className="h-4 w-4 stroke-[2.5px]" />
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Content with Read More logic */}
                                        <div className="mb-4 sm:mb-6 relative group/content transition-all">
                                            <div className={cn(
                                                "prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none text-black dark:text-zinc-300 font-[family-name:var(--font-inter)] font-medium leading-relaxed transition-all duration-300",
                                                !expandedAnswers[answer.id] && answer.content.length > 500 ? "max-h-[350px] sm:max-h-[220px] overflow-hidden" : ""
                                            )}>
                                                <MarkdownRenderer content={answer.content} />
                                            </div>

                                            {!expandedAnswers[answer.id] && answer.content.length > 500 && (
                                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#27272a] via-white/80 dark:via-[#27272a]/80 to-transparent flex items-end justify-center pb-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => toggleAnswerExpand(answer.id)}
                                                        className="rounded-[4px] bg-[#FFBD2E] border-[3px] border-black shadow-[4px_4px_0_0_#000] font-black uppercase text-black hover:text-black hover:bg-[#FFD268] px-8 h-12 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] z-20"
                                                    >
                                                        Devamını Oku
                                                    </Button>
                                                </div>
                                            )}

                                            {expandedAnswers[answer.id] && answer.content.length > 500 && (
                                                <div className="flex justify-end mt-4">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => toggleAnswerExpand(answer.id)}
                                                        className="font-black uppercase text-xs tracking-widest text-black dark:text-white border-2 border-black rounded-[4px] bg-neutral-100 dark:bg-black shadow-[2px_2px_0_0_#000] hover:bg-neutral-200 dark:hover:bg-neutral-900 transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                                                    >
                                                        Daralt
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Bar (Neo-brutalist) */}
                                        <div className="flex items-center justify-between sm:justify-start gap-3 mt-4 sm:mt-0 pt-3 border-t-[3px] border-black mx-[-16px] px-4 sm:mx-[0] sm:px-0 sm:border-none sm:pt-0">
                                            <div className="flex items-center group/like">
                                                <AnswerLikeButton answerId={answer.id} initialLikeCount={answer.likeCount || 0} initialIsLiked={answer.isLiked || false} isLoggedIn={!!user} />
                                            </div>

                                            {/* Reply Group */}
                                            <div className="flex items-center group/reply">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex items-center gap-1.5 px-4 h-10 border-2 border-black bg-white dark:bg-black rounded-[4px] font-black uppercase tracking-widest text-[10px] text-black dark:text-white shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-neo-blue transition-all"
                                                    onClick={() => toggleComments(answer.id)}
                                                >
                                                    <MessageSquare className="h-4 w-4 stroke-[3px]" />
                                                    <span>
                                                        {answer.comments && answer.comments.length > 0
                                                            ? answer.comments.length
                                                            : "YANITLA"}
                                                    </span>
                                                </Button>
                                            </div>

                                            {/* Share placeholder */}
                                            <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-black bg-neutral-100 dark:bg-[#18181b] rounded-[4px] text-black dark:text-white shadow-[2px_2px_0_0_#000] hover:bg-neo-pink hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ml-auto sm:ml-0">
                                                <Share2 className="h-4 w-4 stroke-[2.5px]" />
                                            </Button>
                                        </div>

                                        {/* Expanded Comments */}
                                        {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                            <div className="mt-4 pl-2 sm:pl-4 pt-2 relative">
                                                {/* Show comments here */}
                                                <RealtimeCommentList
                                                    answerId={answer.id}
                                                    initialComments={answer.comments || []}
                                                    currentUserId={user?.id}
                                                    questionId={questionId}
                                                    onDelete={(commentId) => handleCommentDeleted(answer.id, commentId)}
                                                    onCommentsChange={(comments) => {
                                                        setAnswers(prev => prev.map(a => {
                                                            if (a.id === answer.id) {
                                                                if (JSON.stringify(a.comments) !== JSON.stringify(comments)) {
                                                                    return { ...a, comments };
                                                                }
                                                            }
                                                            return a;
                                                        }));
                                                    }}
                                                />

                                                {expandedComments[answer.id] && (
                                                    <div className="mt-3 relative z-10">
                                                        <AnswerCommentForm
                                                            answerId={answer.id}
                                                            questionId={questionId}
                                                            onCommentAdded={(comment) => handleCommentAdded(answer.id, comment)}
                                                            onCancel={() => toggleComments(answer.id)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
