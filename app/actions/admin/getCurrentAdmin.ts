"use server";

import { createClient } from "@/lib/supabase/server";


export async function getCurrentAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "User not authenticated";

  const { data: admin, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Failed to fetch admin:", error.message);
    return null;
  }

  return admin;
}
