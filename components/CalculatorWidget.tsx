"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";

export function CalculatorWidget() {
    const [velocityResult, setVelocityResult] = useState<number | null>(null);
    const [forceResult, setForceResult] = useState<number | null>(null);
    const [accelerationResult, setAccelerationResult] = useState<number | null>(null);

    const calculateVelocity = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const distance = Number(formData.get("distance"));
        const time = Number(formData.get("time"));
        if (time > 0) {
            setVelocityResult(distance / time);
        }
    };

    const calculateForce = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const mass = Number(formData.get("mass"));
        const acceleration = Number(formData.get("acceleration"));
        setForceResult(mass * acceleration);
    };

    const calculateAcceleration = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const velocityChange = Number(formData.get("velocityChange"));
        const time = Number(formData.get("time"));
        if (time > 0) {
            setAccelerationResult(velocityChange / time);
        }
    };

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="p-4 md:p-6">
                <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <CardTitle className="text-base md:text-lg">Fizik Hesaplayıcı</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                    Temel fizik hesaplamalarını hızlıca yapın.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <Tabs defaultValue="velocity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-9">
                        <TabsTrigger value="velocity" className="text-xs">Hız</TabsTrigger>
                        <TabsTrigger value="force" className="text-xs">Kuvvet</TabsTrigger>
                        <TabsTrigger value="acceleration" className="text-xs">İvme</TabsTrigger>
                    </TabsList>

                    <TabsContent value="velocity">
                        <form onSubmit={calculateVelocity} className="space-y-3 pt-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="distance" className="text-xs md:text-sm">Yol (m)</Label>
                                <Input id="distance" name="distance" type="number" step="any" required placeholder="Örn: 100" className="h-8 md:h-10 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="time" className="text-xs md:text-sm">Zaman (s)</Label>
                                <Input id="time" name="time" type="number" step="any" required placeholder="Örn: 10" className="h-8 md:h-10 text-sm" />
                            </div>
                            <Button type="submit" className="w-full h-8 md:h-10 text-sm">Hesapla</Button>
                            {velocityResult !== null && (
                                <div className="mt-3 rounded-lg bg-muted p-3 text-center">
                                    <span className="text-xs text-muted-foreground">Sonuç:</span>
                                    <div className="text-xl font-bold text-primary">{velocityResult.toFixed(2)} m/s</div>
                                </div>
                            )}
                        </form>
                    </TabsContent>

                    <TabsContent value="force">
                        <form onSubmit={calculateForce} className="space-y-3 pt-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="mass" className="text-xs md:text-sm">Kütle (kg)</Label>
                                <Input id="mass" name="mass" type="number" step="any" required placeholder="Örn: 50" className="h-8 md:h-10 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="acceleration" className="text-xs md:text-sm">İvme (m/s²)</Label>
                                <Input id="acceleration" name="acceleration" type="number" step="any" required placeholder="Örn: 9.8" className="h-8 md:h-10 text-sm" />
                            </div>
                            <Button type="submit" className="w-full h-8 md:h-10 text-sm">Hesapla</Button>
                            {forceResult !== null && (
                                <div className="mt-3 rounded-lg bg-muted p-3 text-center">
                                    <span className="text-xs text-muted-foreground">Sonuç:</span>
                                    <div className="text-xl font-bold text-primary">{forceResult.toFixed(2)} N</div>
                                </div>
                            )}
                        </form>
                    </TabsContent>

                    <TabsContent value="acceleration">
                        <form onSubmit={calculateAcceleration} className="space-y-3 pt-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="velocityChange" className="text-xs md:text-sm">Hız Değişimi (m/s)</Label>
                                <Input id="velocityChange" name="velocityChange" type="number" step="any" required placeholder="Örn: 20" className="h-8 md:h-10 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="acc-time" className="text-xs md:text-sm">Zaman (s)</Label>
                                <Input id="acc-time" name="time" type="number" step="any" required placeholder="Örn: 5" className="h-8 md:h-10 text-sm" />
                            </div>
                            <Button type="submit" className="w-full h-8 md:h-10 text-sm">Hesapla</Button>
                            {accelerationResult !== null && (
                                <div className="mt-3 rounded-lg bg-muted p-3 text-center">
                                    <span className="text-xs text-muted-foreground">Sonuç:</span>
                                    <div className="text-xl font-bold text-primary">{accelerationResult.toFixed(2)} m/s²</div>
                                </div>
                            )}
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
