import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export async function POST(req: NextRequest) {
  // Rate limiting: 20 requests per IP per minute to prevent API abuse
  const clientIp = getClientIp(req);
  const rateLimitResult = rateLimit(`geocode:${clientIp}`, {
    maxRequests: 20,
    windowMs: 60000, // 1 minute
  });

  if (!rateLimitResult.success) {
    const waitTime = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Please try again in ${waitTime} seconds.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": waitTime.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    );
  }

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
