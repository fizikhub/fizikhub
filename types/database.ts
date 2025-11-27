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
                    role: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
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
                    views: number
                }
                Insert: {
                    id?: number
                    created_at?: string
                    title: string
                    content?: string | null
                    author_id?: string | null
                    category?: string | null
                    tags?: string[] | null
                    views?: number
                }
                Update: {
                    id?: number
                    created_at?: string
                    title?: string
                    content?: string | null
                    author_id?: string | null
                    category?: string | null
                    tags?: string[] | null
                    views?: number
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
        }
    }
}
