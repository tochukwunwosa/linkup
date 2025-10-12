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

const colors = ["#4F46E5", "#F59E0B", "#10B981", "#EF4444", "#6366F1", "#8B5CF6", "#EC4899", "#06B6D4"];

export function EventCategoryChart({ events }: Props) {
  const categoryCount: Record<string, number> = {};

  events.forEach((event) => {
    if (Array.isArray(event.category)) {
      event.category.forEach((cat) => {
        const key = cat.trim();
        categoryCount[key] = (categoryCount[key] || 0) + 1;
      });
    } else if (typeof event.category === "string") {
      const key = event.category;
      categoryCount[key] = (categoryCount[key] || 0) + 1;
    }
  });

  // Convert to array for Recharts
  const data = Object.entries(categoryCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

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
      <ResponsiveContainer width="100%" height="100%" >
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
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
