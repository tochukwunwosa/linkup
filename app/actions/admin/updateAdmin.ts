"use server";

import { createClient } from "@/lib/supabase/server";
import { AdminFormValues } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

type UpdateAdminResult = { success: true } | { error: string };

export async function updateAdmin(id: string, formData: AdminFormValues):Promise<UpdateAdminResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return {error: "User not authenticated"};

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

  // Remove password if not updating it
  if (!formData.password) {
    delete formData.password;
  }

  const result = await supabase.from("admins").update(formData).eq("id", id);

  if (result.error) {
    console.error("Error updating admin:", result.error);
    throw new Error("Failed to update admin");
  }

  revalidatePath("/admin/dashboard/admins");

  return { success: true };
}
