"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
const MarkdownEditor = lazy(() => import("@/components/markdown-editor").then(mod => ({ default: mod.MarkdownEditor })));
import dynamic from "next/dynamic";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { User, MessageSquare, BadgeCheck, ThumbsUp, ArrowBigUp, ArrowBigDown, Share2, Flame, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAnswer } from "@/app/forum/actions";
import { Database } from "@/types/database";
import { DeleteAnswerButton } from "@/components/forum/delete-answer-button";
import { ReportDialog } from "@/components/report-dialog";
import { Flag } from "lucide-react";
import { AnswerLikeButton } from "@/components/forum/answer-like-button";
import { RealtimeCommentList } from "@/components/forum/realtime-comment-list";
import { AnswerCommentForm } from "@/components/forum/answer-comment-form";
import { ShareDrawer } from "@/components/forum/share-drawer";
import { cn } from "@/lib/utils";
import { isAdminEmail } from "@/lib/admin-shared";

type PublicProfile = {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_verified?: boolean | null;
};

type RawAnswer = Database['public']['Tables']['answers']['Row'] & {
    is_accepted: boolean | null;
    votes?: number | null;
    updated_at?: string | null;
    profiles: PublicProfile | PublicProfile[] | null;
    likeCount?: number;
    isLiked?: boolean;
    comments?: any[];
};

type Answer = Omit<RawAnswer, "author_id" | "profiles"> & {
    profiles: PublicProfile | null;
    canDelete?: boolean;
};

interface AnswerListProps {
    questionId: number;
    initialAnswers: Answer[];
    currentUser: any;
}

function getPublicProfile(profile: PublicProfile | PublicProfile[] | null | undefined): PublicProfile | null {
    return Array.isArray(profile) ? profile[0] || null : profile || null;
}

function toClientAnswer(answer: RawAnswer | (Omit<RawAnswer, "author_id"> & { author_id?: string; canDelete?: boolean }), user: any): Answer {
    const { author_id, profiles, canDelete, ...clientAnswer } = answer as RawAnswer & { canDelete?: boolean };

    return {
        ...clientAnswer,
        profiles: getPublicProfile(profiles),
        canDelete: canDelete ?? (user?.id === author_id || isAdminEmail(user?.email)),
    };
}

export function AnswerList({ questionId, initialAnswers, currentUser }: AnswerListProps) {
    type SortOption = "newest" | "popular";
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
    const [newAnswer, setNewAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(currentUser);
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const [expandedAnswers, setExpandedAnswers] = useState<Record<number, boolean>>({});
    const [supabase] = useState(() => createClient());

    const displayedAnswers = [...answers].sort((a, b) => {

        if (sortBy === "newest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
            const likeA = a.likeCount || 0;
            const likeB = b.likeCount || 0;
            if (likeA !== likeB) return likeB - likeA;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

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
                        .maybeSingle();

                    if (newAnswer) {
                        setAnswers((current) => {
                            if (current.some(a => a.id === newAnswer.id)) return current;
                            return [...current, toClientAnswer({ ...newAnswer, comments: [] } as RawAnswer, user)];
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
                    const { author_id: removedAuthorId, profiles, ...clientUpdate } = payload.new as Partial<RawAnswer>;
                    void removedAuthorId;
                    const normalizedUpdate = {
                        ...clientUpdate,
                        ...(profiles !== undefined ? { profiles: getPublicProfile(profiles) } : {}),
                    } as Partial<Answer>;
                    setAnswers((current) =>
                        current.map((a) =>
                            a.id === payload.new.id
                                ? { ...a, ...normalizedUpdate }
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
    }, [supabase, questionId, user]);

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
                setAnswers((current) => [
                    ...current,
                    toClientAnswer({ ...result.data, comments: [] } as unknown as RawAnswer & { canDelete?: boolean }, user)
                ]);
            }
            setNewAnswer("");
            toast.success("Cevabınız gönderildi!");
        } catch (error: any) {
            toast.error("Hata: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="space-y-0">
            {/* New Answer Form - MOVED TO TOP */}
            {user ? (
                <div id="answer-form" className="mb-8 pt-2 sm:px-0">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="hidden sm:block">
                            <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border-[2px] border-black dark:border-zinc-600 rounded-full shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] bg-white">
                                <AvatarImage src={user.user_metadata?.avatar_url || ""} className="object-cover" />
                                <AvatarFallback className="bg-white dark:bg-zinc-800 text-black dark:text-white font-black">
                                    {user.user_metadata?.username?.[0]?.toUpperCase() || "S"}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                            {/* Simplified Header */}
                            <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black mb-3 text-black dark:text-white uppercase tracking-tighter">
                                Senin Görüşün Ne?
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="border-[2.5px] border-black dark:border-zinc-700 bg-white dark:bg-[#1a1a1d] rounded-[10px] overflow-hidden focus-within:shadow-[4px_4px_0_0_#000] dark:focus-within:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)] transition-all shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)]">
                                    <Suspense fallback={<div className="p-4 text-black dark:text-zinc-400 font-medium text-sm">Editör yükleniyor...</div>}>
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
                                            className="w-full px-8 py-5 rounded-[10px] font-black uppercase tracking-widest bg-[#FFBD2E] text-black border-[2.5px] border-black dark:border-zinc-700 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all text-sm"
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
                <div className="mb-8 p-6 bg-white dark:bg-[#1e1e21] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] text-center shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)]">
                    <div className="max-w-sm mx-auto space-y-4">
                        <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black uppercase text-black dark:text-white">Tartışmaya Katıl</h3>
                        <p className="text-neutral-500 dark:text-zinc-400 font-medium text-sm">Bu soruya cevap vermek veya yorum yapmak için giriş yapmalısın.</p>
                        <Button className="w-full font-black uppercase tracking-widest rounded-lg h-11 bg-white dark:bg-zinc-800 text-black dark:text-white border-[2.5px] border-black dark:border-zinc-600 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:bg-[#FFBD2E] hover:text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all" asChild>
                            <Link href="/login">Giriş Yap / Kayıt Ol</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Sorting Tabs (Neo-Brutalist Folders) */}
            {answers.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-end px-2 sm:px-4 -mb-[2.5px] relative z-10 w-full overflow-x-auto hide-scrollbar">
                        <button
                            onClick={() => setSortBy("newest")}
                            className={cn(
                                "flex flex-shrink-0 items-center gap-2 px-4 sm:px-6 font-black uppercase text-xs sm:text-sm tracking-wider border-[2.5px] border-black dark:border-zinc-700 rounded-t-[10px] transition-all",
                                sortBy === "newest"
                                    ? "bg-[#FFBD2E] text-black border-b-transparent pt-3 pb-3 sm:pt-3.5 sm:pb-3.5 z-10"
                                    : "bg-neutral-200 dark:bg-[#1e1e21] text-neutral-500 dark:text-zinc-500 hover:bg-neutral-300 dark:hover:bg-zinc-800 border-b-black dark:border-b-zinc-700 pt-2 sm:pt-2.5 pb-2 sm:pb-2.5 z-0"
                            )}
                        >
                            <Clock className="w-3.5 h-3.5 stroke-[3px]" />
                            En Yeni
                        </button>
                        <button
                            onClick={() => setSortBy("popular")}
                            className={cn(
                                "flex flex-shrink-0 items-center gap-2 px-4 sm:px-6 font-black uppercase text-xs sm:text-sm tracking-wider border-[2.5px] border-black dark:border-zinc-700 rounded-t-[10px] transition-all -ml-[2.5px]",
                                sortBy === "popular"
                                    ? "bg-neo-pink text-white border-b-transparent pt-3 pb-3 sm:pt-3.5 sm:pb-3.5 z-10"
                                    : "bg-neutral-200 dark:bg-[#1e1e21] text-neutral-500 dark:text-zinc-500 hover:bg-neutral-300 dark:hover:bg-zinc-800 border-b-black dark:border-b-zinc-700 pt-2 sm:pt-2.5 pb-2 sm:pb-2.5 z-0"
                            )}
                        >
                            <Flame className="w-3.5 h-3.5 stroke-[3px]" />
                            En Popüler
                        </button>
                    </div>
                    <div className="w-full h-[2.5px] bg-black dark:bg-zinc-700 mb-6 relative z-0"></div>
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
                            className="py-12 bg-white dark:bg-[#1e1e21] border-[2.5px] border-dashed border-black/30 dark:border-zinc-600 rounded-[10px] text-center"
                        >
                            <div className="bg-[#FFBD2E]/20 border-[2px] border-black dark:border-zinc-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] -rotate-3">
                                <MessageSquare className="h-6 w-6 text-black dark:text-zinc-300 stroke-[2.5px]" />
                            </div>
                            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-black uppercase text-black dark:text-zinc-100 mb-1">Henüz cevap yok</h3>
                            <p className="text-neutral-500 dark:text-zinc-500 text-sm font-medium">İlk cevabı sen ver!</p>
                        </motion.div>
                    ) : (
                        displayedAnswers.map((answer, index) => (
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
                                className="group relative transition-all duration-300 mb-5 bg-white dark:bg-[#1e1e21] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)]"
                            >
                                {/* Thread Line - Connecting to next item if needed, currently just visual marker */}
                                {/* <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-border/40 group-hover:bg-border/60 transition-colors" /> */}

                                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 py-4 px-4 sm:px-5">
                                    {/* Left: Avatar column */}
                                    <div className="hidden sm:flex flex-col items-center shrink-0">
                                        <Link prefetch={false} href={`/kullanici/${answer.profiles?.username}`} className="relative z-10">
                                            <Avatar className={cn(
                                                "h-9 w-9 border-[2px] border-black dark:border-zinc-600 rounded-full shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] bg-white transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000]"
                                            )}>
                                                <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                                <AvatarFallback className="bg-white dark:bg-zinc-800 text-black dark:text-white font-black text-xs">
                                                    {answer.profiles?.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>

                                        {/* Thread Line */}
                                        {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                            <div className="w-[2px] bg-neutral-300 dark:bg-zinc-700 grow mt-3 mb-2 rounded-full hidden sm:block" />
                                        )}
                                    </div>

                                    {/* Right: Content column */}
                                    <div className="flex-1 min-w-0 flex flex-col pt-1 sm:pt-0 pb-1">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center flex-wrap gap-2">
                                                {/* Mobile Avatar (Visible only on small screens next to name) */}
                                                <Link prefetch={false} href={`/kullanici/${answer.profiles?.username}`} className="sm:hidden relative z-10">
                                                    <Avatar className="h-7 w-7 border-[2px] border-black dark:border-zinc-600 rounded-full shadow-[1px_1px_0_0_#000] dark:shadow-none bg-white">
                                                        <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                                        <AvatarFallback className="bg-white dark:bg-zinc-800 text-black dark:text-white font-black text-[10px]">
                                                            {answer.profiles?.username?.[0]?.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Link>

                                                <Link prefetch={false} href={`/kullanici/${answer.profiles?.username}`}
                                                    className="font-bold text-sm text-foreground hover:text-[#FFBD2E] transition-colors px-1 -ml-1 rounded flex items-center gap-1"
                                                >
                                                    @{answer.profiles?.username || "Anonim"}
                                                    {answer.profiles?.is_verified && (
                                                        <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                                    )}
                                                </Link>
                                                <span className="text-neutral-400 dark:text-zinc-600 text-[10px] font-bold hidden sm:inline">·</span>
                                                <span className="text-[10px] font-medium text-neutral-500 dark:text-zinc-500">
                                                    {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}
                                                </span>
                                            </div>

                                            {/* Actions Menu */}
                                            <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity gap-1">

                                                {answer.canDelete && (
                                                    <DeleteAnswerButton
                                                        answerId={answer.id}
                                                        questionId={questionId}
                                                    />
                                                )}

                                                <ReportDialog
                                                    resourceId={answer.id}
                                                    resourceType="answer"
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-black dark:text-zinc-400 bg-white dark:bg-zinc-800 border-[2px] border-black dark:border-zinc-600 rounded-lg hover:bg-neo-pink hover:text-white shadow-[1px_1px_0_0_#000] dark:shadow-[1px_1px_0_0_rgba(255,255,255,0.06)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                                            <Flag className="h-3.5 w-3.5 stroke-[2.5px]" />
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Content with Read More logic */}
                                        <div className="mb-4 sm:mb-6 relative group/content transition-all">
                                        <div className={cn(
                                                "prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-zinc-300 font-[family-name:var(--font-inter)] leading-[1.75] transition-all duration-300",
                                                !expandedAnswers[answer.id] && answer.content.length > 500 ? "max-h-[350px] sm:max-h-[220px] overflow-hidden" : ""
                                            )}>
                                                <MarkdownRenderer content={answer.content} />
                                            </div>

                                            {!expandedAnswers[answer.id] && answer.content.length > 500 && (
                                                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white dark:from-[#1e1e21] via-white/80 dark:via-[#1e1e21]/80 to-transparent flex items-end justify-center pb-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => toggleAnswerExpand(answer.id)}
                                                        className="rounded-lg bg-[#FFBD2E] border-[2.5px] border-black dark:border-zinc-700 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)] font-black uppercase text-black hover:text-black hover:bg-[#FFD268] px-6 h-10 transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000] z-20 text-sm"
                                                    >
                                                        Devamını Oku
                                                    </Button>
                                                </div>
                                            )}

                                            {expandedAnswers[answer.id] && answer.content.length > 500 && (
                                                <div className="flex justify-end mt-3">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => toggleAnswerExpand(answer.id)}
                                                        className="font-bold uppercase text-xs tracking-wider text-neutral-500 dark:text-zinc-400 border-[2px] border-neutral-300 dark:border-zinc-700 rounded-lg bg-neutral-50 dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all"
                                                    >
                                                        Daralt
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Bar (Neo-brutalist) */}
                                        <div className="flex items-center justify-between sm:justify-start gap-2.5 mt-3 sm:mt-0 pt-3 border-t-[2.5px] border-black dark:border-zinc-700 mx-[-16px] px-4 sm:mx-[0] sm:px-0 sm:border-none sm:pt-0">
                                            <div className="flex items-center group/like">
                                                <AnswerLikeButton answerId={answer.id} initialLikeCount={answer.likeCount || 0} initialIsLiked={answer.isLiked || false} isLoggedIn={!!user} />
                                            </div>

                                            {/* Reply Group */}
                                            <div className="flex items-center group/reply">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex items-center gap-1.5 px-3 h-9 border-[2px] border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg font-bold uppercase tracking-wider text-[10px] text-black dark:text-zinc-300 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] hover:bg-[#FFBD2E] hover:text-black transition-all"
                                                    onClick={() => toggleComments(answer.id)}
                                                >
                                                    <MessageSquare className="h-3.5 w-3.5 stroke-[2.5px]" />
                                                    <span>
                                                        {answer.comments && answer.comments.length > 0
                                                            ? answer.comments.length
                                                            : "YANITLA"}
                                                    </span>
                                                </Button>
                                            </div>

                                            {/* Share Drawer */}
                                            <ShareDrawer
                                                url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com'}/forum/${questionId}#answer-${answer.id}`}
                                                title={`FizikHub'da bir yanıt`}
                                            >
                                                <Button variant="ghost" size="icon" className="h-9 w-9 border-[2px] border-black dark:border-zinc-600 bg-neutral-50 dark:bg-zinc-800 rounded-lg text-black dark:text-zinc-400 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] hover:bg-[#FFBD2E] hover:text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all pointer-events-auto">
                                                    <Share2 className="h-3.5 w-3.5 stroke-[2.5px]" />
                                                </Button>
                                            </ShareDrawer>
                                        </div>

                                        {/* Expanded Comments */}
                                        {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                            <div className="mt-4 pl-2 sm:pl-4 pt-2 relative">
                                                {/* Show comments here */}
                                                <RealtimeCommentList
                                                    answerId={answer.id}
                                                    initialComments={answer.comments || []}
                                                    currentUserId={user?.id}
                                                    currentUserEmail={user?.email}
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
