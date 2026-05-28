import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Bell, ChevronDown } from "lucide-react"

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("full_name, subscription_tier").eq("id", user.id).single()

  const initials = (profile?.full_name || user.email || "B").slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar type="brand" />
      <div className="flex-1 ml-60 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 transition">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#1a0533] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700">{profile?.full_name || "Gebruiker"}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
