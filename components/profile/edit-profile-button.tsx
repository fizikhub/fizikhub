"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/app/profil/actions";

interface EditProfileButtonProps {
    currentFullName: string | null;
    currentBio: string | null;
    currentAvatarUrl: string | null;
    currentWebsite?: string | null;
    currentSocialLinks?: any;
}

export function EditProfileButton({ currentFullName, currentBio, currentAvatarUrl, currentWebsite, currentSocialLinks }: EditProfileButtonProps) {
    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState(currentFullName || "");
    const [bio, setBio] = useState(currentBio || "");
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || "");
    const [website, setWebsite] = useState(currentWebsite || "");
    const [twitter, setTwitter] = useState(currentSocialLinks?.twitter || "");
    const [github, setGithub] = useState(currentSocialLinks?.github || "");
    const [instagram, setInstagram] = useState(currentSocialLinks?.instagram || "");
    const [linkedin, setLinkedin] = useState(currentSocialLinks?.linkedin || "");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        setIsUpdating(true);
        const socialLinks = {
            twitter: twitter || null,
            github: github || null,
            instagram: instagram || null,
            linkedin: linkedin || null
        };

        const result = await updateProfile({
            full_name: fullName,
            bio,
            avatar_url: avatarUrl,
            website: website || undefined,
            social_links: socialLinks
        });

        if (result.success) {
            toast.success("Profil güncellendi!");
            setOpen(false);
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setIsUpdating(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Profili Düzenle
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Profili Düzenle</DialogTitle>
                    <DialogDescription>
                        Profil fotoğrafınızı ve biyografinizi güncelleyin.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullname">Ad Soyad</Label>
                        <Input
                            id="fullname"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Adınız Soyadınız"
                            disabled={isUpdating}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Profil Fotoğrafı URL</Label>
                        <Input
                            id="avatar"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            disabled={isUpdating}
                        />
                        <p className="text-xs text-muted-foreground">
                            Fotoğraf URL'sini girin (örn: Unsplash, Gravatar)
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biyografi</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Kendiniz hakkında birkaç cümle yazın..."
                            disabled={isUpdating}
                            rows={4}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {bio.length}/500 karakter
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Web Sitesi</Label>
                        <Input
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://example.com"
                            disabled={isUpdating}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter (X)</Label>
                            <Input
                                id="twitter"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                placeholder="@username"
                                disabled={isUpdating}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                                id="github"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                placeholder="username"
                                disabled={isUpdating}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="username"
                                disabled={isUpdating}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                placeholder="username"
                                disabled={isUpdating}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isUpdating}
                    >
                        İptal
                    </Button>
                    <Button onClick={handleUpdate} disabled={isUpdating}>
                        {isUpdating ? "Güncelleniyor..." : "Kaydet"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
