"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface ViewTransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    id?: string;
}

export function ViewTransitionLink({
    children,
    href,
    onClick,
    id,
    prefetch,
    ...props
}: ViewTransitionLinkProps) {
    const router = useRouter();

    const prefetchRoute = () => {
        if (typeof href !== "string" || !href.startsWith("/")) return;
        router.prefetch(href);
    };

    const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            onClick(e);
        }
        // Let native Next.js <Link> handle navigation natively across all viewports to utilize
        // React's concurrent mode rendering, background prefetching, and route caches.
        // Native CSS "@view-transition { navigation: auto; }" in globals.css handles the transition.
    };

    return (
        <Link
            prefetch={prefetch ?? true}
            {...props}
            href={href}
            onClick={handleTransition}
            onFocus={prefetchRoute}
            onPointerEnter={prefetchRoute}
            onTouchStart={prefetchRoute}
            id={id}
        >
            {children}
        </Link>
    );
}
