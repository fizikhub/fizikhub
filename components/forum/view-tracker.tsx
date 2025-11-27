"use client";

import { useEffect, useRef } from "react";
import { incrementView } from "@/app/forum/actions";

export function ViewTracker({ questionId }: { questionId: number }) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        if (!hasIncremented.current) {
            hasIncremented.current = true;
            incrementView(questionId);
        }
    }, [questionId]);

    return null;
}
