"use client";

import { useRealtimeComments } from "@/hooks/useRealtimeComments";
import { AnswerCommentList } from "./answer-comment-list";
import { useEffect, useRef } from "react";

interface RealtimeCommentListProps {
    answerId: number;
    initialComments: any[];
    currentUserId?: string;
    questionId: number;
    onDelete?: (commentId: number) => void;
    onCommentsChange?: (comments: any[]) => void;
}

export function RealtimeCommentList({
    answerId,
    initialComments,
    currentUserId,
    questionId,
    onDelete,
    onCommentsChange
}: RealtimeCommentListProps) {
    const comments = useRealtimeComments(answerId, initialComments);
    const onCommentsChangeRef = useRef(onCommentsChange);

    // Update ref when prop changes
    useEffect(() => {
        onCommentsChangeRef.current = onCommentsChange;
    }, [onCommentsChange]);

    useEffect(() => {
        if (onCommentsChangeRef.current) {
            onCommentsChangeRef.current(comments);
        }
    }, [comments]);

    return (
        <AnswerCommentList
            comments={comments}
            currentUserId={currentUserId}
            questionId={questionId}
            onDelete={(id) => {
                if (onDelete) onDelete(id);
            }}
        />
    );
}
