import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { config } from "@/lib/config";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleGeocodeResult {
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}


// Helper function to extract city and country from address components
function extractLocationFromComponents(components: AddressComponent[]): { city: string; country: string } {
  let city = "";
  let country = "";

  for (const component of components) {
    if (component.types.includes("locality")) {
      city = component.long_name;
    } else if (component.types.includes("administrative_area_level_2") && !city) {
      city = component.long_name;
    } else if (component.types.includes("country")) {
      country = component.long_name;
    }
  }

  return { city, country };
}

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

  const { lat, lng, address, autocomplete } = await req.json();

  if (address) {
    try {
      // If autocomplete is requested, use Geocoding API with partial matching
      if (autocomplete) {
        // Use Geocoding API for autocomplete-like functionality
        // This doesn't require Places API and is simpler
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${config.googleMaps.serverKey}`;

        const { data } = await axios.get(geocodeUrl);

        if (data.status === "REQUEST_DENIED") {
          console.error("Google Maps API error:", data.error_message || "REQUEST_DENIED - Check API key and enabled APIs");
          return NextResponse.json({
            suggestions: [],
            error: "Geocoding service unavailable"
          });
        }

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
          console.error("Geocoding error:", data.status, data.error_message);
          return NextResponse.json({ suggestions: [] });
        }

        // Return up to 5 results
        const suggestions = (data.results || []).slice(0, 5).map((result: GoogleGeocodeResult) => {
          const { lat, lng } = result.geometry.location;
          const { city, country } = extractLocationFromComponents(result.address_components);

          return {
            name: result.formatted_address,
            lat,
            lng,
            city,
            country,
          };
        });

        return NextResponse.json({ suggestions });
      }

      // Single result for non-autocomplete requests (forward geocoding)
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${config.googleMaps.serverKey}`;

      const { data } = await axios.get(geocodeUrl);

      if (data.status === "REQUEST_DENIED") {
        console.error("Google Maps API error:", data.error_message || "REQUEST_DENIED - Check API key and enabled APIs");
        return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 503 });
      }

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        return NextResponse.json({ city: "", country: "" });
      }

      const { city, country } = extractLocationFromComponents(data.results[0].address_components);

      return NextResponse.json({ city, country });
    } catch (err) {
      console.error("Geocoding (address) error:", err);
      return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
    }
  }

  if (lat && lng) {
    try {
      // Reverse geocoding
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.googleMaps.serverKey}`;
      const { data } = await axios.get(url);

      if (data.status === "REQUEST_DENIED") {
        console.error("Google Maps API error:", data.error_message || "REQUEST_DENIED - Check API key and enabled APIs");
        return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 503 });
      }

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        return NextResponse.json({ city: "", country: "" });
      }

      const { city, country } = extractLocationFromComponents(data.results[0].address_components);

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
