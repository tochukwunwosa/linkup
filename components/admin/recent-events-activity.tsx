"use client"

import { mockEvents } from "@/lib/mock-data"
import { formatDateRange } from "@/lib/utils"

export function RecentEventsActivity() {
  // Sort events by most recent (using mock data)
  const recentEvents = [...mockEvents]
    .sort((a, b) => {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    })
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {recentEvents.map((event) => (
        <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
          <div
            className={`w-2 h-10 rounded-full ${event.publish_status === "Published" ? "bg-green-500" : "bg-amber-500"}`}
          ></div>
          <div className="flex-1">
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDateRange(event.start_date, event.endDate || "")} • {event.location}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">{event.publish_status}</div>
        </div>
      ))}
    </div>
  )
}
