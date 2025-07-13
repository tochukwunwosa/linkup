import { NextResponse } from "next/server";
import { updateEventGeolocationsCron } from "@/app/actions/cron/updateEventGeolocations";

export async function GET() {
  const result = await updateEventGeolocationsCron();
  return NextResponse.json(result);
}
