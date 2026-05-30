import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChatWindow } from "@/components/messaging/chat-window"
import { MessageSquare } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CreatorBerichtenPage({
  searchParams,
}: {
  searchParams: { match?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: matches } = await supabase
    .from("matches")
    .select(`
      id, status, created_at,
      brands(id, bedrijfsnaam, logo_url),
      messages(id, gelezen, sender_id, created_at, content)
    `)
    .eq("creator_id", user.id)
    .in("status", ["accepted", "pending", "completed"])
    .order("created_at", { ascending: false })

  const allMatches = (matches ?? []) as unknown as Array<{
    id: string
    status: string
    created_at: string
    brands: { id: string; bedrijfsnaam: string; logo_url: string | null } | null
    messages: Array<{ id: string; gelezen: boolean; sender_id: string; created_at: string; content: string }>
  }>

  const selectedMatchId = searchParams.match ?? allMatches[0]?.id
  const selectedMatch = allMatches.find((m) => m.id === selectedMatchId)

  let chatMessages: Array<{ id: string; content: string; sender_id: string; created_at: string; gelezen: boolean }> = []
  if (selectedMatchId) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", selectedMatchId)
      .order("created_at", { ascending: true })
    chatMessages = msgs ?? []
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-0 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Berichten</h1>
          <p className="text-xs text-gray-400 mt-0.5">Communiceer via het platform</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {allMatches.length === 0 && (
            <div className="text-center py-12 px-4">
              <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Nog geen actieve matches</p>
            </div>
          )}
          {allMatches.map((m) => {
            const brand = m.brands
            const unread = m.messages.filter((msg) => !msg.gelezen && msg.sender_id !== user.id).length
            const lastMsg = m.messages.sort((a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
            const isActive = m.id === selectedMatchId
            const initials = (brand?.bedrijfsnaam ?? "?").slice(0, 2).toUpperCase()

            return (
              <a
                key={m.id}
                href={`/dashboard/creator/berichten?match=${m.id}`}
                className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                  isActive ? "bg-red-50 border-l-2 border-l-[#ff0050]" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#ff0050] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {brand?.bedrijfsnaam ?? "Brand"}
                    </p>
                    {unread > 0 && (
                      <span className="bg-[#ff0050] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                        {unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {lastMsg ? lastMsg.content : "Geen berichten nog"}
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedMatch ? (
          <ChatWindow
            matchId={selectedMatchId!}
            currentUserId={user.id}
            otherName={selectedMatch.brands?.bedrijfsnaam ?? "Brand"}
            initialMessages={chatMessages}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Selecteer een conversatie</p>
              <p className="text-sm text-gray-400 mt-1">Kies een brand links om te berichtigen</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
