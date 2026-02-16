"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/notifications/actions";

export async function updateUsername(newUsername: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Username boş olamaz
    if (!newUsername || newUsername.trim().length === 0) {
        return { success: false, error: "Kullanıcı adı boş olamaz." };
    }

    // Username formatını kontrol et (sadece harf, rakam, alt çizgi)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(newUsername)) {
        return { success: false, error: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir." };
    }

    // Mevcut profil bilgilerini ve değişim hakkını kontrol et (username_changes_count)
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('id, username_changes_count')
        .eq('id', user.id)
        .single();

    const isAdmin = user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';
    const changeCount = currentProfile?.username_changes_count || 0;

    // Eğer admin değilse ve zaten değiştirdiyse hata ver
    // (Varsayılan olarak 0, 1 kere değiştirebilir -> 0 ise izin ver, 1 ise durdur)
    if (!isAdmin && changeCount >= 1) {
        return { success: false, error: "Kullanıcı adınızı sadece bir kez değiştirebilirsiniz." };
    }

    // Kullanıcı adının benzersiz olup olmadığını kontrol et
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newUsername)
        .neq('id', user.id)
        .single();

    if (existingUser) {
        return { success: false, error: "Bu kullanıcı adı zaten kullanılıyor." };
    }

    // Kullanıcı adını güncelle ve sayacı artır
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            username: newUsername,
            username_changes_count: changeCount + 1
        })
        .eq('id', user.id);

    if (updateError) {
        console.error("Username update error:", updateError);
        return { success: false, error: "Kullanıcı adı güncellenirken hata oluştu." };
    }

    revalidatePath('/profil');
    return { success: true };
}

export async function updateProfile(formData: {
    bio?: string;
    avatar_url?: string;
    full_name?: string;
    website?: string;
    social_links?: any;
    cover_offset_y?: number;
    location?: string;
}) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    const updateData: any = {};

    if (formData.bio !== undefined) updateData.bio = formData.bio;
    if (formData.avatar_url !== undefined) updateData.avatar_url = formData.avatar_url;
    if (formData.full_name !== undefined) updateData.full_name = formData.full_name;
    if (formData.website !== undefined) updateData.website = formData.website;
    if (formData.social_links !== undefined) updateData.social_links = formData.social_links;
    if (formData.cover_offset_y !== undefined) updateData.cover_offset_y = formData.cover_offset_y;
    if (formData.location !== undefined) updateData.location = formData.location;

    // Add updated_at timestamp
    const finalUpdateData = {
        ...updateData,
        updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
        .from('profiles')
        .update(finalUpdateData)
        .eq('id', user.id);

    if (updateError) {
        console.error("Profile update error:", updateError);
        return { success: false, error: `Hata: ${updateError.message}` };
    }

    // Get username for revalidation
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

    revalidatePath('/profil');
    if (profile?.username) {
        revalidatePath(`/kullanici/${profile.username}`);
    }

    return { success: true };
}

export async function followUser(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    if (user.id === targetUserId) {
        return { success: false, error: "Kendinizi takip edemezsiniz. Kendini bu kadar çok mu seviyorsun?" };
    }

    const { error } = await supabase
        .from('follows')
        .insert({
            follower_id: user.id,
            following_id: targetUserId
        });

    if (error) {
        console.error("Follow error:", error);
        return { success: false, error: "Takip edilirken hata oluştu." };
    }

    // Create notification
    await createNotification({
        recipientId: targetUserId,
        actorId: user.id,
        type: 'follow'
    });

    revalidatePath(`/kullanici/${targetUserId}`);
    revalidatePath('/profil');
    return { success: true };
}

export async function unfollowUser(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

    if (error) {
        console.error("Unfollow error:", error);
        return { success: false, error: "Takipten çıkılırken hata oluştu. Evren bu kişiyi takipten çıkmanı istemiyor sanırım." };
    }

    revalidatePath(`/kullanici/${targetUserId}`);
    revalidatePath('/profil');
    return { success: true };
}

export async function getFollowStatus(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { isFollowing: false };

    const { data } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

    return { isFollowing: !!data };
}

export async function getFollowStats(userId: string) {
    try {
        const supabase = await createClient();

        // Get real followers count
        const { count: followersCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', userId);

        // Get real following count
        const { count: followingCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId);

        // Admin boost logic (check username)
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .maybeSingle();

        let finalFollowers = followersCount || 0;

        // Admin username check (barannnbozkurttb)
        if (profile?.username === 'barannnbozkurttb') {
            finalFollowers += 28000;
        }

        return {
            followersCount: finalFollowers,
            followingCount: followingCount || 0
        };
    } catch (error) {
        console.error("Error fetching follow stats:", error);
        return { followersCount: 0, followingCount: 0 };
    }
}

export async function uploadAvatar(file: File) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    try {
        // Get current profile to check for existing avatar
        const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url, username')
            .eq('id', user.id)
            .single();

        // Delete old avatar if exists
        if (profile?.avatar_url) {
            const oldPath = profile.avatar_url.split('/').pop();
            if (oldPath) {
                await supabase.storage
                    .from('avatars')
                    .remove([`${user.id}/${oldPath}`]);
            }
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { success: false, error: "Dosya yüklenirken hata oluştu" };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
            return { success: false, error: "URL alınamadı" };
        }

        // Update profile with new avatar URL
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: urlData.publicUrl })
            .eq('id', user.id);

        if (updateError) {
            console.error("Profile update error:", updateError);
            return { success: false, error: "Profil güncellenirken hata oluştu. Tekrar dener misin yavrum?" };
        }

        revalidatePath("/profil");
        revalidatePath(`/kullanici/${profile?.username || user.id}`);

        return { success: true };
    } catch (error) {
        console.error("Avatar upload error:", error);
        return { success: false, error: "Beklenmeyen bir hata oluştu" };
    }
}

export async function uploadCover(file: File) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    try {
        // Get current profile to check for existing cover
        const { data: profile } = await supabase
            .from('profiles')
            .select('cover_url, username')
            .eq('id', user.id)
            .single();

        // Delete old cover if exists
        if (profile?.cover_url) {
            const oldPath = profile.cover_url.split('/').pop();
            if (oldPath) {
                await supabase.storage
                    .from('covers')
                    .remove([`${user.id}/${oldPath}`]);
            }
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('covers')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { success: false, error: "Dosya yüklenirken hata oluştu. Aptal veritabanı" };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('covers')
            .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
            return { success: false, error: "URL alınamadı" };
        }

        // Update profile with new cover URL
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ cover_url: urlData.publicUrl })
            .eq('id', user.id);

        if (updateError) {
            console.error("Profile update error:", updateError);
            return { success: false, error: "Profil güncellenirken hata oluştu. fuck einstein" };
        }

        revalidatePath("/profil");
        revalidatePath(`/kullanici/${profile?.username || user.id}`);

        return { success: true };
    } catch (error) {
        console.error("Cover upload error:", error);
        return { success: false, error: "Beklenmeyen bir hata oluştu" };
    }
}
