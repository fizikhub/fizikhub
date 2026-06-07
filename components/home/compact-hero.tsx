import { DeferredMemeCanvas } from "@/components/home/deferred-meme-canvas";

export function CompactHero() {
    return (
        <section className="mb-1 sm:mb-4" aria-labelledby="home-hero-title">
            <div className="w-full relative group min-h-[156px] sm:min-h-[220px]">
                <div
                    className="
                        relative w-full h-[clamp(156px,43vw,188px)] sm:h-[220px] md:h-[240px] overflow-hidden
                        rounded-[8px] border-2 sm:border-[3px] border-black
                        shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]
                        bg-zinc-950 bg-[radial-gradient(circle_at_50%_120%,rgba(60,0,120,0.5),transparent)]
                    "
                >
                    <div className="absolute inset-0 z-0" aria-hidden="true">
                        <DeferredMemeCanvas />
                    </div>

                    <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-3 pt-5 pb-5 sm:p-5 sm:pb-8 text-center">
                        <h1
                            id="home-hero-title"
                            className="font-head py-1 text-[clamp(2.35rem,11.5vw,3.35rem)] min-[390px]:text-[clamp(2.55rem,11vw,3.65rem)] sm:text-[clamp(4rem,7vw,4.75rem)] font-black tracking-normal leading-[1.03] bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
                            style={{
                                filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.9))",
                            }}
                        >
                            <span className="block text-[11px] sm:text-base font-bold tracking-normal text-blue-200/85 uppercase mb-0 drop-shadow-md bg-none text-blue-200/85">
                                BİLİMİ
                            </span>
                            {" "}
                            <span className="block whitespace-nowrap">Tİ&apos;YE</span>
                            {" "}
                            <span className="block whitespace-nowrap">ALIYORUZ</span>
                        </h1>

                        <div className="mt-1.5 sm:mt-3 transform origin-center animate-[badge-wiggle_3s_ease-in-out_infinite]">
                            <span className="inline-block bg-[#EAB308] border-[2px] border-black text-black px-3 py-1.5 sm:px-4 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                                AMA CİDDİ ŞEKİLDE
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
