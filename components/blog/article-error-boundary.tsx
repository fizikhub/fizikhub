"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Client-side error boundary that wraps interactive article components.
 * If a client-side error occurs (e.g., in Instagram WebView or restricted browsers),
 * this boundary catches it and renders a minimal fallback instead of crashing
 * the entire page with the "Yüksek İhtimalle Sıçtık" error screen.
 */
export class ArticleErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to console in development, silently handle in production
        if (typeof window !== 'undefined') {
            console.error('[ArticleErrorBoundary] Client-side error caught:', error.message);
        }
    }

    render() {
        if (this.state.hasError) {
            // Return the fallback if provided, otherwise render nothing
            // The article HTML is already server-rendered, so the content is visible
            return this.props.fallback || null;
        }

        return this.props.children;
    }
}
