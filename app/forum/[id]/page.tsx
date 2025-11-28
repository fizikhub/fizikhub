import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Eye, MessageSquare, User, ArrowLeft, CheckCircle2, Flame, Zap, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { AnswerList } from "@/components/forum/answer-list";
import { DeleteQuestionButton } from "@/components/forum/delete-question-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { VoteButton } from "@/components/forum/vote-button";
import { ViewTracker } from "@/components/forum/view-tracker";
import { ReportDialog } from "@/components/report-dialog";
import { Flag } from "lucide-react";

import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: question } = await supabase
        .from('questions')
        .select('title, content')
        .eq('id', id)
        .single();

    if (!question) {
        return {
            title: "Soru Bulunamadı",
        };
    }

    return {
        title: question.title,
        description: question.content.substring(0, 160) + "...",
        openGraph: {
            title: question.title,
            description: question.content.substring(0, 160) + "...",
            type: "website",
        },
    };
}

export default async function QuestionPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch question details
    const { data: question, error } = await supabase.from('questions')
        .select(`
            *,
            profiles(username, full_name, avatar_url, is_verified)
        `)
        .eq('id', id)
        .single();

    if (error || !question) {
        notFound();
    }

    // Fetch answers
    const { data: answers } = await supabase
        .from('answers')
        .select(`
            *,
            profiles(username, full_name, avatar_url, is_verified)
        `)
        .eq('question_id', id)
        .order('created_at', { ascending: true });

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

    // Check if user has voted
    let hasVoted = false;
    if (user) {
        const { data: vote } = await supabase
            .from('question_votes')
            .select('id')
            .eq('question_id', id)
            .eq('user_id', user.id)
            .single();
        hasVoted = !!vote;
    }

    // Status indicators
    const isSolved = answers?.some(a => a.is_accepted) || false;
    const isHot = (question.votes || 0) > 5;
    const isNew = new Date(question.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

    return (
        <div className="min-h-screen bg-background">
            <ViewTracker questionId={question.id} />

            <div className="container py-4 sm:py-6 md:py-10 px-4 md:px-6 max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="mb-4 sm:mb-6">
                    <Link href="/forum">
                        <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:pl-2 transition-all -ml-2 sm:ml-0">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Foruma Dön</span>
                            <span className="sm:hidden">Geri</span>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                        {/* Question Card */}
                        <Card className="border hover:border-primary/10 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardContent className="p-4 sm:p-6 md:p-8">
                                {/* Author Header */}
                                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Link href={`/kullanici/${question.profiles?.username}`}>
                                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                                                <AvatarImage src={question.profiles?.avatar_url || ""} className="object-cover" />
                                                <AvatarFallback className="text-base sm:text-lg bg-primary/10 text-primary font-bold">
                                                    {question.profiles?.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div>
                                            {question.profiles?.username ? (
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/kullanici/${question.profiles.username}`}
                                                        className="font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                                                    >
                                                        @{question.profiles.username}
                                                    </Link>
                                                    {question.profiles.is_verified && (
                                                        <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 fill-blue-500/10" />
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-sm sm:text-base text-foreground">
                                                    Anonim
                                                </span>
                                            )}
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                <span className="hidden sm:inline">{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                                                <span className="sm:hidden">{formatDistanceToNow(new Date(question.created_at), { locale: tr })}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {isSolved && (
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 h-6 text-[10px] sm:text-xs px-2">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span className="hidden sm:inline">Çözüldü</span>
                                            </Badge>
                                        )}
                                        {isHot && !isSolved && (
                                            <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 gap-1 h-6 text-[10px] sm:text-xs px-2">
                                                <Flame className="h-3 w-3" />
                                                <span className="hidden sm:inline">Hot</span>
                                            </Badge>
                                        )}
                                        {isNew && !isSolved && !isHot && (
                                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1 h-6 text-[10px] sm:text-xs px-2">
                                                <Zap className="h-3 w-3" />
                                                <span className="hidden sm:inline">Yeni</span>
                                            </Badge>
                                        )}
                                        <Badge variant="secondary" className="bg-secondary/50 h-6 text-[10px] sm:text-xs px-2">
                                            {question.category || "Genel"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                                    {question.title}
                                </h1>

                                {/* Content */}
                                <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none mb-6 sm:mb-8">
                                    <MarkdownRenderer content={question.content} />
                                </div>

                                {/* Tags */}
                                {question.tags && question.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                                        {question.tags.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Actions Bar */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                        <VoteButton
                                            questionId={question.id}
                                            initialVotes={question.votes || 0}
                                            initialHasVoted={hasVoted}
                                            className="h-8 sm:h-9"
                                        />

                                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-muted/30 text-xs sm:text-sm">
                                            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="font-medium">{answers?.length || 0}</span>
                                            <span className="hidden sm:inline">Cevap</span>
                                        </div>

                                        <ReportDialog
                                            resourceId={question.id}
                                            resourceType="question"
                                            trigger={
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-8 sm:h-9 px-2 sm:px-3 rounded-full hover:bg-destructive/10 text-xs sm:text-sm">
                                                    <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Bildir</span>
                                                </Button>
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-muted/30">
                                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span>{(question.views || 0).toLocaleString('tr-TR')}</span>
                                        <span className="hidden sm:inline">görüntülenme</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Answers Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                                    {answers?.length || 0} Cevap
                                </h2>
                            </div>

                            <AnswerList
                                questionId={question.id}
                                initialAnswers={answers || []}
                                questionAuthorId={question.author_id}
                            />
                        </div>
                    </div>

                    {/* Stats Sidebar (Desktop) */}
                    <aside className="hidden lg:block space-y-6">
                        {/* Stats Card */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 sticky top-24 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    İstatistikler
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Eye className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{(question.views || 0).toLocaleString('tr-TR')}</p>
                                        <p className="text-xs text-muted-foreground">Görüntülenme</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <MessageSquare className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{answers?.length || 0}</p>
                                        <p className="text-xs text-muted-foreground">Cevap</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500/10">
                                        <Flame className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{question.votes || 0}</p>
                                        <p className="text-xs text-muted-foreground">Oy</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin/Author Actions */}
                        {(isAdmin || user?.id === question.author_id) && (
                            <Card className="bg-card/50 backdrop-blur-sm border-destructive/20 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xs font-medium text-destructive uppercase tracking-wider">İşlemler</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DeleteQuestionButton questionId={question.id} authorId={question.author_id} />
                                </CardContent>
                            </Card>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
