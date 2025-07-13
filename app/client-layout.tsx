"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { EventProvider } from "@/components/context/EventContext";
import { EventUrlSync } from "@/components/context/EventUrlSync";
import UserLocationProvider from "@/components/location/UserLocationProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const is404 = pathname === "/404";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <EventProvider>
      {!is404 && (
        <Suspense fallback={null}>
          <EventUrlSync />
        </Suspense>
      )}
      {!isAdminRoute && <UserLocationProvider />}
      {children}
      <Toaster richColors />
    </EventProvider>
  );
}
