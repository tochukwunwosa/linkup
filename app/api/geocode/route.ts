import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export async function POST(req: NextRequest) {
  const { lat, lng } = await req.json();

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  if (!OPENCAGE_API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&language=en`;
    const { data } = await axios.get(url);

    const components = data.results[0]?.components || {};
    const city =
      components.city ||
      components.town ||
      components.village ||
      components.hamlet ||
      "";
    const country = components.country || "";

    return NextResponse.json({ city, country });
  } catch (err) {
    if (err instanceof Error) {
      console.error("OpenCage error:", err.message);
    } else {
      console.error("OpenCage error:", err);
    }
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
