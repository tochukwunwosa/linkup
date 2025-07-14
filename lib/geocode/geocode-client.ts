const geocodeCache = new Map<string, { city: string; country: string }>();

export async function geocodeAddress(
  address: string
): Promise<{ city: string; country: string } | null> {
  if (!address) return null;

  const cacheKey = `address:${address}`;
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey)!;

  try {
    const res = await fetch("/api/geocode", {
      method: "POST",
      body: JSON.stringify({ address }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Geocode Address Error:", await res.text());
      return null;
    }

    const data = await res.json();
    const result = { city: data.city, country: data.country };
    geocodeCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error("Client geocode error:", err);
    return null;
  }
}

export async function reverseGeocodeLatLng(
  lat: number,
  lng: number
): Promise<{ city: string; country: string } | null> {
  const cacheKey = `latlng:${lat},${lng}`;
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey)!;

  try {
    const res = await fetch("/api/geocode", {
      method: "POST",
      body: JSON.stringify({ lat, lng }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Reverse Geocode Error:", await res.text());
      return null;
    }

    const data = await res.json();
    const result = { city: data.city, country: data.country };
    geocodeCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error("Client reverse geocode error:", err);
    return null;
  }
}
