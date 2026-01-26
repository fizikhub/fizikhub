import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center pt-20 sm:pt-0 sm:justify-center text-white bg-[#1a1a1a]">
            {/* Background - Disco Pub */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/disco-bg.png"
                    alt="Disco Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/50" /> {/* Overlay for text readability */}
            </div>

            {/* 404 Text - Behind Rick */}
            <div className="absolute z-10 top-[15%] sm:top-[20%] left-1/2 -translate-x-1/2 pointer-events-none select-none w-full text-center">
                <h1 className="text-[140px] leading-none sm:text-[250px] font-black tracking-tighter text-transparent drop-shadow-[0_0_15px_rgba(255,0,255,0.6)]"
                    style={{
                        WebkitTextStroke: "2px #FF00FF",
                        fontFamily: "var(--font-heading)"
                    }}>
                    404
                </h1>
            </div>

            {/* Rick Character - In front of 404, behind UI text */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex items-end justify-center w-full h-full pointer-events-none">
                <img
                    src="/rick-scientist.png"
                    alt="Rick Scientist"
                    className="h-[60vh] sm:h-[85vh] w-auto max-w-none object-contain translate-y-[5%]"
                />
            </div>

            {/* Content - Top layer */}
            <div className="relative z-30 text-center px-4 mt-10 sm:mt-0 flex flex-col items-center">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl max-w-xl">
                    <h2 className="text-3xl sm:text-5xl font-black mb-4 text-[#FFDE00] drop-shadow-[2px_2px_0px_#000]">
                        SAYFAYI BULAMADIK MORTY!
                    </h2>
                    <p className="text-lg sm:text-xl mb-6 font-medium text-gray-100 drop-shadow-md leading-relaxed">
                        Burada sadece ışıklar, müzik ve benim deham var. <br className="hidden sm:block" /> Geri dön, her şey çok karışık!
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-[#FF0055] text-white hover:bg-[#FF0055]/90 font-bold text-lg px-8 border-2 border-white/20 shadow-[0_0_20px_rgba(255,0,85,0.4)] transition-all hover:scale-105 active:scale-95">
                            EVE DÖN
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
