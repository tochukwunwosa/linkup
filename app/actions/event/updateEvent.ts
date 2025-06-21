"use server";

import { z } from "zod";
import { eventSchema } from "@/lib/validations/event";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateEventAction(
  id: number,
  formData: z.infer<typeof eventSchema>
) {
  const supabase = await createClient();

  const parsed = eventSchema.safeParse(formData);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    throw new Error("Invalid event data");
  }

  const result = await supabase
    .from("events")
    .update({
      ...parsed.data,
      start_date: new Date(parsed.data.start_date).toISOString(),
      end_date: parsed.data.end_date
        ? new Date(parsed.data.end_date).toISOString()
        : null,
    })
    .eq("id", id);

  if (result.error) {
    console.error("Error updating event:", result.error);
    throw new Error("Failed to update event");
  }

  revalidatePath("/admin/events");

  return { success: true };
}
