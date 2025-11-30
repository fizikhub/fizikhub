"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface Comment {
    id: number;
    content: string;
    answer_id: number;
    author_id: string;
    created_at: string;
    profiles?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        is_verified?: boolean | null;
    } | null;
}

export function useRealtimeComments(answerId: number, initialComments: Comment[]) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const supabase = createClient();

    useEffect(() => {
        // Subscribe to new comments for this answer
        const channel = supabase
            .channel(`comments_${answerId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'answer_comments',
                    filter: `answer_id=eq.${answerId}`
                },
                async (payload) => {
                    // Fetch the complete comment with profile data
                    const { data: newComment } = await supabase
                        .from('answer_comments')
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

                    if (newComment) {
                        setComments((current) => [...current, newComment]);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'answer_comments',
                    filter: `answer_id=eq.${answerId}`
                },
                (payload) => {
                    setComments((current) =>
                        current.filter((c) => c.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [answerId, supabase]);

    return comments;
}
