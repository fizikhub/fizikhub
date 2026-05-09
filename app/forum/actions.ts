"use server";

import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/notifications/actions";
import { getClientMetadata, checkContent } from "@/lib/moderation";
import { isAdminEmail } from "@/lib/admin";

type ReputationParams = {
    p_user_id: string;
    p_points: number;
    p_reason: string;
    p_reference_type: string;
    p_reference_id: number;
};

async function addReputation(params: ReputationParams) {
    const { error } = await createAdminClient().rpc('add_reputation', params);
    if (error) {
        console.error("Add Reputation Error:", error);
    }
}

async function incrementQuestionViews(questionId: number) {
    return createAdminClient().rpc('increment_question_views', {
        question_id: questionId,
    });
}

export async function toggleAnswerLike(answerId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Get answer details to check author
    const { data: answer } = await supabase
        .from('answers')
        .select('author_id')
        .eq('id', answerId)
        .single();

    if (!answer) {
        return { success: false, error: "Cevap bulunamadı." };
    }

    // Check if user already liked this answer
    const { data: existingLike } = await supabase
        .from('answer_likes')
        .select('id')
        .eq('answer_id', answerId)
        .eq('user_id', user.id)
        .single();

    if (existingLike) {
        // Unlike
        const { error } = await supabase
            .from('answer_likes')
            .delete()
            .eq('id', existingLike.id);

        if (error) {
            return { success: false, error: error.message };
        }

        // Remove reputation if not self-like
        if (answer.author_id !== user.id) {
            await addReputation({
                p_user_id: answer.author_id,
                p_points: -5,
                p_reason: 'answer_like_removed',
                p_reference_type: 'answer',
                p_reference_id: answerId
            });
        }

    } else {
        // Like
        const { error } = await supabase
            .from('answer_likes')
            .insert({ answer_id: answerId, user_id: user.id });

        if (error) {
            return { success: false, error: error.message };
        }

        // Add reputation if not self-like
        if (answer.author_id !== user.id) {
            await addReputation({
                p_user_id: answer.author_id,
                p_points: 5,
                p_reason: 'answer_liked',
                p_reference_type: 'answer',
                p_reference_id: answerId
            });
        }
    }

    // Get updated like count
    const { count } = await supabase
        .from('answer_likes')
        .select('*', { count: 'exact', head: true })
        .eq('answer_id', answerId);

    revalidatePath('/forum');

    return {
        success: true,
        likeCount: count || 0,
        isLiked: !existingLike
    };
}


export async function createQuestion(formData: { title: string; content: string; category: string; status?: 'published' | 'draft' }) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Soru sormak için giriş yapmalısınız." };
    }

    // Input validation
    if (!formData.title || formData.title.trim().length === 0) {
        return { success: false, error: "Başlık boş olamaz." };
    }
    if (formData.title.length > 300) {
        return { success: false, error: "Başlık en fazla 300 karakter olabilir." };
    }
    if (!formData.content || formData.content.trim().length === 0) {
        return { success: false, error: "İçerik boş olamaz." };
    }
    if (formData.content.length > 20000) {
        return { success: false, error: "İçerik en fazla 20.000 karakter olabilir." };
    }

    // Moderation check
    const modResult = checkContent(`${formData.title} ${formData.content}`);
    const { ip, ua } = await getClientMetadata();

    const { data, error } = await supabase.from('questions').insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author_id: user.id,
        tags: [],
        status: formData.status || 'published',
        author_ip: ip,
        user_agent: ua,
        is_flagged: modResult.isFlagged
    }).select().single();

    if (error) {
        return { success: false, error: "Soru oluşturulurken bir hata oluştu." };
    }

    // Add reputation for asking question ONLY IF PUBLISHED
    if (data.status === 'published') {
        await addReputation({
            p_user_id: user.id,
            p_points: 5,
            p_reason: 'question_created',
            p_reference_type: 'question',
            p_reference_id: data.id
        });
    }

    revalidatePath('/forum');
    return { success: true };
}

export async function updateQuestion(questionId: number, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Input validation
    if (!content || content.trim().length === 0) {
        return { success: false, error: "İçerik boş olamaz." };
    }
    if (content.length > 20000) {
        return { success: false, error: "İçerik en fazla 20.000 karakter olabilir." };
    }

    // Moderation check on update
    const modResult = checkContent(content);
    if (modResult.isFlagged) {
        return { success: false, error: "İçerik politikasına aykırı içerik tespit edildi." };
    }

    // Get question to check ownership
    const { data: question } = await supabase
        .from('questions')
        .select('author_id')
        .eq('id', questionId)
        .single();

    if (!question) {
        return { success: false, error: "Soru bulunamadı." };
    }

    const isAdmin = isAdminEmail(user.email);

    if (question.author_id !== user.id && !isAdmin) {
        return { success: false, error: "Bu soruyu düzenleme yetkiniz yok." };
    }

    // Use standard client (and fix RLS instead)
    const { error, data } = await supabase
        .from('questions')
        .update({ content })
        .eq('id', questionId)
        .select();

    if (error) {
        console.error("Update Question Error:", error);
        return { success: false, error: "Soru güncellenirken hata oluştu." };
    }



    revalidatePath('/forum');
    revalidatePath(`/forum/${questionId}`);
    return { success: true };
}

export async function createAnswer(formData: { content: string; questionId: number }) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Oturum hatası oluştu. Lütfen tekrar giriş yapın." };
    }

    // Input validation
    if (!formData.content || formData.content.trim().length === 0) {
        return { success: false, error: "Cevap içeriği boş olamaz." };
    }
    if (formData.content.length > 20000) {
        return { success: false, error: "Cevap en fazla 20.000 karakter olabilir." };
    }

    const { ip, ua } = await getClientMetadata();
    const modResult = checkContent(formData.content);

    const { data, error } = await supabase.from('answers').insert({
        content: formData.content,
        question_id: formData.questionId,
        author_id: user.id,
        author_ip: ip,
        user_agent: ua,
        is_flagged: modResult.isFlagged
    })
        .select(`
        *,
        profiles(username, full_name)
    `)
        .single();

    if (error) {
        return { success: false, error: "Cevap oluşturulurken bir hata oluştu." };
    }

    // Get question author to notify
    const { data: question } = await supabase
        .from('questions')
        .select('author_id, title')
        .eq('id', formData.questionId)
        .single();

    if (question) {
        const isAdmin = isAdminEmail(user.email);
        const notificationContent = isAdmin
            ? "hazreti yüce müce admin soruna cevap verdi"
            : `"${question.title}" soruna cevap yazdı.`;

        await createNotification({
            recipientId: question.author_id,
            actorId: user.id,
            type: 'reply',
            resourceId: formData.questionId.toString(),
            resourceType: 'question',
            content: notificationContent
        });
    }

    // Add reputation for answering a question
    await addReputation({
        p_user_id: user.id,
        p_points: 10,
        p_reason: 'answer_created',
        p_reference_type: 'answer',
        p_reference_id: data.id
    });

    revalidatePath(`/forum/${formData.questionId}`);
    return { success: true, data };
}

export async function voteQuestion(questionId: number, voteType: 1 | -1) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    // Self-vote prevention
    const { data: questionData } = await supabase
        .from('questions')
        .select('author_id')
        .eq('id', questionId)
        .single();

    if (questionData?.author_id === user.id) {
        return { success: false, error: "Kendi sorunuzu oylayamazsınız." };
    }

    // Check existing vote
    const { data: existingVote } = await supabase
        .from('question_votes')
        .select('*')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .single();

    let newVoteCountChange = 0;

    if (existingVote) {
        if (existingVote.vote_type === voteType) {
            // Remove vote (toggle off)
            await supabase.from('question_votes').delete().eq('id', existingVote.id);
            newVoteCountChange = -voteType;
        } else {
            // Change vote
            await supabase.from('question_votes').update({ vote_type: voteType }).eq('id', existingVote.id);
            newVoteCountChange = 2 * voteType; // e.g., -1 to 1 is +2 change
        }
    } else {
        // New vote
        await supabase.from('question_votes').insert({
            question_id: questionId,
            user_id: user.id,
            vote_type: voteType
        });
        newVoteCountChange = voteType;
    }

    // Manual update of questions table is removed because we now use a database trigger
    // This avoids RLS issues where a user cannot update another user's question row.

    // Notify author on upvote (only if it's a new upvote or changing from down to up)
    if (voteType === 1 && newVoteCountChange > 0) {
        const { data: question } = await supabase
            .from('questions')
            .select('author_id, title')
            .eq('id', questionId)
            .single();

        if (question) {
            await createNotification({
                recipientId: question.author_id,
                actorId: user.id,
                type: 'like',
                resourceId: questionId.toString(),
                resourceType: 'question',
                content: `"${question.title}" sorunu beğendi.`
            });
        }
    }

    revalidatePath('/forum');
    revalidatePath(`/forum/${questionId}`);

    // We return the change so UI can update optimistically if needed, 
    // but the real count will come from DB on revalidate
    return { success: true, voteChange: newVoteCountChange };
}

export async function getUserQuestionVotes(questionIds: number[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || questionIds.length === 0) {
        return { success: true, votes: [] as { question_id: number; vote_type: number }[] };
    }

    const { data, error } = await supabase
        .from('question_votes')
        .select('question_id, vote_type')
        .eq('user_id', user.id)
        .in('question_id', questionIds);

    if (error) {
        return { success: false, votes: [] as { question_id: number; vote_type: number }[] };
    }

    return { success: true, votes: data || [] };
}

export async function deleteQuestion(questionId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    // Check if user is admin
    const isAdmin = isAdminEmail(user.email);

    if (!isAdmin) {
        // Optional: Allow owner to delete (if we want that feature later)
        // For now, strictly admin as requested
        return { success: false, error: "Bu işlemi yapmaya yetkiniz yok." };
    }

    const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

    if (error) {
        console.error("Delete Question Error:", error);
        return { success: false, error: "Soru silinirken hata oluştu." };
    }

    revalidatePath('/forum');
    return { success: true };
}

export async function toggleAnswerAcceptance(answerId: number, questionId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    // Verify ownership of the question OR admin status
    const { data: question } = await supabase
        .from('questions')
        .select('author_id')
        .eq('id', questionId)
        .single();

    const isAdmin = isAdminEmail(user.email);

    if (!question || (question.author_id !== user.id && !isAdmin)) {
        return { success: false, error: "Sadece soruyu soran kişi veya admin cevabı onaylayabilir." };
    }

    // Check current status of the answer
    const { data: currentAnswer } = await supabase
        .from('answers')
        .select('is_accepted, author_id')
        .eq('id', answerId)
        .single();

    if (!currentAnswer) return { success: false, error: "Cevap bulunamadı." };

    const newStatus = !currentAnswer.is_accepted;

    if (newStatus) {
        // If marking as accepted, first find existing accepted answer to remove points
        const { data: previousAccepted } = await supabase
            .from('answers')
            .select('id, author_id')
            .eq('question_id', questionId)
            .eq('is_accepted', true)
            .single();

        if (previousAccepted) {
            // Remove points from previous owner
            await addReputation({
                p_user_id: previousAccepted.author_id,
                p_points: -15,
                p_reason: 'answer_unaccepted',
                p_reference_type: 'answer',
                p_reference_id: previousAccepted.id
            });
        }

        // Unmark all others
        await supabase
            .from('answers')
            .update({ is_accepted: false })
            .eq('question_id', questionId);
    } else {
        // If unmarking (newStatus is false), remove points from current author
        await addReputation({
            p_user_id: currentAnswer.author_id,
            p_points: -15,
            p_reason: 'answer_unaccepted',
            p_reference_type: 'answer',
            p_reference_id: answerId
        });
    }

    // Update status
    const { error } = await supabase
        .from('answers')
        .update({ is_accepted: newStatus })
        .eq('id', answerId);

    if (error) {
        return { success: false, error: error.message };
    }

    // Add points if accepted
    if (newStatus) {
        await addReputation({
            p_user_id: currentAnswer.author_id,
            p_points: 15,
            p_reason: 'answer_accepted',
            p_reference_type: 'answer',
            p_reference_id: answerId
        });
    }

    // Notify answer author if accepted
    if (newStatus && currentAnswer.author_id !== user.id) {
        const notificationContent = isAdmin
            ? "Tebrikler! Cevabın haftanın en iyi cevabı seçildi! 🚀"
            : "Cevabını doğru cevap olarak işaretledi! 🎉";

        await createNotification({
            recipientId: currentAnswer.author_id,
            actorId: user.id,
            type: 'reply', // TODO: Add specific 'accepted' type if needed
            resourceId: questionId.toString(),
            resourceType: 'question',
            content: notificationContent
        });
    }

    revalidatePath(`/forum/${questionId}`);
    return { success: true };
}

export async function incrementView(questionId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Require authentication to prevent anonymous view spam
    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Dedup: check if user already viewed this question (prevents spam)
    const { data: existingView } = await supabase
        .from('question_views')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingView) {
        // Already viewed, skip increment
        return { success: true };
    }

    // Record the view
    await supabase.from('question_views').insert({
        question_id: questionId,
        user_id: user.id
    }).select().maybeSingle(); // ignore errors (table may not exist yet, RPC handles it)

    const { error } = await incrementQuestionViews(questionId);

    if (error) {
        console.error("Increment View Error:", error);
        return { success: false, error: "Görüntülenme sayısı güncellenirken hata oluştu." };
    }

    return { success: true };
}

export async function deleteAnswer(answerId: number, questionId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Check if user is author or admin
    const { data: answer } = await supabase
        .from('answers')
        .select('author_id')
        .eq('id', answerId)
        .single();

    if (!answer) {
        return { success: false, error: "Cevap bulunamadı." };
    }

    const isAdmin = isAdminEmail(user.email);

    if (answer.author_id !== user.id && !isAdmin) {
        return { success: false, error: "Bu cevabı silme yetkiniz yok." };
    }

    const { error } = await supabase
        .from('answers')
        .delete()
        .eq('id', answerId);

    if (error) {
        console.error("Delete Answer Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/forum/${questionId}`);
    return { success: true };
}

export async function createAnswerComment(formData: {
    content: string;
    answerId: number;
    questionId: number;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Yorum yapmak için giriş yapmalısınız." };
    }

    if (!formData.content || formData.content.trim().length === 0) {
        return { success: false, error: "Yorum içeriği boş olamaz." };
    }
    if (formData.content.length > 5000) {
        return { success: false, error: "Yorum en fazla 5.000 karakter olabilir." };
    }

    const { ip, ua } = await getClientMetadata();
    const modResult = checkContent(formData.content);

    const { data, error } = await supabase
        .from('answer_comments')
        .insert({
            content: formData.content,
            answer_id: formData.answerId,
            author_id: user.id,
            author_ip: ip,
            user_agent: ua,
            is_flagged: modResult.isFlagged
        })
        .select(`
            *,
            profiles(username, full_name, avatar_url, is_verified)
        `)
        .single();

    if (error) {
        console.error("Comment creation error:", error);
        return { success: false, error: `Hata: ${error.message}` };
    }

    revalidatePath(`/forum/${formData.questionId}`);
    return { success: true, data };
}

export async function deleteAnswerComment(commentId: number, questionId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Check if user is admin
    const isAdmin = isAdminEmail(user.email);

    let query = supabase.from('answer_comments').delete().eq('id', commentId);

    // If not admin, ensure user owns the comment
    if (!isAdmin) {
        query = query.eq('author_id', user.id);
    }

    const { error } = await query;

    if (error) {
        console.error("Comment deletion error:", error);
        return { success: false, error: "Yorum silinirken hata oluştu." };
    }

    revalidatePath(`/forum/${questionId}`);
    return { success: true };
}

export async function toggleCommentLike(commentId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Get comment details
    const { data: comment } = await supabase
        .from('answer_comments')
        .select('author_id, answer_id')
        .eq('id', commentId)
        .single();

    if (!comment) {
        return { success: false, error: "Yorum bulunamadı." };
    }

    // Prevent self-liking
    if (comment.author_id === user.id) {
        return { success: false, error: "Kendi yorumunuzu beğenemezsiniz." };
    }

    // Check if user already liked this comment
    const { data: existingLike } = await supabase
        .from('answer_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

    // ... (previous code)

    if (existingLike) {
        // Unlike
        const { error } = await supabase
            .from('answer_comment_likes')
            .delete()
            .eq('id', existingLike.id);

        if (error) {
            return { success: false, error: error.message };
        }

        // Remove reputation (deduct 1 point)
        await addReputation({
            p_user_id: comment.author_id,
            p_points: -1,
            p_reason: 'answer_comment_like_removed',
            p_reference_type: 'answer_comment',
            p_reference_id: commentId
        });

        return { success: true };
    } else {
        // Like
        const { error } = await supabase
            .from('answer_comment_likes')
            .insert({
                comment_id: commentId,
                user_id: user.id
            });

        if (error) {
            return { success: false, error: error.message };
        }

        // Add reputation (add 1 point)
        await addReputation({
            p_user_id: comment.author_id,
            p_points: 1,
            p_reason: 'answer_comment_liked',
            p_reference_type: 'answer_comment',
            p_reference_id: commentId
        });

        // Send notification to comment author
        if (comment.author_id !== user.id) {
            await createNotification({
                recipientId: comment.author_id,
                actorId: user.id,
                type: 'like',
                content: 'yorumunu beğendi',
                resourceId: comment.answer_id.toString(), // Linking back to answer for context
                resourceType: 'answer' // The notification system likely handles 'answer' best
            });
        }

        return { success: true };
    }
}
