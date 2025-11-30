"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface Question {
    id: number;
    title: string;
    content: string;
    category: string;
    author_id: string;
    created_at: string;
    vote_count: number;
    view_count: number;
    profiles?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        is_verified?: boolean | null;
    } | null;
    answers?: any[];
}

export function useRealtimeQuestions(initialQuestions: Question[]) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const supabase = createClient();

    useEffect(() => {
        // Subscribe to new questions
        const channel = supabase
            .channel('questions_realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'questions'
                },
                async (payload) => {
                    // Fetch the complete question with profile data
                    const { data: newQuestion } = await supabase
                        .from('questions')
                        .select(`
                            *,
                            profiles (
                                username,
                                full_name,
                                avatar_url,
                                is_verified
                            )
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (newQuestion) {
                        setQuestions((current) => [newQuestion, ...current]);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'questions'
                },
                (payload) => {
                    setQuestions((current) =>
                        current.map((q) =>
                            q.id === payload.new.id
                                ? { ...q, ...payload.new }
                                : q
                        )
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return questions;
}
