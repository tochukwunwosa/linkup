"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Helper function to check admin authorization
async function checkAdminAuth(requiredRole: 'admin' | 'super_admin' = 'admin') {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "User not authenticated", user: null, admin: null };

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single();

  const allowedRoles = requiredRole === 'super_admin' ? ['super_admin'] : ['admin', 'super_admin'];

  if (
    adminError ||
    !admin ||
    admin.deleted_at !== null ||
    !allowedRoles.includes(admin.role)
  ) {
    return { error: "Unauthorized", user, admin: null };
  }

  return { error: null, user, admin };
}

// Soft delete - recoverable
export async function softDeleteEvent(eventId: string, reason?: string) {
  const { error: authError, user, admin } = await checkAdminAuth('admin');
  
  if (authError || !user || !admin) {
    return { error: authError || "Unauthorized" };
  }

  const supabaseService = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Soft delete - this will trigger the log_soft_deleted_event function
  const { error } = await supabaseService
    .from("events")
    .update({ 
      is_deleted: true, 
      deleted_at: new Date().toISOString() 
    })
    .eq("id", eventId);

  if (error) {
    console.error("Failed to soft delete event:", error);
    return { error: "Could not delete event" };
  }

  // Optionally update the reason in deleted_events
  if (reason) {
    await supabaseService
      .from("deleted_events")
      .update({ reason })
      .eq("id", eventId)
      .eq("deletion_type", "soft");
  }

  revalidatePath("/admin/dashboard/events");
  return { success: true, type: "soft" } as const;
}

// Hard delete - permanent, not recoverable
export async function hardDeleteEvent(eventId: string, reason?: string) {
  const { error: authError, user, admin } = await checkAdminAuth('super_admin');
  
  if (authError || !user || !admin) {
    return { error: authError || "Unauthorized" };
  }

  const supabaseService = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Hard delete - this will trigger the log_deleted_event function
  const { error } = await supabaseService
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error("Failed to hard delete event:", error);
    return { error: "Could not delete event" };
  }

  // Optionally update the reason in deleted_events
  if (reason) {
    await supabaseService
      .from("deleted_events")
      .update({ reason })
      .eq("id", eventId)
      .eq("deletion_type", "hard");
  }

  revalidatePath("/admin/dashboard/events");
  return { success: true, type: "hard" } as const;
}

// Restore soft deleted event
export async function restoreEvent(eventId: string) {
  const { error: authError, user, admin } = await checkAdminAuth('admin');
  
  if (authError || !user || !admin) {
    return { error: authError || "Unauthorized" };
  }

  const supabaseService = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if the event exists in deleted_events and is soft deleted
  const { data: deletedEvent, error: fetchError } = await supabaseService
    .from("deleted_events")
    .select("*")
    .eq("id", eventId)
    .eq("deletion_type", "soft")
    .single();

  if (fetchError || !deletedEvent) {
    return { error: "Event not found or cannot be restored" };
  }

  // Restore the event by updating the soft delete flags
  const { error: restoreError } = await supabaseService
    .from("events")
    .update({ 
      is_deleted: false, 
      deleted_at: null 
    })
    .eq("id", eventId);

  if (restoreError) {
    console.error("Failed to restore event:", restoreError);
    return { error: "Could not restore event" };
  }

  // Remove from deleted_events (optional - you might want to keep for audit trail)
  await supabaseService
    .from("deleted_events")
    .delete()
    .eq("id", eventId)
    .eq("deletion_type", "soft");

  revalidatePath("/admin/dashboard/events");
  return { success: true } as const;
}

// Get deleted events (for admin dashboard)
export async function getDeletedEvents() {
  const { error: authError, user, admin } = await checkAdminAuth('super_admin');
  
  if (authError || !user || !admin) {
    return { error: authError || "Unauthorized", data: null };
  }

  const supabaseService = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseService
    .from("deleted_events")
    .select(`
      *,
      deleted_by_admin:admins!deleted_by(name, email)
    `)
    .order("deleted_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch deleted events:", error);
    return { error: "Could not fetch deleted events", data: null };
  }

  return { error: null, data };
}

// Get only restorable events (soft deleted)
export async function getRestorableEvents() {
  const { error: authError, user, admin } = await checkAdminAuth('admin');
  
  if (authError || !user || !admin) {
    return { error: authError || "Unauthorized", data: null };
  }

  const supabaseService = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseService
    .from("deleted_events")
    .select(`
      *,
      deleted_by_admin:admins!deleted_by(name, email)
    `)
    .eq("deletion_type", "soft")
    .order("deleted_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch restorable events:", error);
    return { error: "Could not fetch restorable events", data: null };
  }

  return { error: null, data };
}