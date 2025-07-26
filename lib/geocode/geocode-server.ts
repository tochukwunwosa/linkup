import axios from "axios";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export async function serverGeocodeAddress(
  address: string
): Promise<{ city: string; country: string; lat: number; lng: number } | null> {
  if (!address) return null;
  if (!OPENCAGE_API_KEY) throw new Error("Missing OpenCage API key");

  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${OPENCAGE_API_KEY}&language=en`;

    const { data } = await axios.get(url);

    const result = data.results[0];
    if (!result) return null;

    const components = result.components || {};
    const geometry = result.geometry || {};

    const city =
      components.city ||
      components.town ||
      components.village ||
      components.hamlet ||
      "";
    const country = components.country || "";
    const lat = geometry.lat;
    const lng = geometry.lng;

    return { city, country, lat, lng };
  } catch (err) {
    console.error("Server-side geocode error:", err);
    return null;
  }
}
