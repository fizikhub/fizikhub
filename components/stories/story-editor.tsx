"use client";

import React, { useState, useRef, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload, Type, Move, Image as ImageIcon, CheckCircle, XCircle, ZoomIn, ZoomOut, Plus, Sticker, HelpCircle, X, Settings, Trash2, Edit3, Save, LayoutGrid, PlusCircle, FolderOpen, ArrowLeft } from "lucide-react";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createStoryGroup, deleteStoryGroup, getStoryGroups, updateStoryGroup, getStoriesByGroup, deleteStory, updateStory } from "@/app/stories/actions";
import { cn } from "@/lib/utils";

// --- TYPES ---
interface TextLayer {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    rotation: number;
    nodeRef?: React.RefObject<HTMLDivElement>;
}

interface StickerLayer {
    id: string;
    src: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    nodeRef?: React.RefObject<HTMLDivElement>;
}

interface StoryGroup {
    id: string;
    title: string;
    cover_url: string | null;
    created_at: string;
}

interface Story {
    id: string;
    title: string;
    content: string;
    media_url: string;
    created_at: string;
    group_id: string;
}

// --- MAIN COMPONENT ---
export function StoryEditor() {
    const [activeTab, setActiveTab] = useState<"create" | "manage">("manage");
    const [groups, setGroups] = useState<StoryGroup[]>([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);

    // Fetch groups on mount and when tab changes to create/manage
    const fetchGroups = async () => {
        try {
            // We pass null for userId to get all, but action might need update to filter by current user
            // Actually getStoryGroups in action needs to handle auth. 
            // For management, we need OUR groups.
            // Let's assume getStoryGroups handles current user filter if we don't pass ID, or we need to pass user ID.
            // Since we are client side, we can expect the action to handle "my groups".
            // Checking action implementation: it takes userId. 
            // We need to get user ID first.
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await getStoryGroups(user.id);
                setGroups(data as any || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingGroups(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [activeTab]);

    return (
        <div className="h-[100dvh] bg-[#121212] text-white flex flex-col font-outfit overflow-hidden">
            {/* TOP BAR */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1a1a]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FFC800] rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_white]">
                        <LayoutGrid className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-black text-xl tracking-tight hidden sm:inline">HİKAYE STÜDYOSU</span>
                </div>

                <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setActiveTab("create")}
                        className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                            activeTab === "create" ? "bg-[#23A9FA] text-black shadow-lg" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        Oluştur
                    </button>
                    <button
                        onClick={() => setActiveTab("manage")}
                        className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                            activeTab === "manage" ? "bg-[#FF3366] text-white shadow-lg" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        Yönet
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "create" ? (
                    <StoryCreator groups={groups} onPublish={fetchGroups} />
                ) : (
                    <StoryManager groups={groups} onUpdate={fetchGroups} />
                )}
            </div>
        </div>
    );
}

// --- STORY CREATOR (CANVAS) ---
function StoryCreator({ groups, onPublish }: { groups: StoryGroup[], onPublish: () => void }) {
    const [image, setImage] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
    const [stickerLayers, setStickerLayers] = useState<StickerLayer[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Metadata State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");

    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const stickerInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Set default group if available
    useEffect(() => {
        if (groups.length > 0 && !selectedGroupId) {
            setSelectedGroupId(groups[0].id);
        }
    }, [groups]);

    // ... (Keep existing Canvas Logic helpers: handleImageUpload, etc.)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
                setScale(1);
                setPosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSticker: StickerLayer = {
                    id: `sticker-${Date.now()}`,
                    src: e.target?.result as string,
                    x: 100,
                    y: 300,
                    scale: 1,
                    rotation: 0,
                    nodeRef: React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
                };
                setStickerLayers([...stickerLayers, newSticker]);
                setSelectedId(newSticker.id);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTextLayer = () => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const newLayer: TextLayer = {
            id: `text-${Date.now()}`,
            text: "METİN EKLE",
            x: rect.width / 2 - 60,
            y: rect.height / 2 - 20,
            fontSize: 32,
            color: "#ffffff",
            rotation: 0,
            nodeRef: React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
        };
        setTextLayers([...textLayers, newLayer]);
        setSelectedId(newLayer.id);
    };

    const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
        setTextLayers(layers => layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const updateStickerLayer = (id: string, updates: Partial<StickerLayer>) => {
        setStickerLayers(layers => layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const deleteLayer = (id: string) => {
        if (id.startsWith('text-')) {
            setTextLayers(layers => layers.filter(l => l.id !== id));
        } else {
            setStickerLayers(layers => layers.filter(l => l.id !== id));
        }
        if (selectedId === id) setSelectedId(null);
    };

    const handlePublish = async () => {
        if (!canvasRef.current || !image) return;
        if (!title.trim()) {
            toast.error("Lütfen hikayenize bir başlık ekleyin.");
            return;
        }
        if (!selectedGroupId && groups.length > 0) {
            toast.error("Lütfen bir hikaye grubu seçin.");
            return;
        }

        try {
            setIsUploading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Giriş yapmalısınız.");
                return;
            }

            setSelectedId(null);
            await new Promise(resolve => setTimeout(resolve, 300));

            const canvas = await html2canvas(canvasRef.current, {
                useCORS: true,
                scale: 3,
                backgroundColor: "#000000",
                logging: false,
            });

            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
            if (!blob) throw new Error("Görsel hatası.");

            const fileName = `story-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage.from('stories').upload(fileName, blob);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('stories').getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .from('stories')
                .insert({
                    media_url: publicUrl,
                    author_id: user.id,
                    type: 'image',
                    title: title.trim(),
                    content: content.trim() || undefined,
                    group_id: selectedGroupId || null, // Use group_id
                    category: groups.find(g => g.id === selectedGroupId)?.title || "Genel" // Fallback mainly
                });

            if (dbError) throw dbError;

            toast.success("Hikaye paylaşıldı!");
            onPublish();
            // Reset fields potentially?
            setTitle("");
            setContent("");

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const activeTextLayer = textLayers.find(l => l.id === selectedId);

    return (
        <div className="flex flex-col lg:flex-row h-full">
            {/* CANVAS */}
            <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center p-4 relative overflow-hidden">
                <div
                    ref={canvasRef}
                    className="relative w-full max-w-[400px] aspect-[9/16] bg-black shadow-2xl overflow-hidden ring-1 ring-white/10"
                    onClick={() => setSelectedId(null)}
                >
                    {image ? (
                        <div className="w-full h-full" style={{ transform: `scale(${scale})` }}>
                            <img src={image} className="w-full h-full object-cover pointer-events-none" />
                        </div>
                    ) : (
                        <div
                            className="w-full h-full flex flex-col items-center justify-center text-zinc-600 cursor-pointer hover:bg-zinc-900/50 transition-colors group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-10 h-10 mb-4 opacity-50 group-hover:opacity-100 transition-all text-[#23A9FA]" />
                            <span className="font-bold text-sm">Görsel Seç</span>
                        </div>
                    )}

                    {/* LAYERS RENDER */}
                    {textLayers.map(layer => (
                        <Draggable
                            key={layer.id}
                            nodeRef={layer.nodeRef}
                            position={{ x: layer.x, y: layer.y }}
                            onStop={(e, data) => updateTextLayer(layer.id, { x: data.x, y: data.y })}
                            onStart={() => setSelectedId(layer.id)}
                            bounds="parent"
                        >
                            <div
                                ref={layer.nodeRef}
                                className={`absolute cursor-move px-4 py-2 rounded-lg border-2 transition-all ${selectedId === layer.id ? 'border-[#FFC800] bg-black/30 backdrop-blur-sm' : 'border-transparent'}`}
                                style={{
                                    color: layer.color,
                                    fontSize: `${layer.fontSize}px`,
                                    fontFamily: 'var(--font-outfit)',
                                    fontWeight: 900,
                                    transform: `rotate(${layer.rotation}deg)`
                                }}
                            >
                                {layer.text}
                            </div>
                        </Draggable>
                    ))}
                </div>

                {/* ZOOM SLIDER OVERLAY */}
                {image && (
                    <div className="absolute bottom-8 right-8 bg-black/80 rounded-full px-4 py-2 flex items-center gap-3">
                        <ZoomOut className="w-4 h-4" />
                        <Slider value={[scale]} min={1} max={3} step={0.1} onValueChange={(v) => setScale(v[0])} className="w-24" />
                        <ZoomIn className="w-4 h-4" />
                    </div>
                )}
            </div>

            {/* SIDEBAR CONTROLS */}
            <div className="w-full lg:w-[350px] bg-[#121212] border-l border-white/10 p-6 overflow-y-auto space-y-6">
                {selectedId ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <h3 className="font-bold text-[#23A9FA] text-sm">KATMAN DÜZENLE</h3>
                            <Button size="sm" variant="ghost" onClick={() => deleteLayer(selectedId)} className="text-red-500 h-8">Sil</Button>
                        </div>
                        {activeTextLayer && (
                            <div className="space-y-4">
                                <Input
                                    value={activeTextLayer.text}
                                    onChange={(e) => updateTextLayer(activeTextLayer.id, { text: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800"
                                />
                                <div className="space-y-2">
                                    <Label className="text-xs">Renk</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['#ffffff', '#000000', '#FFC800', '#23A9FA', '#FF3366', '#10B981'].map(c => (
                                            <div
                                                key={c}
                                                className={`w-6 h-6 rounded-full cursor-pointer border-2 ${activeTextLayer.color === c ? 'border-white' : 'border-transparent'}`}
                                                style={{ backgroundColor: c }}
                                                onClick={() => updateTextLayer(activeTextLayer.id, { color: c })}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Boyut</Label>
                                    <Slider value={[activeTextLayer.fontSize]} min={12} max={80} step={1} onValueChange={(v) => updateTextLayer(activeTextLayer.id, { fontSize: v[0] })} />
                                </div>
                            </div>
                        )}
                        <Button className="w-full" variant="secondary" onClick={() => setSelectedId(null)}>Tamamla</Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* MAIN TOOLS */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-20 flex-col gap-2 border-zinc-800 hover:border-[#FFC800]" onClick={() => fileInputRef.current?.click()}>
                                <ImageIcon className="w-6 h-6 text-[#FFC800]" />
                                Görsel
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2 border-zinc-800 hover:border-[#23A9FA]" onClick={addTextLayer}>
                                <Type className="w-6 h-6 text-[#23A9FA]" />
                                Metin
                            </Button>
                        </div>

                        {/* METADATA */}
                        <div className="space-y-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-400">HİKAYE GRUBU / KART</Label>
                                <select
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-md p-2 text-sm focus:border-[#FFC800] outline-none"
                                >
                                    <option value="" disabled>Kart Seçin</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.title}</option>
                                    ))}
                                </select>
                                {groups.length === 0 && (
                                    <p className="text-[10px] text-red-400">Önce "Yönet" sekmesinden bir kart oluşturmalısınız.</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-400">BAŞLIK</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Örn: Günün Bilgisi"
                                    className="bg-black border-zinc-800 placeholder:text-zinc-600"
                                    maxLength={20}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-400">AÇIKLAMA</Label>
                                <Input
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="İsteğe bağlı açıklama..."
                                    className="bg-black border-zinc-800 placeholder:text-zinc-600"
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handlePublish}
                            disabled={isUploading || !image || !title}
                            className="w-full h-12 bg-white text-black font-black hover:bg-zinc-200"
                        >
                            {isUploading ? "YAYINLANIYOR..." : "PAYLAŞ"}
                        </Button>
                    </div>
                )}
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
    );
}

// --- STORY MANAGER ---
function StoryManager({ groups, onUpdate }: { groups: StoryGroup[], onUpdate: () => void }) {
    const [view, setView] = useState<"groups" | "stories">("groups");
    const [selectedGroup, setSelectedGroup] = useState<StoryGroup | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoadingStories, setIsLoadingStories] = useState(false);

    // Create/Edit Group State
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groupTitle, setGroupTitle] = useState("");
    const [groupCover, setGroupCover] = useState<File | null>(null);
    const [previewCover, setPreviewCover] = useState<string>("");

    // Edit Story State
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [editStoryTitle, setEditStoryTitle] = useState("");
    const [editStoryContent, setEditStoryContent] = useState("");
    const [editStoryGroupId, setEditStoryGroupId] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleOpenGroup = async (group: StoryGroup) => {
        setSelectedGroup(group);
        setView("stories");
        setIsLoadingStories(true);
        try {
            const data = await getStoriesByGroup(group.id);
            setStories(data as any || []);
        } finally {
            setIsLoadingStories(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setGroupCover(file);
            setPreviewCover(URL.createObjectURL(file));
        }
    };

    const handleCreateGroup = async () => {
        if (!groupTitle) return toast.error("Başlık gereklidir.");
        try {
            const formData = new FormData();
            formData.append("title", groupTitle);

            // If there is a cover file, upload it first
            if (groupCover) {
                const fileName = `group-cover-${Date.now()}.jpg`;
                const { error: uploadError } = await supabase.storage.from('stories').upload(fileName, groupCover);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('stories').getPublicUrl(fileName);
                formData.append("cover_url", publicUrl);
            } else {
                // Use a default placeholder if no cover
                formData.append("cover_url", "/stories/feyman.png");
            }

            const res = await createStoryGroup(formData);
            if (!res.success) throw new Error(res.error);

            toast.success("Grup oluşturuldu!");
            setIsGroupModalOpen(false);
            setGroupTitle("");
            setGroupCover(null);
            setPreviewCover("");
            onUpdate();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteGroup = async (id: string) => {
        if (!confirm("Bu grubu silmek istediğinize emin misiniz? İçindeki hikayeler silinmeyecek ama grupsuz kalacak.")) return;
        try {
            const res = await deleteStoryGroup(id);
            if (!res.success) throw new Error(res.error);
            toast.success("Grup silindi.");
            onUpdate();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteStory = async (id: string) => {
        if (!confirm("Bu hikayeyi silmek istediğinize emin misiniz?")) return;
        try {
            const res = await deleteStory(id);
            if (!res.success) throw new Error(res.error);
            toast.success("Hikaye silindi.");
            // Refresh list
            if (selectedGroup) handleOpenGroup(selectedGroup);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const openEditStory = (story: Story) => {
        setEditingStory(story);
        setEditStoryTitle(story.title || "");
        setEditStoryContent(story.content || "");
        setEditStoryGroupId(story.group_id || "");
    };

    const handleUpdateStory = async () => {
        if (!editingStory) return;
        try {
            const formData = new FormData();
            formData.append("title", editStoryTitle);
            formData.append("content", editStoryContent);
            if (editStoryGroupId) formData.append("group_id", editStoryGroupId);

            const res = await updateStory(editingStory.id, formData);
            if (!res.success) throw new Error(res.error);

            toast.success("Hikaye güncellendi.");
            setEditingStory(null);
            if (selectedGroup) handleOpenGroup(selectedGroup);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="h-full p-6 lg:p-10 overflow-y-auto">
            {view === "groups" ? (
                // GROUPS VIEW
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black mb-2">HİKAYE KARTLARIM</h2>
                            <p className="text-zinc-400">Hikayelerini gruplandır ve düzenle.</p>
                        </div>
                        <Button
                            onClick={() => setIsGroupModalOpen(true)}
                            className="bg-white text-black font-bold hover:bg-zinc-200 gap-2"
                        >
                            <PlusCircle className="w-5 h-5" /> Kart Oluştur
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {groups.map(group => (
                            <div key={group.id} className="group relative bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden hover:border-[#FFC800] transition-colors cursor-pointer" onClick={() => handleOpenGroup(group)}>
                                <div className="aspect-square relative">
                                    <img
                                        src={group.cover_url || "/placeholder.png"}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                    <h3 className="absolute bottom-4 left-4 font-black text-lg text-white">{group.title}</h3>
                                </div>
                                <div className="p-3 flex justify-end gap-2 bg-[#1a1a1a]">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                                        className="p-2 hover:bg-white/10 rounded-md text-zinc-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {groups.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-white/10 rounded-xl">
                                <FolderOpen className="w-12 h-12 mb-4 opacity-50" />
                                <p>Henüz hiç hikaye kartı oluşturmadınız.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // STORIES VIEW
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => setView("groups")}>
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">KART</span>
                            <h2 className="text-3xl font-black">{selectedGroup?.title}</h2>
                        </div>
                    </div>

                    {isLoadingStories ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#23A9FA]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {stories.map(story => (
                                <div key={story.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 hover:border-[#23A9FA] transition-all">
                                    <div className="aspect-[9/16] relative bg-black">
                                        <img src={story.media_url} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button
                                                onClick={() => openEditStory(story)}
                                                className="bg-black/50 p-2 rounded-full text-white hover:bg-[#23A9FA] hover:text-white transition-colors backdrop-blur-md"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStory(story.id)}
                                                className="bg-black/50 p-2 rounded-full text-white hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-sm truncate">{story.title}</h4>
                                        <p className="text-xs text-zinc-500 truncate">{story.content || "Açıklama yok"}</p>
                                    </div>
                                </div>
                            ))}
                            {stories.length === 0 && (
                                <div className="col-span-full py-12 text-center text-zinc-500">
                                    Bu kartta henüz hikaye yok.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* CREATE GROUP MODAL */}
            <AnimatePresence>
                {isGroupModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#1e1e1e] w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-6 shadow-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-xl">Yeni Kart Oluştur</h3>
                                <button onClick={() => setIsGroupModalOpen(false)}><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 rounded-full bg-black border border-white/10 overflow-hidden relative cursor-pointer group" onClick={() => document.getElementById('group-cover-input')?.click()}>
                                        {previewCover ? (
                                            <img src={previewCover} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-zinc-900">
                                                <Upload className="w-6 h-6 text-zinc-500" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-[10px] uppercase font-bold">Kapak Seç</span>
                                        </div>
                                    </div>
                                    <input id="group-cover-input" type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>KART İSMİ</Label>
                                    <Input
                                        value={groupTitle}
                                        onChange={(e) => setGroupTitle(e.target.value)}
                                        placeholder="Örn: Uzay Haberleri"
                                        className="bg-black border-zinc-800"
                                    />
                                </div>
                            </div>

                            <Button onClick={handleCreateGroup} className="w-full bg-[#FFC800] text-black font-bold hover:bg-[#FFD700]">
                                OLUŞTUR
                            </Button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
