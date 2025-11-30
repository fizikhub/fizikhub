"use client";

import { QuestionCard } from "@/components/forum/question-card";
import { useRealtimeQuestions } from "@/hooks/useRealtimeQuestions";

interface QuestionListProps {
    initialQuestions: any[];
    userVotes: Set<number>;
}

export function QuestionList({ initialQuestions, userVotes }: QuestionListProps) {
    const questions = useRealtimeQuestions(initialQuestions);

    return (
        <div className="space-y-4">
            {questions.map((question) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    hasVoted={userVotes.has(question.id)}
                />
            ))}
        </div>
    );
}
