
const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.resolve(__dirname, '../.env.local') });

async function debugQuizzes() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env vars');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('--- Fetching All Quizzes ---');
    const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('*');

    if (error) {
        console.error('Error fetching quizzes:', error);
        return;
    }

    console.log(`Found ${quizzes.length} quizzes.`);

    for (const quiz of quizzes) {
        console.log(`\nChecking Quiz: "${quiz.title}" (slug: ${quiz.slug})`);

        // Try to fetch by slug exactly as the app does
        const { data: fetchedQuiz, error: fetchError } = await supabase
            .from('quizzes')
            .select('*')
            .eq('slug', quiz.slug)
            .single();

        if (fetchError) {
            console.error(`❌ FAILED to fetch by slug '${quiz.slug}':`, fetchError.message);
        } else if (!fetchedQuiz) {
            console.error(`❌ Quiz not found for slug '${quiz.slug}' (returned null)`);
        } else {
            console.log(`✅ Successfully fetched by slug.`);
        }

        // Check questions
        const { data: questions, error: qError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quiz.id);

        if (qError) {
            console.error(`❌ Error fetching questions for quiz '${quiz.id}':`, qError.message);
        } else {
            console.log(`   Found ${questions.length} questions.`);
        }
    }
}

debugQuizzes().catch(err => console.error(err));
