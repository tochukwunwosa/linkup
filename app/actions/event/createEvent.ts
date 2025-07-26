"use server";

import { z } from "zod";
import { eventSchema } from "@/lib/validations/event";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { serverGeocodeAddress } from "@/lib/geocode/geocode-server";

export async function createEventAction(formData: z.infer<typeof eventSchema>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "User not authenticated";

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single();

  if (adminError || !admin) {
    console.error("Unauthorized access attempt by user:", user.id);
    return "Unauthorized";
  }

  const parsed = eventSchema.safeParse(formData);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    throw new Error("Invalid event data");
  }

  // 🗺️ Geocode the address
  const geo = await serverGeocodeAddress(parsed.data.location);

  const result = await supabase
    .from("events")
    .insert({
      ...parsed.data,
      created_by: admin.id,
      city: geo?.city ?? null,
      country: geo?.country ?? null,
      lat: geo?.lat ?? null, 
      lng: geo?.lng ?? null, 
      start_date: new Date(parsed.data.start_date).toISOString(),
      end_date: parsed.data.end_date
        ? new Date(parsed.data.end_date).toISOString()
        : null,
    })
    .select();

  if (result.error) {
    console.error("Error inserting event:", result.error);
    throw new Error("Failed to create event");
  }

  revalidatePath("/admin/dashboard/events");

  return { success: true };
}
