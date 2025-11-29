import { createClient } from "@/lib/supabase-server";
import { getArticles } from "@/lib/api";
import { BlogList } from "@/components/blog/blog-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bilim Arşivi",
    description: "Evrenin sırlarını çözmeye çalışanların not defteri. Fizik, uzay ve bilim üzerine derinlemesine yazılar ve makaleler.",
    openGraph: {
        title: "Bilim Arşivi | Fizikhub",
        description: "Fizik, uzay ve bilim üzerine derinlemesine yazılar ve makaleler.",
        type: "website",
    },
};

export default async function BlogPage() {
    const supabase = await createClient();
    const articles = await getArticles(supabase, { status: 'published', authorRole: 'all' });

    return (
        <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 md:px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
                    <div className="space-y-3 sm:space-y-4 max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                            Bilim Arşivi
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Evrenin sırlarını çözmeye çalışanların not defteri.
                            <br className="hidden sm:block" />
                            Sıkıcı formüller yok, sadece saf merak var. 🚀
                        </p>
                    </div>
                </div>

                <BlogList initialArticles={articles} />
            </div>
        </div>
    );
}
