import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-purple-600">TikToMatch</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            profile.user_type === 'brand'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-pink-100 text-pink-700'
          }`}>
            {profile.user_type === 'brand' ? '🏢 Brand' : '🎬 Creator'}
          </span>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-gray-500 hover:text-gray-900">Uitloggen</button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welkom terug! 👋
        </h1>
        <p className="text-gray-500 mb-8">
          {profile.user_type === 'brand'
            ? 'Vind de perfecte TikTok creators voor jouw campagne.'
            : 'Ontdek brands die bij jou passen.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.user_type === 'brand' && (
            <>
              <DashboardCard
                href="/dashboard/profiel"
                icon="🏢"
                title="Brand profiel"
                description="Beheer je bedrijfsgegevens en campagne-instellingen"
              />
              <DashboardCard
                href="/dashboard/matches"
                icon="✨"
                title="AI Matches"
                description="Bekijk je AI-gegenereerde creator matches met scores"
              />
              <DashboardCard
                href="/dashboard/campagnes"
                icon="📊"
                title="Campagnes"
                description="Overzicht van actieve en voltooide samenwerkingen"
              />
            </>
          )}

          {profile.user_type === 'creator' && (
            <>
              <DashboardCard
                href="/dashboard/profiel"
                icon="🎬"
                title="Creator profiel"
                description="Beheer je TikTok statistieken en niche"
              />
              <DashboardCard
                href="/dashboard/matches"
                icon="✨"
                title="Brand matches"
                description="Brands die interesse hebben in samenwerking"
              />
              <DashboardCard
                href="/dashboard/inkomsten"
                icon="💰"
                title="Inkomsten"
                description="Overzicht van je GMV en verdiensten"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-purple-200 transition group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
