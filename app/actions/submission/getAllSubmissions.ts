"use server";

import { createClient } from "@/lib/supabase/server";
import type { EventSubmission } from "@/lib/validations/event";

export async function getAllSubmissions(status?: "pending" | "approved" | "rejected") {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("id", user.id)
      .single();

    if (adminError || !admin) {
      console.error("Unauthorized access attempt by user:", user.id);
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Build query
    let query = supabase
      .from("event_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq("submission_status", status);
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error("Error fetching submissions:", error);
      return {
        success: false,
        error: "Failed to fetch submissions",
      };
    }

    return {
      success: true,
      submissions: submissions as EventSubmission[],
    };
  } catch (error) {
    console.error("Unexpected error in getAllSubmissions:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
