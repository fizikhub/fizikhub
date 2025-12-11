import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Eye, MessageSquare, User, ArrowLeft, CheckCircle2, Flame, Zap, BadgeCheck, Edit2 } from "lucide-react";
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
import { EditQuestionDialog } from "@/components/forum/edit-question-dialog";

import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

// Disable static caching for this dynamic page
export const revalidate = 0;

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

        // Fetch comments with like information
        const { data: comments } = await supabase
            .from('answer_comments')
            .select(`
                *,
                profiles(username, full_name, avatar_url, is_verified)
            `)
            .eq('answer_id', answer.id)
            .order('created_at', { ascending: true });

        // Add like counts and isLiked status to comments
        const commentsWithLikes = await Promise.all((comments || []).map(async (comment) => {
            const { count: commentLikeCount } = await supabase
                .from('answer_comment_likes')
                .select('*', { count: 'exact', head: true })
                .eq('comment_id', comment.id);

            let isCommentLiked = false;
            if (user) {
                const { data: userCommentLike } = await supabase
                    .from('answer_comment_likes')
                    .select('id')
                    .eq('comment_id', comment.id)
                    .eq('user_id', user.id)
                    .single();
                isCommentLiked = !!userCommentLike;
            }

            return { ...comment, likeCount: commentLikeCount || 0, isLiked: isCommentLiked };
        }));

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

        return { ...answer, likeCount: likeCount || 0, isLiked, comments: commentsWithLikes };
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
                    <div className="space-y-6">
                        {/* Question Card */}
                        <div className="bg-card border-2 border-border overflow-hidden">
                            <div className="p-6 sm:p-8">
                                {/* Author Header */}
                                <div className="flex items-center gap-3 mb-5">
                                    <Link href={`/kullanici/${question.profiles?.username}`}>
                                        <Avatar className="h-12 w-12 ring-2 ring-border hover:ring-primary/30 transition-all">
                                            <AvatarImage src={question.profiles?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                                                {question.profiles?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Link
                                                href={`/kullanici/${question.profiles?.username}`}
                                                className="font-semibold text-base hover:text-primary transition-colors"
                                            >
                                                @{question.profiles?.username || "Anonim"}
                                            </Link>
                                            {question.profiles?.is_verified && (
                                                <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                        </p>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {isSolved && (
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 h-6 text-xs">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Çözüldü
                                            </Badge>
                                        )}
                                        <Badge variant="secondary" className="bg-secondary/50 h-6 text-xs">
                                            {question.category || "Genel"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 leading-tight">
                                    {question.title}
                                </h1>

                                {/* Content */}
                                <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none mb-6">
                                    <MarkdownRenderer content={question.content} />
                                    {question.updated_at && new Date(question.updated_at).getTime() > new Date(question.created_at).getTime() + 60000 && (
                                        <div className="mt-4 text-xs text-muted-foreground italic flex items-center gap-1">
                                            <Edit2 className="h-3 w-3" />
                                            (Düzenlendi: {formatDistanceToNow(new Date(question.updated_at), { addSuffix: true, locale: tr })})
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {question.tags && question.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {question.tags.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="text-sm px-3 py-1 border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Actions Bar */}
                                <div className="flex items-center justify-between gap-4 pt-5 border-t border-border/50">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <VoteButton
                                            questionId={question.id}
                                            initialVotes={question.votes || 0}
                                            initialHasVoted={hasVoted}
                                        />

                                        <div className="flex items-center gap-2 text-muted-foreground px-3 py-1.5 rounded-full bg-muted/30 text-sm">
                                            <MessageSquare className="h-4 w-4" />
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

                                        {(isAdmin || user?.id === question.author_id) && (
                                            <EditQuestionDialog questionId={question.id} initialContent={question.content} />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                        <span>{(question.views || 0).toLocaleString('tr-TR')}</span>
                                        <span className="hidden sm:inline">görüntülenme</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Answers Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xl sm:text-2xl font-bold">
                                    {answers?.length || 0} Cevap
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
                    <aside className="hidden lg:block space-y-4">
                        {/* Stats Card */}
                        <div className="border-2 border-border bg-card sticky top-24">
                            <div className="p-4 border-b-2 border-border">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    İstatistikler
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
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
                            </div>
                        </div>

                        {/* Admin/Author Actions */}
                        {(isAdmin || user?.id === question.author_id) && (
                            <div className="border-2 border-destructive/50 bg-card">
                                <div className="p-4 border-b-2 border-destructive/50">
                                    <h3 className="text-xs font-bold text-destructive uppercase tracking-wider">İşlemler</h3>
                                </div>
                                <div className="p-4 space-y-2">
                                    <EditQuestionDialog questionId={question.id} initialContent={question.content} />
                                    <DeleteQuestionButton questionId={question.id} authorId={question.author_id} />
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
            <ViewTracker questionId={question.id} />
        </div >
    );
}
