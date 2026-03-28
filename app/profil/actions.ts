"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/notifications/actions";
import { validateImageFile } from "@/lib/security";
import { isAdminEmail } from "@/lib/admin";
import { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// TYPES
// ============================================

export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
}

interface ProfileUpdateData {
    bio?: string;
    avatar_url?: string;
    full_name?: string;
    website?: string;
    social_links?: SocialLinks;
    cover_offset_y?: number;
    location?: string;
    onboarding_completed?: boolean;
    username?: string;
    username_changes_count?: number;
    cover_url?: string;
}

// ============================================
// HELPER: Username validation & change
// ============================================

async function validateAndChangeUsername(
    supabase: SupabaseClient,
    userId: string,
    userEmail: string | undefined,
    newUsername: string
): Promise<{ success: boolean; error?: string; updateFields?: { username: string; username_changes_count: number } }> {
    // Username boş olamaz
    if (!newUsername || newUsername.trim().length === 0) {
        return { success: false, error: "Kullanıcı adı boş olamaz." };
    }

    // Username formatını kontrol et (sadece harf, rakam, alt çizgi)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(newUsername)) {
        return { success: false, error: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir." };
    }

    // Mevcut profil bilgilerini kontrol et
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('id, username, username_changes_count')
        .eq('id', userId)
        .single();

    // Aynı username ise değişiklik gereksiz
    if (currentProfile?.username === newUsername) {
        return { success: true };
    }

    const isAdmin = isAdminEmail(userEmail);
    const changeCount = currentProfile?.username_changes_count || 0;

    if (!isAdmin && changeCount >= 1) {
        return { success: false, error: "Kullanıcı adınızı sadece bir kez değiştirebilirsiniz." };
    }

    // Benzersizlik kontrolü
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newUsername)
        .neq('id', userId)
        .single();

    if (existingUser) {
        return { success: false, error: "Bu kullanıcı adı zaten kullanılıyor." };
    }

    return {
        success: true,
        updateFields: {
            username: newUsername,
            username_changes_count: changeCount + 1
        }
    };
}

export async function updateUsername(newUsername: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    const result = await validateAndChangeUsername(supabase, user.id, user.email, newUsername);
    if (!result.success) {
        return { success: false, error: result.error };
    }

    if (result.updateFields) {
        const { error: updateError } = await supabase
            .from('profiles')
            .update(result.updateFields)
            .eq('id', user.id);

        if (updateError) {
            console.error("Username update error:", updateError);
            return { success: false, error: "Kullanıcı adı güncellenirken hata oluştu." };
        }
    }

    revalidatePath('/profil');
    return { success: true };
}

export async function updateProfile(formData: {
    bio?: string;
    avatar_url?: string;
    full_name?: string;
    website?: string;
    social_links?: SocialLinks;
    cover_offset_y?: number;
    location?: string;
    onboarding_completed?: boolean;
}) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    const updateData: ProfileUpdateData = {};

    if (formData.bio !== undefined) updateData.bio = formData.bio;
    if (formData.avatar_url !== undefined) updateData.avatar_url = formData.avatar_url;
    if (formData.full_name !== undefined) updateData.full_name = formData.full_name;
    if (formData.website !== undefined) updateData.website = formData.website;
    if (formData.social_links !== undefined) updateData.social_links = formData.social_links;
    if (formData.cover_offset_y !== undefined) updateData.cover_offset_y = formData.cover_offset_y;
    if (formData.location !== undefined) updateData.location = formData.location;
    if (formData.onboarding_completed !== undefined) updateData.onboarding_completed = formData.onboarding_completed;

    const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

    if (updateError) {
        console.error("Profile update error detail:", updateError);
        return { success: false, error: "Profil güncellenirken hata oluştu." };
    }

    return { success: true };
}

export async function saveProfileChanges(formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    const fullName = formData.get("full_name") as string;
    const bio = formData.get("bio") as string;
    const website = formData.get("website") as string;
    const location = formData.get("location") as string;
    const newUsername = formData.get("username") as string;
    const avatarFile = formData.get("avatar") as File | null;
    const coverFile = formData.get("cover") as File | null;

    try {
        const updateData: ProfileUpdateData = {};
        
        // 1. Basic Fields
        if (fullName !== null) updateData.full_name = fullName;
        if (bio !== null) updateData.bio = bio;
        if (website !== null) updateData.website = website;
        if (location !== null) updateData.location = location;

        // 2. Avatar Upload
        if (avatarFile && avatarFile.size > 0 && avatarFile.name !== 'undefined') {
            const validationError = validateImageFile(avatarFile);
            if (validationError) return { success: false, error: `Avatar: ${validationError}` };

            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `avatar-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            updateData.avatar_url = urlData.publicUrl;
        }

        // 3. Cover Upload
        if (coverFile && coverFile.size > 0 && coverFile.name !== 'undefined') {
            const validationError = validateImageFile(coverFile);
            if (validationError) return { success: false, error: `Kapak: ${validationError}` };

            const fileExt = coverFile.name.split('.').pop();
            const fileName = `cover-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('covers')
                .upload(filePath, coverFile);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('covers').getPublicUrl(filePath);
            updateData.cover_url = urlData.publicUrl;
        }

        // 4. Username Logic — DRY: uses shared helper
        if (newUsername) {
            const usernameResult = await validateAndChangeUsername(supabase, user.id, user.email, newUsername);
            if (!usernameResult.success) {
                return { success: false, error: usernameResult.error };
            }
            if (usernameResult.updateFields) {
                updateData.username = usernameResult.updateFields.username;
                updateData.username_changes_count = usernameResult.updateFields.username_changes_count;
            }
        }

        // 5. Final Save
        if (Object.keys(updateData).length > 0) {
            const { error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id);

            if (updateError) throw updateError;
        }

        revalidatePath('/profil');
        if (updateData.username) {
            revalidatePath(`/kullanici/${updateData.username}`);
        }
        
        return { success: true };

    } catch (error: unknown) {
        console.error("Profile consolidation error:", error);
        return { success: false, error: "Değişiklikler kaydedilirken bir hata oluştu." };
    }
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
        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
            return { success: false, error: validationError };
        }

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
            return { success: false, error: "Profil güncellenirken hata oluştu." };
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
        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
            return { success: false, error: validationError };
        }

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
            return { success: false, error: "Dosya yüklenirken hata oluştu." };
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
            return { success: false, error: "Profil güncellenirken hata oluştu." };
        }

        revalidatePath("/profil");
        revalidatePath(`/kullanici/${profile?.username || user.id}`);

        return { success: true };
    } catch (error) {
        console.error("Cover upload error:", error);
        return { success: false, error: "Beklenmeyen bir hata oluştu" };
    }
}
