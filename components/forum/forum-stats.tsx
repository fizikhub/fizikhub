"use client";

import { createClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ForumStats() {
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalAnswers: 0,
        solvedQuestions: 0,
        activeUsers: 0
    });
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const fetchStats = async () => {

            // Get total questions
            const { count: questionsCount } = await supabase
                .from('questions')
                .select('*', { count: 'exact', head: true });

            // Get total answers
            const { count: answersCount } = await supabase
                .from('answers')
                .select('*', { count: 'exact', head: true });

            // Get solved questions (questions with accepted answer)
            const { count: solvedCount } = await supabase
                .from('answers')
                .select('*', { count: 'exact', head: true })
                .eq('is_accepted', true);

            // Get active users (posted in last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: activeUsersData } = await supabase
                .from('questions')
                .select('author_id')
                .gte('created_at', thirtyDaysAgo.toISOString());

            const uniqueUsers = new Set(activeUsersData?.map(q => q.author_id) || []);

            setStats({
                totalQuestions: questionsCount || 0,
                totalAnswers: answersCount || 0,
                solvedQuestions: solvedCount || 0,
                activeUsers: uniqueUsers.size
            });
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            icon: MessageSquare,
            label: "Toplam Soru",
            value: stats.totalQuestions,
            color: "text-blue-500"
        },
        {
            icon: TrendingUp,
            label: "Toplam Cevap",
            value: stats.totalAnswers,
            color: "text-purple-500"
        },
        {
            icon: CheckCircle2,
            label: "Çözülen",
            value: stats.solvedQuestions,
            color: "text-green-500"
        },
        {
            icon: Users,
            label: "Aktif Kullanıcı",
            value: stats.activeUsers,
            color: "text-orange-500"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
                <Card key={stat.label} className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.value.toLocaleString('tr-TR')}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
