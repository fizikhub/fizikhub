import { getQuizBySlug } from "../actions";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

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
            url: `https://fizikhub.com/testler/${slug}`,
        },
        twitter: {
            card: "summary",
            title: `${quiz.title} — Fizikhub`,
            description: quiz.description || `${quiz.title} - Fizik bilgini test et!`,
        },
        alternates: { canonical: `https://fizikhub.com/testler/${slug}` },
    };
}

export default async function QuizPage({ params }: Props) {
    const { slug } = await params;
    const quiz = await getQuizBySlug(slug);

    if (!quiz) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-transparent">
            <QuizRunner
                quizId={quiz.id}
                questions={quiz.questions}
                title={quiz.title}
                description={quiz.description}
            />
        </div>
    );
}
