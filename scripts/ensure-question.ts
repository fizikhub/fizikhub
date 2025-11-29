
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Checking for weekly question...');
    const title = 'Işık hızıyla giden bir trende ileriye doğru fener tutarsak ışığın hızı ne olur?';

    const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('title', title);

    if (error) {
        console.error('Error fetching question:', error);
        return;
    }

    if (questions && questions.length > 0) {
        console.log('Question already exists:', questions[0].id);
        return;
    }

    console.log('Question not found. Creating it...');

    // Get admin user
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    const admin = users.find(u => u.email === 'barannnbozkurttb.b@gmail.com');

    if (!admin) {
        console.error('Admin user not found!');
        return;
    }

    const { data: newQuestion, error: insertError } = await supabase
        .from('questions')
        .insert({
            title: title,
            content: 'Bu klasik bir görelilik paradoksu. Sizce dışarıdan bakan bir gözlemci ışığın hızını nasıl ölçer? Işık hızı kaynak hızından bağımsız mıdır? Düşüncelerinizi bekliyorum.',
            category: 'Genel Görelilik',
            author_id: admin.id,
            tags: ['haftanin-sorusu']
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating question:', insertError);
    } else {
        console.log('Question created successfully:', newQuestion.id);
    }
}

main();
