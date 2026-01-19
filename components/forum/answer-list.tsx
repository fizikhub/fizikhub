"use client";

import { useState, useEffect, lazy, Suspense } from "react";
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
import { User, MessageSquare, BadgeCheck, CheckCircle2, ThumbsUp, ArrowBigUp, ArrowBigDown } from "lucide-react";
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
    const [supabase] = useState(() => createClient());

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
                    <div className="flex gap-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-border hidden sm:block">
                            <AvatarImage src={user.user_metadata?.avatar_url || ""} className="object-cover" />
                            <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                                {user.user_metadata?.username?.[0]?.toUpperCase() || "S"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            {/* Simplified Header */}
                            <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                                <span className="text-foreground">Senin</span> Görüşün Ne?
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="min-h-[120px] border border-border/60 rounded-xl overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all bg-card/50 shadow-sm">
                                    <Suspense fallback={<div className="p-4 text-muted-foreground">Editor yükleniyor...</div>}>
                                        <MarkdownEditor
                                            value={newAnswer}
                                            onChange={setNewAnswer}
                                            placeholder="Tartışmaya katıl..."
                                        />
                                    </Suspense>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !newAnswer.trim()}
                                        className="px-6 rounded-full font-bold h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                        {isSubmitting ? "Gönderiliyor..." : "Yanıtla"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-6 rounded-2xl bg-muted/30 text-center border border-dashed border-border/60">
                    <div className="max-w-xs mx-auto space-y-3">
                        <h3 className="text-lg font-bold">Tartışmaya Katıl</h3>
                        <p className="text-sm text-muted-foreground font-medium">Bu soruya cevap vermek veya yorum yapmak için giriş yapmalısın.</p>
                        <Button className="w-full font-bold rounded-full h-9" asChild>
                            <a href="/login">Giriş Yap / Kayıt Ol</a>
                        </Button>
                    </div>
                </div>
            )}

            {/* Answer List */}
            <div className="relative space-y-4">
                {answers.length === 0 ? (
                    <div className="py-12 text-center border-y border-border/40 bg-muted/5">
                        <div className="bg-muted/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Henüz cevap yok</h3>
                        <p className="text-muted-foreground text-sm font-medium">Bu soruya ilk cevabı sen ver!</p>
                    </div>
                ) : (
                    answers.map((answer, index) => (
                        <div
                            key={answer.id}
                            id={`answer-${answer.id}`}
                            className={cn(
                                "group relative transition-all duration-300 border-b border-border/40 hover:bg-muted/5 last:border-0",
                                answer.is_accepted && "bg-green-500/5 hover:bg-green-500/10 rounded-xl border-none mb-4"
                            )}
                        >
                            {/* Thread Line - Connecting to next item if needed, currently just visual marker */}
                            {/* <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-border/40 group-hover:bg-border/60 transition-colors" /> */}

                            <div className="flex gap-2 sm:gap-4 py-4 sm:py-6 px-1 sm:px-3">
                                {/* Left: Avatar column */}
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                    <Link href={`/kullanici/${answer.profiles?.username}`} className="relative z-10">
                                        <Avatar className={cn(
                                            "h-8 w-8 sm:h-10 sm:w-10 border border-border/50 transition-all",
                                            answer.is_accepted ? "border-green-500 ring-2 ring-green-500/20" : "group-hover:border-border"
                                        )}>
                                            <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="bg-secondary text-secondary-foreground font-black text-xs">
                                                {answer.profiles?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </div>

                                {/* Right: Content column */}
                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center flex-wrap gap-x-2">
                                            <Link
                                                href={`/kullanici/${answer.profiles?.username}`}
                                                className="font-bold text-sm hover:text-primary transition-colors flex items-center gap-1"
                                            >
                                                @{answer.profiles?.username || "Anonim"}
                                                {answer.profiles?.is_verified && (
                                                    <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                                )}
                                            </Link>
                                            <span className="text-muted-foreground text-xs font-medium">·</span>
                                            <span className="text-xs text-muted-foreground hover:underline decoration-muted-foreground/50 underline-offset-2 transition-all">
                                                {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                            {answer.is_accepted && (
                                                <span className="flex items-center gap-1 text-green-600 bg-green-500/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase ml-2">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Çözüm
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions Menu */}
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(user?.id === questionAuthorId || ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'].includes(user?.email?.toLowerCase())) && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleAccept(answer.id)}
                                                    className={cn(
                                                        "h-7 w-7 rounded-full hover:bg-green-500/10 transition-colors mr-1",
                                                        answer.is_accepted ? "text-green-600 opacity-100" : "text-muted-foreground hover:text-green-600"
                                                    )}
                                                    title={answer.is_accepted ? "Çözümü kaldır" : "Çözüm olarak işaretle"}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
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
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/50 hover:text-destructive rounded-full">
                                                        <Flag className="h-3 w-3" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none mb-2 sm:mb-3 text-foreground/90 font-medium leading-relaxed">
                                        <MarkdownRenderer content={answer.content} />
                                    </div>

                                    {/* Action Bar (Simple) */}
                                    <div className="flex items-center justify-between max-w-md mt-2">
                                        {/* Like Group */}
                                        <div className="flex items-center group/like">
                                            <AnswerLikeButton
                                                answerId={answer.id}
                                                initialLikeCount={answer.likeCount || 0}
                                                initialIsLiked={answer.isLiked || false}
                                                isLoggedIn={!!user}
                                            />
                                        </div>

                                        {/* Reply Group */}
                                        <div className="flex items-center group/reply">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center gap-1.5 px-2 hover:bg-blue-500/10 hover:text-blue-500 text-muted-foreground transition-colors rounded-full h-7"
                                                onClick={() => toggleComments(answer.id)}
                                            >
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                <span className="text-xs font-bold">
                                                    {answer.comments && answer.comments.length > 0
                                                        ? answer.comments.length
                                                        : "Yanıtla"}
                                                </span>
                                            </Button>
                                        </div>

                                        {/* Share / More placeholder */}
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/50 hover:text-primary rounded-full hover:bg-primary/10">
                                            <ArrowBigUp className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Expanded Comments */}
                                    {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                        <div className="mt-4 pl-4 border-l-2 border-border/40">
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
                                                <div className="mt-4">
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
