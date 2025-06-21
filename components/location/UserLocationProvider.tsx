"use client";

import { useEffect, useState } from "react";
import { useEventContext } from "@/components/context/EventContext";
import { reverseGeocodeLatLng } from "@/lib/geocode";
import LocationPermissionModal from "./LocationPermissionModal";
import { toast } from "sonner";

export default function UserLocationProvider() {
  const { setUserLocation } = useEventContext();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Only show modal if not previously denied
    const denied = localStorage.getItem("location-denied");
    if (!denied) setModalOpen(true);
  }, []);

  const handleAllow = () => {
    setModalOpen(false);
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use Nominatim for reverse geocoding
        const geo = await reverseGeocodeLatLng(latitude, longitude);
        if (geo) {
          setUserLocation({ city: geo.city, country: geo.country, lat: latitude, lng: longitude });
        }
      },
      (err) => {
        // Could not get location

        toast.error(`Could not get location: ${err.message || err.code || 'Unknown error'}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Google Geolocation API (commented out)
    /*
    const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
    fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(async (data) => {
        const { lat, lng } = data.location;
        const geo = await reverseGeocodeLatLng(lat, lng);
        if (geo) {
          setUserLocation({ city: geo.city, country: geo.country, lat, lng });
        }
      });
    */
  };

  const handleDeny = () => {
    setModalOpen(false);
    localStorage.setItem("location-denied", "1");
  };

  return <LocationPermissionModal open={modalOpen} onAllow={handleAllow} onDeny={handleDeny} />;
} 