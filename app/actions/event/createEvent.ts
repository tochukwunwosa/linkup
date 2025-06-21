
"use server";

import { z } from "zod";
import { eventSchema } from "@/lib/validations/event";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function createEventAction(formData: z.infer<typeof eventSchema>, adminId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const parsed = eventSchema.safeParse(formData);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    throw new Error("Invalid event data");
  }

  const result = await supabase.from("events").insert({
    ...parsed.data,
    created_by: adminId,
    start_date: new Date(parsed.data.start_date).toISOString(),
    end_date: parsed.data.end_date
      ? new Date(parsed.data.end_date).toISOString()
      : null,
  });

  if (result.error) {
    console.error("Error inserting event:", result.error);
    throw new Error("Failed to create event");
  }

  revalidatePath("/admin/events");

  return { success: true };
}
