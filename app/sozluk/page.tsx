import { Book } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { getDictionaryTerms } from "@/lib/api";
import { DictionaryList } from "@/components/dictionary/dictionary-list";

export default async function DictionaryPage() {
    const supabase = await createClient();
    const terms = await getDictionaryTerms(supabase);

    return (
        <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto min-h-screen">
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Book className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Bilim Sözlüğü
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    "Bu ne demek şimdi?" dediğin her şey burada.
                    Evrenin karmaşık dilini Türkçe'ye çeviriyoruz.
                </p>
            </div>

            <DictionaryList initialTerms={terms} />
        </div>
    );
}
