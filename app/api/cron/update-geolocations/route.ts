import { NextResponse } from "next/server";
import { updateEventGeolocationsCron } from "@/app/actions/cron/updateEventGeolocations";
import { config } from "@/lib/config";

export async function GET(req: Request) {
  // SECURITY: Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${config.security.cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const result = await updateEventGeolocationsCron();
  return NextResponse.json(result);
}
