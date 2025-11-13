import { NextResponse } from "next/server";
import { updateEventGeolocationsCron } from "@/app/actions/cron/updateEventGeolocations";

export async function GET(req: Request) {
  // SECURITY: Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: "Cron secret not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const result = await updateEventGeolocationsCron();
  return NextResponse.json(result);
}
