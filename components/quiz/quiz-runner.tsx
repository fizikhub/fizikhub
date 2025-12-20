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
    const [feedback, setFeedback] = useState("");

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    const POSITIVE_MESSAGES = [
        "Vay be, Einstein mısın nesin?",
        "Bunu bilmeni beklemiyordum, tebrikler.",
        "Şansa bala doğru yaptın dimi?",
        "Helal olsun, fizik profesörü müsün?",
        "Doğru cevap! Nobel ödülünü kargoluyoruz.",
        "Beyin bedava dedikleri bu olsa gerek.",
    ];

    const NEGATIVE_MESSAGES = [
        "Salla kazan tutmadı be gülüm.",
        "Newton mezarında ters döndü.",
        "Fizikle aran biraz limoni galiba.",
        "Bunu bilmemek ayıp değil, öğrenmemek ayıp (şaka şaka ayıp).",
        "Atma recep din kardeşiyiz.",
        "Biraz daha çalışman lazım, çok değil, baya.",
    ];

    const handleOptionSelect = (value: string) => {
        if (isAnswered) return;
        setSelectedOption(parseInt(value));
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === currentQuestion.correct_answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback(POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)]);
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });
        } else {
            setFeedback(NEGATIVE_MESSAGES[Math.floor(Math.random() * NEGATIVE_MESSAGES.length)]);
        }

        setIsAnswered(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setFeedback("");
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setIsFinished(true);
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
            <Card className="w-full max-w-lg mx-auto text-center p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader>
                    <div className="mx-auto bg-primary/20 p-4 rounded-full mb-4 ring-4 ring-primary">
                        <Trophy className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-black uppercase">Test Bitti!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-6xl font-black text-primary tracking-tighter">
                        {score}<span className="text-2xl text-muted-foreground">/{questions.length}</span>
                    </div>
                    <p className="font-bold text-lg">
                        {score === questions.length ? "Hatasız kul olmaz derler ama sen oldun!" :
                            score > questions.length / 2 ? "Ortalamanın üstündesin, havasını atabilirsin." :
                                "Fizik kitabının kapağını açmayı denedin mi hiç?"}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-3 pt-4">
                    <Link href="/testler">
                        <Button variant="outline" className="border-2 font-bold">Listeye Dön</Button>
                    </Link>
                    <Button onClick={() => window.location.reload()} className="border-2 border-black font-bold">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Tekrar Dene
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            <div className="flex justify-between items-center px-2">
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
                    Soru {currentQuestionIndex + 1} / {questions.length}
                </span>
                <div className="flex items-center gap-2 font-black text-lg bg-black text-white px-3 py-1 rounded-md -rotate-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>{score}</span>
                </div>
            </div>

            <div className="h-3 w-full bg-secondary border-2 border-black dark:border-white rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <Card className="mt-4 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] rounded-xl overflow-hidden relative">
                <CardHeader className="bg-secondary/30 border-b-2 border-black dark:border-white p-6">
                    <CardTitle className="text-xl md:text-2xl font-black leading-tight selection:bg-primary selection:text-white">
                        {currentQuestion.question_text}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <RadioGroup
                        key={currentQuestion.id} // Forces reset on new question
                        value={selectedOption?.toString()}
                        onValueChange={handleOptionSelect}
                        className="space-y-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {currentQuestion.options.map((option, index) => {
                                let itemStyle = "border-2 border-black dark:border-white bg-card hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]";
                                if (isAnswered) {
                                    if (index === currentQuestion.correct_answer) {
                                        itemStyle = "border-2 border-green-600 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 scale-[1.01]";
                                    } else if (index === selectedOption && index !== currentQuestion.correct_answer) {
                                        itemStyle = "border-2 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-100 opacity-80";
                                    } else {
                                        itemStyle = "border-2 opacity-40 grayscale border-dashed";
                                    }
                                } else if (selectedOption === index) {
                                    itemStyle = "border-2 border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
                                }

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className={`flex items-center space-x-3 rounded-lg p-3 cursor-pointer transition-all duration-200 ${itemStyle}`}>
                                            <RadioGroupItem
                                                value={index.toString()}
                                                id={`option-${index}`}
                                                disabled={isAnswered}
                                                className="w-5 h-5 border-2 border-black data-[state=checked]:bg-primary data-[state=checked]:text-black"
                                            />
                                            <Label
                                                htmlFor={`option-${index}`}
                                                className="flex-1 cursor-pointer font-bold text-base leading-snug"
                                            >
                                                {option}
                                            </Label>
                                            {isAnswered && index === currentQuestion.correct_answer && (
                                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </RadioGroup>

                    {/* Feedback Message */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`p-4 rounded-lg text-center font-black text-white transform -rotate-1 ${selectedOption === currentQuestion.correct_answer ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                            >
                                {feedback}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Button - Moved inside content for tightening */}
                    <div className="pt-2">
                        {!isAnswered ? (
                            <Button
                                onClick={handleCheckAnswer}
                                disabled={selectedOption === null}
                                className="w-full h-12 text-lg font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                                Cevabı Kontrol Et
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNextQuestion}
                                className="w-full h-12 text-lg font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-zinc-900 text-white hover:bg-zinc-800"
                            >
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <>
                                        Sıradaki Gelsin
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                ) : (
                                    "Sonuçları Gör"
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
