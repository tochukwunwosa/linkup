"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import UserLocationProvider from "@/components/location/UserLocationProvider";
import { EventProvider } from "@/context/EventContext";
import { EventUrlSync } from "@/context/EventUrlSync";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import { QueryProvider } from "@/components/providers/query-provider";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const is404 = pathname === "/404";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <QueryProvider>
      <EventProvider>
        {!is404 && (
          <Suspense fallback={null}>
            <EventUrlSync />
          </Suspense>
        )}
        {!isAdminRoute && <UserLocationProvider />}

        {!isAdminRoute && <Navbar />}
        <main id="main-content">
          {children}
        </main>
        {!isAdminRoute && <Footer />}

        <Toaster richColors />
        {!isAdminRoute && <PWAInstallPrompt />}
      </EventProvider>
    </QueryProvider>
  );
}
