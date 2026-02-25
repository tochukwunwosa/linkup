"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { EventProvider } from "@/context/EventContext";
import { EventUrlSync } from "@/context/EventUrlSync";

const UserLocationProvider = dynamic(
  () => import("@/components/location/UserLocationProvider"),
  { ssr: false }
);

const PWAInstallPrompt = dynamic(
  () => import("@/components/pwa/install-prompt").then((m) => ({ default: m.PWAInstallPrompt })),
  { ssr: false }
);

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <EventProvider>
      <Suspense fallback={null}>
        <EventUrlSync />
      </Suspense>
      <UserLocationProvider />
      {children}
      <PWAInstallPrompt />
    </EventProvider>
  );
}
