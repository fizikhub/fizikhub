import { ModernLogin } from "@/components/auth/modern-login";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giriş Yap | Fizikhub",
    description: "Fizikhub hesabına giriş yap.",
    robots: {
        index: false,
        follow: false,
    },
};

type LoginPageProps = {
    searchParams?: Promise<{
        next?: string | string[];
    }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;
    const next = Array.isArray(params?.next) ? params.next[0] : params?.next;

    return <ModernLogin nextPath={next} />;
}
