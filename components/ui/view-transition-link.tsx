"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface ViewTransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function ViewTransitionLink({
    children,
    href,
    onClick,
    ...props
}: ViewTransitionLinkProps) {
    const router = useRouter();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            onClick(e);
        }

        if (e.defaultPrevented) return;

        e.preventDefault();

        if (!document.startViewTransition) {
            router.push(href);
            return;
        }

        document.startViewTransition(() => {
            router.push(href);
        });
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
}
