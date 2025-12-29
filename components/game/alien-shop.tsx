"use client";

import React from "react";
import {
    Pizza, Shirt, Sparkles, X, Croissant, Coffee,
    PartyPopper, Utensils, Monitor, Palette
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ShopItem {
    id: string;
    name: string;
    price: number;
    icon: React.ReactNode;
    category: "food" | "clothes" | "decor";
    description: string;
}

const SHOP_ITEMS: ShopItem[] = [
    // Yiyecekler
    { id: "cosmic_pizza", name: "Kozmik Pizza", price: 50, icon: <Pizza className="w-6 h-6 text-orange-500" />, category: "food", description: "+30 Açlık" },
    { id: "star_berry", name: "Yıldız Meyvesi", price: 30, icon: <div className="text-xl">🫐</div>, category: "food", description: "+15 Açlık, +5 Mutluluk" },
    { id: "moon_cheese", name: "Ay Peyniri", price: 40, icon: <Croissant className="w-6 h-6 text-yellow-300" />, category: "food", description: "+25 Açlık" },
    { id: "nebula_coffee", name: "Nebula Kahvesi", price: 25, icon: <Coffee className="w-6 h-6 text-brown-500" />, category: "food", description: "+10 Enerji" },

    // Giyim (Basit overlay sistemi için)
    { id: "space_helmet", name: "Uzay Kaskı", price: 500, icon: <div className="text-xl">🧑‍🚀</div>, category: "clothes", description: "Güvenlik her şeydir." },
    { id: "bow_tie", name: "Papyon", price: 200, icon: <div className="text-xl">🎀</div>, category: "clothes", description: "Şık bir uzaylı için." },
    { id: "sunglasses", name: "Güneş Gözlüğü", price: 350, icon: <div className="text-xl">🕶️</div>, category: "clothes", description: "Güneş patlamalarına karşı." },
    { id: "crown", name: "Kral Tacı", price: 1000, icon: <div className="text-xl">👑</div>, category: "clothes", description: "Gezegenin kralı sensin." },

    // Dekor (Arka planlar)
    { id: "bg_mars", name: "Kızıl Gezegen", price: 800, icon: <div className="w-6 h-6 rounded-full bg-red-600 border border-white/20" />, category: "decor", description: "Tozlu ve kırmızı." },
    { id: "bg_ice", name: "Buzul Ayı", price: 800, icon: <div className="w-6 h-6 rounded-full bg-cyan-300 border border-white/20" />, category: "decor", description: "Soğuk ama güzel." },
];

interface AlienShopProps {
    onClose: () => void;
    onBuy: (item: ShopItem) => void;
    balance: number;
}

export function AlienShop({ onClose, onBuy, balance }: AlienShopProps) {
    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Monitor className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white leading-none">Uzaylı Mağazası</h3>
                        <p className="text-xs text-gray-400 mt-1">En iyi galaktik ürünler</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Balance Display */}
            <div className="px-4 py-2 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-purple-300">BAKİYE</span>
                <div className="flex items-center gap-1 font-mono font-bold text-yellow-400">
                    <Sparkles className="w-3 h-3" />
                    <span>{balance} FP</span>
                </div>
            </div>

            {/* Tabs & Content */}
            <Tabs defaultValue="food" className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-3 bg-transparent p-0 border-b border-white/10 rounded-none h-12">
                    <TabsTrigger value="food" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400 h-full">
                        <Utensils className="w-4 h-4 mr-2" />
                        Yiyecek
                    </TabsTrigger>
                    <TabsTrigger value="clothes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 h-full">
                        <Shirt className="w-4 h-4 mr-2" />
                        Giyim
                    </TabsTrigger>
                    <TabsTrigger value="decor" className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-500/10 data-[state=active]:text-pink-400 h-full">
                        <Palette className="w-4 h-4 mr-2" />
                        Dekor
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden relative">
                    <ScrollArea className="h-full">
                        <div className="p-4 grid grid-cols-2 gap-3 pb-20">
                            <TabsContent value="food" className="contents m-0">
                                {SHOP_ITEMS.filter(i => i.category === "food").map(item => (
                                    <ShopItemCard key={item.id} item={item} onBuy={onBuy} balance={balance} />
                                ))}
                            </TabsContent>
                            <TabsContent value="clothes" className="contents m-0">
                                {SHOP_ITEMS.filter(i => i.category === "clothes").map(item => (
                                    <ShopItemCard key={item.id} item={item} onBuy={onBuy} balance={balance} />
                                ))}
                            </TabsContent>
                            <TabsContent value="decor" className="contents m-0">
                                {SHOP_ITEMS.filter(i => i.category === "decor").map(item => (
                                    <ShopItemCard key={item.id} item={item} onBuy={onBuy} balance={balance} />
                                ))}
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
}

function ShopItemCard({ item, onBuy, balance }: { item: ShopItem, onBuy: (item: ShopItem) => void, balance: number }) {
    const canAfford = balance >= item.price;

    return (
        <div className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl p-3 transition-all duration-200 flex flex-col gap-2">
            <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-300">
                {item.icon}
            </div>

            <div className="flex-1">
                <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed h-8">{item.description}</p>
            </div>

            <div className="flex items-center justify-between mt-1">
                <span className={cn("font-mono text-xs font-bold", canAfford ? "text-yellow-400" : "text-red-400")}>
                    {item.price} FP
                </span>
                <button
                    onClick={() => canAfford && onBuy(item)}
                    disabled={!canAfford}
                    className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all",
                        canAfford
                            ? "bg-white text-black hover:bg-purple-400 hover:text-white hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                            : "bg-white/5 text-gray-500 cursor-not-allowed"
                    )}
                >
                    {canAfford ? "Al" : "Yetersiz"}
                </button>
            </div>
        </div>
    );
}
