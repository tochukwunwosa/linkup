# Location-Based Event Sorting

This document explains how the location-based event sorting feature works in Tech Linkup.

## Overview

When a user visits the website, they are asked for location permission. If granted, events are automatically sorted by proximity to the user's location, showing the most relevant events first.

## How It Works

### 1. Location Permission Flow

1. **User visits website** → `UserLocationProvider` component is rendered
2. **Modal appears** → User is prompted to allow or deny location access
3. **User grants permission** → Browser's Geolocation API gets coordinates
4. **Reverse geocoding** → Coordinates are converted to city/country via Google Maps API
5. **Location stored** → User location is saved in `EventContext`
6. **Events refresh** → Events are re-fetched and sorted by proximity

### 2. Event Sorting Logic

Events are sorted into 4 groups (in order of priority):

1. **Same City** (🏙️) - Events in the user's city
2. **Same Country** (🇳🇬) - Events in the user's country
3. **Nearby** (📍) - Events within 1000 km radius
4. **Others** (🌍) - All other events

Within each group, events are sorted by date (earliest first).

### 3. Technical Implementation

**Components:**
- `components/location/UserLocationProvider.tsx` - Handles permission & geocoding
- `context/EventContext.tsx` - Stores user location state
- `hooks/useInfinteScrollEvent.ts` - Fetches events with location data
- `app/actions/event/getPaginatedFilteredEvents.ts` - Sorts events by proximity

**API Flow:**
```
User grants permission
  ↓
Browser Geolocation API (lat/lng)
  ↓
Google Maps Reverse Geocoding (city/country)
  ↓
EventContext.userLocation
  ↓
useInfiniteScrollEvents hook
  ↓
/api/events?lat=X&lng=Y&userCity=...&userCountry=...
  ↓
getPaginatedFilteredEvents (sorts by proximity)
  ↓
Sorted events displayed
```

## Debugging

The feature includes console logs to help debug:

```
📍 Got user coordinates: { latitude: X, longitude: Y }
🗺️ Reverse geocode result: { city: "Lagos", country: "Nigeria" }
✅ Setting user location: { city: "Lagos", country: "Nigeria", lat: X, lng: Y }
🌍 User location detected, re-sorting events by proximity: {...}
📍 Sorting events by user proximity: {...}
🎯 Events sorted by proximity: X in city, Y in country, Z nearby, W others
```

Open browser DevTools Console to see these logs.

## Testing

### Test 1: Allow Location Permission

1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Click "Allow" on location modal
4. Check console for logs
5. Verify events are sorted by location

### Test 2: Deny Location Permission

1. Clear localStorage
2. Refresh page
3. Click "Deny" on location modal
4. Events should show in default order (by date)

### Test 3: Change Location (Manual)

Open DevTools Console and run:

```javascript
// Simulate being in Lagos, Nigeria
window.localStorage.clear();
window.location.reload();

// After page loads, manually set location
// (Note: This won't trigger the geolocation flow, just for testing)
```

### Test 4: Check Event Distances

```javascript
// Calculate distance between user and event
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Example: Distance between Lagos and Abuja
haversineDistance(6.5244, 3.3792, 9.0765, 7.3986); // ~478 km
```

## User Experience

### Success Toast
When location is detected, a success toast appears:
```
✓ Location detected: Lagos, Nigeria
```

### Error Handling

**iOS Safari Issues:**
- Special error message for iOS Safari users
- Provides instructions to enable location in Settings

**Permission Denied:**
- Toast error message
- Events show in default order

### Persistence

Location permission choice is saved in `localStorage`:
```javascript
localStorage.getItem("location-permission-handled") // "true"
```

To reset and show the modal again:
```javascript
localStorage.removeItem("location-permission-handled");
```

## Requirements

1. **HTTPS Required** - Geolocation API only works on secure origins
2. **Google Maps API** - `GOOGLE_MAPS_SERVER_KEY` must be configured
3. **Event Coordinates** - Events must have `lat` and `lng` in database

## Known Limitations

1. **Initial Load** - Events load before location is detected, then re-sort
2. **Precision** - City/country detection depends on Google Maps data quality
3. **Rate Limits** - Google Maps API has usage limits
4. **No Offline Support** - Requires internet for reverse geocoding

## Future Enhancements

- [ ] Show distance badges on event cards
- [ ] Add "Near You" section to highlight local events
- [ ] Cache user location for faster subsequent visits
- [ ] Add manual location input as fallback
- [ ] Show location indicator in UI (e.g., "Showing events near Lagos")

## Troubleshooting

### Events not sorted by location

**Check:**
1. ✅ Location permission was granted
2. ✅ Console shows location detection logs
3. ✅ Events have `lat/lng` in database
4. ✅ Google Maps API key is configured
5. ✅ Not in admin routes (location only works on public pages)

**Debug:**
```javascript
// Check user location in context
// Open React DevTools → Components → EventProvider → hooks → userLocation
```

### Reverse geocoding fails

**Check:**
1. ✅ Google Maps API key is valid
2. ✅ Geocoding API is enabled in Google Cloud Console
3. ✅ API key has no domain restrictions blocking the request
4. ✅ Check browser console for API errors

### Modal doesn't appear

**Check:**
```javascript
localStorage.getItem("location-permission-handled")
// If "true", modal won't show again. Clear it to reset.
```

## Code References

- Location detection: `components/location/UserLocationProvider.tsx:24-68`
- Sorting logic: `app/actions/event/getPaginatedFilteredEvents.ts:134-205`
- Hook integration: `hooks/useInfinteScrollEvent.ts:44-66`
- API endpoint: `app/api/events/route.ts:21-32`
