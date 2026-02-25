const fs = require('fs');
const file = '/Users/baran/.gemini/antigravity/scratch/fizikhub/components/articles/article-feed.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ProfileArticleCard')) {
    content = content.replace(
        'import { ViewTransitionLink } from "@/components/ui/view-transition-link";',
        'import { ViewTransitionLink } from "@/components/ui/view-transition-link";\nimport { ProfileArticleCard } from "@/components/profile/profile-article-card";'
    );
}

const startStr = '                {/* FEATURED MAGAZINE SPREAD */}';
const endStr = '                </section>';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const sectionToReplace = content.substring(startIndex, endIndex + endStr.length);
    const newSection = `                {/* ARTICLES GRID */}
                <section className="mb-16">
                    <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 mb-6">
                        <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tighter">İndeks</h2>
                        <span className="bg-black dark:bg-white text-white dark:text-black font-black text-base px-3 py-1 rounded-full uppercase">
                            {articles.length} Yazı
                        </span>
                    </div>

                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <ProfileArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-black dark:border-white rounded-2xl bg-black/5 dark:bg-white/5">
                            <Cpu className="w-12 h-12 mb-4 opacity-20" />
                            <h3 className="font-heading font-black text-2xl uppercase mb-2">BOŞLUK.</h3>
                            <p className="font-bold text-zinc-500 text-sm max-w-sm">Bu filtrede hiçbir sinyal yakalanamadı. Lütfen rotayı değiştirin.</p>
                            <Link href="/makale" className="mt-6 bg-[#FF0080] text-white font-black uppercase text-sm px-5 py-2.5 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                KAPSAMA ALANINA DÖN
                            </Link>
                        </div>
                    )}
                </section>`;

    content = content.replace(sectionToReplace, newSection);
}

content = content.replace(/    const showFeatured = [^\n]*\n/g, '');
content = content.replace(/    const featured = [^\n]*\n/g, '');
content = content.replace(/    const restArticles = [^\n]*\n/g, '');

fs.writeFileSync(file, content);
console.log('Update complete');
