import { createClient } from "@/lib/supabase-server";
import { ModernForumHeader } from "@/components/forum/modern-forum-header";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { QuestionCard } from "@/components/forum/question-card";
import { QuestionList } from "@/components/forum/question-list";
import { QuestionOfTheWeek } from "@/components/forum/question-of-the-week";

// Revalidate every 2 minutes for active active forum
export const revalidate = 120;

export const metadata = {
    title: "Bilim Forumu | Fizikhub",
    description: "Fizik sorularını sor, tartışmalara katıl ve topluluktan öğren. TYT/AYT fizik, kuantum, astrofizik ve daha fazlası.",
};

interface ForumPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
            *,
            profiles(username, full_name, avatar_url, is_verified),
            answers(count)
        `, { count: 'exact' });

    // Apply filters
    if (category && category !== "Tümü") {
        query = query.eq('category', category);
    }

    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
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

    const { data: questions, count: totalCount } = await query;

    // Fetch user's votes to show "voted" state
    let userVotes = new Map<number, number>();
    const { data: { user } } = await supabase.auth.getUser();

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

    // Fetch Question of the Week
    const { data: weeklyQuestion } = await supabase
        .from('questions')
        .select('id')
        .contains('tags', ['haftanin-sorusu'])
        .limit(1)
        .maybeSingle();

    // Fetch Latest Article for Ad
    const { data: latestArticle } = await supabase
        .from('articles')
        .select('title, slug, image_url, summary, category, created_at, author:profiles(full_name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Fizikhub Bilim Forumu',
        description: 'Fizik sorularını sor, tartışmalara katıl ve topluluktan öğren.',
        url: 'https://fizikhub.com/forum',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: questions?.map((q, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://fizikhub.com/forum/${q.id}`,
                name: q.title
            })) || []
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-background pb-20">
                <div className="container py-4 sm:py-6 md:py-10 px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
                    <ModernForumHeader />

                    {/* Mobile Question of the Week */}
                    <div className="md:hidden mb-6">
                        <QuestionOfTheWeek questionId={weeklyQuestion?.id} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 sm:gap-6 lg:gap-8">
                        {/* Desktop Sidebar */}
                        <div className="hidden md:block sticky top-24 h-fit space-y-6">
                            <QuestionOfTheWeek questionId={weeklyQuestion?.id} />
                            <ForumSidebar />
                        </div>

                        {/* Main Content */}
                        <div className="space-y-3 sm:space-y-4 md:space-y-6 min-w-0">
                            {!questions || questions.length === 0 ? (
                                <div className="text-center py-12 sm:py-20 border-2 border-dashed border-white/10 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm">
                                    <div className="max-w-md mx-auto px-4">
                                        <p className="text-muted-foreground text-base sm:text-lg mb-2">
                                            {searchQuery
                                                ? `"${searchQuery}" için sonuç bulunamadı.`
                                                : "Henüz hiç soru sorulmamış."}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            {!searchQuery && "İlk soran sen ol!"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <QuestionList
                                    initialQuestions={questions}
                                    userVotes={userVotes}
                                    latestArticle={latestArticle}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
