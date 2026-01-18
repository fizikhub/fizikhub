import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
                // 1. Check for existing profile safely
                const { data: existingProfile, error: fetchError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle() // Use maybeSingle to avoid 406/JSON errors on empty result

                if (fetchError) {
                    console.error('Profile fetch error:', fetchError)
                    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=profile_fetch_failed`)
                }

                // 2. Determine if we need to create or update the profile
                // Update if: No profile, OR missing username, OR missing fullname (and we have it from metadata)
                const metadata = user.user_metadata
                const metaFullName = metadata.full_name || metadata.name || ''
                const metaAvatar = metadata.avatar_url || metadata.picture || ''
                const email = user.email || ''

                const needsUpdate = !existingProfile ||
                    (!existingProfile.username) ||
                    (!existingProfile.full_name && metaFullName)

                if (needsUpdate) {
                    let finalUsername = existingProfile?.username
                    const targetFullName = existingProfile?.full_name || metaFullName || email.split('@')[0]

                    // Generate unique username if one doesn't exist
                    if (!finalUsername) {
                        let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                        if (baseUsername.length < 3) baseUsername = `user${Math.floor(Math.random() * 10000)}`

                        // Try up to 5 times to find a unique username
                        let isUnique = false
                        let attempt = 0

                        while (!isUnique && attempt < 5) {
                            const candidate = attempt === 0 ? baseUsername : `${baseUsername}${Math.floor(Math.random() * 10000)}`

                            const { data: collision } = await supabase
                                .from('profiles')
                                .select('id')
                                .eq('username', candidate)
                                .neq('id', user.id)
                                .maybeSingle()

                            if (!collision) {
                                finalUsername = candidate
                                isUnique = true
                            }
                            attempt++
                        }

                        // Use fallback if all attempts fail
                        if (!finalUsername) {
                            finalUsername = `${baseUsername}${Date.now()}`
                        }
                    }

                    const updates = {
                        id: user.id,
                        username: finalUsername,
                        full_name: targetFullName,
                        avatar_url: existingProfile?.avatar_url || metaAvatar,
                        updated_at: new Date().toISOString(),
                        // Only mark as onboarded if we have the critical info we just set
                        onboarding_completed: existingProfile?.onboarding_completed ?? (!!finalUsername && !!targetFullName)
                    }

                    const { error: upsertError } = await supabase
                        .from('profiles')
                        .upsert(updates)

                    if (upsertError) {
                        console.error('Profile upsert error:', upsertError)
                        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=profile_upsert_failed`)
                    }
                }

                // 3. Final Onboarding Check
                // We re-verify the profile status to be sure
                const { data: finalProfile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .maybeSingle()

                if (finalProfile && !finalProfile.onboarding_completed) {
                    return NextResponse.redirect(`${origin}/onboarding`)
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
