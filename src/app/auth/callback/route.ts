import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const userType = searchParams.get('user_type')

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Als user_type meegegeven via OAuth redirect, sla op in profile
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
