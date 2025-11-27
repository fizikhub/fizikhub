"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { updateUsername } from "@/app/profil/actions";

interface EditUsernameButtonProps {
    currentUsername: string;
}

export function EditUsernameButton({ currentUsername }: EditUsernameButtonProps) {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState(currentUsername);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        setIsUpdating(true);
        const result = await updateUsername(username);

        if (result.success) {
            toast.success("Kullanıcı adı güncellendi!");
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
                    Kullanıcı Adını Değiştir
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kullanıcı Adını Değiştir</DialogTitle>
                    <DialogDescription>
                        Yeni kullanıcı adınızı girin. Sadece harf, rakam ve alt çizgi kullanabilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Yeni Kullanıcı Adı</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ornek_kullanici123"
                            disabled={isUpdating}
                        />
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
                        {isUpdating ? "Güncelleniyor..." : "Güncelle"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
