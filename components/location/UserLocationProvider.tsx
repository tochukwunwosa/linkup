"use client";

import { useEffect, useState } from "react";
import { useEventContext } from "@/components/context/EventContext";
import { reverseGeocodeLatLng } from "@/lib/geocode/geocode-client";
import LocationPermissionModal from "./LocationPermissionModal";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";

export default function UserLocationProvider() {
  const { setUserLocation } = useEventContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);


  useEffect(() => {
    // Only show modal if permission has not been handled yet
    const permissionHandled = localStorage.getItem("location-permission-handled");
    if (!permissionHandled) {
      setModalOpen(true);
    }
  }, []);

  const handleAllow = () => {
    setModalOpen(false);
    localStorage.setItem("location-permission-handled", "true");
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
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isIOS && isSafari) {
          setLocationError(
            `Could not get location on iOS Safari.\n\nThis may happen if:\n- You denied permission (check Settings > Privacy > Location Services > Safari Websites)\n- The site is not served over HTTPS\n- You are in Private Browsing mode\n\nError: ${err.message || 'Permission denied'}`
          );
        } else {
          toast.error(`Could not get location: ${err.message || 'Permission denied'}`);
        }
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
    localStorage.setItem("location-permission-handled", "true");
  };

  return (
    <>
      {locationError && (
        <Alert variant="destructive" className="my-4 whitespace-pre-wrap">
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}
      <LocationPermissionModal open={modalOpen} onAllow={handleAllow} onDeny={handleDeny} />
    </>
  );
} 