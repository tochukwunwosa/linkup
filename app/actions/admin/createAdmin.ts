"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminFormValues } from "@/lib/validations/admin";

type CreateAdminResult = { success: true } | { error: string };

export async function createAdmin(
  formData: AdminFormValues
): Promise<CreateAdminResult> {
  // Regular Supabase client (attached to current user session)
  const userClient = await createClient();

  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) return { error: "User not authenticated" };

  // Step 1: Check if current user is a real admin
  const { data: admin, error: adminError } = await userClient
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single();

  if (adminError || !admin) {
    console.error("Unauthorized access attempt by user:", user.id);
    return { error: "Unauthorized" };
  }

  // Step 2: Use service client to create a new Supabase auth user
  const serviceClient = createAdminClient();
  const { data, error } = await serviceClient.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating auth user:", error.message);
    return { error: error.message };
  }

  const { id, email } = data.user;

  // Step 3: Insert new admin into `admins` table
  const { error: insertError } = await serviceClient.from("admins").insert({
    id,
    email,
    name: formData.name,
    role: formData.role,
    invited_by: admin.id,
  });

  if (insertError) {
    console.error("Error inserting into admins table:", insertError.message);

    // Clean up: delete the newly created auth user if DB insert fails
    await serviceClient.auth.admin.deleteUser(id);
    console.warn("🔁 Rolled back Auth user due to DB failure");

    return { error: insertError.message };
  }

  console.log(`${formData.role} added to admins table`);
  return { success: true };
}
