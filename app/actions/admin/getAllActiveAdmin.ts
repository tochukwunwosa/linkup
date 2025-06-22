"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllActiveAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, return empty array
  if (!user) {
    console.warn("User not authenticated");
    return [];
  }

  const { data: admins, error } = await supabase
    .from("admins")
    .select("*")
    .is("deleted_at", null); // ignore soft-deleted admins

  if (error) {
    console.error("Failed to fetch admins:", error.message);
    return [];
  }

  return admins ?? [];
}
