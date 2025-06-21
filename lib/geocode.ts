import axios from "axios";

// In-memory cache for geocoding results
const geocodeCache = new Map<string, { city: string; country: string }>();

// Reverse geocode lat/lng to city/country using Nominatim
export async function reverseGeocodeLatLng(
  lat: number,
  lng: number
): Promise<{ city: string; country: string } | null> {
  const cacheKey = `latlng:${lat},${lng}`;
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey)!;

  // OpenStreetMap Nominatim
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const { data } = await axios.get(url, {
      headers: { "Accept-Language": "en" },
    });
    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.hamlet ||
      "";
    const country = data.address.country || "";
    const result = { city, country };
    geocodeCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.log(error)
    return null;
  }

  // Google Maps Geocoding API (commented out)
  /*
  const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const { data } = await axios.get(url);
  // ...parse data for city/country
  */
}

// Geocode address to city/country using Nominatim
export async function geocodeAddress(
  address: string
): Promise<{ city: string; country: string } | null> {
  const cacheKey = `address:${address}`;
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey)!;

  // OpenStreetMap Nominatim
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  try {
    const { data } = await axios.get(url, {
      headers: { "Accept-Language": "en" },
    });
    if (!data || !data[0]) return null;
    const lat = data[0].lat;
    const lon = data[0].lon;
    // Use reverse geocode to get city/country
    return await reverseGeocodeLatLng(Number(lat), Number(lon));
  } catch (error) {
    console.log(error);
    return null;
  }

  // Google Maps Geocoding API (commented out)
  /*
  const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  const { data } = await axios.get(url);
  // ...parse data for city/country
  */
}
