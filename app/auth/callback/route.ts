import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ensureUserProfile } from '@/lib/auth-profile'
import { getSupabasePublicConfig } from '@/lib/supabase-server'
import { getSiteUrl } from '@/lib/seo-utils'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const isLocalEnv = process.env.NODE_ENV === 'development'
    const redirectBase = isLocalEnv ? origin : getSiteUrl()
    const code = searchParams.get('code')
    // Validate 'next' parameter to prevent open redirect attacks
    const rawNext = searchParams.get('next') ?? '/'
    const next = (rawNext.startsWith('/') && !rawNext.startsWith('//')) ? rawNext : '/'
    const isPasswordReset = next.startsWith('/reset-password')

    if (code) {
        const supabaseConfig = getSupabasePublicConfig()
        if (!supabaseConfig) {
            console.error('Auth callback missing Supabase public config')
            return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=missing_supabase_config`)
        }

        const cookieStore = await cookies()
        const supabase = createServerClient(
            supabaseConfig.url,
            supabaseConfig.anonKey,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const profileResult = await ensureUserProfile(user)

                if (!profileResult.success) {
                    console.error('Profile ensure error:', profileResult.error)
                    return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=profile_upsert_failed`)
                }

                if (!isPasswordReset && !profileResult.profile?.onboardingCompleted) {
                    return NextResponse.redirect(`${redirectBase}/kurulum`)
                }
            }

            // Success Redirect
            return NextResponse.redirect(`${redirectBase}${next}`)
        }
    }

    return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=no_code`)
}
