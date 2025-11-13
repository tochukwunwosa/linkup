"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import UserLocationProvider from "@/components/location/UserLocationProvider";
import { EventProvider } from "@/context/EventContext";
import { EventUrlSync } from "@/context/EventUrlSync";

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
      <div className="">
        {children}
      </div>
      <Toaster richColors />
    </EventProvider>
  );
}
