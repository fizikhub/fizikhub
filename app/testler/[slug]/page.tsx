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
        title: `${quiz.title} | Fizikhub`,
        description: quiz.description,
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
