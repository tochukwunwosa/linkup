
"use server";

import { z } from "zod";
import { eventSchema } from "@/lib/validations/event";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function createEventAction(formData: z.infer<typeof eventSchema>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "User not authenticated";

  // Step 1: Check if user is an admin
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

  const result = await supabase.from("events").insert({
    ...parsed.data,
    created_by: admin.id,
    start_date: new Date(parsed.data.start_date).toISOString(),
    end_date: parsed.data.end_date
      ? new Date(parsed.data.end_date).toISOString()
      : null,
  });

  if (result.error) {
    console.error("Error inserting event:", result.error);
    throw new Error("Failed to create event");
  }

  revalidatePath("/admin/dashboard/events");

  return { success: true };
}
