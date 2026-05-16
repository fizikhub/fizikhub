import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { BookReviewEditor } from "@/components/book-review/book-review-editor";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yeni Kitap İncelemesi | Fizikhub",
    description: "Okuduğun bir kitabı incele ve toplulukla paylaş.",
    robots: { index: false, follow: true },
    alternates: {
        canonical: "https://www.fizikhub.com/kitap-inceleme/yeni",
    },
};

export default async function NewBookReviewPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/kitap-inceleme/yeni");
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <BookReviewEditor userId={user.id} />
        </div>
    );
}
