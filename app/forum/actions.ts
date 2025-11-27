"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/notifications/actions";

export async function createQuestion(formData: { title: string; content: string; category: string }) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Soru sormak için giriş yapmalısınız." };
    }

    const { error } = await supabase.from('questions').insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author_id: user.id,
        tags: []
    });

    if (error) {
        console.error("Create Question Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/forum');
    return { success: true };
}

export async function createAnswer(formData: { content: string; questionId: number }) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Cevap yazmak için giriş yapmalısınız." };
    }

    const { data, error } = await supabase.from('answers').insert({
        content: formData.content,
        question_id: formData.questionId,
        author_id: user.id
    })
        .select(`
        *,
        profiles(username, full_name)
    `)
        .single();

    if (error) {
        console.error("Create Answer Error:", error);
        return { success: false, error: error.message };
    }

    // Get question author to notify
    const { data: question } = await supabase
        .from('questions')
        .select('author_id, title')
        .eq('id', formData.questionId)
        .single();

    if (question) {
        await createNotification({
            recipientId: question.author_id,
            actorId: user.id,
            type: 'reply',
            resourceId: formData.questionId.toString(),
            resourceType: 'question',
            content: `"${question.title}" soruna cevap yazdı.`
        });
    }

    revalidatePath(`/forum/${formData.questionId}`);
    return { success: true, data };
}

export async function voteQuestion(questionId: number, voteType: 1 | -1) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

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

export async function deleteQuestion(questionId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    // Check if user is admin
    const isAdmin = user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

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

    // Verify ownership of the question
    const { data: question } = await supabase
        .from('questions')
        .select('author_id')
        .eq('id', questionId)
        .single();

    if (!question || question.author_id !== user.id) {
        return { success: false, error: "Sadece soruyu soran kişi cevabı onaylayabilir." };
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
        // If marking as accepted, first unmark all others (to be safe, though unique index handles it, this prevents error)
        await supabase
            .from('answers')
            .update({ is_accepted: false })
            .eq('question_id', questionId);
    }

    // Update status
    const { error } = await supabase
        .from('answers')
        .update({ is_accepted: newStatus })
        .eq('id', answerId);

    if (error) {
        return { success: false, error: error.message };
    }

    // Notify answer author if accepted
    if (newStatus && currentAnswer.author_id !== user.id) {
        await createNotification({
            recipientId: currentAnswer.author_id,
            actorId: user.id,
            type: 'reply', // TODO: Add specific 'accepted' type
            resourceId: questionId.toString(),
            resourceType: 'question',
            content: `Cevabını doğru cevap olarak işaretledi! 🎉`
        });
    }

    revalidatePath(`/forum/${questionId}`);
    return { success: true };
}

export async function incrementView(questionId: number) {
    const supabase = await createClient();

    const { error } = await supabase.rpc('increment_question_views', {
        question_id: questionId
    });

    if (error) {
        console.error("Increment View Error:", error);
        return { success: false, error: error.message };
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

    const isAdmin = user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

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
