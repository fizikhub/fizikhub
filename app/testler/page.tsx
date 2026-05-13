import { getQuizzes } from "./actions";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, ArrowRight, Clock, Trophy } from "lucide-react";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import type { Metadata } from "next";

const SITE_URL = "https://www.fizikhub.com";

export const metadata: Metadata = {
    title: "Fizik Testleri: TYT, AYT ve Bilim Quizleri",
    description: "Ücretsiz fizik testleri çöz: TYT/AYT fizik, kuantum, mekanik ve bilim quizleriyle eksiklerini gör, doğru cevabı anında öğren.",
    keywords: ["fizik testi", "fizik quiz", "TYT fizik test", "AYT fizik test", "bilim sınavı"],
    openGraph: {
        title: "Fizik Testleri ve Bilim Quizleri — Fizikhub",
        description: "TYT/AYT fizik ve genel bilim konularında ücretsiz testler çöz, doğru cevabı anında gör.",
        type: "website",
        url: `${SITE_URL}/testler`,
        images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Fizikhub fizik testleri" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Fizik Testleri — Fizikhub",
        description: "Ücretsiz fizik testleri çöz, eksiklerini gör ve puan kazan.",
        images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: { canonical: `${SITE_URL}/testler` },
};

export const revalidate = 1800;

export default async function QuizzesPage() {
    const quizzes = await getQuizzes();
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/testler#collection`,
        url: `${SITE_URL}/testler`,
        name: "Fizikhub Fizik Testleri",
        description: "TYT, AYT ve genel bilim konularında ücretsiz çevrimiçi fizik testleri.",
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: quizzes.map((quiz, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}/testler/${quiz.slug}`,
                name: quiz.title,
                item: {
                    "@type": "Quiz",
                    "@id": `${SITE_URL}/testler/${quiz.slug}#quiz`,
                    name: quiz.title,
                    description: quiz.description || `${quiz.title} fizik testi`,
                    url: `${SITE_URL}/testler/${quiz.slug}`,
                    inLanguage: "tr-TR",
                    educationalLevel: "Lise",
                    about: { "@type": "Thing", name: "Fizik" },
                    isAccessibleForFree: true,
                },
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BreadcrumbJsonLd items={[{ name: 'Testler', href: '/testler' }]} />
            <div className="container max-w-7xl py-12 px-4 mx-auto min-h-screen">
                <div className="flex flex-col md:flex-row gap-8 items-end mb-12 border-b-4 border-black dark:border-white pb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary text-primary-foreground p-3 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <BrainCircuit className="h-8 w-8" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                                FİZİK TESTLERİ
                            </h1>
                        </div>
                        <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                            Ücretsiz fizik testleri çöz, eksiklerini gör ve doğru cevabı anında öğren.
                            TYT/AYT fizik, kuantum, mekanik ve popüler bilim konularında kısa quizlerle pratik yap.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quizzes.map((quiz) => (
                        <Card key={quiz.id} className="group border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 bg-card rounded-xl overflow-hidden flex flex-col h-full">
                            <CardHeader className="border-b-2 border-black dark:border-white bg-secondary/50 pb-4">
                                <div className="flex justify-between items-start mb-3">
                                    <Badge variant="secondary" className="bg-white border-2 border-black text-black font-bold hover:bg-white rounded-md">
                                        FİZİK
                                    </Badge>
                                    <div className="flex items-center font-bold text-sm bg-black text-white px-2 py-1 rounded">
                                        <Trophy className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                                        <span>{quiz.points} Puan</span>
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-black uppercase leading-tight line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                                    {quiz.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 flex-grow">
                                <p className="text-muted-foreground font-medium mb-6 line-clamp-3">
                                    {quiz.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-bold opacity-70">
                                    <Clock className="h-4 w-4" />
                                    <span>~5 dakika</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6 px-6 mt-auto">
                                <Link prefetch={false} href={`/testler/${quiz.slug}`} className="w-full">
                                    <Button className="w-full h-12 text-lg font-bold border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] bg-primary text-primary-foreground transition-all">
                                        TESTE BAŞLA
                                        <ArrowRight className="ml-2 h-5 w-5" />
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
        </>
    );
}
