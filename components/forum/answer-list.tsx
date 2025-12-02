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
import { User, MessageSquare, BadgeCheck, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAnswer, toggleAnswerAcceptance } from "@/app/forum/actions";
import { Database } from "@/types/database";
import { DeleteAnswerButton } from "@/components/forum/delete-answer-button";
import { ReportDialog } from "@/components/report-dialog";
import { Flag } from "lucide-react";
import { AnswerLikeButton } from "@/components/forum/answer-like-button";
import { RealtimeCommentList } from "@/components/forum/realtime-comment-list";
import { AnswerCommentForm } from "@/components/forum/answer-comment-form";

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
    comments?: any[]; // Using any[] for now to avoid circular type issues, ideally define Comment type
};

interface AnswerListProps {
    questionId: number;
    initialAnswers: Answer[];
    questionAuthorId: string;
}

export function AnswerList({ questionId, initialAnswers, questionAuthorId }: AnswerListProps) {
    // Sort answers: accepted first, then by date
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
    const supabase = createClient();

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
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Realtime subscription for answers
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
                    // Fetch the complete answer with profile data
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
                            // Avoid duplicates
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

            // Optimistic update
            setAnswers(answers.map(a => {
                if (a.id === answerId) {
                    return { ...a, is_accepted: !a.is_accepted };
                }
                // If we are accepting this one, unaccept others
                if (!answers.find(ans => ans.id === answerId)?.is_accepted) {
                    return { ...a, is_accepted: false };
                }
                return a;
            }).sort((a, b) => {
                // Re-sort
                if (a.id === answerId && !a.is_accepted) return -1; // Newly accepted goes top
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
        <div className="space-y-6 sm:space-y-8">
            {/* Answer List */}
            <div className="space-y-3 sm:space-y-4">
                {answers.length === 0 ? (
                    <div className="py-8 sm:py-12 text-center border rounded-xl sm:rounded-2xl bg-muted/10 border-dashed border-muted-foreground/20">
                        <div className="bg-muted/20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium mb-1">Henüz cevap yok</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">Bu soruya ilk cevabı sen ver!</p>
                    </div>
                ) : (
                    answers.map((answer) => (
                        <div key={answer.id} className={`group relative bg-card/50 backdrop-blur-sm rounded-lg sm:rounded-xl border p-4 sm:p-5 md:p-6 transition-all hover:border-primary/20 ${answer.is_accepted ? 'border-green-500/50 bg-green-500/5 shadow-[0_0_20px_-12px_rgba(34,197,94,0.4)]' : 'border-border/50'}`}>
                            {answer.is_accepted && (
                                <div className="absolute -top-2 sm:-top-3 right-4 sm:right-6 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-sm">
                                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    ÇÖZÜM
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <Link
                                        href={`/kullanici/${answer.profiles?.username}`}
                                        className="relative flex-shrink-0"
                                    >
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                                            <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="text-xs sm:text-sm font-bold bg-primary/10 text-primary">
                                                {answer.profiles?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={`/kullanici/${answer.profiles?.username}`}
                                                className="font-semibold text-xs sm:text-sm hover:text-primary transition-colors truncate block"
                                            >
                                                @{answer.profiles?.username || "Anonim"}
                                            </Link>
                                            {answer.profiles?.is_verified && (
                                                <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500 fill-blue-500/10 flex-shrink-0" />
                                            )}
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground block">
                                            <span className="hidden sm:inline">{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}</span>
                                            <span className="sm:hidden">{formatDistanceToNow(new Date(answer.created_at), { locale: tr })}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {(user?.id === questionAuthorId || ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'].includes(user?.email?.toLowerCase())) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleAccept(answer.id)}
                                            className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${answer.is_accepted ? 'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'}`}
                                            title={answer.is_accepted ? "Çözümü kaldır" : "Çözüm olarak işaretle"}
                                        >
                                            <CheckCircle2 className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${answer.is_accepted ? 'fill-current' : ''}`} />
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
                                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none pl-0 sm:pl-12">
                                <MarkdownRenderer content={answer.content} className="text-sm leading-relaxed" />
                            </div>

                            {/* Like Button & Comments */}
                            <div className="mt-4 pl-0 sm:pl-12 space-y-4">
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                    <AnswerLikeButton
                                        answerId={answer.id}
                                        initialLikeCount={answer.likeCount || 0}
                                        initialIsLiked={answer.isLiked || false}
                                        isLoggedIn={!!user}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-muted-foreground hover:text-foreground gap-2 px-2"
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
                                            onCountChange={(count) => {
                                                // Update local state count if needed, or rely on realtime
                                                // Since AnswerList uses 'answers' state, we might want to update it to reflect count
                                                setAnswers(prev => prev.map(a => {
                                                    if (a.id === answer.id && (a.comments?.length !== count)) {
                                                        // Only update if count changed to avoid loops
                                                        // But we can't easily update just the count without the comments array
                                                        // Actually, RealtimeCommentList handles the list.
                                                        // We just need to update the count for the button label.
                                                        // But 'answers' state holds the comments array.
                                                        // If we update 'answers', we might re-render RealtimeCommentList with new initialComments?
                                                        // No, hook ignores initialComments after first render usually.
                                                        return a;
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
                                                    className="mt-2 pl-0 sm:ml-6 text-xs text-muted-foreground hover:text-primary"
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
                    ))
                )}
            </div>

            {/* New Answer Form */}
            {user ? (
                <div className="bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Cevap Yaz</h3>
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div className="min-h-[180px] sm:min-h-[200px] border rounded-lg sm:rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
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
                                className="min-w-[100px] sm:min-w-[120px] rounded-full h-9 sm:h-10 text-sm sm:text-base"
                            >
                                {isSubmitting ? "Gönderiliyor..." : "Cevabı Gönder"}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-muted/20 text-center border border-dashed">
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Cevap yazmak için giriş yapmalısın.</p>
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                        <a href="/login">Giriş Yap</a>
                    </Button>
                </div>
            )}
        </div>
    );
}
