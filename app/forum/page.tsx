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

function getIndexableCategory(value: string | undefined) {
    return value && value !== "Tümü" ? value : undefined;
}

function getForumCanonicalUrl(baseUrl: string, category?: string, page?: number | string) {
    let canonicalUrl = `${baseUrl}/forum`;
    const canonicalParams = new URLSearchParams();
    const pageNumber = typeof page === "string" ? Number(page) : page;

    if (category) canonicalParams.set("category", category);
    if (pageNumber && Number(pageNumber) > 1) canonicalParams.set("page", String(pageNumber));

    const qs = canonicalParams.toString();
    if (qs) canonicalUrl += `?${qs}`;

    return canonicalUrl;
}

function getForumSeoCopy(category?: string) {
    if (category) {
        return {
            title: `${category} Forumu ve Soru Cevap`,
            description: `${category} forumunda soru sor, açıklamalı cevapları incele ve ilgili fizik/bilim tartışmalarına Fizikhub topluluğuyla katıl.`,
        };
    }

    return {
        title: "Bilim ve Fizik Forumu: TYT AYT Fizik Soru Sor",
        description: "Fizik forumu ve bilim forumu: TYT/AYT/YKS fizik sorularını sor, açıklamalı cevapları incele, kuantum, mekanik ve astrofizik tartışmalarına katıl.",
    };
}

export async function generateMetadata({ searchParams }: ForumPageProps): Promise<Metadata> {
    const params = await searchParams;
    const category = getIndexableCategory(typeof params.category === 'string' ? params.category : undefined);
    const sort = typeof params.sort === 'string' ? params.sort : undefined;
    const filter = typeof params.filter === 'string' ? params.filter : undefined;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const page = typeof params.page === 'string' ? params.page : undefined;
    const hasLowValueParams = Boolean(query || filter || (sort && sort !== 'newest'));
    const canonicalUrl = getForumCanonicalUrl(getSiteUrl(), category, page);
    const { title, description } = getForumSeoCopy(category);
    const shouldIndex = !hasLowValueParams;

    return {
        title,
        description,
        keywords: [
            "bilim forumu",
            "fizik forumu",
            "fizik soru cevap",
            "TYT fizik soru sor",
            "AYT fizik soru sor",
            "YKS fizik forumu",
            "fizik soru çözümü",
            "bilimsel tartışma",
            category || "fizik",
        ],
        robots: {
            index: shouldIndex,
            follow: true,
            googleBot: {
                index: shouldIndex,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
                'max-video-preview': -1,
            },
        },
        openGraph: {
            title: category ? `${category} Forumu ve Soru Cevap — Fizikhub` : "Bilim ve Fizik Forumu — Fizikhub",
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
        alternates: {
            canonical: canonicalUrl,
            languages: {
                "tr-TR": canonicalUrl,
                "x-default": canonicalUrl,
            },
        },
    };
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
    const supabase = createStaticClient();
    const params = await searchParams;

    const category = getIndexableCategory(typeof params.category === 'string' ? params.category : undefined);
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
    const canonicalUrl = getForumCanonicalUrl(baseUrl, category, page);
    const { title: pageTitle, description: pageDescription } = getForumSeoCopy(category);
    const includeQuestionListJsonLd = !searchQuery && !filter && sort === "newest";
    const forumKeywords = [
        "bilim forumu",
        "fizik forumu",
        "fizik soru cevap",
        "TYT fizik",
        "AYT fizik",
        "YKS fizik",
        "kuantum",
        "mekanik",
        "astrofizik",
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        name: pageTitle,
        alternateName: ['Fizikhub Bilim Forumu', 'Türkçe Fizik Forumu', 'Fizik Soru Cevap Forumu'],
        description: pageDescription,
        url: canonicalUrl,
        isPartOf: { '@id': `${baseUrl}/#website` },
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'tr-TR',
        keywords: forumKeywords.join(', '),
        about: [
            { '@type': 'Thing', name: 'Fizik' },
            { '@type': 'Thing', name: 'Bilim' },
            { '@type': 'Thing', name: 'TYT AYT YKS fizik' },
            { '@type': 'Thing', name: 'Kuantum fiziği' },
            { '@type': 'Thing', name: 'Astrofizik' },
        ],
        audience: {
            '@type': 'EducationalAudience',
            educationalRole: ['student', 'teacher', 'science enthusiast'],
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/forum?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
        ...(includeQuestionListJsonLd ? { mainEntity: {
            '@type': 'ItemList',
            numberOfItems: ((questions || []) as ForumQuestionRow[]).length,
            itemListElement: ((questions || []) as ForumQuestionRow[]).map((q, i) => (
                buildForumDiscussionPostingItem(q, i, baseUrl)
            ))
        } } : {})
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
