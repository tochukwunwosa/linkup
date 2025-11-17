/**
 * Test script to verify admin notification email system
 * Run with: npx tsx scripts/test-admin-notification.ts
 */

// Load environment variables
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { sendAdminNotification, getAdminEmails } from "../lib/email/emailService";
import { createClient } from "@supabase/supabase-js";

async function testAdminNotification() {
  console.log("Testing Admin Notification System\n");

  // 1. Check environment variables
  console.log("1. Checking environment variables...");
  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendKey) {
    console.error("RESEND_API_KEY is not configured");
    return;
  }
  console.log(`RESEND_API_KEY is configured: ${resendKey.substring(0, 10)}...`);

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials are not configured");
    return;
  }
  console.log("Supabase credentials are configured\n");

  // 2. Check for admins in database
  console.log("2. Fetching admin emails from database...");
  const supabase = createClient(supabaseUrl, supabaseKey);

  const adminEmails = await getAdminEmails(supabase);

  if (adminEmails.length === 0) {
    console.error("No admins found in the database");
    return;
  }

  console.log(`Found ${adminEmails.length} admin(s):`);
  adminEmails.forEach((email, index) => {
    console.log(`   ${index + 1}. ${email}`);
  });
  console.log();

  // 3. Test sending email to first admin
  console.log("3. Testing email notification...");
  const testEmail = adminEmails[0];

  const result = await sendAdminNotification({
    eventTitle: "Test Event - Lagos Tech Summit 2025",
    organizerName: "Test Organizer",
    organizerEmail: "test@example.com",
    eventDate: "December 15, 2025",
    eventLocation: "Lagos, Nigeria",
    eventWebsite: "https://example.com",
    trackingId: "EVT-TEST1234",
    submissionUrl: "https://tech-linkup.vercel.app/admin/dashboard/submissions",
    adminEmail: testEmail,
  });

  if (result) {
    console.log(`Test email sent successfully to ${testEmail}`);
    console.log("\n Admin notification system is working correctly!");
  } else {
    console.error("Failed to send test email");
    console.log("Check the error logs above for details");
  }
}

// Run the test
testAdminNotification().catch((error) => {
  console.error("Test failed with error:", error);
  process.exit(1);
});
