import { getQuizBySlug } from "../actions";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const quiz = await getQuizBySlug(slug);
    if (!quiz) return { title: "Test Bulunamadı" };

    return {
        title: `${quiz.title} | Fizik Testi`,
        description: quiz.description || `${quiz.title} - Fizikhub'da fizik bilgini test et!`,
        openGraph: {
            title: `${quiz.title} — Fizikhub Fizik Testi`,
            description: quiz.description || `${quiz.title} - Fizik bilgini test et ve puan kazan!`,
            type: "website",
            url: `https://www.fizikhub.com/testler/${slug}`,
        },
        twitter: {
            card: "summary",
            title: `${quiz.title} — Fizikhub`,
            description: quiz.description || `${quiz.title} - Fizik bilgini test et!`,
        },
        alternates: { canonical: `https://www.fizikhub.com/testler/${slug}` },
    };
}

export default async function QuizPage({ params }: Props) {
    const { slug } = await params;
    const quiz = await getQuizBySlug(slug);

    if (!quiz) {
        notFound();
    }

    const questions = Array.isArray(quiz.questions)
        ? quiz.questions as QuizQuestionForSchema[]
        : [];
    const canonical = `https://www.fizikhub.com/testler/${slug}`;
    const quizJsonLd = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "@id": `${canonical}#quiz`,
        name: quiz.title,
        description: quiz.description || `${quiz.title} fizik testi`,
        url: canonical,
        inLanguage: "tr-TR",
        about: "Fizik",
        educationalLevel: "Lise",
        isAccessibleForFree: true,
        provider: {
            "@type": "Organization",
            name: "Fizikhub",
            url: "https://www.fizikhub.com",
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
        description: quiz.description || `${quiz.title} fizik testi`,
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
                description={quiz.description}
            />
        </div>
    );
}
