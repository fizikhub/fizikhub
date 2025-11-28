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
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <CardTitle>Fizik Hesaplayıcı</CardTitle>
                </div>
                <CardDescription>
                    Temel fizik hesaplamalarını hızlıca yapın.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="velocity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="velocity">Hız</TabsTrigger>
                        <TabsTrigger value="force">Kuvvet</TabsTrigger>
                        <TabsTrigger value="acceleration">İvme</TabsTrigger>
                    </TabsList>

                    <TabsContent value="velocity">
                        <form onSubmit={calculateVelocity} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="distance">Yol (m)</Label>
                                <Input id="distance" name="distance" type="number" step="any" required placeholder="Örn: 100" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Zaman (s)</Label>
                                <Input id="time" name="time" type="number" step="any" required placeholder="Örn: 10" />
                            </div>
                            <Button type="submit" className="w-full">Hesapla</Button>
                            {velocityResult !== null && (
                                <div className="mt-4 rounded-lg bg-muted p-4 text-center">
                                    <span className="text-sm text-muted-foreground">Sonuç:</span>
                                    <div className="text-2xl font-bold text-primary">{velocityResult.toFixed(2)} m/s</div>
                                </div>
                            )}
                        </form>
                    </TabsContent>

                    <TabsContent value="force">
                        <form onSubmit={calculateForce} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="mass">Kütle (kg)</Label>
                                <Input id="mass" name="mass" type="number" step="any" required placeholder="Örn: 50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acceleration">İvme (m/s²)</Label>
                                <Input id="acceleration" name="acceleration" type="number" step="any" required placeholder="Örn: 9.8" />
                            </div>
                            <Button type="submit" className="w-full">Hesapla</Button>
                            {forceResult !== null && (
                                <div className="mt-4 rounded-lg bg-muted p-4 text-center">
                                    <span className="text-sm text-muted-foreground">Sonuç:</span>
                                    <div className="text-2xl font-bold text-primary">{forceResult.toFixed(2)} N</div>
                                </div>
                            )}
                        </form>
                    </TabsContent>

                    <TabsContent value="acceleration">
                        <form onSubmit={calculateAcceleration} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="velocityChange">Hız Değişimi (m/s)</Label>
                                <Input id="velocityChange" name="velocityChange" type="number" step="any" required placeholder="Örn: 20" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acc-time">Zaman (s)</Label>
                                <Input id="acc-time" name="time" type="number" step="any" required placeholder="Örn: 5" />
                            </div>
                            <Button type="submit" className="w-full">Hesapla</Button>
                            {accelerationResult !== null && (
                                <div className="mt-4 rounded-lg bg-muted p-4 text-center">
                                    <span className="text-sm text-muted-foreground">Sonuç:</span>
                                    <div className="text-2xl font-bold text-primary">{accelerationResult.toFixed(2)} m/s²</div>
                                </div>
                            )}
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
