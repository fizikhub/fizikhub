export type PhysicsEra =
  | "Antik Dönem"
  | "Bilimsel Devrim"
  | "Klasik Mekanik"
  | "Elektromanyetizma"
  | "Modern Fizik"
  | "Kuantum ve Ötesi";

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  scientist: string;
  description: string;
  era: PhysicsEra;
  colorClass: string;
}

export const physicsTimelineData: TimelineEvent[] = [
  {
    id: "demokritos-atom",
    year: "MÖ 400 civarı",
    title: "Maddenin Bölünemez Özü: Atom",
    scientist: "Demokritos",
    description: "Maddenin sonsuza kadar bölünemeyeceği fikri ilk kez ortaya atıldı. Demokritos, evrendeki her şeyin 'atomos' adını verdiği, bölünemeyen ve gözle görülemeyen küçük parçacıklardan oluştuğunu savundu. O dönemde tamamen felsefi bir düşünce olsa da, modern bilimin temellerinden birini attı.",
    era: "Antik Dönem",
    colorClass: "bg-neo-yellow",
  },
  {
    id: "arsimet-kaldirma",
    year: "MÖ 250 civarı",
    title: "Suyun Kaldırma Kuvveti",
    scientist: "Arşimet",
    description: "Hamamda yıkanırken suyun taşmasından yola çıkarak sıvıların kaldırma kuvvetini keşfetti. 'Evreka!' çığlıklarıyla sokaklara döküldüğü efsanesi bir yana dursun, Arşimet prensibi bugün gemilerin yüzmesinden denizaltıların dalışına kadar birçok alanda aktif olarak kullanılmaktadır.",
    era: "Antik Dönem",
    colorClass: "bg-neo-vibrant-lime",
  },
  {
    id: "kopernik-gunes",
    year: "1543",
    title: "Güneş Merkezli Evren Modeli",
    scientist: "Kopernik",
    description: "Dünya'nın evrenin merkezinde olduğu inancını yıkan devrimsel eser yayınlandı. Gökyüzü cisimlerinin Dünya'nın değil, Güneş'in etrafında döndüğünü savunarak bilim tarihinde yepyeni bir çağın kapılarını araladı.",
    era: "Bilimsel Devrim",
    colorClass: "bg-neo-vibrant-cyan",
  },
  {
    id: "galileo-teleskop",
    year: "1609",
    title: "Teleskobun Göklerle Buluşması",
    scientist: "Galileo Galilei",
    description: "Kendi yaptığı teleskopla Jüpiter'in uydularını, Ay'daki kraterleri ve Güneş lekelerini gözlemledi. Sadece gökyüzüne bakmakla kalmadı, serbest düşme deneyleriyle hareket kanunlarının temellerini atarak deneysel fiziğin babası oldu.",
    era: "Bilimsel Devrim",
    colorClass: "bg-neo-purple",
  },
  {
    id: "newton-principia",
    year: "1687",
    title: "Principia ve Kütleçekimi",
    scientist: "Isaac Newton",
    description: "Klasik mekaniğin kutsal kitabı sayılan 'Principia Mathematica' yayımlandı. Elmanın düşüşüyle Ay'ın yörüngede kalışının aynı fiziksel yasalara (Evrensel Kütleçekim) bağlı olduğunu kanıtladı. Üç hareket yasasıyla dünyayı yüzyıllar boyunca açıklayacak sistemi kurdu.",
    era: "Klasik Mekanik",
    colorClass: "bg-neo-yellow",
  },
  {
    id: "maxwell-denklemleri",
    year: "1865",
    title: "Elektrik ve Manyetizmanın Birleşimi",
    scientist: "James Clerk Maxwell",
    description: "Elektrik ve manyetizmanın aslında aynı madalyonun iki yüzü olduğunu dört zarif denklemle ispatladı. Işığın da bir elektromanyetik dalga olduğunu öngörerek modern radyo, televizyon ve kablosuz iletişimin önünü açtı.",
    era: "Elektromanyetizma",
    colorClass: "bg-neo-vibrant-pink",
  },
  {
    id: "planck-kuanta",
    year: "1900",
    title: "Enerjinin Kesikli Doğası",
    scientist: "Max Planck",
    description: "Siyah cisim ışıması problemini çözmek için enerjinin sürekli değil, 'kuanta' adını verdiği küçük paketler halinde yayıldığını öne sürdü. O gün sadece matematiksel bir zorunluluk olarak gördüğü bu fikir, Kuantum Mekaniği'nin doğum belgesi oldu.",
    era: "Modern Fizik",
    colorClass: "bg-neo-funky-lime",
  },
  {
    id: "einstein-relativite",
    year: "1905",
    title: "Mucizevi Yıl: Özel Görelilik",
    scientist: "Albert Einstein",
    description: "Zamanın ve mekanın mutlak olmadığını, ışık hızına yaklaştıkça zamanın yavaşladığını kanıtladı. Kütle ve enerjinin eşdeğerliğini gösteren o meşhur E=mc² denklemini de aynı yıl içinde makalelerinde yayınlayarak fiziği kökünden sarstı.",
    era: "Modern Fizik",
    colorClass: "bg-neo-vibrant-cyan",
  },
  {
    id: "bohr-atom",
    year: "1913",
    title: "Kuantum Atom Modeli",
    scientist: "Niels Bohr",
    description: "Elektronların çekirdek etrafında rastgele değil, sadece belirli yörüngelerde dolanabileceğini kanıtladı. Bir yörüngeden diğerine geçerken ışıma veya soğurma yapıldığı fikriyle, maddelerin yaydığı spesifik renkli ışıkların (spektrum) gizemini çözdü.",
    era: "Kuantum ve Ötesi",
    colorClass: "bg-neo-purple",
  },
  {
    id: "heisenberg-belirsizlik",
    year: "1927",
    title: "Belirsizlik İlkesi",
    scientist: "Werner Heisenberg",
    description: "Bir parçacığın hızını ve konumunu aynı anda kusursuz bir kesinlikle ölçemeyeceğimizi matematiksel olarak ispatladı. Evrenin temelinde determinizmin (kesinlik) değil, olasılıkların yattığını göstererek kuantum felsefesinin en büyük kırılmasını yaşattı.",
    era: "Kuantum ve Ötesi",
    colorClass: "bg-neo-vibrant-pink",
  },
  {
    id: "hubble-genisleme",
    year: "1929",
    title: "Genişleyen Evren",
    scientist: "Edwin Hubble",
    description: "Galaksilerin bizden uzaklaştığını ve daha da ilginci, bizden uzak olanların çok daha hızlı uzaklaştığını gözlemledi. Evrenin statik olmadığı, aksine tıpkı şişen bir balon gibi sürekli genişlediği gerçeği, ileride Big Bang (Büyük Patlama) teorisine kanıt olacaktı.",
    era: "Modern Fizik",
    colorClass: "bg-neo-yellow",
  },
  {
    id: "higgs-bozonu",
    year: "2012",
    title: "Kütlenin Kaynağı: Higgs Bozonu",
    scientist: "CERN Bilim İnsanları",
    description: "Parçacıklara kütle kazandırdığı teorik olarak 1960'larda öne sürülen Higgs Bozonu, CERN'deki Büyük Hadron Çarpıştırıcısı'nda yıllar süren devasa deneyler sonucunda nihayet gözlemlendi. Standart Model'in en büyük eksik parçalarından biri böylece tamamlanmış oldu.",
    era: "Kuantum ve Ötesi",
    colorClass: "bg-neo-vibrant-lime",
  }
];
