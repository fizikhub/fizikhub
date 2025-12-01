"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { submitQuizResult } from "@/app/testler/actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";

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
    const [answers, setAnswers] = useState<{ [key: string]: number }>({}); // questionId -> selectedOptionIndex

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    const handleOptionSelect = (value: string) => {
        if (isAnswered) return;
        setSelectedOption(parseInt(value));
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === currentQuestion.correct_answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
            toast.success("Doğru cevap!");
        } else {
            toast.error("Yanlış cevap.");
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
        // Calculate final score including the last question if it was just answered
        // Actually score state is already updated because handleCheckAnswer runs before this

        if (score > questions.length / 2) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        await submitQuizResult(quizId, score, questions.length);
    };

    if (isFinished) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center p-8">
                <CardHeader>
                    <div className="mx-auto bg-yellow-100 p-4 rounded-full mb-4">
                        <Trophy className="h-12 w-12 text-yellow-600" />
                    </div>
                    <CardTitle className="text-3xl">Test Tamamlandı!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-5xl font-bold text-primary">
                        {score} / {questions.length}
                    </div>
                    <p className="text-muted-foreground">
                        {score === questions.length ? "Mükemmel! Hepsini doğru bildin." :
                            score > questions.length / 2 ? "Tebrikler, güzel sonuç!" :
                                "Biraz daha çalışmalısın."}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Doğru: {score}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span>Yanlış: {questions.length - score}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Link href="/testler">
                        <Button variant="outline">Diğer Testler</Button>
                    </Link>
                    <Button onClick={() => window.location.reload()}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Tekrar Çöz
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Soru {currentQuestionIndex + 1} / {questions.length}</span>
                <span>Skor: {score}</span>
            </div>
            <Progress value={progress} className="h-2" />

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="text-xl leading-relaxed">
                        {currentQuestion.question_text}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedOption?.toString()}
                        onValueChange={handleOptionSelect}
                        className="space-y-3"
                    >
                        <AnimatePresence mode="wait">
                            {currentQuestion.options.map((option, index) => {
                                let itemStyle = "border-2 hover:bg-muted/50 transition-all";
                                if (isAnswered) {
                                    if (index === currentQuestion.correct_answer) {
                                        itemStyle = "border-green-500 bg-green-500/10";
                                    } else if (index === selectedOption && index !== currentQuestion.correct_answer) {
                                        itemStyle = "border-red-500 bg-red-500/10";
                                    } else {
                                        itemStyle = "opacity-50";
                                    }
                                } else if (selectedOption === index) {
                                    itemStyle = "border-primary bg-primary/5";
                                }

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className={`flex items-center space-x-2 rounded-lg p-4 cursor-pointer ${itemStyle}`}>
                                            <RadioGroupItem
                                                value={index.toString()}
                                                id={`option-${index}`}
                                                disabled={isAnswered}
                                            />
                                            <Label
                                                htmlFor={`option-${index}`}
                                                className="flex-1 cursor-pointer font-medium"
                                            >
                                                {option}
                                            </Label>
                                            {isAnswered && index === currentQuestion.correct_answer && (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            )}
                                            {isAnswered && index === selectedOption && index !== currentQuestion.correct_answer && (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-end pt-6">
                    {!isAnswered ? (
                        <Button
                            onClick={handleCheckAnswer}
                            disabled={selectedOption === null}
                            className="w-full sm:w-auto"
                        >
                            Cevabı Kontrol Et
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNextQuestion}
                            className="w-full sm:w-auto"
                        >
                            {currentQuestionIndex < questions.length - 1 ? (
                                <>
                                    Sonraki Soru
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            ) : (
                                "Testi Bitir"
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
