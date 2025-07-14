import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export async function POST(req: NextRequest) {
  const { lat, lng, address } = await req.json();

  if (!OPENCAGE_API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  if (address) {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${OPENCAGE_API_KEY}&language=en`;

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
      console.error("Geocoding (address) error:", err);
      return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
    }
  }

  if (lat && lng) {
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
      console.error("Geocoding (latlng) error:", err);
      return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: "Missing address or lat/lng" },
    { status: 400 }
  );
}
