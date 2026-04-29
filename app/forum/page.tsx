import { createClient } from "@/lib/supabase-server";
import { ModernForumHeader } from "@/components/forum/modern-forum-header";
import { Suspense } from "react";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { QuestionCard } from "@/components/forum/question-card";
import { QuestionList } from "@/components/forum/question-list";
import { QuestionOfTheWeek } from "@/components/forum/question-of-the-week";
import { ForumHeaderFallback } from "@/components/forum/forum-header-fallback";
import { Ghost } from "lucide-react";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { sanitizeSearchQuery } from "@/lib/security";
import type { Metadata } from "next";

// Revalidate every 2 minutes for active active forum
export const revalidate = 120;

interface ForumPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: ForumPageProps): Promise<Metadata> {
    const params = await searchParams;
    const category = typeof params.category === 'string' && params.category !== 'Tümü' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;
    const filter = typeof params.filter === 'string' ? params.filter : undefined;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const page = typeof params.page === 'string' ? params.page : undefined;
    const hasLowValueParams = Boolean(query || filter || page || (sort && sort !== 'newest'));
    const canonicalUrl = category
        ? `https://www.fizikhub.com/forum?category=${encodeURIComponent(category)}`
        : "https://www.fizikhub.com/forum";
    const title = category ? `${category} Soruları ve Bilim Forumu` : "Bilim Forumu";
    const description = category
        ? `${category} hakkında fizik ve bilim soruları, cevaplar ve topluluk tartışmaları.`
        : "Fizik sorularını sor, tartışmalara katıl ve topluluktan öğren. TYT/AYT fizik, kuantum, astrofizik ve daha fazlası.";

    return {
        title,
        description,
        keywords: ["fizik forumu", "bilim soruları", "fizik soru cevap", "TYT fizik soruları", "bilimsel tartışma", category || "fizik"],
        robots: hasLowValueParams
            ? { index: false, follow: true }
            : { index: true, follow: true },
        openGraph: {
            title: category ? `${category} Soruları — Fizikhub` : "Bilim Forumu — Fizikhub",
            description,
            type: "website",
            url: canonicalUrl,
            images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub Bilim Forumu" }],
        },
        twitter: {
            card: "summary_large_image",
            title: category ? `${category} Soruları — Fizikhub` : "Bilim Forumu — Fizikhub",
            description,
            images: ["/og-image.jpg"],
        },
        alternates: { canonical: canonicalUrl },
    };
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
    const supabase = await createClient();
    const params = await searchParams;

    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'newest';
    const searchQuery = typeof params.q === 'string' ? params.q : undefined;
    const filter = typeof params.filter === 'string' ? params.filter : undefined;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const limit = 30; // Limit for performance
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
        .from('questions')
        .select(`
            id, title, content, created_at, category, votes, author_id, tags,
            profiles(username, full_name, avatar_url, is_verified),
            answers(count)
        `, { count: 'exact' });

    // Apply filters
    if (category && category !== "Tümü") {
        query = query.eq('category', category);
    }

    if (searchQuery) {
        const sanitizedSearch = sanitizeSearchQuery(searchQuery);
        query = query.ilike('title', `%${sanitizedSearch}%`);
    }

    // Apply sorting
    if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
    } else {
        // Default to popular (votes)
        query = query.order('votes', { ascending: false });
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Run main query + user auth + secondary queries in parallel
    const [{ data: questions, count: totalCount, error: questionsError }, { data: { user } }, { data: weeklyQuestion }, { data: latestArticle }] = await Promise.all([
        query,
        supabase.auth.getUser(),
        // Fetch Question of the Week
        supabase
            .from('questions')
            .select('id')
            .contains('tags', ['haftanin-sorusu'])
            .limit(1)
            .maybeSingle(),
        // Fetch Latest Article for Ad (Only from Writers)
        supabase
            .from('articles')
            .select('title, slug, image_url, content, category, created_at, author:profiles!articles_author_id_fkey(full_name, is_writer)')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
    ]);

    if (questionsError) {
        console.error("Supabase Error fetching forum questions:", questionsError);
    }

    // Fetch user's votes to show "voted" state
    const userVotes = new Map<number, number>();
    if (user && questions && questions.length > 0) {
        const { data: votes } = await supabase
            .from('question_votes')
            .select('question_id, vote_type')
            .eq('user_id', user.id)
            .in('question_id', questions.map(q => q.id));

        if (votes) {
            votes.forEach(v => userVotes.set(v.question_id, v.vote_type));
        }
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Fizikhub Bilim Forumu',
        description: 'Fizik sorularını sor, tartışmalara katıl ve topluluktan öğren.',
        url: 'https://www.fizikhub.com/forum',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: questions?.map((q, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://www.fizikhub.com/forum/${q.id}`,
                name: q.title
            })) || []
        }
    };

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'Forum', href: '/forum' }]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-background min-h-screen pb-20">
                <div className="container py-4 md:py-8 px-4 md:px-8 max-w-[1600px] mx-auto">
                    <Suspense fallback={<ForumHeaderFallback currentCategory={category} currentSort={sort} />}>
                        <ModernForumHeader />
                    </Suspense>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-10">
                        {/* Main Content */}
                        <div className="space-y-6 min-w-0 order-2 lg:order-1">
                            {!questions || questions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-[3px] border-dashed border-black/30 dark:border-zinc-600 rounded-[10px] bg-card">
                                    <div className="w-16 h-16 rounded-xl bg-[#FFBD2E]/20 border-[2.5px] border-black dark:border-zinc-600 flex items-center justify-center mb-5 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]">
                                        <Ghost className="w-8 h-8 text-black dark:text-zinc-300" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">
                                        {searchQuery
                                            ? `"${searchQuery}" için sonuç bulunamadı`
                                            : "Henüz soru sorulmamış"}
                                    </h3>
                                    <p className="text-sm font-medium text-muted-foreground max-w-sm leading-relaxed">
                                        {searchQuery
                                            ? "Farklı anahtar kelimelerle aramayı deneyebilirsin."
                                            : "Bu kategori sessiz görünüyor. İlk soruyu sen sorarak tartışmayı başlatabilirsin!"}
                                    </p>
                                </div>
                            ) : (
                                <QuestionList
                                    initialQuestions={questions}
                                    userVotes={userVotes}
                                    latestArticle={latestArticle}
                                />
                            )}
                        </div>

                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block space-y-8 order-2 sticky top-[100px] h-fit">
                            <ForumSidebar />
                            {weeklyQuestion && <QuestionOfTheWeek questionId={weeklyQuestion.id} />}
                        </div>

                        {/* Mobile Question of the Week (Bottom) */}
                        <div className="lg:hidden mt-8 order-3">
                            <QuestionOfTheWeek questionId={weeklyQuestion?.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
