"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Database } from "@/types/database";

type Question = Database['public']['Tables']['questions']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface QuestionWithProfile extends Question {
    profiles: Pick<Profile, 'username' | 'full_name' | 'avatar_url'> & {
        is_verified?: boolean | null;
    } | null;
    votes: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answers?: any[]; // Keep as any for now or define Answer structure if needed
}

export function useRealtimeQuestions(initialQuestions: QuestionWithProfile[]) {
    const [questions, setQuestions] = useState<QuestionWithProfile[]>(initialQuestions);
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
                        setQuestions((current) => [newQuestion as QuestionWithProfile, ...current]);
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
