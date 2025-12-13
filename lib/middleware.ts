import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
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
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refreshing the auth token
    // OPTIMIZATION: Skip auth check for homepage and public static pages to improve TTFB.
    // The homepage is cached and doesn't use server-side user data.
    // Navbar fetches user status on the client side.
    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/hakkimizda' || request.nextUrl.pathname === '/gizlilik-politikasi') {
        return supabaseResponse;
    }

    let user = null
    try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
        if (!error && supabaseUser) {
            user = supabaseUser
        }
    } catch (e) {
        // Ignore auth errors, treat as logged out
    }

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/admin') && user?.email !== 'barannnbozkurttb.b@gmail.com' && user?.email !== 'barannnnbozkurttb.b@gmail.com') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/profil') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return supabaseResponse
}
