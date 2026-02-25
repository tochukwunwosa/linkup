"use client";

import React, { Suspense } from "react";
import UserLocationProvider from "@/components/location/UserLocationProvider";
import { EventProvider } from "@/context/EventContext";
import { EventUrlSync } from "@/context/EventUrlSync";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";

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
