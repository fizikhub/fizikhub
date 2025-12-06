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
import { BackgroundWrapper } from "@/components/home/background-wrapper";

import { AnswerList } from "@/components/forum/answer-list";
import { DeleteQuestionButton } from "@/components/forum/delete-question-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { VoteButton } from "@/components/forum/vote-button";
import { ViewTracker } from "@/components/forum/view-tracker";
import { BookmarkButton } from "@/components/bookmark-button";
import { ReportButton } from "@/components/report-button";
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
        .select('title, content, category')
        .eq('id', id)
        .single();

    if (!question) {
        return {
            title: "Soru Bulunamadı",
        };
    }

    const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com'}/api/og`);
    ogUrl.searchParams.set('title', question.title);
    ogUrl.searchParams.set('category', question.category || 'Genel');

    return {
        title: question.title,
        description: question.content.substring(0, 160) + "...",
        openGraph: {
            title: question.title,
            description: question.content.substring(0, 160) + "...",
            type: "website",
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: question.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: question.title,
            description: question.content.substring(0, 160) + "...",
            images: [ogUrl.toString()],
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

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

    // Fetch answers and user interactions in parallel
    const [
        { data: answers },
        { data: userVote },
        { data: userBookmark }
    ] = await Promise.all([
        // 1. Fetch answers
        supabase
            .from('answers')
            .select(`
                *,
                profiles(username, full_name, avatar_url, is_verified)
            `)
            .eq('question_id', id)
            .order('created_at', { ascending: true }),

        // 2. Check if user has voted (only if logged in)
        user ? supabase
            .from('question_votes')
            .select('vote_type')
            .eq('question_id', id)
            .eq('user_id', user.id)
            .single() : Promise.resolve({ data: null }),

        // 3. Check if user has bookmarked (only if logged in)
        user ? supabase
            .from('question_bookmarks')
            .select('id')
            .eq('question_id', id)
            .eq('user_id', user.id)
            .single() : Promise.resolve({ data: null })
    ]);

    const hasVoted = userVote?.vote_type === 1;

    // Fetch like counts and user likes for all answers
    const answersWithLikes = await Promise.all((answers || []).map(async (answer) => {
        const { count: likeCount } = await supabase
            .from('answer_likes')
            .select('*', { count: 'exact', head: true })
            .eq('answer_id', answer.id);

        // Fetch comments
        const { data: comments } = await supabase
            .from('answer_comments')
            .select(`
                *,
                profiles(username, full_name, avatar_url, is_verified)
            `)
            .eq('answer_id', answer.id)
            .order('created_at', { ascending: true });

        let isLiked = false;
        if (user) {
            const { data: userLike } = await supabase
                .from('answer_likes')
                .select('id')
                .eq('answer_id', answer.id)
                .eq('user_id', user.id)
                .single();
            isLiked = !!userLike;
        }

        return { ...answer, likeCount: likeCount || 0, isLiked, comments: comments || [] };
    }));



    // Status indicators
    const isSolved = answersWithLikes?.some(a => a.is_accepted) || false;
    const isHot = (question.votes || 0) > 5;
    const isNew = new Date(question.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

    // JSON-LD Structured Data for Q&A
    const acceptedAnswer = answersWithLikes?.find(a => a.is_accepted);
    const suggestedAnswers = answersWithLikes?.filter(a => !a.is_accepted);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: {
            '@type': 'Question',
            name: question.title,
            text: question.content.substring(0, 200) + "...",
            answerCount: answers?.length || 0,
            upvoteCount: question.votes || 0,
            dateCreated: question.created_at,
            author: {
                '@type': 'Person',
                name: question.profiles?.username || 'Anonim',
            },
            ...(acceptedAnswer && {
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: acceptedAnswer.content,
                    dateCreated: acceptedAnswer.created_at,
                    upvoteCount: acceptedAnswer.votes || 0,
                    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com'}/forum/${question.id}#answer-${acceptedAnswer.id}`,
                    author: {
                        '@type': 'Person',
                        name: acceptedAnswer.profiles?.username || 'Anonim',
                    },
                },
            }),
            ...(suggestedAnswers && suggestedAnswers.length > 0 && {
                suggestedAnswer: suggestedAnswers.map(answer => ({
                    '@type': 'Answer',
                    text: answer.content,
                    dateCreated: answer.created_at,
                    upvoteCount: answer.votes || 0,
                    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com'}/forum/${question.id}#answer-${answer.id}`,
                    author: {
                        '@type': 'Person',
                        name: answer.profiles?.username || 'Anonim',
                    },
                })),
            }),
        },
    };

    return (
        <div className="min-h-screen bg-background pb-20 relative overflow-x-hidden">
            <BackgroundWrapper />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container py-4 sm:py-6 md:py-10 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <div className="mb-4 sm:mb-6">
                    <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:pl-2 transition-all -ml-2 sm:ml-0 font-bold uppercase text-xs tracking-wider" asChild>
                        <Link href="/forum">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">FORUMA DÖN</span>
                            <span className="sm:hidden">GERİ</span>
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                        {/* Question Card */}
                        <Card className="border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 bg-card overflow-hidden">
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
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 leading-tight uppercase tracking-tight">
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
                                        <BookmarkButton
                                            type="question"
                                            itemId={question.id}
                                            initialBookmarked={!!userBookmark}
                                        />

                                        <ReportButton
                                            contentType="question"
                                            contentId={question.id}
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
                                <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight">
                                    {answers?.length || 0} CEVAP
                                </h2>
                            </div>

                            <AnswerList
                                questionId={question.id}
                                initialAnswers={answersWithLikes || []}
                                questionAuthorId={question.author_id}
                            />
                        </div>
                    </div>

                    {/* Stats Sidebar (Desktop) */}
                    <aside className="hidden lg:block space-y-6">
                        {/* Stats Card */}
                        <Card className="border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] sticky top-24 bg-card">
                            <CardHeader className="pb-3 border-b-2 border-black dark:border-white">
                                <CardTitle className="text-xs font-black text-foreground uppercase tracking-wider">
                                    İSTATİSTİKLER
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
                            <Card className="border-2 border-destructive shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] bg-card">
                                <CardHeader className="pb-3 border-b-2 border-destructive">
                                    <CardTitle className="text-xs font-black text-destructive uppercase tracking-wider">İŞLEMLER</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DeleteQuestionButton questionId={question.id} authorId={question.author_id} />
                                </CardContent>
                            </Card>
                        )}
                    </aside>
                </div>
            </div>
            <ViewTracker questionId={question.id} />
        </div >
    );
}
