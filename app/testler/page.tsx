import { getQuizzes } from "./actions";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, ArrowRight, Clock, Trophy } from "lucide-react";

export const metadata = {
    title: "Fizik Testleri | Fizikhub",
    description: "Bilgini test et, puan kazan ve liderlik tablosunda yüksel.",
};

export default async function QuizzesPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="container max-w-5xl py-10 px-4 mx-auto">
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/20">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Fizik Testleri</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Kendini dene, eksiklerini gör ve puanları topla.
                    Her test sana yeni bir şeyler öğretecek.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                    Fizik
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                    <Trophy className="h-3 w-3" />
                                    <span>{quiz.points} Puan</span>
                                </div>
                            </div>
                            <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                                {quiz.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">
                                {quiz.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>~5 dk</span>
                                </div>
                                {/* We could add question count here if we joined tables */}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/testler/${quiz.slug}`} className="w-full">
                                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                                    Teste Başla
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}

                {quizzes.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        Henüz test bulunmuyor. Yakında eklenecek!
                    </div>
                )}
            </div>
        </div>
    );
}
