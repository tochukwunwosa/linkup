"use server";

import { createClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";

export async function updateEventGeolocationsCron() {
  const supabase = await createClient();

  // 1. Fetch events missing city/country
  const { data: events, error } = await supabase
    .from("events")
    .select("id, location")
    .or("city.is.null,country.is.null");

  if (error) {
    console.error("Failed to fetch events for geolocation:", error);
    return { success: false };
  }

  if (!events || events.length === 0) {
    console.log("No events need geolocation update.");
    return { success: true, message: "Nothing to update" };
  }

  console.log(`Found ${events.length} events to update`);

  for (const event of events) {
    try {
      const geo = await geocodeAddress(event.location);

      if (!geo?.city && !geo?.country) continue;

      const { error: updateError } = await supabase
        .from("events")
        .update({
          city: geo.city,
          country: geo.country,
        })
        .eq("id", event.id);

      if (updateError) {
        console.error(`Failed to update event ${event.id}`, updateError);
      } else {
        console.log(`Updated event ${event.id}:`, geo);
      }
    } catch (err) {
      console.error(`Error geocoding event ${event.id}:`, err);
    }
  }

  return { success: true };
}
