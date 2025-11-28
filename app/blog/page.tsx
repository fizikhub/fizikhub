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
    const articles = await getArticles(supabase);

    return (
        <div className="min-h-screen py-6 sm:py-8 md:py-12 px-4 md:px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Bilim Arşivi
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl">
                            Evrenin sırlarını çözmeye çalışanların not defteri.
                            Burada sıkıcı formüller yok, sadece saf merak var.
                        </p>
                    </div>
                </div>

                <BlogList initialArticles={articles} />
            </div>
        </div>
    );
}
