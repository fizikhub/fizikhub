"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MarkdownRenderer } from "@/components/markdown-renderer";
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
}

export function AnswerList({ questionId, initialAnswers, questionAuthorId }: AnswerListProps) {
    const sortedAnswers = [...initialAnswers].sort((a, b) => {
        if (a.is_accepted === b.is_accepted) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return a.is_accepted ? -1 : 1;
    });

    const [answers, setAnswers] = useState<Answer[]>(sortedAnswers);
    const [newAnswer, setNewAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
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
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user ?? null);
        };

        getUser();

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
        <div className="space-y-4 sm:space-y-5">
            {/* Answer List */}
            <div className="space-y-4">
                {answers.length === 0 ? (
                    <div className="py-12 text-center border rounded-xl bg-muted/10 border-dashed border-muted-foreground/20">
                        <div className="bg-muted/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Henüz cevap yok</h3>
                        <p className="text-muted-foreground text-sm">Bu soruya ilk cevabı sen ver!</p>
                    </div>
                ) : (
                    answers.map((answer) => (
                        <div
                            key={answer.id}
                            className={cn(
                                "group bg-card border-2 transition-all duration-200",
                                answer.is_accepted
                                    ? "border-green-500/50 bg-green-500/5"
                                    : "border-border hover:border-border/80"
                            )}
                        >
                            {/* Accepted Badge */}
                            {answer.is_accepted && (
                                <div className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    KABUL EDİLEN CEVAP
                                </div>
                            )}

                            <div className="flex gap-4 p-5 sm:p-6">
                                {/* Left: Vote Section - Quora Style */}
                                <div className="flex flex-col items-center gap-2 min-w-[48px]">
                                    <AnswerLikeButton
                                        answerId={answer.id}
                                        initialLikeCount={answer.likeCount || 0}
                                        initialIsLiked={answer.isLiked || false}
                                        isLoggedIn={!!user}
                                    />
                                </div>

                                {/* Right: Content Section */}
                                <div className="flex-1 min-w-0 space-y-4">
                                    {/* Author Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <Link href={`/kullanici/${answer.profiles?.username}`}>
                                                <Avatar className="h-10 w-10 ring-2 ring-border hover:ring-primary/30 transition-all">
                                                    <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                                    <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                                                        {answer.profiles?.username?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        href={`/kullanici/${answer.profiles?.username}`}
                                                        className="font-semibold text-sm hover:text-primary transition-colors"
                                                    >
                                                        @{answer.profiles?.username || "Anonim"}
                                                    </Link>
                                                    {answer.profiles?.is_verified && (
                                                        <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    <span className="hidden sm:inline">{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}</span>
                                                    <span className="sm:hidden">{formatDistanceToNow(new Date(answer.created_at), { locale: tr })}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            {(user?.id === questionAuthorId || ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'].includes(user?.email?.toLowerCase())) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleAccept(answer.id)}
                                                    className={cn(
                                                        "h-8 w-8 p-0",
                                                        answer.is_accepted
                                                            ? "text-green-600 hover:text-green-700"
                                                            : "text-muted-foreground hover:text-green-600"
                                                    )}
                                                    title={answer.is_accepted ? "Çözümü kaldır" : "Çözüm olarak işaretle"}
                                                >
                                                    <CheckCircle2 className={cn("h-4 w-4", answer.is_accepted && "fill-current")} />
                                                </Button>
                                            )}
                                            <DeleteAnswerButton
                                                answerId={answer.id}
                                                questionId={questionId}
                                                authorId={answer.author_id}
                                            />
                                            <ReportDialog
                                                resourceId={answer.id}
                                                resourceType="answer"
                                                trigger={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                        <Flag className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none">
                                        <MarkdownRenderer content={answer.content} className="leading-relaxed" />
                                    </div>

                                    {/* Comments */}
                                    <div className="pt-3 border-t border-border/50 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-muted-foreground hover:text-foreground gap-2 px-2 -ml-2"
                                                onClick={() => toggleComments(answer.id)}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                <span className="text-xs font-medium">
                                                    {answer.comments && answer.comments.length > 0
                                                        ? `${answer.comments.length} Yorum`
                                                        : "Yorum Yap"}
                                                </span>
                                            </Button>
                                        </div>

                                        {/* Comments Section */}
                                        {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
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

                                                {expandedComments[answer.id] ? (
                                                    <AnswerCommentForm
                                                        answerId={answer.id}
                                                        questionId={questionId}
                                                        onCommentAdded={(comment) => handleCommentAdded(answer.id, comment)}
                                                        onCancel={() => toggleComments(answer.id)}
                                                    />
                                                ) : (
                                                    user && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="mt-2 text-xs text-muted-foreground hover:text-primary -ml-2"
                                                            onClick={() => toggleComments(answer.id)}
                                                        >
                                                            Yorum Yaz
                                                        </Button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Answer Form */}
            {user ? (
                <div className="border-2 border-border bg-card p-5 sm:p-6">
                    <h3 className="text-base font-bold mb-4">Cevabınızı Yazın</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="min-h-[200px] border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <MarkdownEditor
                                value={newAnswer}
                                onChange={setNewAnswer}
                                placeholder="Cevabınızı buraya yazın... (Markdown desteklenir)"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !newAnswer.trim()}
                                className="px-6"
                            >
                                {isSubmitting ? "Gönderiliyor..." : "Cevabı Gönder"}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-6 rounded-lg bg-muted/20 text-center border border-dashed">
                    <p className="text-sm text-muted-foreground mb-4">Cevap yazmak için giriş yapmalısın.</p>
                    <Button variant="outline" size="sm" asChild>
                        <a href="/login">Giriş Yap</a>
                    </Button>
                </div>
            )}
        </div>
    );
}
