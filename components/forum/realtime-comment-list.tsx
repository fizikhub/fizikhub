"use client";

import { useRealtimeComments } from "@/hooks/useRealtimeComments";
import { AnswerCommentList } from "./answer-comment-list";
import { useEffect } from "react";

interface RealtimeCommentListProps {
    answerId: number;
    initialComments: any[];
    currentUserId?: string;
    questionId: number;
    onDelete?: (commentId: number) => void;
    onCountChange?: (count: number) => void;
}

export function RealtimeCommentList({
    answerId,
    initialComments,
    currentUserId,
    questionId,
    onDelete,
    onCountChange
}: RealtimeCommentListProps) {
    const comments = useRealtimeComments(answerId, initialComments);

    useEffect(() => {
        if (onCountChange) {
            onCountChange(comments.length);
        }
    }, [comments.length, onCountChange]);

    return (
        <AnswerCommentList
            comments={comments}
            currentUserId={currentUserId}
            questionId={questionId}
            onDelete={(id) => {
                // We rely on realtime for state update, but we can call parent's onDelete if needed
                if (onDelete) onDelete(id);
            }}
        />
    );
}
