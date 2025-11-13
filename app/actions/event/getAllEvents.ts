'use server'

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getAllEvents = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_events")
    .select("*")
    .order("created_at", { ascending: false }); // Newest events first

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }

  return data;
});
