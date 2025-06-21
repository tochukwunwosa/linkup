"use client"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Event } from "@/lib/validations/event"
import { format } from "date-fns"

interface Props {
  events: Event[]
}

export function EventTrendChart({ events }: Props) {
  // Group events by start_date (formatted as "MMM d", e.g., "May 21")
  const trendMap = new Map<string, number>()

  for (const event of events) {
    const dateKey = format(new Date(event.start_date), "MMM d")
    trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1)
  }

  // Convert to sorted array of { date, registrations }
  const data = Array.from(trendMap.entries())
    .map(([date, count]) => ({ date, registrations: count }))
    .sort((a, b) =>
      new Date(a.date + " 2024").getTime() - new Date(b.date + " 2024").getTime()
    ) // "2024" is placeholder year for sorting

  return (
    <ChartContainer
      config={{
        registrations: {
          label: "Registrations",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="registrations"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
    
  )
}
