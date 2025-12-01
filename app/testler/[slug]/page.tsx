import { getQuizBySlug } from "../actions";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const quiz = await getQuizBySlug(params.slug);
    if (!quiz) return { title: "Test Bulunamadı" };

    return {
        title: `${quiz.title} | Fizikhub`,
        description: quiz.description,
    };
}

export default async function QuizPage({ params }: Props) {
    const quiz = await getQuizBySlug(params.slug);

    if (!quiz) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-10 px-4 mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
                <p className="text-muted-foreground">{quiz.description}</p>
            </div>

            <QuizRunner
                quizId={quiz.id}
                questions={quiz.questions}
                title={quiz.title}
            />
        </div>
    );
}
