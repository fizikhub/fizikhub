"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Database } from "@/types/database";

type Answer = Database['public']['Tables']['answers']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AnswerWithProfile extends Answer {
    profiles: Pick<Profile, 'username' | 'full_name' | 'avatar_url'> & {
        is_verified?: boolean | null;
    } | null;
    likeCount?: number;
    isLiked?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments?: any[]; // Keep as any for now if comments structure isn't fully defined yet, or define if possible
}

export function useRealtimeAnswers(questionId: number, initialAnswers: AnswerWithProfile[]) {
    const [answers, setAnswers] = useState<AnswerWithProfile[]>(initialAnswers);
    const supabase = createClient();

    useEffect(() => {
        // Subscribe to new answers for this question
        const channel = supabase
            .channel(`answers_${questionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'answers',
                    filter: `question_id=eq.${questionId}`
                },
                async (payload) => {
                    // Fetch the complete answer with profile data
                    const { data: newAnswer } = await supabase
                        .from('answers')
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

                    if (newAnswer) {
                        setAnswers((current) => [...current, { ...newAnswer, comments: [] } as AnswerWithProfile]);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'answers',
                    filter: `question_id=eq.${questionId}`
                },
                (payload) => {
                    setAnswers((current) =>
                        current.map((a) =>
                            a.id === payload.new.id
                                ? { ...a, ...payload.new }
                                : a
                        )
                    );
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'answers',
                    filter: `question_id=eq.${questionId}`
                },
                (payload) => {
                    setAnswers((current) =>
                        current.filter((a) => a.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [questionId, supabase]);

    return answers;
}
