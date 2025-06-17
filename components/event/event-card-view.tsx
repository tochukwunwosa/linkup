"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, MapPin } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Event } from "@/lib/validations/event"
import { formatDateRange } from "@/lib/utils"

interface EventsCardViewProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: number) => void
}

export function EventsCardView({ events, onEdit, onDelete }: EventsCardViewProps) {
  return (
    <div className="grid gap-4">
      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No events found</div>
      ) : (
        events.map((event) => (
          <Card key={event.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{event.title}</h3>
                <Badge
                  variant={event.publish_status === "Published" ? "default" : "outline"}
                  className={event.publish_status === "Published" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                  {event.publish_status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  {formatDateRange(event.start_date, event.endDate || "")}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Badge variant={event.type === "Online" ? "secondary" : "outline"} className="mt-1">
                    {event.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event</AlertDialogTitle>
                    <AlertDialogDescription>
                      {`Are you sure you want to delete "{event.title}"? This action cannot be undone.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(event.id)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
