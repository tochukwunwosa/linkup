"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { CalendarPlus } from "lucide-react";
import { EventsTable } from "@/components/event/events-table";
import { EventsCardView } from "@/components/event/event-card-view";
import type { Event } from "@/lib/validations/event";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EventForm } from "@/components/event/event-form";
import { getAllEvents } from "@/app/actions/event/getAllEvents";
import { toast } from "sonner";
import { softDeleteEvent } from "@/app/actions/event/deleteEvent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminEventsPage() {
  const isMobile = useIsMobile();

  const [events, setEvents] = useState<Event[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [openDeleteEventDialog, setOpenDeleteEventDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);


  const fetchEvents = useCallback(async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }, []);

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

  const handleOpenDeleteEventDialog = (event: Event) => {
    setEventToDelete(event);
    setOpenDeleteEventDialog(true);
  };


  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      const res = await softDeleteEvent(eventToDelete.id);
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success("Event deleted");
      fetchEvents();
      setOpenDeleteEventDialog(false);
      setEventToDelete(null);
    } catch {
      toast.error("Failed to delete");
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeader title="Events" description="Manage all events" />
        <Button
          onClick={handleCreateEvent}
          className="w-fit bg-primary hover:bg-secondary transition-colors duration-300 ease-in-out"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {isMobile ? (
        <EventsCardView
          events={events}
          onEdit={handleEditEvent}
          onDelete={handleOpenDeleteEventDialog}
        />

      ) : (
        <EventsTable
          events={events}
          onEdit={handleEditEvent}
            onDelete={handleOpenDeleteEventDialog}
        />
      )}

      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="w-[99%] md:w-[85%] h-[90vh] md:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={editingEvent}
            onSubmit={() => {
              setIsDrawerOpen(false);
              fetchEvents();
            }}
            onCancel={() => setIsDrawerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Global AlertDialog for delete confirmation */}
      <AlertDialog
        open={openDeleteEventDialog}
        onOpenChange={(open) => {
          setOpenDeleteEventDialog(open);
          if (!open) setEventToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to tepmorary delete{" "}
              <strong className="text-primary font-semibold">
                {eventToDelete?.title}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}