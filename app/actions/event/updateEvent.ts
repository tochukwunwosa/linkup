"use server";

import { z } from "zod";
import { eventSchema } from "@/lib/validations/event";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { serverGeocodeAddress } from "@/lib/geocode/geocode-server";
import { formatDateToYYYYMMDD } from "@/lib/date-utils";

export async function updateEventAction(
  id: string,
  formData: z.infer<typeof eventSchema>
) {
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

  
    const geo = await serverGeocodeAddress(parsed.data.location);

  const result = await supabase
    .from("events")
    .update({
      ...parsed.data,
      city: geo?.city ?? null,
      country: geo?.country ?? null,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      start_date: formatDateToYYYYMMDD(parsed.data.start_date),
      end_date: parsed.data.end_date
        ? formatDateToYYYYMMDD(parsed.data.end_date)
        : null,
    })
    .eq("id", id);

  if (result.error) {
    console.error("Error updating event:", result.error);
    throw new Error("Failed to update event");
  }

  revalidatePath("/admin/dashboard/events");

  return { success: true };
}
