"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginFormValues } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export async function adminLogin(formData: LoginFormValues) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(formData);
  if (error) return { error: error.message };

  return { success: true };
}

// logout
export async function logoutAdmin() {
  const supabase = await createClient();

  await supabase.auth.signOut(); // Global sign-out (sign out from all device)
  redirect("/admin/login");
}
