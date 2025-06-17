"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { EventForm } from "@/components/event/event-form"
import { mockEvents } from "@/lib/mock-data"
import { CalendarPlus } from "lucide-react"
import { EventsTable } from "@/components/event/events-table"
import { EventsCardView } from "@/components/event/event-card-view"
import type { Event } from "@/lib/validations/event"
import { useIsMobile } from "@/hooks/use-mobile"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function AdminEventsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const isMobile = useIsMobile()

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setIsDrawerOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsDrawerOpen(true)
  }

  const handleDeleteEvent = (id: number) => {
    // In a real app, this would call an API to delete the event
    console.log(`Delete event with ID: ${id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeader title="Events" description="Manage all events" />
        <Button onClick={handleCreateEvent} className="bg-primary hover:bg-accentent">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {isMobile ? (
        <EventsCardView events={mockEvents} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
      ) : (
          <EventsTable events={mockEvents} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
      )}

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <DrawerTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto">
            <EventForm
              initialData={editingEvent}
              onSubmit={() => setIsDrawerOpen(false)}
              onCancel={() => setIsDrawerOpen(false)}
            />
          </div>
          <DrawerFooter className="pt-2">{/* Footer content if needed */}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
