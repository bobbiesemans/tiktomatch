import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  if (!profile?.user_type) redirect('/auth/login')

  // Stuur naar het juiste dashboard op basis van user type
  if (profile.user_type === 'brand') {
    // Check of onboarding gedaan is
    const { data: brand } = await supabase.from('brands').select('id').eq('id', user.id).maybeSingle()
    if (!brand) redirect('/auth/onboarding/brand')
    redirect('/dashboard/brand')
  } else {
    // Creator
    const { data: creator } = await supabase.from('creators').select('id').eq('id', user.id).maybeSingle()
    if (!creator) redirect('/auth/onboarding/creator')
    redirect('/dashboard/creator')
  }
}
