"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Play, Frown, PartyPopper, Zap, ThumbsDown } from "lucide-react";
import { submitQuizResult } from "@/app/testler/actions";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import { toast } from "sonner";

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
    description: string;
}

export function QuizRunner({ quizId, questions, title, description }: QuizRunnerProps) {
    const [isStarted, setIsStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [pointsEarned, setPointsEarned] = useState<number>(0);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    const POSITIVE_MESSAGES = [
        "Vay be, Einstein mısın nesin?",
        "Bunu bilmeni beklemiyordum, tebrikler.",
        "Şansa bala doğru yaptın dimi?",
        "Helal olsun, fizik profesörü müsün?",
        "Doğru cevap! Nobel ödülünü kargoluyoruz.",
        "Beyin bedava dedikleri bu olsa gerek.",
        "Gözlerim yaşardı, ne zekice bir cevap!",
        "Bu soruyu hazırlayan bile şaşırdı.",
        "Sen bu işi çözmüşsün, biz dükkanı kapatalım.",
        "Tebrikler, NASA seni arıyor.",
        "Zeka fışkırıyor resmen!",
        "Bu kadar zeki olmak yormuyor mu?"
    ];

    const NEGATIVE_MESSAGES = [
        "Salla kazan tutmadı be gülüm.",
        "Newton mezarında ters döndü.",
        "Fizikle aran biraz limoni galiba.",
        "Bunu bilmemek ayıp değil, öğrenmemek ayıp (şaka şaka ayıp).",
        "Atma recep din kardeşiyiz.",
        "Biraz daha çalışman lazım, çok değil, baya.",
        "Üzgünüm ama cevap şıkkı bile sana güldü.",
        "Belki de fizik senin olayım değildir?",
        "Yanlış cevap vererek de tarihe geçebilirsin.",
        "Kitabı tersten mi okudun?",
        "Olsun, en azından denedin... sanırım.",
        "Cevabı salladın ama tutmadı di mi?"
    ];

    const handleStart = () => {
        setIsStarted(true);
    };

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
        // Sarcastic Confetti for high scores
        if (score > questions.length / 2) {
            const end = Date.now() + 1000;
            const colors = ['#bb0000', '#ffffff'];
            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }

        try {
            const result = await submitQuizResult(quizId, score, questions.length);
            // @ts-ignore
            if (result.success) {
                setPointsEarned(result.pointsEarned || 0);
                setAlreadyCompleted(!!result.alreadyCompleted);
            }
        } catch (error) {
            console.error("Failed to submit result", error);
        }
    };

    if (!isStarted) {
        return (
            <div className="container max-w-3xl py-12 px-4 mx-auto min-h-[60vh] flex flex-col justify-center items-center">
                <Card className="w-full text-center p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                    <CardHeader className="space-y-4">
                        <Badge className="mx-auto text-base py-1 px-4 border-2 border-black dark:border-white bg-primary text-primary-foreground hover:bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -rotate-2">
                            FİZİK TESTİ
                        </Badge>
                        <CardTitle className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                            {title}
                        </CardTitle>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    </CardHeader>
                    <CardFooter className="justify-center pt-6">
                        <Button
                            onClick={handleStart}
                            size="lg"
                            className="text-lg font-black px-10 py-6 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 border-2 border-transparent hover:scale-105 transition-transform shadow-xl"
                        >
                            <Play className="mr-3 h-5 w-5 fill-current" />
                            TESTE BAŞLA
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (isFinished) {
        const percentage = (score / questions.length) * 100;
        const isSuccess = percentage > 50;
        const isPerfect = score === questions.length;

        let titleText = "Helal Olsun!";
        if (!isSuccess) titleText = "Geçmiş Olsun!";
        if (isPerfect) titleText = "İnanılmaz!";

        let messageText = "";
        if (isPerfect) messageText = "Hatasız kul olmaz derler ama sen oldun! Mükemmelsin.";
        else if (isSuccess) messageText = "Ortalamanın üstündesin, havanı atabilirsin. (Ama çok değil)";
        else messageText = "Fizik kitabının kapağını hiç açmayı denedin mi? Merak ettim sadece.";

        return (
            <div className="container max-w-md py-8 px-4 mx-auto">
                <Card className="w-full text-center p-4 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className={`mx-auto p-4 rounded-full mb-4 ring-4 ring-black dark:ring-white shadow-xl ${isSuccess ? 'bg-yellow-400' : 'bg-red-400'}`}
                        >
                            {isSuccess ?
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 1.5, loop: Infinity, delay: 1 }}
                                >
                                    <Trophy className="h-12 w-12 text-black" />
                                </motion.div>
                                :
                                <motion.div
                                    animate={{ y: [0, 5, 0, 5, 0] }}
                                    transition={{ duration: 2, loop: Infinity, repeatDelay: 1 }}
                                >
                                    <ThumbsDown className="h-12 w-12 text-black" />
                                </motion.div>
                            }
                        </motion.div>
                        <CardTitle className="text-2xl md:text-3xl font-black uppercase transform -rotate-1">
                            {titleText}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 relative z-10 pb-2">
                        <div className="space-y-1">
                            <div className="text-6xl font-black tracking-tighter tabular-nums">
                                {score}<span className="text-2xl text-muted-foreground">/{questions.length}</span>
                            </div>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-xl border-2 border-black/10 dark:border-white/10">
                            <p className="font-bold text-base leading-snug">
                                {messageText}
                            </p>
                        </div>

                        {/* Points Display */}
                        {pointsEarned > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 border-2 border-green-600 p-3 rounded-xl text-green-800 dark:text-green-100"
                            >
                                <PartyPopper className="h-5 w-5" />
                                <span className="text-lg font-black">{pointsEarned} HubPuan Kazandın!</span>
                            </motion.div>
                        )}

                        {(alreadyCompleted || (!alreadyCompleted && pointsEarned === 0 && score > 0)) && (
                            <div className="text-xs font-bold text-muted-foreground bg-muted p-2 rounded-lg relative overflow-hidden group">
                                <span className="relative z-10">(Daha önce çözdüğün için tekrar puan yok çakal 😉)</span>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2 pt-2">
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full border-2 border-black font-bold h-10 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Tekrar Dene
                        </Button>
                        <Link href="/testler" className="w-full">
                            <Button variant="outline" className="w-full border-2 font-bold h-10 text-base">Testlere Dön</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-4 pt-4 pb-12">
            <div className="flex justify-between items-center px-2">
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
                    Soru {currentQuestionIndex + 1} / {questions.length}
                </span>
                <div className="flex items-center gap-2 font-black text-base bg-black text-white px-2 py-0.5 rounded-md -rotate-2 shadow-lg">
                    <Trophy className="h-3 w-3 text-yellow-400" />
                    <span>{score}</span>
                </div>
            </div>

            <div className="h-2 w-full bg-secondary border-2 border-black dark:border-white rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <Card className="mt-2 border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] rounded-xl overflow-hidden relative">
                <CardHeader className="bg-secondary/30 border-b-2 border-black dark:border-white p-4">
                    <CardTitle className="text-lg md:text-xl font-black leading-tight selection:bg-primary selection:text-white">
                        {currentQuestion.question_text}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <RadioGroup
                        key={currentQuestion.id} // Forces reset on new question
                        value={selectedOption?.toString()}
                        onValueChange={handleOptionSelect}
                        className="space-y-2"
                    >
                        <AnimatePresence mode="popLayout">
                            {currentQuestion.options.map((option, index) => {
                                let itemStyle = "border-2 border-black dark:border-white bg-card hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
                                if (isAnswered) {
                                    if (index === currentQuestion.correct_answer) {
                                        itemStyle = "border-2 border-green-600 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 scale-[1.01]";
                                    } else if (index === selectedOption && index !== currentQuestion.correct_answer) {
                                        itemStyle = "border-2 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-100 opacity-80";
                                    } else {
                                        itemStyle = "border-2 opacity-40 grayscale border-dashed";
                                    }
                                } else if (selectedOption === index) {
                                    itemStyle = "border-2 border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]";
                                }

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className={`flex items-center space-x-3 rounded-lg p-2.5 cursor-pointer transition-all duration-200 ${itemStyle}`}>
                                            <RadioGroupItem
                                                value={index.toString()}
                                                id={`option-${index}`}
                                                disabled={isAnswered}
                                                className="w-4 h-4 border-2 border-black data-[state=checked]:bg-primary data-[state=checked]:text-black"
                                            />
                                            <Label
                                                htmlFor={`option-${index}`}
                                                className="flex-1 cursor-pointer font-bold text-sm leading-snug"
                                            >
                                                {option}
                                            </Label>
                                            {isAnswered && index === currentQuestion.correct_answer && (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </RadioGroup>

                    {/* Feedback Message - Made smaller and less intrusive */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`p-3 rounded-lg text-center font-bold text-sm text-white transform -rotate-1 shadow-md ${selectedOption === currentQuestion.correct_answer ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                            >
                                {feedback}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Button - Compact */}
                    <div className="pt-1">
                        {!isAnswered ? (
                            <Button
                                onClick={handleCheckAnswer}
                                disabled={selectedOption === null}
                                className="w-full h-10 text-base font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                                Cevabı Kontrol Et
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNextQuestion}
                                className="w-full h-10 text-base font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-zinc-900 text-white hover:bg-zinc-800"
                            >
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <>
                                        Sıradaki
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                ) : (
                                    "Sonuçlar"
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
