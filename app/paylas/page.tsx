"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    BookOpen,
    MessageCircle,
    FlaskConical,
    Library,
    FileText,
    ArrowRight,
    Lock,
    Loader2,
    type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { createClient } from "@/lib/supabase";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SHARE_DESTINATIONS = [
    "/makale/yeni?type=blog",
    "/forum?create=true",
    "/makale/yeni?type=experiment",
    "/kitap-inceleme/yeni",
    "/makale/yeni?type=term",
    "/ara",
    "/login",
];

// PERF: Lazy-load the heavy Three.js canvas only on desktop and only after idle.
const RealisticStars = dynamic(() => import("@/components/share/realistic-stars").then(mod => mod.RealisticStars), {
    ssr: false,
    loading: () => null
});

function DeferredDesktopStars() {
    const [shouldLoadStars, setShouldLoadStars] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
        if (!media.matches) return;

        const enable = () => setShouldLoadStars(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable, { timeout: 1800 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(enable, 700);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    return shouldLoadStars ? <RealisticStars /> : null;
}

// BENTO BOX STYLE CARDS (Agresif Neo-Brutalizm)
interface FreshCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    color: string;
    accentColor: string;
    eyebrow: string;
    colSpan?: string;
    rowSpan?: string;
    showBorderBeam?: boolean;
    isLarge?: boolean;
    badge?: string;
    onProtectedClick?: (href: string, title: string) => void;
    isLocked?: boolean;
    isCheckingAuth?: boolean;
}

function FreshCard({ title, description, href, icon: Icon, color, accentColor, eyebrow, colSpan = "col-span-1", rowSpan = "row-span-1", showBorderBeam, isLarge, badge, onProtectedClick, isLocked, isCheckingAuth }: FreshCardProps) {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!onProtectedClick) return;

        event.preventDefault();
        onProtectedClick(href, title);
    };

    return (
        <div
            className={cn("relative group w-full h-full [perspective:1000px] motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] active:scale-[0.985] transition-transform duration-300", colSpan, rowSpan)}
        >
            <Link prefetch href={href} aria-label={`${title} paylaş`} className="block h-full" onClick={handleClick}>
                <div className={cn(
                    "relative h-full w-full bg-white flex flex-col justify-between overflow-hidden",
                    "border-[2.5px] sm:border-[3px] border-black rounded-[10px]",
                    "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
                    "transition-all duration-300 ease-out",
                    isLarge ? "p-4 min-[390px]:p-5 md:p-7" : "p-3.5 min-[390px]:p-4 md:p-5"
                )}>
                    {showBorderBeam && (
                        <BorderBeam
                            size={400}
                            duration={8}
                            delay={0}
                            borderWidth={4}
                            colorFrom={accentColor}
                            colorTo="#000000"
                        />
                    )}

                    {/* Top Accent Line */}
                    <div className={cn("absolute top-0 left-0 right-0 h-2.5 sm:h-3 border-b-[2.5px] sm:border-b-[3px] border-black", color)} />
                    <div className={cn("absolute bottom-0 left-0 h-[42%] w-2 border-r-[3px] border-black opacity-0 transition-opacity duration-300 group-hover:opacity-100", color)} />

                    {/* Banner & Icon Header */}
                    <div className="flex items-start justify-between w-full mt-1.5 mb-3 min-[390px]:mb-4">
                        <div className="flex flex-col gap-2 min-[390px]:gap-2.5">
                            <div className={cn(
                                "flex items-center justify-center rounded-[10px] border-[2.5px] sm:border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                                color,
                                isLarge ? "w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem]" : "w-12 h-12 min-[390px]:w-14 min-[390px]:h-14"
                            )}>
                                <Icon className={cn("text-black stroke-[2.6px]", isLarge ? "w-7 h-7 sm:w-9 sm:h-9" : "w-6 h-6 min-[390px]:w-7 min-[390px]:h-7")} />
                            </div>
                            {badge && (
                                <span className="inline-flex min-h-7 items-center self-start px-2.5 py-1 bg-black text-white text-[9px] sm:text-[10px] font-black uppercase rounded-full shadow-[2px_2px_0px_0px_#fff] border border-black -rotate-2">
                                    {badge}
                                </span>
                            )}
                        </div>

                        <div className={cn(
                            "flex items-center justify-center rounded-full border-[3px] border-black",
                            "bg-white group-hover:bg-black transition-colors duration-300",
                            "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none",
                            isLarge ? "w-11 h-11 sm:w-12 sm:h-12" : "w-11 h-11"
                        )}>
                            {isCheckingAuth ? (
                                <Loader2 className="h-5 w-5 animate-spin text-black" />
                            ) : isLocked ? (
                                <Lock className="h-5 w-5 text-black group-hover:text-white transition-colors duration-300" />
                            ) : (
                                <ArrowRight className={cn(
                                "text-black group-hover:text-white transition-colors duration-300",
                                isLarge ? "w-5 h-5 sm:w-6 sm:h-6" : "w-5 h-5",
                                "group-hover:translate-x-1"
                                )} />
                            )}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 mt-auto">
                        <span className={cn(
                            "mb-2 hidden text-[10px] font-black uppercase text-zinc-400",
                            isLarge ? "min-[380px]:block" : "md:block"
                        )}>
                            {eyebrow}
                        </span>
                        <h3 className={cn(
                            "font-black text-black uppercase mb-1.5 md:mb-2 leading-[0.92]",
                            isLarge ? "text-[2.35rem] min-[390px]:text-4xl sm:text-5xl lg:text-6xl" : "text-[1.8rem] min-[390px]:text-[2rem] md:text-[2.35rem]"
                        )}>
                            <span className="block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-zinc-600 transition-all duration-300">
                                {title}
                            </span>
                        </h3>
                        <p className={cn(
                            "text-zinc-600 font-extrabold leading-snug",
                            isLarge ? "text-sm min-[390px]:text-base sm:text-lg max-w-[94%] sm:max-w-[78%] line-clamp-3" : "text-[13px] min-[390px]:text-sm line-clamp-2"
                        )}>
                            {description}
                        </p>
                    </div>

                    {/* Background Abstract Pattern */}
                    <div className={cn(
                        "absolute pointer-events-none text-black transition-transform duration-700 ease-in-out group-hover:rotate-12 group-hover:scale-110",
                        isLarge ? "-bottom-12 -right-10 opacity-10" : "-bottom-8 -right-8 opacity-[0.045]"
                    )}>
                        <Icon className={cn(isLarge ? "w-64 h-64" : "w-40 h-40")} />
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function PaylasPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    useEffect(() => {
        for (const href of SHARE_DESTINATIONS) {
            router.prefetch(href);
        }
    }, [router]);

    useEffect(() => {
        let isMounted = true;
        let idleId: number | null = null;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const loadProfileName = async (userId: string) => {
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, username")
                .eq("id", userId)
                .single();

            if (!isMounted || !profile) return;
            setUserName(profile.full_name || profile.username || "Bilim İnsanı");
        };

        const primeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (!isMounted) return;

            setIsAuthenticated(Boolean(user));
            setLoaded(true);

            if (!user) return;

            setUserName(
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Bilim İnsanı"
            );

            const loadProfile = () => loadProfileName(user.id);

            if ("requestIdleCallback" in window) {
                idleId = window.requestIdleCallback(loadProfile, { timeout: 1200 });
            } else {
                timeoutId = globalThis.setTimeout(loadProfile, 250);
            }
        };

        primeAuth().catch(() => {
            if (!isMounted) return;
            setIsAuthenticated(false);
            setLoaded(true);
        });

        return () => {
            isMounted = false;
            if (idleId !== null) window.cancelIdleCallback(idleId);
            if (timeoutId !== null) globalThis.clearTimeout(timeoutId);
        };
    }, [supabase]);

    const requireAuth = (href: string, title: string) => {
        router.prefetch(href);

        if (!loaded) {
            router.push(href);
            return;
        }

        if (isAuthenticated) {
            router.push(href);
            return;
        }

        const label = title === "SORU" ? "soru sormak" : title === "KİTAP" ? "kitap incelemesi yazmak" : title === "BLOG" ? "blog yazmak" : `${title.toLocaleLowerCase("tr-TR")} paylaşmak`;

        toast(`Fizikhub'a giriş yapmalısın`, {
            description: `${label.charAt(0).toLocaleUpperCase("tr-TR") + label.slice(1)} için giriş yapmalı veya üye olmalısın.`,
            className: "dynamic-island-toast",
            duration: 3800,
        });

        router.push(`/login?next=${encodeURIComponent(href)}`);
    };

    const cardAuthProps = {
        onProtectedClick: requireAuth,
        isLocked: loaded && !isAuthenticated,
        isCheckingAuth: !loaded,
    };

    return (
        <div className="min-h-screen bg-background px-3 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-3 font-sans relative overflow-hidden sm:px-4 md:pt-16">

            {/* REALISTIC STARS - desktop-only and deferred so mobile navigation stays instant */}
            <DeferredDesktopStars />

            {/* TEXTURED PAPER BACKGROUND - Reduced Opacity for Star Visibility */}
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-30 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay"
                style={{
                    // Slightly finer grain (0.5) but still visible
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
                }}
            ></div>



            <div className="max-w-[980px] mx-auto relative z-10">

                {/* Header - Compact */}
                <div className="mb-4 pt-1 relative sm:mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                        <div className="flex flex-col">
                            <h1 className="text-[clamp(2.65rem,14vw,4.75rem)] md:text-7xl font-black text-[#EAB308] leading-[0.86] uppercase drop-shadow-[3px_3px_0px_#fff] text-stroke-black">
                                Paylaşım<br />
                            </h1>
                            <div className="flex items-center">
                                <span className="text-[clamp(2.65rem,14vw,4.75rem)] md:text-7xl font-black text-white leading-[0.86] uppercase text-stroke-black drop-shadow-[3px_3px_0px_#000]">
                                    MERKEZİ
                                </span>
                            </div>
                        </div>
                        <p className="flex min-h-[56px] items-center justify-center md:items-start text-black font-black text-sm min-[390px]:text-base md:text-base w-full md:w-auto max-w-xl md:max-w-xs md:text-right leading-tight bg-white px-3.5 min-[390px]:px-4 py-3 rounded-[10px] border-[2.5px] sm:border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:min-h-[62px]">
                            {loaded ? (
                                userName ?
                                    <span className="line-clamp-2">Bugün ne paylaşmak istersin, {userName}?</span> :
                                    <span>Bugün ne paylaşmak istersin?</span>
                            ) : (
                                <span className="opacity-50">Yükleniyor...</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* ULTRA-PREMIUM BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 gap-3.5 auto-rows-[178px] min-[390px]:auto-rows-[190px] sm:gap-5 sm:auto-rows-[210px] md:grid-cols-3 md:gap-5 md:auto-rows-[190px] lg:grid-cols-4">
                    {/* 1. Blog: L-Shape / Double Width & Height (Hero Item) */}
                    <FreshCard
                        title="BLOG"
                        description="Sıra dışı fikirleri, evrensel notları ve teorilerini kağıda (veya internete) dök."
                        href="/makale/yeni?type=blog"
                        icon={FileText}
                        color="bg-[#EAB308]"
                        accentColor="#EAB308"
                        eyebrow="Makale alanı"
                        colSpan="md:col-span-2 lg:col-span-2"
                        rowSpan="row-span-2"
                        showBorderBeam={true}
                        isLarge={true}
                        badge="POPÜLER TERCİH"
                        {...cardAuthProps}
                    />

                    {/* 2. Question: Single Block - Very Vibrant */}
                    <FreshCard
                        title="SORU"
                        description="Kafanı kurcalayan o denklemi topluluğa fırlat."
                        href="/forum?create=true"
                        icon={MessageCircle}
                        color="bg-[#FB7185]"
                        accentColor="#FB7185"
                        eyebrow="Topluluk sorusu"
                        colSpan="md:col-span-1 lg:col-span-2"
                        {...cardAuthProps}
                    />

                    {/* 3. Experiment: Single Block - Vertical Reach */}
                    <FreshCard
                        title="DENEY"
                        description="Laboratuvar sonuçlarını simüle et, kanıtları herkese sun."
                        href="/makale/yeni?type=experiment"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]"
                        accentColor="#4ADE80"
                        eyebrow="Kanıt ve simülasyon"
                        colSpan="md:col-span-1 lg:col-span-1"
                        rowSpan="md:row-span-2 lg:row-span-1"
                        {...cardAuthProps}
                    />

                    {/* 4. Book: Wide Block */}
                    <FreshCard
                        title="KİTAP"
                        description="Okuduğun bilimsel eseri parçalarına ayır ve incele."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]"
                        accentColor="#60A5FA"
                        eyebrow="Okuma notu"
                        colSpan="md:col-span-2 lg:col-span-2"
                        {...cardAuthProps}
                    />

                    {/* 5. Term: Wide Block Bottom */}
                    <FreshCard
                        title="TERİM"
                        description="Bilim lügatine ansiklopedik bir kavram bırak."
                        href="/makale/yeni?type=term"
                        icon={BookOpen}
                        color="bg-[#C084FC]"
                        accentColor="#C084FC"
                        eyebrow="Bilim sözlüğü"
                        colSpan="md:col-span-1 lg:col-span-1"
                        {...cardAuthProps}
                    />

                </div>

                {/* Footer / Terminal Search Bar - Hacker Style */}
                <div className="mt-4 sm:mt-7 md:mt-9">
                    <Link prefetch href="/ara" className="block w-full group">
                        <div className="bg-zinc-950 text-emerald-500 min-h-14 sm:min-h-[4.5rem] rounded-[10px] flex items-center justify-between px-3.5 sm:px-7 border-[2.5px] sm:border-[3px] border-black hover:bg-black hover:border-emerald-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[0_0_20px_0px_rgba(16,185,129,0.5)] transition-all duration-300 relative overflow-hidden">
                            {/* Terminal Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>

                            <span className="font-bold text-xs min-[390px]:text-sm sm:text-lg md:text-xl flex items-center gap-2 sm:gap-4 md:gap-5 z-10 w-full min-w-0">
                                <span className="text-emerald-500 font-mono font-black text-xl sm:text-2xl shrink-0">{`>`}</span>
                                <span className="font-mono text-emerald-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                    <span className="opacity-50">root@fizikhub:~#</span> search_archive
                                </span>
                                <span className="w-2.5 sm:w-3.5 h-6 sm:h-7 bg-emerald-500 animate-[pulse_1s_step-end_infinite] shrink-0 inline-block -ml-1 sm:-ml-2"></span>
                            </span>
                            <div className="bg-emerald-500 text-black min-h-10 px-4 sm:px-6 py-2 rounded-[8px] font-black text-xs sm:text-sm uppercase border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0 z-10 hidden min-[420px]:flex items-center">
                                EXECUTE
                            </div>
                        </div>
                    </Link>
                </div>

                {/* E-E-A-T and GEO/SEO Context Section */}
                <section className="mt-8 p-4 sm:p-6 bg-white/92 dark:bg-zinc-900/92 border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)] text-black dark:text-zinc-100 relative overflow-hidden">
                    {/* Top yellow accent strip */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#EAB308]"></div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black uppercase text-[#EAB308] tracking-widest">Fizikhub Bilimsel Yayıncılık</span>
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none">
                                Yayın İlkeleri
                            </h2>
                        </div>

                        <p className="text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
                            Fizikhub; fizik, kozmoloji, astrofizik ve modern bilim disiplinlerinde Türkçe ve nitelikli kaynak ihtiyacını karşılamak için kurulmuş, akran denetimine önem veren dinamik bir bilimsel paylaşım merkezidir. Burada yaptığınız her paylaşım, hem arama motorlarının (SEO) hem de yeni nesil yapay zeka arama motorlarının (GEO - Generative Engine Optimization) akademik doğruluk standartlarına göre taranır ve dizine eklenir.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="space-y-3">
                                <h3 className="text-base font-black uppercase text-rose-500">Paylaşım Modellerimiz</h3>
                                <ul className="space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                    <li>
                                        <strong className="text-black dark:text-white">Blog & Makaleler:</strong> Evrensel teoriler, görelilik kuramları, parçacık fiziği bulguları gibi derin konuları sade ve yapılandırılmış biçimde ele alan ana yayın yüzeyidir.
                                    </li>
                                    <li>
                                        <strong className="text-black dark:text-white">Forum Soruları:</strong> Kafanıza takılan karmaşık fizik denklemleri, akademik ödevler veya kozmolojik teoriler hakkında topluluktan ve uzman yazarlardan hızlı, güvenilir cevaplar alabileceğiniz interaktif alandır.
                                    </li>
                                    <li>
                                        <strong className="text-black dark:text-white">Bilimsel Deneyler:</strong> Laboratuvar veya dijital fizik simülasyon sonuçlarını, hipotezlerinizi, metotlarınızı ve gözlem verilerinizi topluluğa sunabileceğiniz deneysel veri merkezidir.
                                    </li>
                                    <li>
                                        <strong className="text-black dark:text-white">Kitap İncelemeleri:</strong> Bilim tarihine geçmiş klasik eserlerden güncel popüler bilim yayınlarına kadar önemli kitapların eleştirel analizlerinin yapıldığı entelektüel köşedir.
                                    </li>
                                    <li>
                                        <strong className="text-black dark:text-white">Sözlük Terimleri:</strong> Akademik sis ve jargondan uzak, kavramların özünü açıklayan ve tüm bilim insanları ile öğrencilerin yararlanabileceği ansiklopedik Türkçe terimler bankasıdır.
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-black uppercase text-blue-500">Neden Fizikhub'da Yazmalısın?</h3>
                                <div className="space-y-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                    <p>
                                        <strong className="text-black dark:text-white">Akademik E-E-A-T Uyumu:</strong> Yazarlarımızın profilleri, uzmanlık alanları ve kaynakçaları Google E-E-A-T (Deneyim, Uzmanlık, Yetkinlik, Güvenilirlik) kurallarına göre indekslenir. Bu sayede paylaşımlarınız internet aramalarında en üst sıralara tırmanır.
                                    </p>
                                    <p>
                                        <strong className="text-black dark:text-white">Gelişmiş Yapay Zeka (GEO) Görünürlüğü:</strong> İçeriklerimiz ChatGPT, Gemini, Perplexity gibi üretken yapay zeka arama motorlarının rahatlıkla okuyabileceği, referans gösterebileceği ve atıf yapabileceği temiz bir JSON-LD şeması ile sarmalanır.
                                    </p>
                                    <p>
                                        <strong className="text-black dark:text-white">Türkçe Bilim Topluluğu:</strong> Türkiye'nin ve dünyanın dört bir yanından fizik meraklısı, mühendis, akademisyen ve öğrencilerden oluşan nitelikli bir kitleye doğrudan erişim sağlarsınız.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-bold text-zinc-500">
                            <span>© 2026 Fizikhub Bilimsel Yayıncılık Standartları</span>
                            <span>Akran Denetimli Popüler Bilim Platformu</span>
                        </div>
                    </div>
                </section>

            </div>

            <style jsx global>{`
                .text-stroke-black {
                    -webkit-text-stroke: 1.5px black;
                }
                @media (min-width: 768px) {
                    .text-stroke-black {
                        -webkit-text-stroke: 2px black;
                    }
                }
            `}</style>
        </div>
    );
}
