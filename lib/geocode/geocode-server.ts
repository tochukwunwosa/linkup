import axios from "axios";
import { config } from "@/lib/config";

export async function serverGeocodeAddress(
  address: string
): Promise<{ city: string; country: string; lat: number; lng: number } | null> {
  if (!address) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${config.googleMaps.serverKey}`;

    const { data } = await axios.get(url);

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;

    // Extract city and country from address_components
    let city = "";
    let country = "";

    for (const component of result.address_components) {
      if (component.types.includes("locality")) {
        city = component.long_name;
      } else if (component.types.includes("administrative_area_level_2") && !city) {
        // Fallback to administrative area if no locality
        city = component.long_name;
      } else if (component.types.includes("country")) {
        country = component.long_name;
      }
    }

    return { city, country, lat, lng };
  } catch (err) {
    console.error("Server-side geocode error:", err);
    return null;
  }
}
