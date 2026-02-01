/**
 * FizikHub Daily ArXiv Automation Script
 * 
 * Bu script her gün çalışarak:
 * 1. ArXiv API üzerinden en son fizik makalelerini çeker
 * 2. FizikHub'ın GERÇEK makalelerinin TAMAMINI içeren TAM METİN eğitim verisi ile çevirir
 * 3. Supabase'e otomatik yayınlar
 */

import { createClient } from '@supabase/supabase-js';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// ============= CONFIGURATION =============
const ARXIV_API_URL = 'http://export.arxiv.org/api/query?search_query=cat:physics*+OR+cat:astro-ph*+OR+cat:quant-ph*&sortBy=submittedDate&sortOrder=descending';
const MAX_ARTICLES_PER_DAY = 3;
const BOT_AUTHOR_ID = process.env.ARXIV_BOT_AUTHOR_ID || null;

// ============= CLIENTS =============
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============= TAM METİN EĞİTİM VERİSİ (BARAN BOZKURT YAZILARI - HER KELİMESİYLE) =============
const FIZIKHUB_COMPLETE_ARTICLES = `
# FİZİKHUB EĞİTİM VERİSİ - TAM METİN MAKALELER

Aşağıdaki makalelerin TAMAMINI oku ve bu üslubu, esprileri, anlatım tarzını birebir kopyala. Bunlar sitenin kurucusu Baran Bozkurt tarafından yazılmıştır.

---
MAKALE 1: EKSİKLİK TEOREMİ (TAM METİN)

900'lerin başında vizyoner matematikçiler bir araya toplanıp "Her şeyi açıklayan bir formül elde edebilir miyiz acaba?" diye düşündüler. Bu formül o kadar mükemmel olmalıydı ki; 2+2'nin cevabını 4 verebilir, Ay ile Dünya arasına kaç tane ülker çikolatalı gofretin sığabileceğini söyleyebilir, keza aşkın cevabını da bulabilmeliydi. Eh, böyle bir formül bulsalardı süper olurdu. Ama bulamadılar. Yüksek ihtimalle hiçbir zaman da bulamayacaklar. Neden?

1900'lerin başında bu vizyoner matematikçilerin yüzüne şlak diye "Eksiklik Teoremini" yapıştıran genç Kurt Gödel yüzünden tabii ki. Gödel'in teorisi şuydu: Doğru olan her şey kanıtlanamaz.

İlginç. Ne yani, bir çikolatalı gofretin 33 gram olduğu doğru ama kanıtlayamaz mıyız? Yok yavrum, o öyle değil işte.

Eksiklik Teoremi
1900'lerdeki o vizyoner abilerimizin hayalindeki formül veyahut sistem şöyleydi:

1. Tutarlı Olmalı: Sistem içinde asla çelişki olmamalı. Hem 5+5=10 hem de 5+5=11 diyemeyiz.

2. Tam Olmalı: Doğru olan her matematiksel ifadenin mutlak ve değişmez bir kanıtı olmalı. Örneğin 2+2=4 gibi, bu mutlak ve değişmezdir.

Gödel masadaki soğana vurup cücüğünü çıkardı tuzlayıp yedikten sonra şunu dedi: "Hocam diyelim ki 'Bu cümle yalandır' yazılı bir kağıt olsun. Sonracığıma diyelim ki sizin bu mükemmel, her şeyi açıklayan sisteminiz bir kitap olsun. Bu kitaba bakarak 'Bu cümle bu sistem içinde kanıtlanamaz' ifadesini inceleyelim."

Eğer bu cümle kanıtlanırsa, cümlenin kendisi "kanıtlanamaz" diyordu; demek ki sistem çelişti (Tutarlı değil). Eğer kanıtlanamıyorsa, cümlenin dediği şey doğru çıktı ama sistem bunu kanıtlayamıyor (Tam değil). Yani bu cümle kanıtlansa da kanıtlanmasa da sistem yukarıda bahsettiğimiz o mükemmelliğe erişemez.

Gödel soğanın üstüne çay içip ikinci şlapı vurdu:"Sevgili birtanecik matematikçiler, kurduğunuz sistem aritmetik yapabilecek kadar karmaşıksa, ya içinde çelişkiler barındırır (yani yalan söyler) ya da eksik kalmaya mahkumdur."

İşte bu noktada matematik 404 hatası aldı. Çünkü bu vizyoner matematikçi abilerimiz matematiği, her sorunun cevabını "Evet" ya da "Hayır" diye net bir şekilde veren bir makineye benzetmek istiyorlardı. Gödel ise makinenin içine, makinenin kendi kendine asla çözemeyeceği bir soru attı.

Bununla da kalmadı, Gödel hızını alamayıp İkinci Eksiklik Teoremi ile masadaki diğer soğanada vurdu. Dedi ki: "Bir sistemin tutarlı olduğunu (yani saçmalamadığını), sadece o sistemin kurallarını kullanarak ispatlayamazsınız."

Örneğin bir adam sana geliyor ve "Ben asla yalan söylemem" diyor (erkekler her zaman yalan söyler mal erkekler). Bu adama inanmak için onun sözünden başka bir kanıta (belki bir şahide, belki bir kamera kaydına) ihtiyacın var. Matematik de böyle işte. Matematiğin kendi kendine "Ben sağlamım, bana güvenin" demesi yetmiyor. Bunu kanıtlamak için matematiğin dışına çıkman, daha üst bir sisteme geçmen lazım. Ama o üst sistemin sağlamlığını kanıtlamak için daha da üste... Sonsuz bir döngü. Hoppaaa…

Peki, bu ne anlama geliyor? Kepenkleri falan mı kapatalım? Mühendisler fizikçilerin emrettiği şeyleri yapmayı mı bıraksın? Biz marketten para üstü almayı bırakalım mı? Hayır. Gödel matematiğin işe yaramaz olduğunu söylemedi; sadece sınırları olduğunu söyledi. Evrenin bütün sırlarını tek bir kitaba, tek bir formüle sığdıramazsın dedi. Belki de bizi yapay zekadan ve hesap makinelerinden ayıran şey budur. Biz "Gödel Cümlesi"ne baktığımızda onun doğru olduğunu sezgilerimizle anlıyoruz ama sistem (matematik) bunu ispatlayamıyor.

O her şeyi açıklayan, aşkın formülünü bile veren "Mükemmel Teori" maalesef yok. Ama en azından artık neyi bilemeyeceğimizi biliyoruz. Hiç yoktan iyidir.

---
MAKALE 2: TANRI ZAR ATMAZ MI? (TAM METİN)

Bazen alacağım önemli kararları okey salonundan çaldığım zarı atarak karar veriyorum. Çift sayı gelirse o kararı uyguluyorum, tek sayı gelirse o kararı uygulamıyorum. Zar atarak karar verme sürecimi kısaltıyorum. Peki eğer Tanrı varsa ve evreni oluştururken karar verme sürecini kısaltmak için zar atmış veya atıyor olabilir mi?

Bu konuyu ele alırken saygıdeğer Einstein'ın düşüncelerinden bahsederek başlayacağız. Söz gelimi kendisi Tanrı'nın zar atmayacağını iddia etmiştir. Bilimsel bir yaklaşım sergilersek, Tanrı'nın zar atabileceğini kanıtlarsak saygıdeğer Einstein'ı yanlışlayabiliriz. Einstein'ı yanlışlayabilmek hoşuma gider.

EINSTEIN'IN TANRISI
Einstein'ın ailesi pek de dindar olmayan Aşkenaz Yahudileriydi. Anne ve babasının sekülerliğine rağmen genç yaşta Albert, Yahudiliği büyük bir tutkuyla benimsedi ve ona emredilen görevleri yerine getiren dindar bir Yahudi oldu. Yahudi geleneğine göre her hafta yoksul ve bilgili bir kişi yemeğe çağrılırdı. Einstein ailesi de genç yaştaki Einstein'ın fikirlerinin olgunlaşmasında büyük emeği geçen tıp öğrencisi Max Talmud'u davet ederdi. Max Talmud genel olarak Einstein'ın öğretmeni olarak bilinir ama kendisi son derece başarılı bir doktordur. Talmud, genç yaştaki Einstein'ı doğa bilimleri ile tanıştırdı; metafiziğin tamamen reddedilmesi gerektiğini savunan Avusturyalı fizikçi Ernst Mach'ın "görmek inanmaktır" felsefesini benimsetti.

Ancak Einstein'ın bu entelektüel yolculuğunda, genç yaşta benimsediği kutsal metinler ile bilim arasındaki çatışma şlap diye acımasızca yüzüne vurdu. Ergen Einstein'ımız ise isyan etti ve dogmatik dinlere karşı büyük bir nefret geliştirdi. Genç yaşta acımasızca karşılaştığı ampirist felsefe ona ileride çok fayda sağlayacaktı.

Sene 1905'e gelindiğinde KPSS'den güzel bir puan alarak İsviçre Patent Ofisine atandı ve çalışmaya başladı. Her memur gibi o da kaytarmayı sevdiğinden, "Bari kaytarıyorsak faydalı bir iş için kaytaralım" mantalitesi ile genç yaşta tanıştığı Mach'ın mutlak uzay ve zamanı reddetmesi üzerine düşünmeye başladı. Bu kaytarma, ileride büyük yankı uyandıracak olan özel görelilik teorisinin temelini attı. Ama memurluktan emekli olduktan sonra, her ne kadar ünlenmesine yardımcı olan bu düşüncenin temelini atan Mach'ın dogmatik, asi ampirizmini reddetmeye başladı. Hatta bir keresinde "Mach, mekanikte ne kadar iyiyse felsefede o kadar ucubedir" dedi. Tamam, "ucube" kısmını ben uydurdum ama anladınız işte siz.

Zamanla Einstein çok daha rasyonel bir bakış açısı geliştirdi. Yani ona göre bilimsel teoriler işe yarayan ıvır zıvırlar değil; gerçekten var olan evrenin araçlarıdır. Kısacası Einstein, insan aklının bu araçları bir ölçüde anlayabildiğini savundu. Eh yani pek de haksız sayılmaz. Bu savunmayı "dindar bir duyguya" benzetirdi ama din anlamında değil; dine duyulan saygı gibi evrene duyduğu saygı ve hayranlık duygusu gibi.

Anlayacağınız üzere Einstein'ın Tanrısı dini değil, felsefiydi. Yaşlı Einstein'a yıllar sonra Tanrı'ya inanıp inanmadığı sorulduğunda:

"Ben Spinoza'nın Tanrısı'na inanıyorum; O, var olan her şeyin yasal uyumunda kendini gösterir ancak insanlığın kaderi ve işleriyle ilgilenen bir Tanrı'ya inanmıyorum."

dedi. İlginç. Bu cevabı biraz inceleyelim.

Spinoza'ya göre Tanrı eşittir doğadır. Yani Tanrı bir kişi değildir; dualarımıza karşılık vermez ya da mucize falan yapmaz. Tanrı evreni yaratmamıştır; evren zaten Tanrı'dır. İnsanlar, gezegenler, galaksiler, kolalı jelibonlar aslında hepsi Tanrı'nın kendisidir. Einstein'ın Spinoza'nın Tanrısı'na inandığını söylemesi ile şunu anlarız: Einstein evrene büyük bir saygı duyuyordu. Kısacası bu sözü ile — Amsterdam'daki Yahudi cemiyetinden aforoz edilse bile — Einstein şunu da söylemek istiyor: Evrenin akılla anlaşılabilir olduğuna güvenmek, dindarlığa yakın bir şey.

Einstein evrenin akılla anlaşılabilir olduğuna inanıyordu. Kuantum fiziği ise evrenin akılla anlaşılamayacak kadar karmaşık ve olasılığa dayalı bir yapıda olduğunu söylüyordu. Bu nedenle Einstein kuantum fiziğine hep biraz ön yargılıydı. Ona göre evren düzenli ve anlaşılabilirdi. Ama kuantum fiziği tam tersini söylüyordu.

Einstein'ın o meşhur sözüne tekrar değinelim: "Tanrı zar atmaz." Einstein burada dini bir Tanrı'dan bahsetmemiştir. Spinoza'nın Tanrısı olan evrenden bahsetmiştir. Evrenin zar atmayacağını, çünkü evrenin gayet düzenli bir yapıda olduğunu söylemek istemiştir. Ama Einstein efendi yanılıyordu. Tanrı bal gibi de zar atar. Hatta bazen hile yapıp zarı bile tutar.

TANRI NASIL ZAR ATAR?
Aslında bu yazıda Tanrı'nın nasıl zar attığına değinmek planımda yoktu. Bunu başka bir yazıda detaylı ele almak istiyordum ama madem bu kadar Tanrı'nın zar attığını iddia ettik, nasıl attığına değinmemek yazıyı yarım bırakmak olurdu. Ucundan değinelim.

Kuantum dünyası temelde belirsiz ve olasılık tabanlıdır. Niels Bohr şöyle demiştir:

"Kuantum dünyası diye somut bir şey yok; sadece onu tanımlamak için yaptığımız model var."

Yani adamcağız diyor ki: Örneğin dalga fonksiyonu gerçek bir şey olmak zorunda değil; sadece ölçümlerimizi hesaplamaya yarayan bir araçtır. Kuantumun kurucularından Bohr, fiziğin aslında doğanın gerçekten ne olduğu değil; doğa hakkında ne söyleyebileceğimizi incelediğini söyler. Yani bilemiyorum, Bohr kendi içinde fiziğin tanımını yapmış ama günümüzde bu tanımın pek doğru olduğunu söylemek doğru değil.

Einstein evrenin gayet anlaşılabilir olduğunu savunuyordu. Bohr ve diğerleri ise "Hayır kardeşim, in mikro boyuta gör ananın ebesini" mantalitesi ile Einstein'a karşı çıktılar.

Mikro evren ile makro evren birbiriyle iç içedir. Amiyane tabirle atom altı parçacıkların rastlantısal hareketleri, atomun kararlılığını ve davranışını etkiler ve sonuç olarak makro evrendeki projeksiyonlarda olasılıklar ortaya çıkar. Tüm parametrelere sahip olsan bile %100 bilemeyeceğin olasılıklar… Evet, hava durumunu tahmin edebilirsin; yumurtanın kaç dakikada kayısı kıvamına geldiğini tahmin edebilirsin; 100 metre yükseklikten bir top serbest düşüşe geçtiğinde 50. metredeki hızını hesaplayabilirsin. Ancak karmaşık ve çok daha uzun vadede oluşacak olaylarda, denklemdeki tüm parametreleri bilsen bile kuantum fiziğine göre %100 kesinlikte tahminde bulunamazsın. Çünkü o sistemde bazı parçacıkların mikro rastgele hareketleri yüzünden küçük sapmalar oluşacak ve 1–2 saniye sonrasını kesin öngörebildiğin bu denklemle, 1–2 milyar yıllık süreci çok daha düşük kesinlikle tahmin edebilir hale geleceksin. Süre arttıkça sapma artacak.

Kuantum dolanıklılık, belirsizlik ilkesi eğer parçacık fiziğinde modasını yitirir; parçacıkların konumu, hızı vb. farklı parametrelerin aynı anda tespit edilebileceği formüller, teknik ve teknoloji gelişir ve yepyeni bir teori ileri sürülürse bilim tekrar determinist bakış açısına döner. Ancak böyle bir vakte kadar bilinmezlik/tesadüf bilimsel açıdan en sağlam argüman olmaya devam edecektir. (Belki de sonsuza dek bu durum Einstein'ın canını çok sıkmış olsa da.)

---
MAKALE 3: ENTROPİ (TAM METİN)

Sarısı patlamış sahanda yumurtanın sarısını neden eski haline döndüremeyiz? Kırılmış bir kalbi neden tek bir sözle onaramayız? Tüm bu soruların merkezinde o meşhur kavram yatıyor: Entropi.

Entropi Nedir?

Entropi, amiyane tabirle evrendeki her şeyin düzenden düzensizliğe doğru akmasıdır. Bu tanım biraz eksik ama şimdilik genel çerçeveyi kavramanız için yeterli.

Evrendeki her şey; karmaşık, düzensiz ve "yayılmış" bir hale dönüşmek ister. Nedeni basit: Olasılık. Düzenli olmak enerji ve çaba ister. Odanı düşün; yüksek ihtimalle şu an dağınıktır. Enerji harcayıp odanı jilet gibi yapabilirsin. Ama sen prensip sahibi ve "önemli" bir kişi olduğundan, o değerli enerjini odayı toplamak için harcamazsın. İşte evren de tam olarak bu mantaliteyle çalışıyor.

Big Bang ve Düzen

Evrenin bu mantalitesini daha iyi anlamak için onun doğum anına, yani Big Bang'e (Büyük Patlama) gidelim.

Bildiğiniz gibi yaklaşık 13.8 milyar yıl önce, nedeni pek bilinmeyen bir sebepten dolayı evren bir anda ortaya çıktı. Adına "Büyük Patlama" desek de, aslında orada klasik anlamda bir bomba patlaması falan olmadı. Olay, muazzam bir genişlemeydi. Detayları başka bir yazıda konuşuruz, biz konumuz olan entropiye dönelim.

Büyük Patlama olduktan sonraki o akıl almaz kısalıktaki süre (10 üzeri eksi 43 saniye) boyunca "Planck Dönemi" yaşandı. Bu dönemi şöyle hayal edelim: Şu anki gözlemlenebilir evrendeki tüm galaksiler, gezegenler ve yıldızlar, bir toplu iğne başından bile küçük bir alana sıkışmıştı. O kadar yoğun, sıcak ve en önemlisi düzenliydi ki... Mükemmel bir "düşük entropi" durumu. Karmaşa yoktu, her şey derli topluydu.

Ama evren, derli toplu kalmak için uğraşmak istemedi. Bu doyumsuz hızla genişledi. O minicik alana sığdırdığı maddeyi milyarlarca ışık yılı uzaklıklara saçtı. Bu saçılan maddeler zamanla büyüyüp adam oldular koca koca yıldızlara, galaksilere dönüştüler. Tıpkı ebeveynleri olan evren gibi onlar da tek bir yerde durmaya karşıydılar ve birbirlerinden gittikçe uzaklaştılar.

Peki Bu Gidiş Nereye? Isıl Ölüm

Evrenin ve onun çocuklarının düzene olan bu nefretleri nereye kadar sürecek?

Isıl Ölüm'e kadar.

Isıl ölüm; evrenin entropisinin maksimum seviyeye ulaşması demektir. Termodinamiğin ikinci yasası gereği entropi sürekli artmak zorundadır. Sonunda evren, mükemmel bir "termodinamik dengeye" erişecektir. Kafan karışmasın, "denge" iyi bir şey gibi tınlasa da burada durum vahim. Hemen bir makarna örneğiyle açıklayalım.

Canın makarna çekti. Tencereye su, tuz, makarna ve yağ koydun. Ocağın altını açtın. Aslında yaptığın şey şu: Doğalgazdaki kimyasal enerjiyi ısıya çevirip tencereye aktarmak. Tencere ısınır, o ısıyı makarnaya verir ve makarna pişer. Bu transferin olabilmesi için ocağın tencereden daha sıcak olması gerekir. Yani bir sıcaklık farkı vardır.

İşte evrenin ısıl ölümü, artık o tencereyi ısıtamayacağınız ana verilen addır. Çünkü evrenin her noktası, istisnasız bir şekilde aynı sıcaklığa erişmiştir. Enerjiyi bir yerden bir yere aktaracak, ısıtacak ya da soğutacak hiçbir potansiyel fark kalmamıştır. Sıcaklık farkı yoksa, enerji akışı yoktur. Enerji akışı yoksa, iş yoktur. İş yoksa, canlılık da yoktur. Siz de yoksunuz makarna da yok. Aşk da yok. Aşk yoksa yansın bu dünya.

İnsan şunu düşünebilir: "Yaw her yerde sıcaklık aynıysa, her şey eşit dağılmışsa bu 'düzenli' demek değil midir? Maksimum düzene ulaşmışız, sen ucube gibi neden buna maksimum düzensizlik diyorsun?"

Güzel soru ama cevap hayır. Termodinamik açıdan bu durum maksimum düzensizliktir.

Bunu şöyle düşünün: Kütüphanedeki kitapların türlerine göre raflara dizilmesi "düzendir" (Düşük Entropi). Ancak bir bombanın patlayıp o kitapların sayfalarını kütüphanenin her santimetrekaresine eşit şekilde, homojen olarak dağıtması "düzensizliktir" (Yüksek Entropi).

Isıl ölümde enerji o kadar eşit ve homojen yayılmıştır ki, artık onu kullanıp bir "yapı" oluşturmak imkansızdır. Evren kapalı bir sistem olduğundan, bu sona doğru kaçınılmaz bir şekilde sürüklenmektedir.
---

ÜSLUP EMİRLERİ:
1. Yukarıdaki makalelerdeki anlatım tarzını, esprileri, "Hocam", "Şefim" gibi hitapları aynen kullan.
2. "Matematik 404 hatası aldı", "soğana vurup cücüğünü çıkardı", "Hoppaaa", "Aşk yoksa yansın bu dünya" gibi kalıpları uygun yerlere yerleştir.
3. Akademik dili BIRAK, podcast anlatır gibi konuş.
4. ArXiv abstract'ındaki HER CÜMLEYİ çevir, asla özetleme.
5. En az 500 kelime yaz.
`;

// ============= HELPER FUNCTIONS =============

interface ArxivItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    creator: string;
}

async function fetchArxivPapers(): Promise<ArxivItem[]> {
    console.log('📡 ArXiv API üzerinden makaleler çekiliyor...');

    const url = `${ARXIV_API_URL}&max_results=${MAX_ARTICLES_PER_DAY}`;
    const response = await fetch(url);
    const xmlText = await response.text();

    const items: ArxivItem[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xmlText)) !== null && items.length < MAX_ARTICLES_PER_DAY) {
        const entryXml = match[1];

        const title = entryXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim() || '';
        const link = entryXml.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || '';
        const summary = entryXml.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.replace(/\s+/g, ' ').trim() || '';
        const published = entryXml.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || '';
        const author = entryXml.match(/<name>([\s\S]*?)<\/name>/)?.[1]?.trim() || 'ArXiv';

        if (title && summary) {
            items.push({
                title,
                link,
                description: summary,
                pubDate: published,
                creator: author
            });
        }
    }

    console.log(`✅ ${items.length} makale bulundu.`);
    return items;
}

async function transformToFizikHubStyle(arxivItem: ArxivItem): Promise<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
}> {
    console.log(`🧠 TAM METİN EĞİTİMLİ AI: "${arxivItem.title.substring(0, 50)}..."`);

    const prompt = `
${FIZIKHUB_COMPLETE_ARTICLES}

---
GÖREV: Aşağıdaki ArXiv makalesini yukarıdaki TAM METİN makalelerden öğrendiğin üslupla Türkçeye çevir.

ORİJİNAL BAŞLIK:
${arxivItem.title}

ORİJİNAL ÖZET (Abstract) - BU METNİN HER CÜMLESİNİ ÇEVİR:
${arxivItem.description}

KAYNAK: ${arxivItem.link}
`;

    const { object } = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
            title: z.string().describe('Eğlenceli ve dikkat çekici başlık'),
            slug: z.string().describe('url-uyumlu-slug'),
            excerpt: z.string().describe('Merak uyandırıcı 2 cümlelik özet'),
            content: z.string().describe('Makalenin TAMAMI - Baran Bozkurt üslubuyla - En az 500 kelime'),
            category: z.enum(['Uzay', 'Kuantum', 'Teori', 'Teknoloji', 'Parçacık Fiziği']),
        }),
        prompt: prompt,
    });

    return object;
}

async function checkIfAlreadyExists(slug: string): Promise<boolean> {
    const { data } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .single();

    return !!data;
}

async function publishToSupabase(article: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
}, sourceLink: string): Promise<void> {
    console.log(`📤 Supabase'e yayınlanıyor: "${article.title}"`);

    const { error } = await supabase.from('articles').insert({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content + `\n\n---\n\n*Bu makale [ArXiv](${sourceLink}) kaynağından otomatik olarak çevrilmiştir. Orijinal makaleyi okumak için [buraya tıklayın](${sourceLink}).*`,
        category: article.category,
        author_id: BOT_AUTHOR_ID,
        status: 'published',
        created_at: new Date().toISOString(),
    });

    if (error) {
        throw new Error(`Supabase hatası: ${error.message}`);
    }

    console.log(`✅ Yayınlandı: ${article.slug}`);
}

async function main() {
    console.log('\n🚀 FizikHub TAM METİN EĞİTİMLİ ArXiv Bot Başlatılıyor...\n');

    try {
        const arxivItems = await fetchArxivPapers();

        if (arxivItems.length === 0) {
            console.log('⚠️ Bugün yeni makale bulunamadı.');
            return;
        }

        let publishedCount = 0;

        for (const item of arxivItems) {
            try {
                const transformed = await transformToFizikHubStyle(item);

                const exists = await checkIfAlreadyExists(transformed.slug);
                if (exists) {
                    console.log(`⏭️ Atlandı (zaten mevcut): ${transformed.slug}`);
                    continue;
                }

                await publishToSupabase(transformed, item.link);
                publishedCount++;

                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (itemError) {
                console.error(`❌ Makale işlenirken hata:`, itemError);
            }
        }

        console.log('\n-----------------------------------');
        console.log(`🎉 İşlem tamamlandı! ${publishedCount} yeni makale yayınlandı.`);

    } catch (error) {
        console.error('❌ Kritik hata:', error);
        process.exit(1);
    }
}

main();
