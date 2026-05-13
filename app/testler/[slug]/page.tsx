import { getQuizBySlug } from "../actions";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { SEO_PRIORITY_ARTICLES } from "@/lib/seo-priority";
import { getSiteUrl, hasUsefulIndexableText, isLikelyIndexableTitle, truncateForMeta } from "@/lib/seo-utils";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

type QuizQuestionForSchema = {
    question_text?: string;
    options?: unknown;
    correct_answer?: number;
};

function getQuestions(quiz: { questions?: unknown }) {
    return Array.isArray(quiz.questions)
        ? quiz.questions as QuizQuestionForSchema[]
        : [];
}

function getQuizDescription(quiz: { title: string; description?: string | null; questions?: unknown }) {
    return truncateForMeta(
        quiz.description || `${quiz.title} testiyle fizik bilgini ölç, eksiklerini gör ve doğru cevabı anında öğren.`,
        158
    );
}

function isIndexableQuiz(quiz: { title?: string | null; description?: string | null; questions?: unknown }) {
    const questions = getQuestions(quiz);
    return isLikelyIndexableTitle(quiz.title) && (questions.length >= 3 || hasUsefulIndexableText(quiz.description, 40));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const quiz = await getQuizBySlug(slug);
    if (!quiz) return { title: "Test Bulunamadı" };

    const baseUrl = getSiteUrl();
    const canonical = `${baseUrl}/testler/${slug}`;
    const description = getQuizDescription(quiz);
    const title = `${quiz.title}: Online Fizik Testi`;
    const shouldIndex = isIndexableQuiz(quiz);

    return {
        title,
        description,
        openGraph: {
            title: `${quiz.title} — Fizikhub Fizik Testi`,
            description,
            type: "website",
            url: canonical,
            images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: `${quiz.title} fizik testi` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${quiz.title} — Fizikhub`,
            description,
            images: [`${baseUrl}/og-image.jpg`],
        },
        robots: shouldIndex ? { index: true, follow: true } : { index: false, follow: true },
        alternates: { canonical },
    };
}

function QuizSeoDetails({ quiz, questions }: {
    quiz: { title: string; description?: string | null; points?: number | null };
    questions: QuizQuestionForSchema[];
}) {
    const previewQuestions = questions
        .filter((question) => isLikelyIndexableTitle(question.question_text))
        .slice(0, 5);
    const relatedArticles = SEO_PRIORITY_ARTICLES.slice(0, 4);

    return (
        <section className="container mx-auto max-w-3xl px-4 pb-12" aria-labelledby="quiz-seo-summary">
            <div className="rounded-[10px] border-[2.5px] border-black bg-white p-5 text-black shadow-[4px_4px_0_0_#000] dark:bg-zinc-900 dark:text-white sm:p-6">
                <h2 id="quiz-seo-summary" className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                    {quiz.title} ne ölçer?
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">
                    Bu test, fizik kavramlarını yalnızca ezber düzeyinde değil; soru okuma, seçenek eleme ve doğru ilişki kurma becerisiyle ölçer.
                    Cevabı kontrol ettiğinde doğru seçeneği anında görürsün. {quiz.points ? `${quiz.points} HubPuan kazanma fırsatı da var.` : "Kısa pratik için uygundur."}
                </p>

                {previewQuestions.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500">
                            Bu testte karşılaşabileceğin soru tarzları
                        </h3>
                        <ul className="mt-3 grid gap-2">
                            {previewQuestions.map((question, index) => (
                                <li key={`${question.question_text}-${index}`} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold leading-6 dark:border-zinc-700 dark:bg-zinc-800">
                                    {question.question_text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <nav className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-700" aria-label="Testten önce okunabilecek konu anlatımları">
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500">
                        Testten önce konu anlatımı oku
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Link href="/makale" className="rounded-md border border-black bg-yellow-400 px-3 py-2 text-xs font-black text-black">
                            Fizik makaleleri
                        </Link>
                        <Link href="/sozluk" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-black text-white">
                            Bilim sözlüğü
                        </Link>
                        {relatedArticles.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/makale/${article.slug}`}
                                className="rounded-md border border-zinc-300 px-3 py-2 text-xs font-bold text-zinc-700 transition-colors hover:border-yellow-400 hover:text-black dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"
                            >
                                {article.title}
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default async function QuizPage({ params }: Props) {
    const { slug } = await params;
    const quiz = await getQuizBySlug(slug);

    if (!quiz) {
        notFound();
    }

    const questions = getQuestions(quiz);
    const baseUrl = getSiteUrl();
    const canonical = `${baseUrl}/testler/${slug}`;
    const description = getQuizDescription(quiz);
    const quizJsonLd = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "@id": `${canonical}#quiz`,
        name: quiz.title,
        description,
        url: canonical,
        inLanguage: "tr-TR",
        about: { "@type": "Thing", name: "Fizik" },
        educationalLevel: "Lise",
        educationalAlignment: {
            "@type": "AlignmentObject",
            alignmentType: "educationalSubject",
            targetName: "Fizik",
        },
        isAccessibleForFree: true,
        provider: {
            "@type": "Organization",
            name: "Fizikhub",
            url: baseUrl,
        },
        hasPart: questions.slice(0, 10).map((question) => {
            const options = Array.isArray(question.options) ? question.options : [];
            const answer = typeof question.correct_answer === "number"
                ? options[question.correct_answer]
                : undefined;

            return {
                "@type": "Question",
                name: question.question_text || quiz.title,
                ...(typeof answer === "string" ? {
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: answer,
                    },
                } : {}),
            };
        }),
    };
    const learningResourceJsonLd = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "@id": `${canonical}#learning-resource`,
        name: quiz.title,
        description,
        learningResourceType: "Quiz",
        educationalLevel: "Lise",
        teaches: "Fizik",
        url: canonical,
        inLanguage: "tr-TR",
    };

    return (
        <div className="min-h-screen bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
            />
            <BreadcrumbJsonLd items={[
                { name: "Testler", href: "/testler" },
                { name: quiz.title, href: `/testler/${slug}` },
            ]} />
            <QuizRunner
                quizId={quiz.id}
                questions={quiz.questions}
                title={quiz.title}
                description={description}
            />
            <QuizSeoDetails quiz={quiz} questions={questions} />
        </div>
    );
}
