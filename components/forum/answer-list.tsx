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

type Answer = Database['public']['Tables']['answers']['Row'] & {
    is_accepted: boolean | null;
    profiles: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        is_verified?: boolean | null;
    } | null;
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
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

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
        <div className="space-y-8">
            {/* Answer List */}
            <div className="space-y-6">
                {answers.length === 0 ? (
                    <div className="py-12 text-center border rounded-2xl bg-muted/10 border-dashed border-muted-foreground/20">
                        <div className="bg-muted/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Henüz cevap yok</h3>
                        <p className="text-muted-foreground text-sm">Bu soruya ilk cevabı sen ver!</p>
                    </div>
                ) : (
                    answers.map((answer) => (
                        <div key={answer.id} className={`group relative bg-card/50 backdrop-blur-sm rounded-xl border p-6 transition-all hover:border-primary/20 ${answer.is_accepted ? 'border-green-500/50 bg-green-500/5 shadow-[0_0_20px_-12px_rgba(34,197,94,0.4)]' : 'border-border/50'}`}>
                            {answer.is_accepted && (
                                <div className="absolute -top-3 right-6 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    ÇÖZÜM
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/kullanici/${answer.profiles?.username}`}
                                        className="relative"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={answer.profiles?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                                                {answer.profiles?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={`/kullanici/${answer.profiles?.username}`}
                                                className="font-semibold text-sm hover:text-primary transition-colors block"
                                            >
                                                @{answer.profiles?.username || "Anonim"}
                                            </Link>
                                            {answer.profiles?.is_verified && (
                                                <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user?.id === questionAuthorId && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleAccept(answer.id)}
                                            className={`h-8 px-2 ${answer.is_accepted ? 'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'}`}
                                            title={answer.is_accepted ? "Çözümü kaldır" : "Çözüm olarak işaretle"}
                                        >
                                            <CheckCircle2 className={`h-4 w-4 ${answer.is_accepted ? 'fill-current' : ''}`} />
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                <Flag className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="pl-13">
                                <MarkdownRenderer content={answer.content} className="text-sm leading-relaxed" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Answer Form */}
            {user ? (
                <div className="bg-card rounded-2xl border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Cevap Yaz</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="min-h-[200px] border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
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
                                className="min-w-[120px] rounded-full"
                            >
                                {isSubmitting ? "Gönderiliyor..." : "Cevabı Gönder"}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-6 rounded-lg bg-muted/20 text-center border border-dashed">
                    <p className="text-muted-foreground mb-4">Cevap yazmak için giriş yapmalısın.</p>
                    <Button variant="outline" asChild>
                        <a href="/login">Giriş Yap</a>
                    </Button>
                </div>
            )}
        </div>
    );
}
