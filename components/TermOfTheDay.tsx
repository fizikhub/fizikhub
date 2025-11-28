"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw } from "lucide-react";
import { DictionaryTerm } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface TermOfTheDayProps {
    terms: DictionaryTerm[];
}

export function TermOfTheDay({ terms }: TermOfTheDayProps) {
    const [term, setTerm] = useState<DictionaryTerm | null>(null);

    const pickRandomTerm = () => {
        if (terms.length > 0) {
            const randomIndex = Math.floor(Math.random() * terms.length);
            setTerm(terms[randomIndex]);
        }
    };

    useEffect(() => {
        pickRandomTerm();
    }, [terms]);

    if (!term) {
        return (
            <Card className="h-full w-full bg-gradient-to-br from-card to-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Günün Terimi</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Henüz terim eklenmemiş. Veritabanını kontrol edin.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full w-full bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                    <CardTitle className="text-base md:text-lg font-bold">Günün Terimi</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={pickRandomTerm} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg md:text-xl font-bold text-primary">{term.term}</h3>
                    <Badge variant="secondary" className="text-[10px] md:text-xs w-fit">{term.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {term.definition}
                </p>
            </CardContent>
        </Card>
    );
}
