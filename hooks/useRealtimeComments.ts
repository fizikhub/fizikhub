"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin-shared";

type PublicProfile = {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_verified?: boolean | null;
};

interface RawComment {
    id: number;
    content: string;
    answer_id: number;
    author_id: string;
    created_at: string;
    profiles?: PublicProfile | PublicProfile[] | null;
}

type Comment = Omit<RawComment, "author_id" | "profiles"> & {
    profiles?: PublicProfile | null;
    canDelete?: boolean;
};

function getPublicProfile(profile: PublicProfile | PublicProfile[] | null | undefined): PublicProfile | null {
    return Array.isArray(profile) ? profile[0] || null : profile || null;
}

function toClientComment(comment: RawComment, currentUserId?: string, currentUserEmail?: string): Comment {
    const { author_id, profiles, ...clientComment } = comment;

    return {
        ...clientComment,
        profiles: getPublicProfile(profiles),
        canDelete: currentUserId === author_id || isAdminEmail(currentUserEmail),
    };
}

export function useRealtimeComments(
    answerId: number,
    initialComments: Comment[],
    currentUserId?: string,
    currentUserEmail?: string
) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [supabase] = useState(() => createClient());

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
                            id,
                            content,
                            answer_id,
                            author_id,
                            created_at,
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
                        setComments((current) => [...current, toClientComment(newComment as unknown as RawComment, currentUserId, currentUserEmail)]);
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
    }, [answerId, supabase, currentUserId, currentUserEmail]);

    return comments;
}
