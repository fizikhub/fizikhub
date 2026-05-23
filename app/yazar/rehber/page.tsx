"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogEditor101 } from "@/components/article/blog-editor-101";
import { createClient } from "@/lib/supabase";

export default function GuideRedirectPage() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            if (window.localStorage.getItem("fizikhub.blogEditor101.dismissed") === "true") {
                router.push("/yazar/yeni");
                return;
            }

            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            } else {
                // If not logged in, redirect to login then back here? or straight to new?
                // For now, let's just show guide anonymously or redirect to login
                // router.push("/login?next=/yazar/rehber");
            }
        };
        checkUser();
    }, [router]);


    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            router.push("/yazar/yeni");
        }
    };

    const handleDontShow = () => {
        window.localStorage.setItem("fizikhub.blogEditor101.dismissed", "true");
    };

    // If we want to show it even without user ID (demo mode), passed "guest"
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background loader or placeholder while modal opens */}
            <BlogEditor101
                open={isOpen}
                onOpenChange={handleOpenChange}
                userId={userId || "guest"}
                onDontShowAgain={handleDontShow}
            />
        </div>
    );
}
