import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { serverGeocodeAddress } from "@/lib/geocode/geocode-server";
import { config } from "@/lib/config";

export async function GET(req: Request) {
  // SECURITY: Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${config.security.cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

  // Fetch events missing lat or lng, limit to 50 per batch (adjust as needed)
  const { data: events, error } = await supabase
    .from("events")
    .select("id, location")
    .or("lat.is.null,lng.is.null")
    .limit(50);

  if (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }

  if (!events || events.length === 0) {
    return NextResponse.json({ message: "No events need geocoding" });
  }

  let updatedCount = 0;
  const failedEvents: string[] = [];

  for (const event of events) {
    if (!event.location) {
      console.log(`Skipping event ${event.id} due to missing location`);
      continue;
    }

    try {
      const geo = await serverGeocodeAddress(event.location);
      if (geo?.lat && geo?.lng) {
        const { error: updateError } = await supabase
          .from("events")
          .update({ lat: geo.lat, lng: geo.lng })
          .eq("id", event.id);

        if (updateError) {
          console.error(`Failed to update event ${event.id}:`, updateError);
          failedEvents.push(event.id);
        } else {
          updatedCount++;
          console.log(`Updated event ${event.id} with lat/lng.`);
        }
      } else {
        console.log(`No coordinates found for event ${event.id}`);
        failedEvents.push(event.id);
      }
    } catch (err) {
      console.error(`Error geocoding event ${event.id}:`, err);
      failedEvents.push(event.id);
    }
  }

  return NextResponse.json({
    message: `Processed ${events.length} events`,
    updated: updatedCount,
    failed: failedEvents,
  });
}
