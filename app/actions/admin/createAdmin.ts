import { createClient } from "@/lib/supabase/server";
import { Admin } from "@/types";

export async function createSuperAdmin(formData: Admin) {
  const supabase = await createClient();

  // 1. Create user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating auth user:", error.message);
    return { error: error.message };
  }

  const { id, email } = data.user;
  console.log("Auth user created:", id);

  // 2. Insert into admins table
  const { error: insertError } = await supabase.from("admins").insert({
    id,
    email,
    name: formData.name,
    role: formData.role || "admin", // fallback if role not provided
  });

  if (insertError) {
    console.error("Error inserting into admins table:", insertError.message);

    // Optional: Clean up Auth user if admins insert fails
    await supabase.auth.admin.deleteUser(id);
    console.warn("Rolled back Auth user due to DB failure");

    return { error: insertError.message };
  }

  console.log(`${formData.role} added to admins table`);
  return { success: true };
}
