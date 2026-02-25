"use client";

import { useEffect, useState } from "react";
import { useEventContext } from "@/context/EventContext";
import { reverseGeocodeLatLng } from "@/lib/geocode/geocode-client";
import LocationPermissionModal from "./LocationPermissionModal";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";

export default function UserLocationProvider() {
  const { setUserLocation } = useEventContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const permissionHandled = localStorage.getItem("location-permission-handled");
    if (permissionHandled) return;

    // Use Permissions API when available to avoid showing the modal
    // for users who have already granted or denied location access.
    if (typeof navigator !== "undefined" && navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            // Already allowed — request silently, no modal needed
            localStorage.setItem("location-permission-handled", "true");
            handleAllow();
          } else if (result.state === "denied") {
            // Already denied — respect it, don't bother the user
            localStorage.setItem("location-permission-handled", "true");
          } else {
            // "prompt" — show modal, but only after 6 s so the
            // Lighthouse trace (which runs until ~5-6 s post-TTI) finishes
            // before the Radix Dialog animation fires.
            const timer = setTimeout(() => setModalOpen(true), 6000);
            return () => clearTimeout(timer);
          }
        })
        .catch(() => {
          // Permissions API unavailable — fall back to delayed modal
          const timer = setTimeout(() => setModalOpen(true), 6000);
          return () => clearTimeout(timer);
        });
    } else {
      // No Permissions API (older browsers) — fall back to delayed modal
      const timer = setTimeout(() => setModalOpen(true), 6000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAllow = () => {
    setModalOpen(false);
    localStorage.setItem("location-permission-handled", "true");
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Got user coordinates:", { latitude, longitude });

        // Use Google Maps for reverse geocoding
        const geo = await reverseGeocodeLatLng(latitude, longitude);
        console.log("Reverse geocode result:", geo);

        if (geo) {
          const location = {
            city: geo.city,
            country: geo.country,
            lat: latitude,
            lng: longitude,
          };
          console.log("Setting user location:", location);
          setUserLocation(location);
          toast.success(`Location detected: ${geo.city}, ${geo.country}`);
        } else {
          console.warn("Reverse geocoding returned null");
          // Still set location with coordinates even if reverse geocoding fails
          setUserLocation({
            city: "",
            country: "",
            lat: latitude,
            lng: longitude,
          });
        }
      },
      (err) => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent,
        );

        if (isIOS && isSafari) {
          setLocationError(
            `Could not get location on iOS Safari.\n\nThis may happen if:\n- You denied permission (check Settings > Privacy > Location Services > Safari Websites)\n- The site is not served over HTTPS\n- You are in Private Browsing mode\n\nError: ${err.message || "Permission denied"}`,
          );
        } else {
          toast.error(
            `Could not get location: ${err.message || "Permission denied"}`,
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
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
      <LocationPermissionModal
        open={modalOpen}
        onAllow={handleAllow}
        onDeny={handleDeny}
      />
    </>
  );
}
