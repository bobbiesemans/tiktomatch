"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 truncate max-w-32">{link}</span>
      <button
        title="Kopieer link"
        onClick={handleCopy}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-green-500" />
          : <Copy className="h-3.5 w-3.5 text-gray-400" />}
      </button>
    </div>
  )
}
