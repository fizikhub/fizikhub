"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createQuiz } from "@/app/actions/quiz";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Question {
    question_text: string;
    options: string[];
    correct_answer: number;
}

export function QuizForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState(10);
    const [questions, setQuestions] = useState<Question[]>([
        { question_text: "", options: ["", "", "", ""], correct_answer: 0 }
    ]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question_text: "", options: ["", "", "", ""], correct_answer: 0 }]);
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createQuiz({
                title,
                slug,
                description,
                points,
                questions: questions.map((q, i) => ({ ...q, order: i }))
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Quiz başarıyla oluşturuldu!");
                router.push("/admin/quizzes");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Quiz Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Başlık</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                            }}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="points">Puan Değeri</Label>
                        <Input type="number" id="points" value={points} onChange={(e) => setPoints(parseInt(e.target.value))} required />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Sorular</h2>
                    <Button type="button" onClick={handleAddQuestion} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Soru Ekle
                    </Button>
                </div>

                {questions.map((question, qIndex) => (
                    <Card key={qIndex} className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            disabled={questions.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="mt-3 text-muted-foreground">
                                    <span className="font-mono text-sm">#{qIndex + 1}</span>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Soru Metni</Label>
                                        <Textarea
                                            value={question.question_text}
                                            onChange={(e) => handleQuestionChange(qIndex, "question_text", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Seçenekler</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-2">
                                                    <div className="flex items-center h-full pt-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qIndex}`}
                                                            checked={question.correct_answer === oIndex}
                                                            onChange={() => handleQuestionChange(qIndex, "correct_answer", oIndex)}
                                                            className="h-4 w-4"
                                                        />
                                                    </div>
                                                    <Input
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        placeholder={`${String.fromCharCode(65 + oIndex)}) Seçenek`}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            * Doğru cevabı işaretlemeyi unutmayın.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} size="lg">
                    {loading ? "Kaydediliyor..." : "Quiz Oluştur"}
                </Button>
            </div>
        </form>
    );
}
