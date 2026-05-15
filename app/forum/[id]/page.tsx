import { createClient, createStaticClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Eye, MessageSquare, ArrowLeft, CheckCircle2, Flame, BadgeCheck, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundWrapper } from "@/components/home/background-wrapper";
import { cn } from "@/lib/utils";
import { isAdminEmail } from "@/lib/admin";

import { AnswerList } from "@/components/forum/answer-list";
import { DeleteQuestionButton } from "@/components/forum/delete-question-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { VoteButton } from "@/components/forum/vote-button";
import { ViewTracker } from "@/components/forum/view-tracker";
import { BookmarkButton } from "@/components/bookmark-button";
import { ReportButton } from "@/components/report-button";
import { EditQuestionDialog } from "@/components/forum/edit-question-dialog";
// import { ScrollFixer } from "@/components/ui/scroll-fixer";
import { StickyActionBar } from "@/components/forum/sticky-action-bar";
import { QuickNav } from "@/components/forum/quick-nav";
import { RelatedQuestions } from "@/components/forum/related-questions";
import { ReplyButton } from "@/components/forum/reply-button";
import { ReadingProgress } from "@/components/forum/reading-progress";
import { ShareDrawer } from "@/components/forum/share-drawer";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getSiteUrl, hasUsefulIndexableText, isLikelyIndexableTitle, stripMarkdownForMeta, truncateForMeta } from "@/lib/seo-utils";

import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

type PublicProfile = {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_verified?: boolean | null;
};

// ISR: Regenerate every 30 seconds for forum questions
export const revalidate = 30;

function getPublicProfile(profile: PublicProfile | PublicProfile[] | null | undefined): PublicProfile | null {
    return Array.isArray(profile) ? profile[0] || null : profile || null;
}

function getAnswerCount(question: { answers?: Array<{ count?: number | null }> | null }) {
    return Number(question.answers?.[0]?.count || 0);
}

function parseQuestionId(rawId: string) {
    const match = rawId.match(/^\d+/);
    if (!match) return null;

    const questionId = Number.parseInt(match[0], 10);
    return Number.isSafeInteger(questionId) ? questionId : null;
}

function isIndexableForumQuestion(question: {
    title?: string | null;
    content?: string | null;
    answers?: Array<{ count?: number | null }> | null;
}) {
    const visibleText = [question.title, question.content].filter(Boolean).join(" ");
    return isLikelyIndexableTitle(question.title) && (hasUsefulIndexableText(visibleText, 40) || getAnswerCount(question) > 0);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const questionId = parseQuestionId(id);

    if (!questionId) {
        return {
            title: "Soru Bulunamadı",
            robots: { index: false, follow: false },
        };
    }

    const supabase = createStaticClient();

    const { data: question } = await supabase
        .from('questions')
        .select('title, content, category, tags, created_at, votes, profiles(username), answers(count)')
        .eq('id', questionId)
        .single();

    if (!question) {
        return {
            title: "Soru Bulunamadı",
            robots: { index: false, follow: false },
        };
    }

    const baseUrl = getSiteUrl();
    const canonicalUrl = `${baseUrl}/forum/${questionId}`;
    const category = question.category || 'Genel';
    const cleanContent = stripMarkdownForMeta(question.content);
    const description = truncateForMeta(
        cleanContent || `${question.title} sorusu için Fizikhub ${category} forumunda topluluk cevapları ve bilimsel tartışmalar.`,
        155
    );
    const seoTitle = `${question.title} — ${category} Forumu`;
    const shouldIndex = isIndexableForumQuestion(question);

    // Dynamic keywords from category + tags
    const dynamicKeywords = [
        question.title.toLowerCase(),
        category.toLowerCase(),
        'fizik forumu',
        'bilim soruları',
        ...(question.tags || []).map((t: string) => t.toLowerCase()),
        'fizikhub',
    ].filter(Boolean);

    const ogUrl = new URL(`${baseUrl}/api/og`);
    ogUrl.searchParams.set('title', question.title);
    ogUrl.searchParams.set('category', category);

    return {
        title: seoTitle,
        description,
        keywords: dynamicKeywords,
        robots: shouldIndex ? { index: true, follow: true } : { index: false, follow: true },
        openGraph: {
            title: seoTitle,
            description,
            type: "website",
            url: canonicalUrl,
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
            title: seoTitle,
            description,
            images: [ogUrl.toString()],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function QuestionPage({ params }: PageProps) {
    const { id } = await params;
    const questionId = parseQuestionId(id);

    if (!questionId) {
        notFound();
    }

    const publicSupabase = createStaticClient();

    // Fetch question details
    const { data: rawQuestion, error } = await publicSupabase.from('questions')
        .select(`
            id, title, content, created_at, category, tags, votes, views, author_id,
            profiles(username, full_name, avatar_url, is_verified)
        `)
        .eq('id', questionId)
        .single();

    if (error || !rawQuestion) {
        notFound();
    }

    const question = {
        ...rawQuestion,
        updated_at: null,
        profiles: getPublicProfile(rawQuestion.profiles),
    };

    // Check if user is admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = isAdminEmail(user?.email);

    // Fetch answers and user interactions in parallel
    const [
        { data: answers },
        { data: userVote },
        { data: userBookmark }
    ] = await Promise.all([
        // 1. Fetch answers
        publicSupabase
            .from('answers')
            .select(`
                id, question_id, author_id, content, created_at, is_accepted,
                profiles(username, full_name, avatar_url, is_verified)
            `)
            .eq('question_id', question.id)
            .order('created_at', { ascending: true }),

        // 2. Check if user has voted (only if logged in)
        user ? supabase
            .from('question_votes')
            .select('vote_type')
            .eq('question_id', question.id)
            .eq('user_id', user.id)
            .maybeSingle() : Promise.resolve({ data: null }),

        // 3. Check if user has bookmarked (only if logged in)
        user ? supabase
            .from('question_bookmarks')
            .select('id')
            .eq('question_id', question.id)
            .eq('user_id', user.id)
            .maybeSingle() : Promise.resolve({ data: null })
    ]);

    const hasVoted = userVote?.vote_type === 1;

    // Fetch like counts and user likes for all answers
    // Extract answer IDs
    const normalizedAnswers = (answers || []).map((answer) => ({
        ...answer,
        votes: 0,
        updated_at: null,
        profiles: getPublicProfile(answer.profiles),
    }));
    const answerIds = normalizedAnswers.map(a => a.id);
    const hasAnswers = answerIds.length > 0;

    // Fetch all related data in parallel for answers
    const [
        { data: allAnswerLikesData },
        { data: allAnswerUserLikesData },
        { data: allCommentsData }
    ] = await Promise.all([
        // 1. All answer likes (using view/count or full select grouped by id)
        // Note: For counts, getting all records is acceptable if the dataset per question is small.
        // A better approach long-term is an RPC, but fetching 'answer_id' to group in memory works for now.
        hasAnswers ? publicSupabase
            .from('answer_likes')
            .select('answer_id')
            .in('answer_id', answerIds) : Promise.resolve({ data: [] }),

        // 2. User's explicit likes for these answers
        user && hasAnswers ? supabase
            .from('answer_likes')
            .select('answer_id')
            .eq('user_id', user.id)
            .in('answer_id', answerIds) : Promise.resolve({ data: [] }),

        // 3. All comments for these answers
        hasAnswers ? publicSupabase
            .from('answer_comments')
            .select(`
                id, answer_id, author_id, content, created_at,
                profiles(username, full_name, avatar_url, is_verified)
            `)
            .in('answer_id', answerIds)
            .order('created_at', { ascending: true }) : Promise.resolve({ data: [] })
    ]);

    const normalizedCommentsData = (allCommentsData || []).map((comment) => ({
        ...comment,
        profiles: getPublicProfile(comment.profiles),
    }));

    const commentIds = (allCommentsData || []).map(c => c.id);
    const hasComments = commentIds.length > 0;

    // Fetch all related data for comments in parallel
    const [
        { data: allCommentLikesData },
        { data: allCommentUserLikesData }
    ] = await Promise.all([
        // 1. All comment likes
        hasComments ? publicSupabase
            .from('answer_comment_likes')
            .select('comment_id')
            .in('comment_id', commentIds) : Promise.resolve({ data: [] }),

        // 2. User's specific likes for these comments
        user && hasComments ? supabase
            .from('answer_comment_likes')
            .select('comment_id')
            .eq('user_id', user.id)
            .in('comment_id', commentIds) : Promise.resolve({ data: [] })
    ]);

    // Aggregate in memory (O(N) operations, entirely eliminates N+1 DB calls)
    const answersWithLikes = normalizedAnswers.map((answer) => {
        const { author_id: answerAuthorId, ...answerForClient } = answer;
        // Count Answer Likes
        const likeCount = (allAnswerLikesData || []).filter(l => l.answer_id === answer.id).length;
        // Check User Answer Like
        const isLiked = (allAnswerUserLikesData || []).some(l => l.answer_id === answer.id);

        // Map Comments
        const answerComments = normalizedCommentsData.filter(c => c.answer_id === answer.id);
        const commentsWithLikes = answerComments.map((comment) => {
            const { author_id: commentAuthorId, ...commentForClient } = comment;
            const commentLikeCount = (allCommentLikesData || []).filter(cl => cl.comment_id === comment.id).length;
            const isCommentLiked = (allCommentUserLikesData || []).some(cl => cl.comment_id === comment.id);

            return {
                ...commentForClient,
                canDelete: isAdmin || user?.id === commentAuthorId,
                likeCount: commentLikeCount,
                isLiked: isCommentLiked
            };
        });

        return {
            ...answerForClient,
            canDelete: isAdmin || user?.id === answerAuthorId,
            likeCount,
            isLiked,
            comments: commentsWithLikes
        };
    });



    // Status indicators
    const isSolved = answersWithLikes?.some(a => a.is_accepted) || false;

    // JSON-LD Structured Data for Q&A
    const acceptedAnswer = answersWithLikes?.find(a => a.is_accepted);
    const suggestedAnswers = answersWithLikes?.filter(a => !a.is_accepted);

    const baseUrl = getSiteUrl();

    // QAPage JSON-LD — Google Rich Results for Q&A
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        '@id': `${baseUrl}/forum/${question.id}#qapage`,
        url: `${baseUrl}/forum/${question.id}`,
        mainEntity: {
            '@type': 'Question',
            '@id': `${baseUrl}/forum/${question.id}#question`,
            name: question.title,
            text: stripMarkdownForMeta(question.content), // Full text required by Google
            answerCount: answers?.length || 0,
            upvoteCount: question.votes || 0,
            dateCreated: question.created_at,
            datePublished: question.created_at,
            author: {
                '@type': 'Person',
                name: question.profiles?.username || 'Anonim',
                url: question.profiles?.username ? `${baseUrl}/kullanici/${question.profiles.username}` : baseUrl,
            },
            ...(acceptedAnswer && {
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: stripMarkdownForMeta(acceptedAnswer.content),
                    dateCreated: acceptedAnswer.created_at,
                    datePublished: acceptedAnswer.created_at,
                    upvoteCount: acceptedAnswer.votes || 0,
                    url: `${baseUrl}/forum/${question.id}#answer-${acceptedAnswer.id}`,
                    author: {
                        '@type': 'Person',
                        name: acceptedAnswer.profiles?.username || 'Anonim',
                        url: acceptedAnswer.profiles?.username ? `${baseUrl}/kullanici/${acceptedAnswer.profiles.username}` : baseUrl,
                    },
                },
            }),
            ...(suggestedAnswers && suggestedAnswers.length > 0 && {
                suggestedAnswer: suggestedAnswers.slice(0, 10).map(answer => ({
                    '@type': 'Answer',
                    text: stripMarkdownForMeta(answer.content),
                    dateCreated: answer.created_at,
                    datePublished: answer.created_at,
                    upvoteCount: answer.votes || 0,
                    url: `${baseUrl}/forum/${question.id}#answer-${answer.id}`,
                    author: {
                        '@type': 'Person',
                        name: answer.profiles?.username || 'Anonim',
                        url: answer.profiles?.username ? `${baseUrl}/kullanici/${answer.profiles.username}` : baseUrl,
                    },
                })),
            }),
        },
    };

    const tagColors = [
        "bg-[#FFBD2E] text-black", // Neo Yellow
        "bg-neo-pink text-white", // Neo Pink
        "bg-neo-blue text-white", // Neo Blue
        "bg-[#4ADE80] text-black", // Neo Green
        "bg-[#c084fc] text-white", // Neo Purple
    ];

    return (
        <div className="min-h-screen bg-background pb-20 relative overflow-x-hidden selection:bg-[#FFBD2E]/20 selection:text-[#FFBD2E]">
            <ReadingProgress />
            <BackgroundWrapper />
            <BreadcrumbJsonLd items={[
                { name: 'Forum', href: '/forum' },
                { name: question.title, href: `/forum/${question.id}` }
            ]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto py-2 sm:py-6 md:py-8 px-0 sm:px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 lg:gap-8 items-start">

                    {/* Main Content Column */}
                    <main className="min-w-0 w-full">
                        {/* Back Button & Header */}
                        <div className="flex items-center gap-4 mb-2 sm:mb-4 px-2 sm:px-0">
                            <Button variant="ghost" size="sm" className="gap-2 pl-2 sm:pl-0 hover:pl-2 transition-all -ml-2 font-bold uppercase text-xs tracking-wider text-muted-foreground hover:text-foreground" asChild>
                                <Link prefetch={false} href="/forum">
                                    <ArrowLeft className="h-4 w-4 stroke-[3px]" />
                                    <span className="hidden sm:inline">Foruma Dön</span>
                                    <span className="sm:hidden">Geri</span>
                                </Link>
                            </Button>
                        </div>

                        {/* QUESTION CARD - Neo-Brutalist */}
                        <article itemScope itemType="https://schema.org/Question" className={cn(
                            "relative overflow-hidden transition-all duration-200",
                            "bg-white dark:bg-[#1e1e21]",
                            "border-[2.5px] border-black dark:border-zinc-700 rounded-[10px]",
                            "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]",
                            "-mx-2 sm:mx-0"
                        )}>
                            {/* Noise Texture */}
                            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none mix-blend-multiply z-0"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                            />

                            {/* 1. Yellow Neo-Brutalist Header Bar */}
                            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b-[2.5px] border-black dark:border-zinc-700 bg-gradient-to-r from-[#FFBD2E] to-[#FFD466] z-10 relative">
                                <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-black">
                                    {question.category || "GENEL"}
                                </span>
                                <div className="flex items-center gap-2">
                                    {isSolved && (
                                        <div className="flex items-center gap-1 bg-black text-[#FFBD2E] px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Çözüldü
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Author Info & Edit (Below Header) */}
                            <div className="p-4 sm:p-5 pb-0 flex justify-between items-start gap-3 relative z-10">
                                <div className="flex items-center gap-3">
                                    <Link prefetch={false} href={`/kullanici/${question.profiles?.username}`} className="block group">
                                        <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border-[2px] border-black dark:border-zinc-600 rounded-full overflow-hidden bg-white shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.1)] group-hover:shadow-[1px_1px_0_0_#000] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all">
                                            <AvatarImage src={question.profiles?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="bg-white dark:bg-zinc-800 text-black dark:text-white font-black text-sm">
                                                {question.profiles?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex flex-col leading-tight">
                                        <Link prefetch={false} href={`/kullanici/${question.profiles?.username}`}
                                            className="font-bold text-base sm:text-lg hover:text-[#FFBD2E] transition-colors flex items-center gap-1.5"
                                        >
                                            @{question.profiles?.username || "Anonim"}
                                            {question.profiles?.is_verified && (
                                                <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                            )}
                                        </Link>
                                        <time dateTime={question.created_at} className="font-medium text-xs text-neutral-500 dark:text-zinc-500">
                                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                        </time>
                                    </div>
                                </div>

                                {/* Top Actions (Menu) */}
                                {(isAdmin || user?.id === question.author_id) && (
                                    <div className="bg-white dark:bg-zinc-800 border-[2px] border-black dark:border-zinc-600 rounded-lg shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.1)]">
                                        <EditQuestionDialog questionId={question.id} initialContent={question.content} />
                                    </div>
                                )}
                            </div>

                            {/* 3. Content Body */}
                            <div className="px-4 sm:px-6 py-5 relative z-10">
                                {/* Title */}
                                <h1 className="font-[family-name:var(--font-outfit)] text-2xl sm:text-3xl font-black text-black dark:text-zinc-50 leading-tight tracking-tight mb-5">
                                    {question.title}
                                </h1>

                                {/* Markdown Content */}
                                <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none break-words leading-[1.8] font-[family-name:var(--font-inter)] text-neutral-700 dark:text-zinc-300">
                                    <MarkdownRenderer content={question.content} />
                                </div>

                                {/* Tags & Badges */}
                                {question.tags && question.tags.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {question.tags.map((tag: string, index: number) => {
                                            const colorClass = tagColors[index % tagColors.length];
                                            return (
                                                <Badge key={tag} variant="outline" className={cn(
                                                    "h-7 border-[2px] border-black dark:border-zinc-600 font-bold text-[10px] sm:text-xs uppercase shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.1)] rounded-full hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all px-3",
                                                    colorClass
                                                )}>
                                                    #{tag}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* 4. Stats & Actions Combined */}
                            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t-[2.5px] border-black dark:border-zinc-700 bg-neutral-50 dark:bg-[#161618] relative z-10">
                                {/* Left: Stats + Actions */}
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <VoteButton
                                        questionId={question.id}
                                        initialVotes={question.votes || 0}
                                        initialHasVoted={hasVoted}
                                        startExpanded={true}
                                    />

                                    <ReplyButton />

                                    <ShareDrawer
                                        url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.fizikhub.com'}/forum/${question.id}`}
                                        title={question.title}
                                    >
                                        <Button variant="ghost" size="icon" className="h-9 w-9 border-[2px] border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg text-black dark:text-zinc-300 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:bg-[#FFBD2E] hover:text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all pointer-events-auto">
                                            <Share2 className="h-3.5 w-3.5 stroke-[2.5px]" />
                                        </Button>
                                    </ShareDrawer>

                                    <ReportButton
                                        contentType="question"
                                        contentId={question.id}
                                    />
                                </div>

                                {/* Right: Stats + Bookmark */}
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-neutral-500 dark:text-zinc-500">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{question.views?.toLocaleString('tr-TR') || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            <span>{answers?.length || 0}</span>
                                        </div>
                                    </div>
                                    <BookmarkButton
                                        type="question"
                                        itemId={question.id}
                                        initialBookmarked={!!userBookmark}
                                    />
                                </div>
                            </div>
                        </article>

                        {/* Answers Section */}
                        <section aria-label="Cevaplar" className="mt-8 sm:mt-10 max-w-full px-2 sm:px-0">
                            <div className="flex items-center justify-between px-1 mb-5">
                                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-[#FFBD2E]" />
                                    Cevaplar
                                    <span className="text-sm font-bold text-neutral-500 dark:text-zinc-500 bg-neutral-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-neutral-200 dark:border-zinc-700">{answers?.length || 0}</span>
                                </h3>
                            </div>

                            <AnswerList
                                questionId={question.id}
                                initialAnswers={answersWithLikes || []}
                                currentUser={user}
                            />
                        </section>

                        {/* Related Questions */}
                        <div className="mt-10 sm:mt-12 px-2 sm:px-0">
                            <RelatedQuestions
                                currentQuestionId={question.id}
                                category={question.category || "Genel"}
                            />
                        </div>
                    </main>

                    {/* Stats Sidebar (Desktop) */}
                    <aside className="hidden lg:block space-y-6 w-full sticky top-24 pt-10">
                        {/* Explore Sidebar */}
                        <div className="bg-white dark:bg-[#1e1e21] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] p-5 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)]">
                            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-tight">
                                <Flame className="h-5 w-5 text-[#FFBD2E]" />
                                Keşfet
                            </h3>
                            <div className="space-y-3">
                                <p className="text-xs font-medium text-neutral-500 dark:text-zinc-500 leading-relaxed">
                                    Fizik dünyasında en çok konuşulan konulara göz at.
                                </p>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start font-bold text-xs uppercase border-[2px] border-black dark:border-zinc-600 hover:bg-[#FFBD2E] hover:text-black hover:border-black h-10 rounded-lg shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all dark:text-zinc-300" asChild>
                                        <Link prefetch={false} href="/forum?sort=popular">Popüler Sorular</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start font-bold text-xs uppercase border-[2px] border-black dark:border-zinc-600 hover:bg-neo-pink hover:text-white hover:border-black h-10 rounded-lg shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all dark:text-zinc-300" asChild>
                                        <Link prefetch={false} href="/forum?category=Kuantum">#Kuantum</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start font-bold text-xs uppercase border-[2px] border-black dark:border-zinc-600 hover:bg-neo-blue hover:text-white hover:border-black h-10 rounded-lg shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all dark:text-zinc-300" asChild>
                                        <Link prefetch={false} href="/forum?category=Astrofizik">#Astrofizik</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {(isAdmin || user?.id === question.author_id) && (
                            <div className="border-[2.5px] border-red-400 dark:border-red-500/40 bg-red-50 dark:bg-red-950/20 rounded-[10px] p-5 shadow-[3px_3px_0_0_rgba(239,68,68,0.3)]">
                                <h3 className="font-black text-sm text-red-700 dark:text-red-400 uppercase tracking-wider mb-3">Yönetim</h3>
                                <div className="space-y-3">
                                    <DeleteQuestionButton questionId={question.id} />
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            <ViewTracker questionId={question.id} />
            <QuickNav />
            <StickyActionBar
                questionId={question.id}
                votes={question.votes || 0}
                hasVoted={hasVoted}
            />
        </div>
    );
}
