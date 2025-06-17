"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for event registrations over time
const data = [
  { date: "May 1", registrations: 10 },
  { date: "May 5", registrations: 15 },
  { date: "May 10", registrations: 12 },
  { date: "May 15", registrations: 25 },
  { date: "May 20", registrations: 18 },
  { date: "May 25", registrations: 30 },
  { date: "May 30", registrations: 35 },
]

export function EventTrendChart() {
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
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
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
