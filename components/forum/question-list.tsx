"use client";

import { QuestionCard } from "@/components/forum/question-card";
import { useRealtimeQuestions } from "@/hooks/useRealtimeQuestions";

interface QuestionListProps {
    initialQuestions: any[];
    userVotes: Map<number, number>;
}

export function QuestionList({ initialQuestions, userVotes }: QuestionListProps) {
    const questions = useRealtimeQuestions(initialQuestions);

    return (
        <div className="space-y-3">
            {questions.map((question) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    userVote={userVotes.get(question.id)}
                />
            ))}
        </div>
    );
}
