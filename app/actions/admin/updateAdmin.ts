"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFormValues } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

type UpdateAdminResult = { success: true } | { error: string };

export async function updateAdmin(
  id: string,
  formData: AdminFormValues,
  currentPassword?: string
): Promise<UpdateAdminResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "User not authenticated" };

  // Check if user is super admin
  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single();

  if (adminError || !admin || admin.role !== "super_admin") {
    console.error("Unauthorized access attempt by user:", user.id);
    return { error: "Unauthorized" };
  }

  // SECURITY: If updating own password, require re-authentication
  const isUpdatingOwnAccount = id === user.id;
  const isUpdatingPassword = formData.password && formData.password.length > 0;

  if (isUpdatingOwnAccount && isUpdatingPassword) {
    if (!currentPassword) {
      return {
        error: "Current password is required to change your password",
      };
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: admin.email,
      password: currentPassword,
    });

    if (verifyError) {
      return {
        error: "Current password is incorrect",
      };
    }
  }

  // Update password in Supabase Auth if provided
  if (isUpdatingPassword) {
    const adminClient = createAdminClient();
    const { error: passwordError } = await adminClient.auth.admin.updateUserById(
      id,
      { password: formData.password }
    );

    if (passwordError) {
      console.error("Error updating password:", passwordError);
      return { error: "Failed to update password" };
    }
  }

  // Remove password from form data before updating admins table
  const { password: _password, ...updateData } = formData;

  // Update admin metadata in admins table
  const result = await supabase.from("admins").update(updateData).eq("id", id);

  if (result.error) {
    console.error("Error updating admin:", result.error);
    return { error: "Failed to update admin" };
  }

  revalidatePath("/admin/dashboard/admins");

  return { success: true };
}
