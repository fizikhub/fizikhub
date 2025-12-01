import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh session if needed - required for Server Components
    const { data: { user } } = await supabase.auth.getUser()

    // Onboarding Check
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

        const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding')

        // If onboarding is NOT completed and user is NOT on onboarding page -> Redirect to onboarding
        if (profile && !profile.onboarding_completed && !isOnboardingPage) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // If onboarding IS completed and user IS on onboarding page -> Redirect to home
        if (profile && profile.onboarding_completed && isOnboardingPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}
