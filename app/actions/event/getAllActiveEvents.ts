'use server'

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getAllActiveEvents = cache(async () => {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("admin_events")
    .select("*")
    .gt("end_date", now)
    .order("start_date", { ascending: true }); //Newewst from start date will show first

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }

  return data;
});
