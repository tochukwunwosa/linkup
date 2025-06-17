"use client"

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Tech", value: 40 },
  { name: "Design", value: 20 },
  { name: "Startup", value: 35 },
  { name: "Marketing", value: 25 },
  { name: "AI", value: 30 },
]

export function EventCategoryChart() {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Events",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-full flex flex-col min-h-[280px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
          barCategoryGap="15%"
        >
          <XAxis
            dataKey="name"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
            barSize={36} // makes bars chunkier
            className="transition-all duration-300 hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
