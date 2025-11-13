"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginFormValues } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";

export async function adminLogin(formData: LoginFormValues) {
  // Rate limiting: 5 login attempts per email per minute
  const rateLimitResult = rateLimit(`login:${formData.email}`, {
    maxRequests: 5,
    windowMs: 60000, // 1 minute
  });

  if (!rateLimitResult.success) {
    const waitTime = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return {
      error: `Too many login attempts. Please try again in ${waitTime} seconds.`,
    };
  }

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
