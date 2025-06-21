"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarPlus } from "lucide-react";
import { EventsTable } from "@/components/event/events-table";
import { EventsCardView } from "@/components/event/event-card-view";
import type { Event } from "@/lib/validations/event";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EventForm } from "@/components/event/event-form";
import { useAdmin } from "@/components/context/AdminContext";
import { getAllActiveEvents } from "@/app/actions/event/getAllActiveEvents";
import { toast } from "sonner";

export default function AdminEventsPage() {
  const admin = useAdmin();
  const isMobile = useIsMobile();

  const [events, setEvents] = useState<Event[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getAllActiveEvents();
      setEvents(data)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }, [])

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsDrawerOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsDrawerOpen(true);
  };

  const handleDeleteEvent = (id: number) => {
    console.log(`Delete event with ID: ${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeader title="Events" description="Manage all events" />
        <Button onClick={handleCreateEvent} className="bg-primary hover:bg-accent">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {isMobile ? (
        <EventsCardView events={events} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
      ) : (
        <EventsTable events={events} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
      )}

      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="w-[95%] md:w-[75%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={editingEvent}
            onSubmit={() => {
              setIsDrawerOpen(false);
              fetchEvents(); // refetch event
            }}

            onCancel={() => setIsDrawerOpen(false)}
            adminId={admin.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
