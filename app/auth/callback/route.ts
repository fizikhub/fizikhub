import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
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
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // 1. Get existing profile
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                // 2. Prepare profile data from metadata
                const metadata = user.user_metadata
                const fullName = metadata.full_name || metadata.name || ''
                const avatarUrl = metadata.avatar_url || metadata.picture || ''
                const email = user.email || ''
                
                // Generate base username from email (e.g. baran from baran@example.com)
                // Normalize: lowercase, remove non-alphanumeric
                let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                if (baseUsername.length < 3) baseUsername = `user${Math.floor(Math.random() * 10000)}`

                // 3. Logic: If no profile OR critical data missing (like username/fullname), upsert it.
                // We prefer keeping existing data if valid.
                const needsUpdate = !existingProfile || 
                                  (!existingProfile.username) || 
                                  (!existingProfile.full_name && fullName)

                if (needsUpdate) {
                    const username = existingProfile?.username || baseUsername
                    const targetFullName = existingProfile?.full_name || fullName || baseUsername
                    
                    // Specific fix: if we are creating a fresh profile or fixing a broken one
                    // we might need to handle username collisions. For now, we'll try to upsert.
                    // Ideally, we should check uniqueness, but for a quick fix, let's append random if needed
                    // or just rely on the fact that email-based username is usually unique per person.
                    // To be safe against collisions on "common" names, we can append a short random string if it's a new profile.
                    
                    let finalUsername = username
                    if (!existingProfile) {
                        // Check if username exists
                        const { data: collision } = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('username', username)
                            .neq('id', user.id) // excluding self just in case
                            .single()
                        
                        if (collision) {
                            finalUsername = `${username}${Math.floor(Math.random() * 1000)}`
                        }
                    }

                    const updates = {
                        id: user.id,
                        username: finalUsername,
                        full_name: targetFullName,
                        avatar_url: existingProfile?.avatar_url || avatarUrl,
                        updated_at: new Date().toISOString(),
                        onboarding_completed: existingProfile?.onboarding_completed ?? true // Should be true for Google logins mostly
                    }

                    const { error: upsertError } = await supabase
                        .from('profiles')
                        .upsert(updates)
                    
                    if (upsertError) {
                        console.error('Profile upsert error in callback:', upsertError)
                    }
                }

                // Re-fetch profile to check onboarding status accurately after potential update
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single()

                // If profile exists but onboarding is not completed (or null), redirect to onboarding
                // This handles both auto-created profiles (trigger) and manual signups
                if (profile && !profile.onboarding_completed) {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
