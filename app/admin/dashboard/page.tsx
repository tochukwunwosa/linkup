"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { EventCategoryChart } from "@/components/admin/charts/event-category-chart"
import { EventTypeDistributionChart } from "@/components/admin/charts/event-type-distribution-chart"
import { EventTrendChart } from "@/components/admin/charts/event-trend-chart"
import { RecentEventsActivity } from "@/components/admin/recent-events-activity"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useCallback, useEffect, useState } from "react"
import { getAllActiveEvents } from "@/app/actions/event/getAllActiveEvents"
import { toast } from "sonner"
import { Event } from "@/lib/validations/event"
export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getAllActiveEvents();
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

  const totalEvents = events.length;
  const publishedEvents = events.filter((event) => event.publish_status === "Published").length;
  const onlineEvents = events.filter((event) => event.type === "Online").length;
  const inPersonEvents = events.filter((event) => event.type === "In-person").length;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader title="Dashboard" description="Overview of your events and activities" />
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {/* total events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Events in the platform</p>
          </CardContent>
        </Card>
        {/* published events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Published Events</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{publishedEvents}</div>
            <p className="text-xs text-muted-foreground">Live events</p>
          </CardContent>
        </Card>

        {/* online events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Online Events</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineEvents}</div>
            <p className="text-xs text-muted-foreground">Virtual events</p>
          </CardContent>
        </Card>
        {/* in-person events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">In-person Events</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inPersonEvents}</div>
            <p className="text-xs text-muted-foreground">Physical events</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        {/* overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            {/* event trend */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
                <CardDescription>Event registration trends over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <EventTrendChart events={events} />
              </CardContent>
            </Card>
            {/* event type distribution */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Event Type Distribution</CardTitle>
                <CardDescription>Online vs In-person events</CardDescription>
              </CardHeader>
              <CardContent>
                <EventTypeDistributionChart events={events} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            {/* events by category chart */}
            <Card className=" lg:col-span-4 flex flex-col">
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
                <CardDescription>Distribution of events across categories</CardDescription>
              </CardHeader>
              <CardContent className="">
                <EventCategoryChart events={events} />
              </CardContent>
            </Card>

            {/* recent activity */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest events and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentEventsActivity events={events} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* advanced analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed metrics and insights</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <p className="text-sm text-muted-foreground">Advanced analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
