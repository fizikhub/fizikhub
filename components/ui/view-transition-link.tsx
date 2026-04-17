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
    ...props
}: ViewTransitionLinkProps) {
    const router = useRouter();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            onClick(e);
        }

        if (e.defaultPrevented) return;

        // Let the browser/Next.js handle new tabs
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
            return;
        }

        // On mobile or unsupported browsers, do NOT prevent default.
        // Let the native Next.js <Link> handle the click natively so it uses React concurrent rendering!
        // This is crucial for "buttery" fluid navigation without main thread blocking.
        if (!document.startViewTransition || window.innerWidth < 768) {
            return;
        }

        e.preventDefault();

        document.startViewTransition(() => {
            router.push(href);
        });
    };

    return (
        <Link  {...props} href={href} onClick={handleTransition} id={id}>
            {children}
        </Link>
    );
}
