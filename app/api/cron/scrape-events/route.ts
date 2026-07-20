import { NextResponse } from "next/server";
import { scrapeEventsCron } from "@/app/actions/cron/scrapeEvents";
import { config } from "@/lib/config";

// Scraping + parsing several sources can run close to Vercel's function
// timeout; set the max Node.js allows on Hobby so a slow source doesn't
// get cut off mid-run.
export const maxDuration = 60;

export async function GET(req: Request) {
  // SECURITY: Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${config.security.cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const result = await scrapeEventsCron();
  return NextResponse.json(result);
}
