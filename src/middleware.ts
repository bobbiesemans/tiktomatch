import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Pagina's die ingelogde gebruikers WEL mogen bezoeken onder /auth
  const isOnboarding = pathname.startsWith('/auth/onboarding')
  const isCallback   = pathname.startsWith('/auth/callback')
  const isUpdatePw   = pathname.startsWith('/auth/update-password')
  const isVerify     = pathname.startsWith('/auth/verify-email')

  const isAuthPage   = pathname.startsWith('/auth') && !isOnboarding && !isCallback && !isUpdatePw && !isVerify
  const isDashboard  = pathname.startsWith('/dashboard')
  const isProtectedApi = pathname.startsWith('/api') &&
    !pathname.startsWith('/api/webhooks/stripe') &&
    !pathname.startsWith('/api/waitlist')

  // Niet ingelogd → stuur naar login
  if (!user && (isDashboard || isProtectedApi || isOnboarding)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Ingelogd op login/register pagina → stuur naar dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/api/:path*'],
}
