import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const userType = searchParams.get('user_type')

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Password recovery flow → stuur naar update-password pagina
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`)
      }

      // OAuth flow: sla user_type op als meegegeven
      if (userType && (userType === 'brand' || userType === 'creator')) {
        await supabase
          .from('profiles')
          .update({ user_type: userType })
          .eq('id', data.user.id)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
