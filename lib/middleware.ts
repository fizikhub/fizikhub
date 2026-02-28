import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_EMAILS } from '@/lib/admin'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
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

    // OPTIMIZATION: Skip auth check for public static pages to improve TTFB.
    // These pages are cached/public and don't need server-side user data.
    const publicPaths = ['/', '/hakkimizda', '/gizlilik-politikasi', '/kullanim-sartlari', '/iletisim', '/puanlar-nedir'];
    const publicPrefixes = ['/blog', '/forum', '/sozluk', '/testler', '/simulasyonlar', '/siralamalar', '/deney', '/kitap-inceleme', '/kullanici', '/yazar'];

    const isPublicPage = publicPaths.includes(request.nextUrl.pathname) ||
        publicPrefixes.some(prefix => request.nextUrl.pathname.startsWith(prefix));

    if (isPublicPage) {
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

    // Protected routes — use centralized admin emails
    if (request.nextUrl.pathname.startsWith('/admin') && !ADMIN_EMAILS.includes(user?.email?.toLowerCase() as any)) {
        // Also check role from profile if email doesn't match
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (profile?.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        } else {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/profil') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return supabaseResponse
}
