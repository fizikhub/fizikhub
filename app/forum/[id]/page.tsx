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
import { ScrollToAnswerButton } from "@/components/forum/scroll-to-answer-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { VoteButton } from "@/components/forum/vote-button";
import { ViewTracker } from "@/components/forum/view-tracker";
import { BookmarkButton } from "@/components/bookmark-button";
import { ReportButton } from "@/components/report-button";
import { Flag } from "lucide-react";
import { EditQuestionDialog } from "@/components/forum/edit-question-dialog";
// import { ScrollFixer } from "@/components/ui/scroll-fixer";
import { StickyActionBar } from "@/components/forum/sticky-action-bar";
import { RelatedQuestions } from "@/components/forum/related-questions";
import { ReplyButton } from "@/components/forum/reply-button";

import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

// ISR: Regenerate every 30 seconds for forum questions
export const revalidate = 30;

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
        <div className="min-h-screen bg-background pb-20 relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            {/* ScrollFixer removed to prevent hydration issues */}
            <BackgroundWrapper />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto py-2 sm:py-6 md:py-8 px-0 sm:px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 lg:gap-8 items-start">

                    {/* Main Content Column */}
                    <main className="min-w-0 w-full">
                        {/* Back Button & Header */}
                        <div className="flex items-center gap-4 mb-4 px-4 sm:px-0">
                            <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:pl-2 transition-all -ml-2 font-bold uppercase text-xs tracking-wider text-muted-foreground hover:text-foreground" asChild>
                                <Link href="/forum">
                                    <ArrowLeft className="h-4 w-4 stroke-[3px]" />
                                    <span className="hidden sm:inline">Foruma Dön</span>
                                    <span className="sm:hidden">Geri</span>
                                </Link>
                            </Button>
                        </div>

                        {/* QUESTION CARD - Twitter Style / Neo-Brutalist */}
                        <div className="bg-card border-y sm:border-2 border-border sm:rounded-xl overflow-hidden shadow-none sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:sm:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">

                            {/* 1. Header: Author & Context */}
                            <div className="p-3 sm:p-6 pb-1 sm:pb-4 flex justify-between items-start gap-2 sm:gap-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Link href={`/kullanici/${question.profiles?.username}`} className="block group">
                                        <Avatar className="h-8 w-8 sm:h-12 sm:w-12 border-2 border-border group-hover:border-primary transition-colors">
                                            <AvatarImage src={question.profiles?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="bg-primary/10 text-primary font-black text-sm sm:text-base">
                                                {question.profiles?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex flex-col leading-tight">
                                        <Link
                                            href={`/kullanici/${question.profiles?.username}`}
                                            className="font-bold text-sm sm:text-lg hover:text-primary transition-colors flex items-center gap-1.5"
                                        >
                                            @{question.profiles?.username || "Anonim"}
                                            {question.profiles?.is_verified && (
                                                <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                            )}
                                        </Link>
                                        <span className="text-xs sm:text-sm text-muted-foreground font-mono font-medium">
                                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                </div>

                                {/* Top Actions (Menu) */}
                                {(isAdmin || user?.id === question.author_id) && (
                                    <EditQuestionDialog questionId={question.id} initialContent={question.content} />
                                )}
                            </div>

                            {/* 2. Content Body */}
                            <div className="px-3 sm:px-6 py-1 sm:py-2">
                                {/* Title */}
                                <h1 className="text-lg sm:text-2xl md:text-3xl font-black mb-2 sm:mb-4 leading-tight text-foreground tracking-tight text-balance">
                                    {question.title}
                                </h1>

                                {/* Markdown Content */}
                                <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none break-words leading-relaxed text-foreground/90 font-medium">
                                    <MarkdownRenderer content={question.content} />
                                </div>

                                {/* Edit Timestamp */}
                                {question.updated_at && new Date(question.updated_at).getTime() > new Date(question.created_at).getTime() + 60000 && (
                                    <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground/70 italic font-mono">
                                        <Edit2 className="h-3 w-3" />
                                        Düzenlendi: {formatDistanceToNow(new Date(question.updated_at), { addSuffix: true, locale: tr })}
                                    </div>
                                )}

                                {/* Tags & Badges */}
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors h-7 px-3 rounded-md text-xs font-bold uppercase tracking-wider">
                                        {question.category || "Genel"}
                                    </Badge>

                                    {isSolved && (
                                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 h-7 px-3 rounded-md text-xs font-bold uppercase">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Çözüldü
                                        </Badge>
                                    )}

                                    {question.tags?.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="h-7 border-border hover:bg-muted font-mono text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Stats Divider */}
                            <div className="px-3 sm:px-6 py-2 sm:py-4 flex items-center gap-4 border-b border-border/50 text-xs sm:text-sm font-bold text-muted-foreground mt-1 sm:mt-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-foreground">{question.views?.toLocaleString('tr-TR') || 0}</span>
                                    <span className="font-medium text-muted-foreground/70">Görüntülenme</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-foreground">{answers?.length || 0}</span>
                                    <span className="font-medium text-muted-foreground/70">Cevap</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-foreground">{question.votes || 0}</span>
                                    <span className="font-medium text-muted-foreground/70">Oy</span>
                                </div>
                            </div>

                            {/* 4. Action Bar (Twitter Style) */}
                            <div className="flex items-center justify-between px-2 sm:px-6 py-1.5 sm:py-3 bg-muted/5">
                                {/* Left Actions (Vote, Comment, Share) */}
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <VoteButton
                                        questionId={question.id}
                                        initialVotes={question.votes || 0}
                                        initialHasVoted={hasVoted}
                                        startExpanded={true} // Add this prop to VoteButton if needed, or style it there
                                    />

                                    <ReplyButton />

                                    <ReportButton
                                        contentType="question"
                                        contentId={question.id}
                                    />
                                </div>

                                {/* Right Actions (Bookmark) */}
                                <div className="flex items-center">
                                    <BookmarkButton
                                        type="question"
                                        itemId={question.id}
                                        initialBookmarked={!!userBookmark}
                                    />
                                    {/* Share Button Placeholder if needed */}
                                </div>
                            </div>
                        </div>

                        {/* Answers Section */}
                        <div className="mt-4 sm:mt-10 max-w-full">
                            <div className="flex items-center justify-between px-1 mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Cevaplar
                                    <span className="text-muted-foreground text-base font-medium ml-1 bg-muted px-2 py-0.5 rounded-full">{answers?.length || 0}</span>
                                </h3>
                            </div>

                            <AnswerList
                                questionId={question.id}
                                initialAnswers={answersWithLikes || []}
                                questionAuthorId={question.author_id}
                                currentUser={user}
                            />
                        </div>

                        {/* Related Questions */}
                        <div className="mt-12 pt-8 border-t-2 border-border/40">
                            <h4 className="font-black text-lg mb-4 opacity-80 uppercase tracking-widest pl-1">Benzer Tartışmalar</h4>
                            <RelatedQuestions
                                currentQuestionId={question.id}
                                category={question.category || "Genel"}
                            />
                        </div>
                    </main>

                    {/* Stats Sidebar (Desktop) */}
                    <aside className="hidden lg:block space-y-6 w-full sticky top-24 pt-10">
                        {/* Sidebar content simplified/designed */}
                        <div className="brutalist-card p-6 rounded-xl bg-card">
                            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                                <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                                Trendler
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Fizik dünyasında haftanın en çok konuşulan konularına göz at.
                                </p>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start font-bold border-2 h-10" asChild>
                                        <Link href="/forum?sort=popular">Popüler Sorular</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start font-bold border-2 h-10" asChild>
                                        <Link href="/forum?category=Kuantum">#Kuantum</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start font-bold border-2 h-10" asChild>
                                        <Link href="/forum?category=Astrofizik">#Astrofizik</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {(isAdmin || user?.id === question.author_id) && (
                            <div className="border-2 border-destructive/20 bg-destructive/5 rounded-xl p-6">
                                <h3 className="text-sm font-black text-destructive uppercase tracking-wider mb-4">Yönetici Paneli</h3>
                                <div className="space-y-3">
                                    <DeleteQuestionButton questionId={question.id} authorId={question.author_id} />
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            <ViewTracker questionId={question.id} />
            <StickyActionBar
                questionId={question.id}
                votes={question.votes || 0}
                hasVoted={hasVoted}
            />
        </div>
    );
}
