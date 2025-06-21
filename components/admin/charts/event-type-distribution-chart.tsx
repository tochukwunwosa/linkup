"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Event } from "@/lib/validations/event";

interface Props {
  events: Event[];
}

export function EventTypeDistributionChart({ events }: Props) {
  const onlineCount = events.filter((e) => e.type === "Online").length;
  const inPersonCount = events.filter((e) => e.type === "In-person").length;
  const hybridCount = events.filter((e) => e.type === "In-person & Online").length;

  // const total = onlineCount + inPersonCount + hybridCount;

  const data = [
    { name: "Online", value: onlineCount, color: "#4F46E5" },
    { name: "In-person", value: inPersonCount, color: "#F97316" },
    { name: "Hybrid", value: hybridCount, color: "#10B981" },
  ].filter((d) => d.value > 0); // remove 0-value types

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1">
        <ChartContainer
          config={{
            value: {
              label: "Events",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="flex mt-20 justify-center gap-6 py-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
