"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const facts = [
    "Işık, Güneş'ten Dünya'ya yaklaşık 8 dakika 20 saniyede ulaşır. Yani şu an güneşe bakıyorsanız, aslında 8 dakika öncesini görüyorsunuz. Geçmiş olsun.",
    "Evrendeki atomların %90'ından fazlası hidrojendir. Geri kalanı da 'ben neyim?' diye düşünüyor.",
    "Bir nötron yıldızından alınan bir çay kaşığı madde, Everest Dağı kadar ağırdır. Çayına şeker niyetine atma sakın.",
    "Ses uzayda yayılmaz çünkü ses dalgalarının iletilmesi için bir ortama ihtiyacı vardır. Çığlık atsanız da kimse duymaz, korku filmi gibi.",
    "Venüs, Güneş Sistemi'ndeki en sıcak gezegendir. Merkür güneşe daha yakın ama Venüs 'sera etkisi' yüzünden yanıyor. İşte küresel ısınmanın sonu.",
    "Samanyolu Galaksisi'nin merkezinde süper kütleli bir kara delik bulunur. Adı Sagittarius A*. Evet, galaksimizin kalbinde bir canavar var.",
    "Zaman, kütleçekimi arttıkça yavaşlar. Karadeliğin yanında takılırsanız, dünyadakiler yaşlanırken siz genç kalırsınız. Anti-aging'in zirvesi.",
    "Kuantum dolanıklığı sayesinde parçacıklar, aralarındaki mesafe ne olursa olsun birbirlerini anında etkileyebilirler. Buna Einstein 'uzaktan ürkütücü eylem' demişti. Haklıymış.",
    "Evren sürekli genişlemektedir ve bu genişleme hızı giderek artmaktadır. Nereye yetişmeye çalışıyorsa artık.",
    "Bir atomun %99.9999999'u boşluktur. Yani aslında hiçliğe dokunuyorsunuz. Varlığınız bir illüzyon olabilir mi?",
    "Güneşin içine yaklaşık 1.3 milyon tane Dünya sığabilir. Sıkış tepiş tabi.",
    "Bir gün aslında 24 saat değil, 23 saat 56 dakika 4 saniyedir. Kalan 3 dakika 56 saniye nereye gidiyor sanıyorsunuz?",
    "İnsan DNA'sı %50 oranında muzla aynıdır. Meyve tabağına bakışınız değişti mi?",
    "Uzayda ağlayamazsınız çünkü yer çekimi olmadığı için gözyaşlarınız akmaz, gözünüzde topaklanır. Dramatik sahneler iptal.",
    "Satürn o kadar hafiftir ki, yeterince büyük bir küvete koysanız yüzerdi. Ama küveti kim temizleyecek?",
    "Eğer bir kara deliğe düşerseniz, spagetti gibi uzarsınız. Bilimsel terimi gerçekten de 'spagettifikasyon'dur. Afiyet olsun.",
    "Bir insan vücudunda, evrendeki yıldız sayısından daha fazla atom bulunur. Kendinizi o kadar da küçük hissetmeyin.",
    "Işık bir saniyede dünyanın etrafını 7.5 kez dolaşabilir. Ama sabahları uyanmak hala zor.",
    "Venüs'te bir gün, bir yıldan daha uzundur. 'Bugün bitmek bilmedi' lafı orada gerçek.",
    "Hamamböcekleri kafaları kopsa bile birkaç hafta yaşayabilirler. Sonunda açlıktan ölürler çünkü yemek yiyecek ağızları yoktur. Mantıklı.",
    "Tardigradlar uzay boşluğunda hayatta kalabilir. Biz ise Wi-Fi gidince ölüyoruz.",
    "Eğer dünyadaki tüm insanlar aynı anda zıplarsa... Hiçbir şey olmaz. Evren bizimle o kadar ilgilenmiyor.",
    "Plüton keşfedildiği tarihten (1930) gezegen statüsünden çıkarıldığı tarihe (2006) kadar güneşi bir kez bile tam turlayamadı. Yazık.",
    "Nötron yıldızları saniyede 600 kez dönebilir. Başın dönmesi neymiş o zaman görürsün.",
    "Her yıl Ay dünyadan 3.8 cm uzaklaşıyor. İlişkimize biraz mesafe koymak istiyor sanırım."

];

export function DailyFact() {
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentFactIndex(Math.floor(Math.random() * facts.length));
    }, []);

    const nextFact = () => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    };

    if (!isClient) return null;

    return (
        <section className="py-16 bg-primary text-primary-foreground border-b-2 border-black dark:border-white">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 font-black mb-6 uppercase tracking-widest border-2 border-black dark:border-white px-4 py-1 bg-white text-black">
                        <Zap className="w-4 h-4 fill-black" />
                        <span>Gereksiz Bilgiler Ansiklopedisi</span>
                    </div>

                    <div className="relative min-h-[120px] flex items-center justify-center mb-8">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentFactIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="text-2xl md:text-4xl font-black leading-tight"
                            >
                                "{facts[currentFactIndex]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={nextFact}
                        className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors border-2 border-transparent hover:border-black"
                    >
                        BAŞKA BİR TANE DAHA
                    </button>
                </div>
            </div>
        </section>
    );
}
