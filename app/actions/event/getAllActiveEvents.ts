'use server'

import { createClient } from "@/lib/supabase/server";

export async function getAllActiveEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .is("deleted_at", null);

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }

  return data;
}
