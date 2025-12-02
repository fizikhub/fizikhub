"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { setWeeklyQuestion } from "@/app/actions/weekly-pick";
import { toast } from "sonner";
import { Search, Trophy, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Question {
    id: number;
    title: string;
    category: string;
    created_at: string;
    profiles: {
        username: string | null;
    } | null;
}

interface WeeklyQuestionManagerProps {
    currentPick: any;
}

export function WeeklyQuestionManager({ currentPick }: WeeklyQuestionManagerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [settingPick, setSettingPick] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);

        const supabase = createClient();
        const { data, error } = await supabase
            .from("questions")
            .select(`
                id,
                title,
                category,
                created_at,
                profiles (
                    username
                )
            `)
            .ilike("title", `%${searchQuery}%`)
            .limit(5);

        if (data) {
            setSearchResults(data as any);
        }
        setLoading(false);
    };

    const handleSetPick = async (questionId: number) => {
        setSettingPick(true);
        const result = await setWeeklyQuestion(questionId);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Haftanın sorusu güncellendi!");
            setSearchResults([]);
            setSearchQuery("");
        }
        setSettingPick(false);
    };

    return (
        <div className="space-y-8">
            {/* Current Pick */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-200 dark:border-amber-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                        <Trophy className="h-5 w-5" />
                        Aktif Haftanın Sorusu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {currentPick ? (
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">{currentPick.questions.title}</h3>
                            <div className="text-sm text-muted-foreground flex gap-2">
                                <span>@{currentPick.questions.profiles?.username || "Anonim"}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(currentPick.created_at), { addSuffix: true, locale: tr })}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Henüz bir soru seçilmemiş.</p>
                    )}
                </CardContent>
            </Card>

            {/* Search */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Yeni Soru Seç</h2>
                <div className="flex gap-2">
                    <Input
                        placeholder="Soru başlığında ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" />
                        {loading ? "Aranıyor..." : "Ara"}
                    </Button>
                </div>

                <div className="grid gap-4">
                    {searchResults.map((question) => (
                        <Card key={question.id} className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">{question.title}</p>
                                    <div className="text-xs text-muted-foreground flex gap-2">
                                        <span className="bg-muted px-1.5 py-0.5 rounded">{question.category}</span>
                                        <span>@{question.profiles?.username || "Anonim"}</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleSetPick(question.id)}
                                    disabled={settingPick}
                                >
                                    {settingPick ? "Seçiliyor..." : "Bunu Seç"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {searchResults.length === 0 && searchQuery && !loading && (
                        <p className="text-sm text-muted-foreground text-center py-4">Sonuç bulunamadı.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
