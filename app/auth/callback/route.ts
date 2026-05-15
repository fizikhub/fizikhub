import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ensureUserProfile } from '@/lib/auth-profile'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Validate 'next' parameter to prevent open redirect attacks
    const rawNext = searchParams.get('next') ?? '/'
    const next = (rawNext.startsWith('/') && !rawNext.startsWith('//')) ? rawNext : '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
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
                    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=profile_upsert_failed`)
                }

                if (!profileResult.profile?.onboardingCompleted) {
                    return NextResponse.redirect(`${origin}/kurulum`)
                }
            }

            // Success Redirect
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}
