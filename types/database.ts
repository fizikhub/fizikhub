export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    cover_url: string | null
                    role: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    cover_url?: string | null
                    role?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    cover_url?: string | null
                    role?: string | null
                    created_at?: string
                }
            }
            articles: {
                Row: {
                    id: number
                    created_at: string
                    title: string
                    slug: string
                    content: string | null
                    excerpt: string | null
                    image_url: string | null
                    category: string | null
                    author_id: string | null
                    published: boolean
                }
                Insert: {
                    id?: number
                    created_at?: string
                    title: string
                    slug: string
                    content?: string | null
                    excerpt?: string | null
                    image_url?: string | null
                    category?: string | null
                    author_id?: string | null
                    published?: boolean
                }
                Update: {
                    id?: number
                    created_at?: string
                    title?: string
                    slug?: string
                    content?: string | null
                    excerpt?: string | null
                    image_url?: string | null
                    category?: string | null
                    author_id?: string | null
                    published?: boolean
                }
            }
            questions: {
                Row: {
                    id: number
                    created_at: string
                    title: string
                    content: string | null
                    author_id: string | null
                    category: string | null
                    tags: string[] | null
                    tags: string[] | null
                    views: number
                    status: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    title: string
                    content?: string | null
                    author_id?: string | null
                    category?: string | null
                    tags?: string[] | null
                    tags?: string[] | null
                    views?: number
                    status?: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    title?: string
                    content?: string | null
                    author_id?: string | null
                    category?: string | null
                    tags?: string[] | null
                    tags?: string[] | null
                    views?: number
                    status?: string
                }
            }
            answers: {
                Row: {
                    id: number
                    content: string
                    question_id: number
                    author_id: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    content: string
                    question_id: number
                    author_id: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    content?: string
                    question_id?: number
                    author_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "answers_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "answers_question_id_fkey"
                        columns: ["question_id"]
                        isOneToOne: false
                        referencedRelation: "questions"
                        referencedColumns: ["id"]
                    },
                ]
            }
            dictionary_terms: {
                Row: {
                    id: number
                    created_at: string
                    term: string
                    definition: string
                    category: string | null
                }
                Insert: {
                    id?: number
                    created_at?: string
                    term: string
                    definition: string
                    category?: string | null
                }
                Update: {
                    id?: number
                    created_at?: string
                    term?: string
                    definition?: string
                    category?: string | null
                }
            }
            quizzes: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string | null
                    points: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description?: string | null
                    points?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string | null
                    points?: number
                    created_at?: string
                }
            }
            quiz_questions: {
                Row: {
                    id: string
                    quiz_id: string
                    question_text: string
                    options: Json
                    correct_answer: number
                    order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    quiz_id: string
                    question_text: string
                    options: Json
                    correct_answer: number
                    order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    quiz_id?: string
                    question_text?: string
                    options?: Json
                    correct_answer?: number
                    order?: number
                    created_at?: string
                }
            }
            user_quiz_attempts: {
                Row: {
                    id: string
                    user_id: string
                    quiz_id: string
                    score: number
                    total_questions: number
                    completed_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    quiz_id: string
                    score: number
                    total_questions: number
                    completed_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    quiz_id?: string
                    score?: number
                    total_questions?: number
                    completed_at?: string
                }
            }
            weekly_picks: {
                Row: {
                    id: string
                    question_id: number
                    week_start_date: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    question_id: number
                    week_start_date?: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    question_id?: number
                    week_start_date?: string
                    is_active?: boolean
                    created_at?: string
                }
            }
            blocked_users: {
                Row: {
                    id: string
                    blocker_id: string
                    blocked_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    blocker_id: string
                    blocked_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    blocker_id?: string
                    blocked_id?: string
                    created_at?: string
                }
            }
        }
    }
}
