import { ChevronDown, MessageSquareQuote, Compass, HelpCircle, Link as LinkIcon, BookOpen } from "lucide-react";
import Link from "next/link";

interface QuickAnswerProps {
    override: {
        summaryTitle: string;
        summary: string;
        formulaTitle: string;
        formula: string;
        formulaExplanation: string;
        exampleTitle: string;
        example: string;
        subtopics: readonly string[];
        questions: readonly { question: string; answer: string }[];
        termLinks: readonly { href: string; label: string }[];
        relatedQueries: readonly string[];
        sources?: readonly { href: string; label: string }[];
    };
    relatedArticles: { slug: string; title: string }[];
}

export function CollapsibleQuickAnswer({ override, relatedArticles }: QuickAnswerProps) {
    return (
        <section className="container mx-auto max-w-3xl px-4 mt-5 sm:mt-8 mb-7 sm:mb-10 z-10 relative">
            <details className="group rounded-[14px] border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] dark:bg-[#18181b] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.55)]">
                {/* Accordion Toggle Header */}
                <summary className="flex w-full cursor-pointer list-none select-none items-center justify-between gap-3 rounded-[12px] px-4 py-3.5 text-left transition-colors duration-200 hover:bg-zinc-50 group-open:rounded-b-none group-open:rounded-t-[12px] group-open:border-b-2 group-open:border-black group-open:bg-zinc-50/40 dark:hover:bg-[#242427] dark:group-open:bg-[#202024] sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[8px] bg-[#FFE500] border-2 border-black text-black font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000] transform hover:rotate-12 transition-transform">
                            ⚡
                        </span>
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">HIZLI ÖZET VE KAVRAM REHBERİ</p>
                            <h2 className="text-[15px] sm:text-lg font-black text-zinc-950 dark:text-white leading-tight mt-0.5">
                                {override.summaryTitle}
                            </h2>
                        </div>
                    </div>
                    <ChevronDown
                        aria-hidden="true"
                        className="h-5 w-5 flex-shrink-0 stroke-[3px] text-zinc-500 transition-transform duration-300 group-open:rotate-180 group-open:text-black dark:group-open:text-[#FFE500] sm:h-6 sm:w-6"
                    />
                </summary>

                {/* Collapsible Content */}
                <div>
                    <div className="px-4 py-5 sm:px-6 sm:py-6 space-y-6 rounded-b-[14px]">
                        
                        {/* Summary Block */}
                        <div className="relative">
                            <p className="text-[15px] sm:text-base font-bold leading-relaxed text-zinc-900 dark:text-zinc-100 pl-4 border-l-[3px] border-[#FFE500]">
                                {override.summary}
                            </p>
                        </div>

                        {/* Formula & Example Section */}
                        <div className="grid gap-4 border-t border-zinc-800/15 dark:border-zinc-800/80 pt-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                    <MessageSquareQuote className="w-3.5 h-3.5" />
                                    <span>{override.formulaTitle}</span>
                                </div>
                                <p className="rounded-[10px] border-2 border-black bg-zinc-50 px-4 py-3 font-mono text-sm font-black text-black dark:bg-[#242427] dark:text-zinc-50 shadow-[2px_2px_0px_0px_#000] dark:border-zinc-700">
                                    {override.formula}
                                </p>
                                <p className="text-xs leading-relaxed font-semibold text-zinc-500 dark:text-zinc-400 pt-1">
                                    {override.formulaExplanation}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                    <Compass className="w-3.5 h-3.5" />
                                    <span>{override.exampleTitle}</span>
                                </div>
                                <div className="rounded-[10px] border-2 border-black bg-zinc-50/50 p-4 text-xs sm:text-sm leading-relaxed font-bold text-zinc-700 dark:text-zinc-300 dark:bg-zinc-900/40 dark:border-zinc-700">
                                    {override.example}
                                </div>
                            </div>
                        </div>

                        {/* Subtopics Section */}
                        <div className="border-t border-zinc-800/15 dark:border-zinc-800/80 pt-5">
                            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 stroke-[2.5px]" />
                                Bu konuda bilinmesi gereken alt başlıklar
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {override.subtopics.map((topic) => (
                                    <span
                                        key={topic}
                                        className="rounded-[8px] border-2 border-black bg-white px-3 py-1.5 text-xs font-black text-zinc-900 dark:border-zinc-700 dark:bg-[#242427] dark:text-zinc-100 shadow-[1.5px_1.5px_0px_0px_#000] transition-transform hover:-translate-y-0.5 cursor-default select-none"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="border-t border-zinc-800/15 dark:border-zinc-800/80 pt-5 space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 stroke-[2.5px]" />
                                Sık Sorulan Sorular
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {override.questions.map((item, idx) => (
                                    <div 
                                        key={item.question}
                                        className="p-4 bg-zinc-50 dark:bg-[#242427] border-2 border-black rounded-[10px] shadow-[2px_2px_0px_0px_#000] dark:border-zinc-700"
                                    >
                                        <h4 className="text-sm sm:text-base font-black text-zinc-950 dark:text-white flex items-start gap-1.5">
                                            <span className="text-[#FFE500] font-black">Q{idx+1}.</span>
                                            {item.question}
                                        </h4>
                                        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed font-semibold text-zinc-600 dark:text-zinc-400">
                                            {item.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Related and Terms Section */}
                        <div className="grid gap-5 border-t border-zinc-800/15 dark:border-zinc-800/80 pt-5 sm:grid-cols-2">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    İlgili okumalar
                                </p>
                                <div className="grid gap-2">
                                    {relatedArticles.map((article) => (
                                        <Link
                                            key={article.slug}
                                            href={`/makale/${article.slug}`}
                                            className="text-sm font-black text-zinc-950 dark:text-white underline decoration-[#FFE500] decoration-[3px] underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors w-fit leading-tight"
                                        >
                                            {article.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                    Anahtar Kavramlar & Terimler
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {override.termLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="rounded-[8px] border-2 border-black bg-[#FFE500] px-3 py-1.5 text-xs font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] hover:bg-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    {override.relatedQueries.map((query) => (
                                        <span
                                            key={query}
                                            className="rounded-[8px] border-2 border-black bg-white px-3 py-1.5 text-xs font-black text-zinc-950 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#000] cursor-default select-none"
                                        >
                                            {query}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {override.sources && override.sources.length > 0 && (
                            <div className="border-t border-zinc-800/15 pt-5 dark:border-zinc-800/80">
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                    <BookOpen className="h-4 w-4 stroke-[2.5px]" />
                                    Güvenilir kaynaklar
                                </h3>
                                <ul className="grid gap-2 sm:grid-cols-2">
                                    {override.sources.map((source) => (
                                        <li key={source.href}>
                                            <a
                                                href={source.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-bold text-zinc-700 underline decoration-[#FFE500] decoration-2 underline-offset-4 hover:text-black dark:text-zinc-300 dark:hover:text-white"
                                            >
                                                {source.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </details>
        </section>
    );
}
