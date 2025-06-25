import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getAllActiveEvents = cache(async () => {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .is("deleted_at", null)
    .gt("end_date", now)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }

  return data;
});
