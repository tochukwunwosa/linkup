"use server";

import { z } from "zod";
import { eventSchema } from "@/lib/validations/event";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { serverGeocodeAddress } from "@/lib/geocode/geocode-server";
import { formatDateToYYYYMMDD } from "@/lib/date-utils";
import { buildEventSlugBase, generateUniqueEventSlug } from "@/lib/slug";

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

  const slugBase = buildEventSlugBase(parsed.data.title, geo?.city ?? undefined, parsed.data.location);
  const slug = await generateUniqueEventSlug(supabase, slugBase);

  const result = await supabase
    .from("events")
    .insert({
      ...parsed.data,
      slug,
      created_by: admin.id,
      city: geo?.city ?? null,
      country: geo?.country ?? null,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      start_date: formatDateToYYYYMMDD(parsed.data.start_date),
      end_date: parsed.data.end_date
        ? formatDateToYYYYMMDD(parsed.data.end_date)
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
