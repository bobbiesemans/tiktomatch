"use client"

import { AreaChart } from "@tremor/react"
import { TrendingUp } from "lucide-react"

interface WeeklyDataPoint {
  datum: string
  verwacht: number
  daadwerkelijk: number
}

interface Props {
  data: WeeklyDataPoint[]
}

export function EarningsChart({ data }: Props) {
  const hasData = data.some((d) => d.verwacht > 0 || d.daadwerkelijk > 0)

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-gray-400">
        <TrendingUp className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm font-medium">Nog geen inkomsten data</p>
        <p className="text-xs mt-1">Begin je eerste campagne om hier statistieken te zien.</p>
      </div>
    )
  }

  return (
    <AreaChart
      className="h-72"
      data={data}
      index="datum"
      categories={["verwacht", "daadwerkelijk"]}
      colors={["indigo", "rose"]}
      valueFormatter={(n: number) => "€" + n.toLocaleString("nl-BE")}
      showLegend
      showGridLines
      showAnimation
    />
  )
}
