import axios from "axios";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export async function serverGeocodeAddress(
  address: string
): Promise<{ city: string; country: string } | null> {
  if (!address) return null;
  if (!OPENCAGE_API_KEY) throw new Error("Missing OpenCage API key");

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

    return { city, country };
  } catch (err) {
    console.error("Server-side geocode error:", err);
    return null;
  }
}
