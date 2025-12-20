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
        <div className="container max-w-5xl py-12 px-4 mx-auto min-h-screen">
            <div className="text-center mb-12 pb-8 border-b-4 border-black dark:border-white">
                <Badge className="mb-4 text-lg py-1 px-4 border-2 border-black dark:border-white bg-primary text-primary-foreground hover:bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    FİZİK TESTİ
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                    {quiz.title}
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                    {quiz.description}
                </p>
            </div>

            <QuizRunner
                quizId={quiz.id}
                questions={quiz.questions}
                title={quiz.title}
            />
        </div>
    );
}
