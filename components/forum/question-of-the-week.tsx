"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, HelpCircle } from "lucide-react";
import Link from "next/link";

interface QuestionOfTheWeekProps {
    questionId?: number;
    questionSlug?: string;
}

export function QuestionOfTheWeek({ questionId, questionSlug }: QuestionOfTheWeekProps) {
    // If no ID provided, fallback to a default or hide?
    // For now, hardcode the known title slug if not provided, but ideally we pass it.
    const targetUrl = questionId ? `/forum/soru/${questionId}` : "/forum/soru/isik-hizi-tren-paradoksu";

    return (
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-lg font-bold">Haftanın Sorusu</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="mb-2 text-lg font-semibold">
                    Işık hızıyla giden bir trende ileriye doğru fener tutarsak ışığın hızı ne olur?
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    En iyi cevabı veren "Einstein Rozeti" kazanacak!
                </p>
                <Link href={targetUrl}>
                    <Button className="w-full gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Cevapla
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
