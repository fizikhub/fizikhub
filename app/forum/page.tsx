import { createStaticClient } from "@/lib/supabase-server";
import { ModernForumHeader } from "@/components/forum/modern-forum-header";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { QuestionList } from "@/components/forum/question-list";
import { QuestionOfTheWeek } from "@/components/forum/question-of-the-week";
import { Ghost } from "lucide-react";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { buildSafeIlikePattern } from "@/lib/security";
import { buildForumDiscussionPostingItem } from "@/lib/forum-structured-data";
import type { ForumStructuredDataProfile } from "@/lib/forum-structured-data";
import { getSiteUrl } from "@/lib/seo-utils";
import type { Metadata } from "next";

// Revalidate every 2 minutes for active active forum
export const revalidate = 120;

interface ForumPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type ForumQuestionRow = {
    id: number;
    title: string;
    content?: string | null;
    created_at: string;
    updated_at?: string | null;
    category?: string | null;
    votes?: number | null;
    tags?: string[] | null;
    profiles?: ForumStructuredDataProfile | ForumStructuredDataProfile[] | null;
    answers?: Array<{ count?: number | null } | Record<string, unknown>> | null;
    all_answers?: Array<{ count?: number | null }> | null;
};

export async function generateMetadata({ searchParams }: ForumPageProps): Promise<Metadata> {
    const params = await searchParams;
    const category = typeof params.category === 'string' && params.category !== 'Tümü' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;
    const filter = typeof params.filter === 'string' ? params.filter : undefined;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const page = typeof params.page === 'string' ? params.page : undefined;
    const hasLowValueParams = Boolean(query || filter || (sort && sort !== 'newest'));
    // Self-referencing canonical: each paginated page gets its own canonical
    let canonicalUrl = `${getSiteUrl()}/forum`;
    const canonicalParams = new URLSearchParams();
    if (category) canonicalParams.set('category', category);
    if (page && Number(page) > 1) canonicalParams.set('page', page);
    const qs = canonicalParams.toString();
    if (qs) canonicalUrl += `?${qs}`;
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
    const supabase = createStaticClient();
    const params = await searchParams;

    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'newest';
    const filter = typeof params.filter === 'string' ? params.filter : undefined;
    const searchQuery = typeof params.q === 'string' ? params.q : undefined;
    const requestedPage = typeof params.page === 'string' ? Number.parseInt(params.page, 10) : 1;
    const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
    const limit = 18;
    const offset = (page - 1) * limit;

    let selectString = `
        id, title, content, created_at, category, votes, tags,
        profiles(username, full_name, avatar_url, is_verified),
        answers(count)
    `;

    if (filter === 'solved') {
        selectString = `
            id, title, content, created_at, category, votes, tags,
            profiles(username, full_name, avatar_url, is_verified),
            answers!inner(id, is_accepted),
            all_answers:answers(count)
        `;
    } else if (filter === 'unanswered') {
        selectString = `
            id, title, content, created_at, category, votes, tags,
            profiles(username, full_name, avatar_url, is_verified),
            answers(id)
        `;
    }

    // Build query
    let query = supabase
        .from('questions')
        .select(selectString) as any;

    query = query.eq('status', 'published');

    // Apply filters
    if (category && category !== "Tümü") {
        query = query.eq('category', category);
    }

    if (searchQuery) {
        query = query.ilike('title', buildSafeIlikePattern(searchQuery));
    }

    if (filter === 'solved') {
        query = query.eq('answers.is_accepted', true);
    } else if (filter === 'unanswered') {
        query = query.is('answers', null);
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

    const [{ data: questions, error: questionsError }, { data: weeklyQuestion }, { data: latestArticle }] = await Promise.all([
        query,
        supabase
            .from('questions')
            .select('id')
            .contains('tags', ['haftanin-sorusu'])
            .limit(1)
            .maybeSingle(),
        supabase
            .from('articles')
            .select('title, slug, image_url, category')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
    ]);

    if (questionsError) {
        console.error("Supabase Error fetching forum questions:", questionsError);
    }

    const userVotes = new Map<number, number>();

    const baseUrl = getSiteUrl();
    const canonicalUrl = `${baseUrl}/forum`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Fizikhub Bilim Forumu',
        description: 'Fizik sorularını sor, tartışmalara katıl ve topluluktan öğren.',
        url: canonicalUrl,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: ((questions || []) as ForumQuestionRow[]).map((q, i) => (
                buildForumDiscussionPostingItem(q, i, baseUrl)
            ))
        }
    };

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'Forum', href: '/forum' }]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-background min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
                <div className="container py-3 md:py-8 px-3 min-[390px]:px-4 md:px-8 max-w-[1600px] mx-auto">
                    {/* SEO-friendly heading — visible and descriptive */}
                    <div className="mb-4 md:mb-6 border-2 border-black/80 dark:border-zinc-700 bg-white dark:bg-[#1e1e21] p-3.5 sm:p-4 rounded-[8px] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#EAB308]"></div>
                        <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-black dark:text-zinc-50 flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="bg-[#EAB308] border-2 border-black text-black px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase">
                                {category && category !== 'Tümü' ? category : 'Genel'}
                            </span>
                            {category && category !== 'Tümü'
                                ? `${category} Soruları ve Tartışmaları`
                                : filter === 'solved'
                                ? 'Fizikhub Çözülmüş Bilim Soruları'
                                : filter === 'unanswered'
                                ? 'Fizikhub Cevaplanmamış Bilim Soruları'
                                : 'Fizikhub Bilim Forumu'}
                        </h1>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-2 leading-relaxed max-w-3xl">
                            {category && category !== 'Tümü'
                                ? `${category} alanı altındaki soru-cevap paylaşımları, topluluk çözümleri ve akademik tartışmalar.`
                                : filter === 'solved'
                                ? 'Topluluk tarafından doğrulanmış ve çözüme kavuşturulmuş fizik ve bilim soruları.'
                                : filter === 'unanswered'
                                ? 'Henüz yanıtlanmamış, katkınızı ve bilimsel açıklamalarınızı bekleyen fizik ve bilim soruları.'
                                : 'Merak ettiğin fizik ve bilim sorularını sor, tartışmalara katıl ve topluluktan öğren. TYT, AYT, Kuantum, Astrofizik ve fazlası.'}
                        </p>
                    </div>

                    <ModernForumHeader />

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-10">
                        {/* Main Content */}
                        <div className="space-y-6 min-w-0 order-2 lg:order-1">
                            {!questions || questions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-[3px] border-dashed border-black/30 dark:border-zinc-600 rounded-[10px] bg-card">
                                    <div className="w-16 h-16 rounded-xl bg-[#EAB308]/20 border-[2.5px] border-black dark:border-zinc-600 flex items-center justify-center mb-5 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]">
                                        <Ghost className="w-8 h-8 text-black dark:text-zinc-300" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">
                                        {searchQuery
                                            ? `"${searchQuery}" için sonuç bulunamadı`
                                            : filter === 'solved'
                                            ? "Henüz çözülmüş soru bulunmuyor"
                                            : filter === 'unanswered'
                                            ? "Tüm sorular cevaplanmış!"
                                            : "Henüz soru sorulmamış"}
                                    </h3>
                                    <p className="text-sm font-medium text-muted-foreground max-w-sm leading-relaxed">
                                        {searchQuery
                                            ? "Farklı anahtar kelimelerle aramayı deneyebilirsin."
                                            : filter === 'solved'
                                            ? "Diğer sorulara cevap vererek ilk çözümlü soruyu sen oluşturabilirsin!"
                                            : filter === 'unanswered'
                                            ? "Yeni bir soru sorarak tartışmayı başlatabilirsin."
                                            : "Bu kategori sessiz görünüyor. İlk soruyu sen sorarak tartışmayı başlatabilirsin!"}
                                    </p>
                                </div>
                            ) : (
                                <QuestionList
                                    initialQuestions={((questions || []) as ForumQuestionRow[]).map((q) => {
                                        const { answers, all_answers, ...questionForClient } = q;
                                        const actualAnswers = all_answers ?? answers;
                                        const answerCount = filter === 'unanswered'
                                            ? 0
                                            : (actualAnswers?.[0]?.count ?? actualAnswers?.length ?? 0);
                                        return {
                                            ...questionForClient,
                                            content: q.content ? q.content.slice(0, 350) : '',
                                            answer_count: answerCount
                                        };
                                    })}
                                    userVotes={userVotes}
                                    latestArticle={latestArticle}
                                />
                            )}
                        </div>

                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block space-y-8 order-2 sticky top-[100px] h-fit" aria-label="Forum kenar çubuğu">
                            <ForumSidebar />
                            {weeklyQuestion && <QuestionOfTheWeek questionId={weeklyQuestion.id} />}
                        </aside>

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
