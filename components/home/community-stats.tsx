"use client";

import { motion } from "framer-motion";
import { Users, MessageCircle, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface StatsProps {
    userCount: number;
    questionCount: number;
    answerCount: number;
}

export function CommunityStats({ userCount, questionCount, answerCount }: StatsProps) {
    return (
        <section className="py-12 bg-muted/30 border-y border-border/50">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatItem
                        icon={Users}
                        value={userCount}
                        label="Fizikçi"
                        delay={0}
                    />
                    <StatItem
                        icon={HelpCircle}
                        value={questionCount}
                        label="Soru"
                        delay={0.1}
                    />
                    <StatItem
                        icon={MessageCircle}
                        value={answerCount}
                        label="Cevap"
                        delay={0.2}
                    />
                </div>
            </div>
        </section>
    );
}

function StatItem({ icon: Icon, value, label, delay }: { icon: any, value: number, label: string, delay: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepTime = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 hover:border-primary/20 transition-colors"
        >
            <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                <Icon className="h-8 w-8" />
            </div>
            <div className="text-4xl font-bold mb-2 tracking-tight">
                {count.toLocaleString('tr-TR')}
                <span className="text-primary ml-1">+</span>
            </div>
            <div className="text-muted-foreground font-medium">{label}</div>
        </motion.div>
    );
}
