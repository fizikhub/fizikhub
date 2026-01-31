import { Metadata } from "next";
import { NotesPageWrapper } from "@/components/notes/notes-page-wrapper";

export const metadata: Metadata = {
    title: "Notlarım | FizikHub",
    description: "Kişisel notlarınızı oluşturun, düzenleyin ve organize edin. Zengin metin editörü, renkli etiketler ve otomatik kayıt özellikleriyle.",
    keywords: ["notlar", "not alma", "fizik notları", "ders notları", "çalışma notları"],
};

export default function NotlarPage() {
    return (
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <NotesPageWrapper />
        </main>
    );
}
