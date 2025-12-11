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
                            id={`answer-${answer.id}`}
                            className={cn(
                                "group bg-card border-2 border-border/60 rounded-xl overflow-hidden relative transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_25px_-10px_rgba(var(--primary),0.25)]",
                                answer.is_accepted && "border-primary bg-primary/5"
                            )}
                        >
                            {/* Cosmic background effect */}
                            <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Accepted Badge */}
                            {answer.is_accepted && (
                                <div className="bg-primary text-primary-foreground text-sm font-bold px-6 py-2.5 flex items-center gap-2 border-b-2 border-primary/30">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Kabul Edilen Cevap
                                </div>
                            )}

                            <div className="p-5 sm:p-6 relative z-10">
                                {/* Author Info */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/kullanici/${answer.profiles?.username}`} className="group/avatar relative">
                                            <Avatar className="h-11 w-11 ring-2 ring-transparent group-hover/avatar:ring-primary/20 transition-all duration-300">
                                                <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {answer.profiles?.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/kullanici/${answer.profiles?.username}`}
                                                    className="font-heading font-bold text-base hover:text-primary transition-colors"
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
                                    <div className="flex items-center gap-2">
                                        {(user?.id === questionAuthorId || ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'].includes(user?.email?.toLowerCase())) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleAccept(answer.id)}
                                                className={cn(
                                                    "h-9 px-3 border-2 rounded-lg active:scale-95 transition-all",
                                                    answer.is_accepted
                                                        ? "border-primary text-primary hover:bg-primary/10"
                                                        : "border-border hover:border-primary/40 hover:bg-primary/5"
                                                )}
                                                title={answer.is_accepted ? "Çözümü kaldır" : "Çözüm olarak işaretle"}
                                            >
                                                <CheckCircle2 className={cn("h-4 w-4 mr-1", answer.is_accepted && "fill-current")} />
                                                <span className="text-xs font-bold">{answer.is_accepted ? "Kaldır" : "Kabul Et"}</span>
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
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive border-2 border-transparent hover:border-destructive/40 rounded-lg active:scale-95 transition-all">
                                                    <Flag className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Answer Content */}
                                <div className="prose prose-base md:prose-lg prose-neutral dark:prose-invert max-w-none mb-5">
                                    <MarkdownRenderer content={answer.content} />
                                </div>

                                {/* Action Bar */}
                                <div className="flex items-center gap-3 pt-4 border-t-2 border-border/40">
                                    {/* Like Button */}
                                    <AnswerLikeButton
                                        answerId={answer.id}
                                        initialLikeCount={answer.likeCount || 0}
                                        initialIsLiked={answer.isLiked || false}
                                        isLoggedIn={!!user}
                                    />

                                    {/* Comment Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-border bg-secondary/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 active:scale-95"
                                        onClick={() => toggleComments(answer.id)}
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="text-sm font-bold">
                                            {answer.comments && answer.comments.length > 0
                                                ? `${answer.comments.length} Yorum`
                                                : "Yorum Yap"}
                                        </span>
                                    </Button>
                                </div>

                                {/* Comments Section */}
                                {(expandedComments[answer.id] || (answer.comments && answer.comments.length > 0)) && (
                                    <div className="mt-5 pt-5 border-t-2 border-border/40 animate-in fade-in slide-in-from-top-2 duration-200">
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
                                                    className="mt-3 text-sm border-2 border-border rounded-lg hover:border-primary/40 hover:text-primary active:scale-95 transition-all"
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
                    ))
                )}
            </div>

            {/* New Answer Form */}
            {user ? (
                <div id="answer-form" className="border-2 border-border/60 bg-card rounded-xl p-5 sm:p-6 hover:border-primary/40 transition-colors duration-300 scroll-mt-24">
                    <h3 className="text-lg font-heading font-bold mb-4">Cevabınızı Yazın</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="min-h-[200px] border-2 border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
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
                                className="px-6 border-2 border-primary hover:border-primary/80 active:scale-95 transition-all font-bold"
                            >
                                {isSubmitting ? "Gönderiliyor..." : "Cevabı Gönder"}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-6 rounded-xl bg-secondary/30 text-center border-2 border-dashed border-border">
                    <p className="text-sm text-muted-foreground mb-4 font-medium">Cevap yazmak için giriş yapmalısın.</p>
                    <Button variant="outline" size="sm" className="border-2 active:scale-95 transition-all" asChild>
                        <a href="/login">Giriş Yap</a>
                    </Button>
                </div>
            )}
        </div>
    );
}
