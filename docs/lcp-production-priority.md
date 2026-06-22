# Production LCP Priority Report

Generated: 2026-06-22T21:54:45.703Z
Window: 2026-05-23T21:54:45.153Z to now
LCP samples: 148

Priority/fetchPriority is reserved for a confirmed above-the-fold image. Text LCP and unknown attribution must not receive speculative image priority.

| Route | Samples | P75 | Poor | Needs improvement | Dominant LCP element/resource | Decision |
|---|---:|---:|---:|---:|---|---|
| /makale/kara-delige-dusersek-ne-olur-1766107168421 | 1 | 4672 ms | 1 | 0 | (unknown — awaiting enhanced attribution) | Keep the above-fold cover priority/fetchPriority=high; investigate image bytes, TTFB, and element render delay. |
| /makale/karanlik-madde-nedir-nasil-gorunur | 4 | 3608 ms | 0 | 3 | (unknown — awaiting enhanced attribution) | Keep the above-fold cover priority/fetchPriority=high; investigate image bytes, TTFB, and element render delay. |
| /kullanici/baranbozkurt | 2 | 3304 ms | 0 | 2 | (unknown — awaiting enhanced attribution) | Do not add image priority blindly; LCP is not yet proven to be an image. |
| /login | 4 | 3292 ms | 0 | 2 | (unknown — awaiting enhanced attribution) | Do not add image priority blindly; LCP is not yet proven to be an image. |
| /makale/kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990 | 4 | 2680 ms | 0 | 2 | (unknown — awaiting enhanced attribution) | Keep the above-fold cover priority/fetchPriority=high; investigate image bytes, TTFB, and element render delay. |
| /kullanim-sartlari | 1 | 2656 ms | 0 | 1 | (unknown — awaiting enhanced attribution) | Do not add image priority blindly; LCP is not yet proven to be an image. |
| /makale/killi-bir-kopekten-kitalararasi-akustik-muhendisine-balinalarin-evrimi-ve-fizigi | 3 | 2640 ms | 0 | 1 | (unknown — awaiting enhanced attribution) | Keep the above-fold cover priority/fetchPriority=high; investigate image bytes, TTFB, and element render delay. |
| /makale/fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj | 2 | 2518 ms | 0 | 2 | (unknown — awaiting enhanced attribution) | Keep the above-fold cover priority/fetchPriority=high; investigate image bytes, TTFB, and element render delay. |
| /makale/parcacik-fizigine-giris-evrenin-perde-arkasi-1767186788291 | 2 | 2440 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /testler | 2 | 2404 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /makale/serway-1-kitap-i-ncelemesi-mkkynylwexp | 2 | 2296 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /simulasyonlar/optik-laboratuvari | 1 | 2296 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/fotoelektron | 1 | 1996 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /simulasyonlar | 3 | 1856 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| / | 73 | 1848 ms | 8 | 4 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /profil | 9 | 1728 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/kuantum-bilgisayar | 1 | 1712 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /forum/10 | 2 | 1548 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /makale/kategori/astronomi | 1 | 1196 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /forum/51 | 3 | 1112 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /simulasyonlar/dalga-girisimi | 1 | 908 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /forum/34 | 1 | 904 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/termal-iletkenlik | 3 | 888 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/dalgalarin-yayilma-hizi | 1 | 816 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /nevbara | 3 | 800 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /forum | 3 | 764 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /makale/azteklerden-gunumuze-tutun-tarihcesi-kimyasi-ve-etkileri-1769018062247 | 2 | 696 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /simulasyonlar/basit-sarkac | 2 | 664 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/amper-yasasi | 2 | 420 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/kuantum-alan-teorisi | 1 | 380 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /makale/kategori/bilim | 2 | 364 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/dalga-parcacik-ikililigi | 2 | 296 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /sozluk/mutlak-sicaklik | 2 | 288 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |
| /konular/momentum-carpisma | 2 | 260 ms | 0 | 0 | (unknown — awaiting enhanced attribution) | No priority change; continue sampling. |

## Current decision

- Article detail covers remain priority candidates because they are above the fold and the slowest sampled routes are article pages.
- No additional route receives image priority yet: historical attribution is empty.
- Enhanced attribution now uses both Next.js attribution and a native LargestContentfulPaint PerformanceObserver fallback to record selector, resource URL, timing, and size. Re-run this report after sufficient new traffic.
