"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-destructive/5">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
                {/* Broken Atom Illustration */}
                <div className="relative">
                    <div className="text-[150px] md:text-[200px] font-black opacity-10 select-none">
                        500
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            {/* Broken nucleus */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-destructive rounded-full opacity-50 blur-md animate-pulse" />
                                    <div className="absolute inset-0 w-12 h-12 border-4 border-destructive rounded-full" />
                                </div>
                            </div>
                            {/* Broken orbits */}
                            <div className="absolute inset-0 border-4 border-dashed border-destructive/40 rounded-full" style={{ clipPath: "inset(0 50% 0 0)" }} />
                            <div className="absolute inset-4 border-4 border-dashed border-destructive/40 rounded-full rotate-45" style={{ clipPath: "inset(0 0 50% 0)" }} />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Bir Şeyler Ters Gitti</h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Sistemde bir hata oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground font-mono">
                            Hata Kodu: {error.digest}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={reset} size="lg" className="gap-2 group">
                        <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                        Tekrar Dene
                    </Button>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="gap-2">
                            <Home className="h-5 w-5" />
                            Ana Sayfa
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
