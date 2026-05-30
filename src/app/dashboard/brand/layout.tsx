import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UserDropdown } from "@/components/ui/user-dropdown"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Bell } from "lucide-react"
import Link from "next/link"

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subscription_tier")
    .eq("id", user.id)
    .single()

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("gelezen", false)

  const initials = (profile?.full_name || user.email || "B").slice(0, 2).toUpperCase()
  const name = profile?.full_name || user.email?.split("@")[0] || "Gebruiker"

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] overflow-x-hidden">
      <DashboardSidebar type="brand" />
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen min-w-0">
        {/* Premium header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 ml-12 lg:ml-0">
            <div className="hidden lg:block h-6 w-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest hidden sm:block">Brand Dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <Link
              href="/dashboard/brand/berichten"
              className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Bell className="h-5 w-5" />
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff0050] rounded-full" />
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            <UserDropdown
              name={name}
              initials={initials}
              tier={profile?.subscription_tier ?? "free"}
              type="brand"
              avatarColor="bg-[#1a0533]"
            />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 w-full max-w-[1400px] mx-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
