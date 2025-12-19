"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, BrainCircuit, Sparkles, Timer } from "lucide-react";
import { submitQuizResult } from "@/app/testler/actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Question {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: number;
}

interface QuizRunnerProps {
    quizId: string;
    questions: Question[];
    title: string;
}

export function QuizRunner({ quizId, questions, title }: QuizRunnerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [shake, setShake] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    // Trigger confetti on perfect score or passing
    useEffect(() => {
        if (isFinished && score > questions.length / 2) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isFinished, score, questions.length]);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === currentQuestion.correct_answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
            toast.success("Mükemmel! Doğru cevap.", { duration: 1500 });
            // Mini confetti for correct answer
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 }
            });
        } else {
            toast.error("Maalesef yanlış cevap.", { duration: 1500 });
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }

        setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOption }));
        setIsAnswered(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setIsFinished(true);
        await submitQuizResult(quizId, score, questions.length);
    };

    if (isFinished) {
        return (
            <div className="w-full max-w-2xl mx-auto py-12 px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                >
                    <Card className="text-center p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                        <CardContent className="space-y-8 pt-6">
                            <div className="mx-auto w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Trophy className="h-12 w-12 text-black" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tight">Test Tamamlandı!</h2>
                                <p className="text-muted-foreground font-medium">İşte sonuçların:</p>
                            </div>

                            <div className="text-7xl font-black text-primary tracking-tighter">
                                {score}<span className="text-3xl text-muted-foreground">/{questions.length}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-xl border-2 border-green-600 flex items-center justify-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    <span className="font-bold text-green-700 dark:text-green-400 text-lg">{score} Doğru</span>
                                </div>
                                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-xl border-2 border-red-600 flex items-center justify-center gap-3">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                    <span className="font-bold text-red-700 dark:text-red-400 text-lg">{questions.length - score} Yanlış</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/testler" className="flex-1">
                                    <Button variant="outline" className="w-full h-12 text-lg font-bold border-2 border-black">
                                        Diğer Testler
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 h-12 text-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <RotateCcw className="mr-2 h-5 w-5" />
                                    Tekrar Çöz (XP Kazan)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto min-h-[calc(100vh-200px)] flex flex-col pb-24 md:pb-0">
            {/* Header Stats */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <BrainCircuit className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Soru</span>
                        <span className="text-xl font-black leading-none">{currentQuestionIndex + 1}<span className="text-muted-foreground text-sm">/{questions.length}</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Skor</span>
                        <span className="text-xl font-black leading-none text-green-600">{score}00</span>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <Sparkles className="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-6 bg-secondary border-2 border-black rounded-full overflow-hidden mb-8 shadow-inner">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-black/50 mix-blend-multiply">
                    İlerleme Durumu: %{Math.round(progress)}
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ x: 50, opacity: 0, rotate: 1 }}
                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                    exit={{ x: -50, opacity: 0, rotate: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`w-full ${shake ? "animate-shake" : ""}`}
                >
                    <Card className="border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] rounded-2xl overflow-hidden bg-card">
                        <div className="p-6 md:p-10">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-8">
                                {currentQuestion.question_text}
                            </h2>

                            <div className="space-y-4">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = selectedOption === index;
                                    const isCorrect = index === currentQuestion.correct_answer;

                                    // Determine style based on state
                                    let borderColor = "border-black dark:border-white";
                                    let bgColor = "bg-card";
                                    let textColor = "text-foreground";
                                    let shadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

                                    if (isAnswered) {
                                        if (isCorrect) {
                                            borderColor = "border-green-600";
                                            bgColor = "bg-green-100 dark:bg-green-900/40";
                                            textColor = "text-green-800 dark:text-green-100";
                                            shadow = "shadow-none translate-x-[2px] translate-y-[2px]";
                                        } else if (isSelected && !isCorrect) {
                                            borderColor = "border-red-600";
                                            bgColor = "bg-red-100 dark:bg-red-900/40";
                                            textColor = "text-red-800 dark:text-red-100";
                                            shadow = "shadow-none translate-x-[2px] translate-y-[2px]";
                                        } else {
                                            bgColor = "bg-muted/50";
                                            textColor = "text-muted-foreground";
                                            shadow = "shadow-none";
                                        }
                                    } else if (isSelected) {
                                        borderColor = "border-primary";
                                        bgColor = "bg-primary/10";
                                        shadow = "shadow-none translate-x-[2px] translate-y-[2px]";
                                    }

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                            className={cn(
                                                "relative flex items-center p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none",
                                                borderColor, bgColor, textColor, shadow,
                                                isAnswered ? "cursor-default" : "cursor-pointer"
                                            )}
                                            onClick={() => handleOptionSelect(index)}
                                        >
                                            <div className="flex-shrink-0 mr-4">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm",
                                                    isAnswered && isCorrect ? "border-green-600 bg-green-200 text-green-800" :
                                                        isAnswered && isSelected && !isCorrect ? "border-red-600 bg-red-200 text-red-800" :
                                                            isSelected ? "border-primary bg-primary text-secondary" :
                                                                "border-black dark:border-white bg-transparent"
                                                )}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold flex-1">{option}</span>

                                            {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-600 ml-2" />}
                                            {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600 ml-2" />}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Bottom Actions - Sticky on Mobile */}
            {!isFinished && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t-2 border-black dark:border-white z-50 md:static md:bg-transparent md:border-none md:p-0 md:mt-8">
                    <div className="max-w-3xl mx-auto">
                        {!isAnswered ? (
                            <Button
                                onClick={handleCheckAnswer}
                                disabled={selectedOption === null}
                                className="w-full h-14 md:h-16 text-xl font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cevabı Kontrol Et
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNextQuestion}
                                className="w-full h-14 md:h-16 text-xl font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <>
                                        Sonraki Soru <ArrowRight className="ml-2 h-6 w-6" />
                                    </>
                                ) : (
                                    "Testi Tamamla"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
