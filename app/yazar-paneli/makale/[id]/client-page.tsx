"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import {
    ArrowLeft,
    Bot,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    MessageSquarePlus,
    ExternalLink,
    BookOpen,
    Sparkles,
    RefreshCw,
    Check,
    FileText,
    Shield,
    Lightbulb,
    PenTool,
    HelpCircle,
    Search,
} from "lucide-react";
import { addArticleNote, resolveNote, triggerManualAIReview, approveArticle, revokeApproval } from "@/app/yazar-paneli/actions";

interface ReviewDetailClientProps {
    data: {
        article: any;
        references: any[];
        aiReview: any;
        notes: any[];
        approvals: any[];
        hasApproved: boolean;
        currentUserId: string;
    };
    articleId: number;
}

const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
};

const scoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/30";
    return "bg-red-500/10 border-red-500/30";
};

const severityBadge = (severity: string) => {
    switch (severity) {
        case "high": return <Badge variant="destructive" className="text-[10px] px-1.5">Yüksek</Badge>;
        case "medium": return <Badge className="text-[10px] px-1.5 bg-amber-500/20 text-amber-600 border-amber-500/30">Orta</Badge>;
        case "low": return <Badge variant="secondary" className="text-[10px] px-1.5">Düşük</Badge>;
        default: return null;
    }
};

const reliabilityBadge = (level: string) => {
    switch (level) {
        case "high": return <Badge className="text-[10px] px-1.5 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Güvenilir</Badge>;
        case "medium": return <Badge className="text-[10px] px-1.5 bg-amber-500/20 text-amber-600 border-amber-500/30">Orta</Badge>;
        case "low": return <Badge variant="destructive" className="text-[10px] px-1.5">Düşük</Badge>;
        case "unknown": return <Badge variant="outline" className="text-[10px] px-1.5">Bilinmiyor</Badge>;
        default: return null;
    }
};

const noteTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    correction: { label: "Düzeltme", icon: <PenTool className="w-3 h-3" />, color: "text-red-500" },
    suggestion: { label: "Öneri", icon: <Lightbulb className="w-3 h-3" />, color: "text-amber-500" },
    question: { label: "Soru", icon: <HelpCircle className="w-3 h-3" />, color: "text-blue-500" },
};

export function ReviewDetailClient({ data, articleId }: ReviewDetailClientProps) {
    const { article, references, aiReview, notes: initialNotes, approvals, hasApproved: initialHasApproved, currentUserId } = data;
    const [notes, setNotes] = useState(initialNotes);
    const [hasApproved, setHasApproved] = useState(initialHasApproved);
    const [isLoading, setIsLoading] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [localAiReview, setLocalAiReview] = useState(aiReview);

    // Note form state
    const [noteContent, setNoteContent] = useState("");
    const [noteType, setNoteType] = useState<"correction" | "suggestion" | "question">("suggestion");
    const [isAddingNote, setIsAddingNote] = useState(false);

    const handleAddNote = async () => {
        if (!noteContent.trim()) return;
        setIsAddingNote(true);
        try {
            const result = await addArticleNote(articleId, noteContent.trim(), noteType);
            if (result.success) {
                toast.success("Not eklendi");
                setNoteContent("");
                // Optimistic update
                setNotes(prev => [{
                    id: Date.now().toString(),
                    content: noteContent.trim(),
                    type: noteType,
                    resolved: false,
                    created_at: new Date().toISOString(),
                    user: { full_name: "Siz", avatar_url: null, username: "" }
                }, ...prev]);
            } else {
                toast.error(result.error || "Not eklenemedi");
            }
        } catch { toast.error("Bir hata oluştu"); }
        finally { setIsAddingNote(false); }
    };

    const handleResolveNote = async (noteId: string) => {
        try {
            const result = await resolveNote(noteId);
            if (result.success) {
                setNotes(prev => prev.map(n => n.id === noteId ? { ...n, resolved: true } : n));
                toast.success("Not çözüldü olarak işaretlendi");
            }
        } catch { toast.error("Bir hata oluştu"); }
    };

    const handleTriggerAI = async () => {
        setIsReviewing(true);
        try {
            const result = await triggerManualAIReview(articleId);
            if (result.success) {
                toast.success("AI inceleme tamamlandı! Sayfa yenileniyor...");
                window.location.reload();
            } else {
                toast.error(result.error || "AI inceleme başarısız");
            }
        } catch { toast.error("Bir hata oluştu"); }
        finally { setIsReviewing(false); }
    };

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const result = await approveArticle(articleId);
            if (result.success) {
                setHasApproved(true);
                toast.success("Makale onaylandı!");
            } else { toast.error(result.error); }
        } catch { toast.error("Bir hata oluştu"); }
        finally { setIsLoading(false); }
    };

    const handleRevoke = async () => {
        setIsLoading(true);
        try {
            const result = await revokeApproval(articleId);
            if (result.success) {
                setHasApproved(false);
                toast.success("Onay geri alındı");
            } else { toast.error(result.error); }
        } catch { toast.error("Bir hata oluştu"); }
        finally { setIsLoading(false); }
    };

    const author = article.author;

    return (
        <div className="container max-w-6xl py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/yazar-paneli" prefetch={false}>
                    <Button variant="ghost" size="icon" className="border-2 border-black dark:border-zinc-800">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-black tracking-tight">{article.title}</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Avatar className="w-5 h-5">
                            <AvatarImage src={author?.avatar_url} />
                            <AvatarFallback className="text-[10px]">{author?.full_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span>{author?.full_name || author?.username}</span>
                        <span>·</span>
                        <span>{format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}</span>
                        <span>·</span>
                        <Badge variant="outline" className="text-[10px]">{article.category}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTriggerAI}
                        disabled={isReviewing}
                        className="border-2 border-black dark:border-zinc-800 font-bold"
                    >
                        {isReviewing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
                        {isReviewing ? "İnceleniyor..." : "AI İncele"}
                    </Button>
                    {hasApproved ? (
                        <Button variant="outline" size="sm" onClick={handleRevoke} disabled={isLoading}
                            className="border-2 border-emerald-500 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Onayını Geri Al
                        </Button>
                    ) : (
                        <Button size="sm" onClick={handleApprove} disabled={isLoading}
                            className="border-2 border-black dark:border-zinc-800 font-bold bg-emerald-500 hover:bg-emerald-600 text-white">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Onayla
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Article Content + References */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Article Content */}
                    <div className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700">
                            <FileText className="w-5 h-5" />
                            <h2 className="font-black text-lg">Makale İçeriği</h2>
                        </div>
                        {article.excerpt && (
                            <p className="text-muted-foreground italic mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                {article.excerpt}
                            </p>
                        )}
                        <div
                            className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-img:rounded-lg"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>

                    {/* References */}
                    <div className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700">
                            <BookOpen className="w-5 h-5" />
                            <h2 className="font-black text-lg">Kaynaklar</h2>
                            <Badge variant="outline" className="ml-auto">{references.length} kaynak</Badge>
                        </div>
                        {references.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-4">Kaynak belirtilmemiş.</p>
                        ) : (
                            <div className="space-y-3">
                                {references.map((ref, i) => (
                                    <div key={ref.id} className="flex gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded h-fit">[{i + 1}]</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm">{ref.title}</p>
                                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                                {ref.authors && <span>{ref.authors}</span>}
                                                {ref.publisher && <span>{ref.publisher}</span>}
                                                {ref.year && <span>({ref.year})</span>}
                                                {ref.doi && <span>DOI: {ref.doi}</span>}
                                            </div>
                                            {ref.url && (
                                                <a href={ref.url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline">
                                                    <ExternalLink className="w-3 h-3" /> {ref.url.substring(0, 60)}...
                                                </a>
                                            )}
                                        </div>
                                        {/* Show reliability from AI review if available */}
                                        {localAiReview?.source_reliability?.sources?.find((s: any) => s.url === ref.url) && (
                                            reliabilityBadge(
                                                localAiReview.source_reliability.sources.find((s: any) => s.url === ref.url)?.reliability
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column: AI Review + Notes */}
                <div className="space-y-6">
                    {/* AI Review */}
                    <div className="border-2 border-black dark:border-zinc-800 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700">
                            <Bot className="w-5 h-5 text-violet-500" />
                            <h2 className="font-black text-lg">AI Raporu</h2>
                            <Sparkles className="w-4 h-4 text-violet-400 ml-auto" />
                        </div>

                        {!localAiReview ? (
                            <div className="text-center py-8">
                                <Bot className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-sm text-muted-foreground mb-3">AI inceleme henüz yapılmadı.</p>
                                <Button size="sm" variant="outline" onClick={handleTriggerAI} disabled={isReviewing}
                                    className="font-bold border-2">
                                    {isReviewing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                    İncelemeyi Başlat
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Overall Score */}
                                <div className={`text-center p-4 rounded-lg border-2 ${scoreBg(localAiReview.overall_score)}`}>
                                    <div className={`text-4xl font-black ${scoreColor(localAiReview.overall_score)}`}>
                                        {localAiReview.overall_score}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 font-medium">Genel Puan / 100</div>
                                </div>

                                {/* Category Scores */}
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: "İçerik", score: localAiReview.content_accuracy?.score, icon: <Shield className="w-3.5 h-3.5" /> },
                                        { label: "Yazım", score: localAiReview.grammar_check?.score, icon: <PenTool className="w-3.5 h-3.5" /> },
                                        { label: "Kaynaklar", score: localAiReview.source_reliability?.score, icon: <BookOpen className="w-3.5 h-3.5" /> },
                                        { label: "Uyum", score: localAiReview.source_content_match?.score, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
                                        { label: "Okunabilirlik", score: localAiReview.readability_score, icon: <FileText className="w-3.5 h-3.5" /> },
                                    ].map(({ label, score, icon }) => (
                                        <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                            <span className="text-muted-foreground">{icon}</span>
                                            <span className="text-xs font-medium flex-1">{label}</span>
                                            <span className={`text-sm font-black ${scoreColor(score || 0)}`}>{score ?? "—"}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Content Issues */}
                                {localAiReview.content_accuracy?.issues?.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold flex items-center gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> İçerik Sorunları
                                        </h3>
                                        {localAiReview.content_accuracy.issues.map((issue: any, i: number) => (
                                            <div key={i} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className="font-medium">{issue.text}</span>
                                                    {severityBadge(issue.severity)}
                                                </div>
                                                <p className="text-muted-foreground">{issue.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Grammar Errors */}
                                {localAiReview.grammar_check?.errors?.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold flex items-center gap-1.5">
                                            <PenTool className="w-3.5 h-3.5 text-blue-500" /> Yazım Hataları
                                        </h3>
                                        {localAiReview.grammar_check.errors.slice(0, 5).map((err: any, i: number) => (
                                            <div key={i} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="line-through text-red-400">{err.original}</span>
                                                    <span>→</span>
                                                    <span className="text-emerald-500 font-medium">{err.suggestion}</span>
                                                </div>
                                                <span className="text-muted-foreground text-[10px]">{err.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Source Reliability */}
                                {localAiReview.source_reliability?.sources?.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 text-violet-500" /> Kaynak Güvenilirliği
                                        </h3>
                                        {localAiReview.source_reliability.sources.map((src: any, i: number) => (
                                            <div key={i} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-medium truncate flex-1">{src.url?.substring(0, 40)}...</span>
                                                    {reliabilityBadge(src.reliability)}
                                                </div>
                                                <p className="text-muted-foreground">{src.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Source-Content Mismatches */}
                                {localAiReview.source_content_match?.mismatches?.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold flex items-center gap-1.5">
                                            <XCircle className="w-3.5 h-3.5 text-red-500" /> Kaynak-İçerik Uyumsuzlukları
                                        </h3>
                                        {localAiReview.source_content_match.mismatches.map((m: any, i: number) => (
                                            <div key={i} className="p-2 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-xs space-y-1">
                                                <p className="font-medium">İddia: {m.claim}</p>
                                                <p className="text-muted-foreground">Kaynak: {m.source}</p>
                                                <p className="text-red-500">{m.issue}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Suggestions */}
                                {localAiReview.suggestions?.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold flex items-center gap-1.5">
                                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Öneriler
                                        </h3>
                                        <ul className="space-y-1">
                                            {localAiReview.suggestions.map((s: string, i: number) => (
                                                <li key={i} className="text-xs text-muted-foreground flex gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                                                    <span className="text-amber-500 font-bold">•</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Aşama 1: Derin Analiz (Gemini 2.5 Flash) */}
                                {localAiReview.deep_analysis && (
                                    <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-violet-500/20 p-1.5 rounded-md">
                                                <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                            </div>
                                            <h3 className="text-sm font-black text-violet-700 dark:text-violet-400">Aşama 1: İçerik Uyumu (Gemini)</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { title: "Kaynak-İddia Uyumu", text: localAiReview.deep_analysis.source_claim_agreement, icon: <BookOpen className="w-3.5 h-3.5 text-violet-500" /> },
                                                { title: "FizikHub Tonu", text: localAiReview.deep_analysis.fizikhub_tone_and_readability, icon: <MessageSquarePlus className="w-3.5 h-3.5 text-violet-500" /> },
                                                { title: "Yapı ve Derinlik", text: localAiReview.deep_analysis.structure_and_depth, icon: <FileText className="w-3.5 h-3.5 text-violet-500" /> },
                                                { title: "Google E-E-A-T", text: localAiReview.deep_analysis.google_eeat, icon: <Shield className="w-3.5 h-3.5 text-violet-500" /> }
                                            ].map((item, idx) => (
                                                <div key={idx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5 mb-1.5">
                                                        {item.icon} {item.title}
                                                    </h4>
                                                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Aşama 2: Gemma 3 27B AI Tespiti */}
                                {localAiReview.ai_originality_analysis && (
                                    <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-500/20 p-1.5 rounded-md">
                                                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <h3 className="text-sm font-black text-blue-700 dark:text-blue-400">Aşama 2: AI Tespiti (Gemma 27B)</h3>
                                            </div>
                                            <Badge variant={localAiReview.ai_originality_analysis.originality_score > 70 ? "default" : "destructive"}>
                                                Özgünlük: %{localAiReview.ai_originality_analysis.originality_score || 0}
                                            </Badge>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { title: "Yapay Zeka Etkisi", text: localAiReview.ai_originality_analysis.detailed_verdict, icon: <Search className="w-3.5 h-3.5 text-blue-500" /> },
                                                { title: "İnsani Dokunuşlar", text: localAiReview.ai_originality_analysis.human_touch_points, icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> },
                                                { title: "Robotik Dil Sorunları", text: localAiReview.ai_originality_analysis.robotic_language_issues, icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> }
                                            ].map((item, idx) => (
                                                <div key={idx} className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 shadow-sm">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1.5">
                                                        {item.icon} {item.title}
                                                    </h4>
                                                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Aşama 3: Gemma 3 12B Son Karar */}
                                {localAiReview.final_verdict && (
                                    <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-fuchsia-500/20 p-1.5 rounded-md">
                                                <Shield className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
                                            </div>
                                            <h3 className="text-sm font-black text-fuchsia-700 dark:text-fuchsia-400">Aşama 3: Son Karar (Gemma 12B)</h3>
                                        </div>
                                        <div className="p-4 rounded-xl border-2 border-fuchsia-200 dark:border-fuchsia-900/50 bg-fuchsia-50 dark:bg-fuchsia-900/10 shadow-sm">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h4 className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest">Yayın Kararı:</h4>
                                                <Badge
                                                    className={
                                                        localAiReview.final_verdict.publishability === "Uygun"
                                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                            : localAiReview.final_verdict.publishability === "Revizyon"
                                                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                                                            : "bg-red-500 hover:bg-red-600 text-white"
                                                    }
                                                >
                                                    {localAiReview.final_verdict.publishability}
                                                </Badge>
                                            </div>
                                            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                                {localAiReview.final_verdict.final_notes}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <p className="text-[10px] text-muted-foreground text-center mt-2">
                                    Modeller: <span className="font-bold text-violet-400">Gemini 2.5 Flash</span> + <span className="font-bold text-blue-400">Gemma 3 27B</span> + <span className="font-bold text-fuchsia-400">Gemma 3 12B</span> · {format(new Date(localAiReview.reviewed_at), "d MMM HH:mm", { locale: tr })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Notes Section */}
                    <div className="border-2 border-black dark:border-zinc-800 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700">
                            <MessageSquarePlus className="w-5 h-5 text-blue-500" />
                            <h2 className="font-black text-lg">İnceleme Notları</h2>
                            <Badge variant="outline" className="ml-auto">{notes.length}</Badge>
                        </div>

                        {/* Add Note Form */}
                        <div className="space-y-3 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex gap-1">
                                {(["correction", "suggestion", "question"] as const).map(type => (
                                    <Button
                                        key={type}
                                        variant={noteType === type ? "default" : "outline"}
                                        size="sm"
                                        className="text-xs font-bold flex-1"
                                        onClick={() => setNoteType(type)}
                                    >
                                        <span className={noteTypeConfig[type].color}>{noteTypeConfig[type].icon}</span>
                                        <span className="ml-1 hidden sm:inline">{noteTypeConfig[type].label}</span>
                                    </Button>
                                ))}
                            </div>
                            <Textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Notunuzu yazın..."
                                className="min-h-[80px] resize-none text-sm"
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={isAddingNote || !noteContent.trim()}
                                className="w-full font-bold border-2 border-black dark:border-zinc-800"
                                size="sm"
                            >
                                <MessageSquarePlus className="w-4 h-4 mr-2" />
                                {isAddingNote ? "Ekleniyor..." : "Not Ekle"}
                            </Button>
                        </div>

                        {/* Notes List */}
                        {notes.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Henüz not eklenmedi.</p>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {notes.map(note => {
                                    const config = noteTypeConfig[note.type] || noteTypeConfig.suggestion;
                                    return (
                                        <div key={note.id} className={`p-3 rounded-lg border ${note.resolved ? 'opacity-50 border-zinc-200 dark:border-zinc-800' : 'border-zinc-300 dark:border-zinc-700'}`}>
                                            <div className="flex items-start gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={note.user?.avatar_url} />
                                                    <AvatarFallback className="text-[9px]">{note.user?.full_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold">{note.user?.full_name || note.user?.username}</span>
                                                        <span className={`flex items-center gap-0.5 text-[10px] ${config.color}`}>
                                                            {config.icon} {config.label}
                                                        </span>
                                                        {note.resolved && (
                                                            <Badge variant="outline" className="text-[9px] px-1 text-emerald-500 border-emerald-500/30">
                                                                <Check className="w-2.5 h-2.5 mr-0.5" /> Çözüldü
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[10px] text-muted-foreground/60">
                                                            {format(new Date(note.created_at), "d MMM HH:mm", { locale: tr })}
                                                        </span>
                                                        {!note.resolved && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-5 text-[10px] px-1.5 text-emerald-500 hover:text-emerald-600"
                                                                onClick={() => handleResolveNote(note.id)}
                                                            >
                                                                <Check className="w-3 h-3 mr-0.5" /> Çözüldü
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
