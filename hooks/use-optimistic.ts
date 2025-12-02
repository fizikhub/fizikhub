"use client";

import { useState, useTransition } from 'react';

/**
 * Optimistic UI Hook
 * Provides immediate UI feedback while server action is processing
 * 
 * @example
 * const [isLiked, toggleLike] = useOptimistic(initialLiked, likeAction);
 */
export function useOptimistic<T>(
    initialState: T,
    serverAction: (newState: T) => Promise<void | { error?: string }>
): [T, (newState: T) => Promise<void>] {
    const [state, setState] = useState<T>(initialState);
    const [isPending, startTransition] = useTransition();

    const optimisticUpdate = async (newState: T) => {
        // Immediately update UI (optimistic)
        setState(newState);

        // Start server action
        startTransition(async () => {
            try {
                const result = await serverAction(newState);

                // If server returns error, rollback
                if (result?.error) {
                    setState(initialState); // Rollback to previous state
                    console.error('Optimistic update failed:', result.error);
                }
            } catch (error) {
                // On error, rollback
                setState(initialState);
                console.error('Optimistic update error:', error);
            }
        });
    };

    return [state, optimisticUpdate];
}
