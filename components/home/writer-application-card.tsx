"use client";

import { PenTool, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function WriterApplicationCard() {
    return (
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <PenTool className="w-6 h-6 text-foreground/70" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                            Yazar Ol
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Bilgini paylaşmayı ve yazmayı seviyorsan yazar kadromuza katılabilirsin.
                        </p>
                    </div>

                    <Link href="/basvuru/yazar">
                        <Button size="sm" variant="outline" className="gap-2 text-sm font-medium">
                            Başvur
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
