import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FilePlus, BookPlus, Settings, LogOut, Home } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r bg-muted/30 p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 font-bold text-xl px-2">
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                    <span>Admin Paneli</span>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" /> Genel Bakış
                        </Button>
                    </Link>
                    <Link href="/admin/makale-ekle">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FilePlus className="h-4 w-4" /> Makale Ekle
                        </Button>
                    </Link>
                    <Link href="/admin/sozluk-ekle">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <BookPlus className="h-4 w-4" /> Terim Ekle
                        </Button>
                    </Link>
                    <div className="my-2 border-t" />
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Home className="h-4 w-4" /> Siteye Dön
                        </Button>
                    </Link>
                </nav>

                <div className="mt-auto">
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10">
                {children}
            </main>
        </div>
    );
}
