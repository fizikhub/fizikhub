import { Metadata } from "next";
import { SlotMachine } from "@/components/slot/slot-machine";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Slot Makinesi | Fizikhub",
    description: "Hubpuanlarını kullanarak slot oyna! Şansını dene ve kazanç elde et.",
};

export default async function SlotPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?redirect=/slot");
    }

    return (
        <main className="min-h-screen py-12 px-4">
            <div className="container max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
                        🎰 Slot Makinesi
                    </h1>
                    <p className="text-muted-foreground">
                        Hubpuanlarını kullanarak şansını dene!
                    </p>
                </div>

                <SlotMachine />
            </div>
        </main>
    );
}
