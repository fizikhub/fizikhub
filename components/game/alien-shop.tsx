"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface ShopItem {
    id: string;
    name: string;
    price: number;
    icon: string;
    type: "food" | "hygiene" | "cosmetic";
}

const ITEMS: ShopItem[] = [
    { id: "burger", name: "Uzay Burger", price: 50, icon: "🍔", type: "food" },
    { id: "pizza", name: "Kozmik Pizza", price: 75, icon: "🍕", type: "food" },
    { id: "soap", name: "Yıldız Sabunu", price: 20, icon: "🧼", type: "hygiene" },
    { id: "hat", name: "Kırmızı Bere", price: 500, icon: "🧢", type: "cosmetic" },
    { id: "glasses", name: "Havalı Gözlük", price: 800, icon: "🕶️", type: "cosmetic" },
];

export function AlienShop({ onClose, onBuy }: { onClose: () => void, onBuy: (item: ShopItem) => void }) {
    const [balance, setBalance] = useState(1250); // Mock Start Balance

    const handleBuy = (item: ShopItem) => {
        if (balance >= item.price) {
            setBalance(prev => prev - item.price);
            onBuy(item);
            toast.success(`${item.name} satın alındı!`);
        } else {
            toast.error("Yetersiz Hub Puanı!");
        }
    };

    return (
        <div className="absolute inset-0 bg-white/95 z-50 flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                <h4 className="font-bold flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Market
                </h4>
                <div className="font-mono text-sm bg-yellow-300 px-2 py-1 border border-black">
                    💰 {balance} HP
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-2 pb-4">
                    {ITEMS.map(item => (
                        <div key={item.id} className="flex items-center justify-between border-2 border-gray-200 p-2 hover:border-black transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className="text-xs text-gray-500">{item.price} Puan</div>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => handleBuy(item)}
                                className="h-8 rounded-none bg-black text-white hover:bg-gray-800"
                            >
                                Al
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
