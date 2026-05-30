"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendMessage } from "@/app/actions/messages"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  gelezen: boolean
}

interface Props {
  matchId: string
  currentUserId: string
  otherName: string
  initialMessages: Message[]
}

export function ChatWindow({ matchId, currentUserId, otherName, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [matchId, supabase])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    const content = input.trim()
    setInput("")

    // Optimistic update
    const optimistic: Message = {
      id: crypto.randomUUID(),
      content,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      gelezen: false,
    }
    setMessages((prev) => [...prev, optimistic])

    startTransition(async () => {
      await sendMessage(matchId, content)
    })
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })
  }

  function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString("nl-BE", { day: "numeric", month: "long" })
  }

  // Groepeer berichten per dag
  const grouped: { date: string; messages: Message[] }[] = []
  messages.forEach((m) => {
    const d = new Date(m.created_at).toDateString()
    const last = grouped[grouped.length - 1]
    if (last?.date === d) last.messages.push(m)
    else grouped.push({ date: d, messages: [m] })
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <p className="text-sm font-semibold text-gray-900">{otherName}</p>
        <p className="text-xs text-gray-400">Via TikToMatch platform</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">Geen berichten nog. Stuur het eerste bericht!</p>
            <p className="text-xs text-gray-300 mt-1">Alle communicatie verloopt via dit platform.</p>
          </div>
        )}

        {grouped.map(({ date, messages: dayMsgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">{formatDate(dayMsgs[0].created_at)}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-2">
              {dayMsgs.map((msg) => {
                const isMine = msg.sender_id === currentUserId
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? "bg-[#ff0050] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? "text-white/60" : "text-gray-400"}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Typ een bericht..."
          className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ff0050]/30 focus:border-[#ff0050]"
          maxLength={2000}
        />
        <Button
          type="submit"
          size="sm"
          className="bg-[#ff0050] hover:bg-[#ff337a] px-4"
          disabled={!input.trim() || isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
