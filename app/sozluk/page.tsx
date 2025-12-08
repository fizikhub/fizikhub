import { Book } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { getDictionaryTerms } from "@/lib/api";
import { DictionaryList } from "@/components/dictionary/dictionary-list";

export const metadata = {
    title: "Bilim Sözlüğü | Fizikhub",
    description: "Fizik ve astronomi terimleri sözlüğü. Karmaşık kavramların anlaşılır açıklamaları.",
};

export default async function DictionaryPage() {
    const supabase = await createClient();
    const terms = await getDictionaryTerms(supabase);

    return (
        <div className="container py-12 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 items-end mb-12 border-b-4 border-black dark:border-white pb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-primary text-primary-foreground p-3 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <Book className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            Bilim Sözlüğü
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                        "Bu ne demek şimdi?" dediğin her şey burada.
                        Evrenin karmaşık dilini Türkçe'ye çeviriyoruz.
                    </p>
                </div>
            </div>

            <DictionaryList initialTerms={terms} />
        </div>
    );
}
