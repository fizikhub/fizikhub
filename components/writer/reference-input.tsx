"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { checkLinkHealth } from "@/app/yazar-paneli/actions";
import { toast } from "sonner";


export interface Reference {
    url: string;
    title: string;
    authors: string;
    publisher: string;
    year: string;
    doi: string;
}

interface ReferenceInputProps {
    references: Reference[];
    onChange: (refs: Reference[]) => void;
}

const emptyRef: Reference = { url: "", title: "", authors: "", publisher: "", year: "", doi: "" };

export function ReferenceInput({ references, onChange }: ReferenceInputProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [healthChecks, setHealthChecks] = useState<Record<number, { loading: boolean, status: 'ok' | 'error' | 'warning' | null, message?: string }>>({});


    const addReference = () => {
        onChange([...references, { ...emptyRef }]);
        setExpandedIndex(references.length);
    };

    const removeReference = (index: number) => {
        const newRefs = references.filter((_, i) => i !== index);
        onChange(newRefs);
        if (expandedIndex === index) setExpandedIndex(null);
    };

    const updateReference = (index: number, field: keyof Reference, value: string) => {
        const newRefs = [...references];
        newRefs[index] = { ...newRefs[index], [field]: value };
        onChange(newRefs);

        // If URL changes, reset its health status
        if (field === "url") {
            setHealthChecks(prev => ({
                ...prev,
                [index]: { loading: false, status: null }
            }));
        }
    };

    const runHealthCheck = async (index: number, url: string) => {
        if (!url || !url.startsWith("http")) return;

        setHealthChecks(prev => ({
            ...prev,
            [index]: { loading: true, status: null }
        }));

        try {
            const result = await checkLinkHealth(url);
            if (result.ok) {
                setHealthChecks(prev => ({
                    ...prev,
                    [index]: { loading: false, status: 'ok' }
                }));
            } else {
                setHealthChecks(prev => ({
                    ...prev,
                    [index]: { 
                        loading: false, 
                        status: result.status === 404 ? 'error' : 'warning',
                        message: result.error || (result.status === 404 ? "Bu kaynak artık erişilebilir değil (404)" : "Bağlantı sorunu")
                    }
                }));
                if (result.status === 404) {
                    toast.error(`Kaynak [${index + 1}] erişilemiyor: 404 Not Found`);
                }
            }
        } catch (error) {
            setHealthChecks(prev => ({
                ...prev,
                [index]: { loading: false, status: 'warning', message: "Kontrol edilemedi" }
            }));
        }
    };


    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-base font-bold">Kaynaklar</Label>
                <span className="text-xs text-muted-foreground">{references.length} kaynak</span>
            </div>

            {references.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Henüz kaynak eklenmedi.</p>
                    <p className="text-xs text-muted-foreground">Makalenizin güvenilirliğini artırmak için kaynak ekleyin.</p>
                </div>
            )}

            {references.map((ref, index) => (
                <div key={index} className="border-2 border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                    {/* Header - always visible */}
                    <div 
                        className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            [{index + 1}]
                        </span>
                        <span className="flex-1 text-sm font-medium truncate">
                            {ref.title || "Başlıksız kaynak"}
                        </span>
                        {ref.url && (
                            <a 
                                href={ref.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive/80"
                            onClick={(e) => { e.stopPropagation(); removeReference(index); }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        {expandedIndex === index ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>

                    {/* Expanded fields */}
                    {expandedIndex === index && (
                        <div className="p-3 space-y-3 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1 sm:col-span-2">
                                    <Label className="text-xs">Başlık *</Label>
                                    <Input
                                        value={ref.title}
                                        onChange={(e) => updateReference(index, "title", e.target.value)}
                                        placeholder="Kaynak başlığı"
                                        className="h-9 text-sm"
                                    />
                                </div>
                                
                                <div className="space-y-1 sm:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs">URL</Label>
                                        <div className="flex items-center gap-2">
                                            {healthChecks[index]?.loading && (
                                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground animate-pulse">
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                </span>
                                            )}
                                            {healthChecks[index]?.status === 'ok' && (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                                                    <CheckCircle2 className="w-3 h-3" /> Erişilebilir
                                                </span>
                                            )}
                                            {healthChecks[index]?.status === 'error' && (
                                                <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
                                                    <XCircle className="w-3 h-3" /> Kırık Link (404)
                                                </span>
                                            )}
                                            {healthChecks[index]?.status === 'warning' && (
                                                <span className="flex items-center gap-1 text-[10px] text-amber-500 font-medium">
                                                    <AlertCircle className="w-3 h-3" /> {healthChecks[index]?.message || "Sorunlu"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            value={ref.url}
                                            onChange={(e) => updateReference(index, "url", e.target.value)}
                                            onBlur={() => runHealthCheck(index, ref.url)}
                                            placeholder="https://..."
                                            className={`h-9 text-sm pr-9 ${
                                                healthChecks[index]?.status === 'error' ? 'border-red-500 ring-red-500/20' : 
                                                healthChecks[index]?.status === 'ok' ? 'border-emerald-500/50' : ''
                                            }`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-primary"
                                            onClick={() => runHealthCheck(index, ref.url)}
                                            disabled={healthChecks[index]?.loading || !ref.url}
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Yazar(lar)</Label>
                                    <Input
                                        value={ref.authors}
                                        onChange={(e) => updateReference(index, "authors", e.target.value)}
                                        placeholder="Einstein, A."
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Yayıncı / Dergi</Label>
                                    <Input
                                        value={ref.publisher}
                                        onChange={(e) => updateReference(index, "publisher", e.target.value)}
                                        placeholder="Nature, Science..."
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Yıl</Label>
                                    <Input
                                        value={ref.year}
                                        onChange={(e) => updateReference(index, "year", e.target.value)}
                                        placeholder="2024"
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">DOI</Label>
                                    <Input
                                        value={ref.doi}
                                        onChange={(e) => updateReference(index, "doi", e.target.value)}
                                        placeholder="10.1000/xyz123"
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-dashed font-bold hover:border-primary hover:text-primary transition-colors"
                onClick={addReference}
            >
                <Plus className="w-4 h-4 mr-2" />
                Kaynak Ekle
            </Button>
        </div>
    );
}
