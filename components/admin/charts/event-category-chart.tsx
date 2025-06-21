"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Event } from "@/lib/validations/event";

interface Props {
  events: Event[];
}

const colors = ["#4F46E5", "#F59E0B", "#10B981", "#EF4444", "#6366F1"];

export function EventCategoryChart({ events }: Props) {
  const categories = ["Tech", "Design", "Startup", "Marketing", "AI", "Web"];

  const data = categories.map((category) => ({
    name: category,
    value: events.filter((e) => e.category === category).length,
  })).filter(d => d.value > 0); // remove empty ones

  return (
    <ChartContainer
      config={{
        value: {
          label: "Events",
          color: "var(--primary)",
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
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
