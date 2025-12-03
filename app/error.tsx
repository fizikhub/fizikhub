"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-background to-background -z-10" />

            <div className="space-y-6 max-w-md mx-auto">
                <div className="text-6xl mb-4 animate-pulse">
                    🚨
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                    Houston, Bir Sorunumuz Var!
                </h2>

                <p className="text-muted-foreground text-lg">
                    Beklenmedik bir hata oluştu. Sistemlerimiz şu an bu durumu analiz ediyor.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button onClick={reset} size="lg" className="gap-2 rounded-full">
                        <RefreshCw className="h-4 w-4" />
                        Tekrar Dene
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2 rounded-full">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Ana Sayfa
                        </Link>
                    </Button>
                </div>

                {error.digest && (
                    <p className="text-xs text-muted-foreground/50 mt-8 font-mono">
                        Hata Kodu: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
