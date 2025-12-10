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
        <div className="space-y-6">
            {/* Answer List */}
            <div className="space-y-6">
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
                                "bg-card border border-border rounded-lg overflow-hidden",
                                answer.is_accepted && "border-green-500/50 bg-green-500/5"
                            )}
                        >
                            {/* Accepted Badge */}
                            {answer.is_accepted && (
                                <div className="bg-green-500 text-white text-sm font-bold px-6 py-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Kabul Edilen Cevap
                                </div>
                            )}

                            <div className="flex gap-6 p-6">
                                {/* Left: Upvote Section - Exactly like Quora */}
                                <div className="flex flex-col items-center gap-2 pt-1">
                                    <AnswerLikeButton
                                        answerId={answer.id}
                                        initialLikeCount={answer.likeCount || 0}
                                        initialIsLiked={answer.isLiked || false}
                                        isLoggedIn={!!user}
                                    />
                                </div>

                                {/* Right: Content Section */}
                                <div className="flex-1 min-w-0">
                                    {/* Author Info - Like Quora */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/kullanici/${answer.profiles?.username}`}>
                                                <Avatar className="h-12 w-12 ring-2 ring-border hover:ring-primary/30 transition-all cursor-pointer">
                                                    <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                                    <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                                                        {answer.profiles?.username?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/kullanici/${answer.profiles?.username}`}
                                                        className="font-bold text-base hover:text-primary transition-colors"
                                                    >
                                                        {answer.profiles?.username || "Anonim"}
                                                    </Link>
                                                    {answer.profiles?.is_verified && (
                                                        <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions - Admin/Author */}
                                        <div className="flex items-center gap-1">
                                            {(user?.id === questionAuthorId || ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'].includes(user?.email?.toLowerCase())) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleAccept(answer.id)}
                                                    className={cn(
                                                        "h-9 px-3",
                                                        answer.is_accepted
                                                            ? "text-green-600 hover:text-green-700"
                                                            : "text-muted-foreground hover:text-green-600"
                                                    )}
                                                    title={answer.is_accepted ? "Çözümü kaldır" : "Çözüm olarak işaretle"}
                                                >
                                                    <CheckCircle2 className={cn("h-4 w-4 mr-1", answer.is_accepted && "fill-current")} />
                                                    <span className="text-xs">{answer.is_accepted ? "Kaldır" : "Kabul Et"}</span>
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
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive">
                                                        <Flag className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Answer Content - Larger, more readable */}
                                    <div className="prose prose-base md:prose-lg prose-neutral dark:prose-invert max-w-none mb-6">
                                        <MarkdownRenderer content={answer.content} />
                                    </div>

                                    {/* Action Bar - Like Quora */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground gap-2"
                                            onClick={() => toggleComments(answer.id)}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                {answer.comments && answer.comments.length > 0
                                                    ? `${answer.comments.length} Yorum`
                                                    : "Yorum Yap"}
                                            </span>
                                        </Button>
                                    </div>

                                    {/* Comments Section */}
                                    {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
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
                                                        className="mt-2 text-sm text-muted-foreground hover:text-primary"
                                                        onClick={() => toggleComments(answer.id)}
                                                    >
                                                        Yorum Ekle
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Answer Form */}
            {user ? (
                <div className="border border-border bg-card rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Cevabınızı Yazın</h3>
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
