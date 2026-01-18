
import { createClient } from "@/lib/supabase-server";
import { ModernForumHeader } from "@/components/forum/modern-forum-header";
import { Suspense } from "react";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { QuestionCard } from "@/components/forum/question-card";
import { QuestionList } from "@/components/forum/question-list";
import { QuestionOfTheWeek } from "@/components/forum/question-of-the-week";
import { Ghost } from "lucide-react";

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

    // Fetch Latest Article for Ad (Only from Writers)
    const { data: latestArticle } = await supabase
        .from('articles')
        .select('title, slug, image_url, content, category, created_at, author:profiles!articles_author_id_fkey!inner(full_name)')
        .eq('status', 'published')
        .eq('author.is_writer', true)
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
            <div className="bg-background min-h-screen pb-20">
                <div className="container py-4 md:py-8 px-4 md:px-8 max-w-[1400px] mx-auto">
                    <Suspense fallback={<div className="h-[300px] rounded-3xl bg-muted/20 animate-pulse mb-8" />}>
                        <ModernForumHeader />
                    </Suspense>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
                        {/* Main Content */}
                        <div className="space-y-6 min-w-0 order-2 lg:order-1">
                            {!questions || questions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-border rounded-3xl bg-muted/5">
                                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                        <Ghost className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        {searchQuery
                                            ? `"${searchQuery}" için sonuç bulunamadı`
                                            : "Henüz soru sorulmamış"}
                                    </h3>
                                    <p className="text-muted-foreground text-sm max-w-sm">
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
