"use client";

import { EventProvider } from '@/components/context/EventContext'
import React from 'react'
import { Toaster } from 'sonner'
import UserLocationProvider from '@/components/location/UserLocationProvider'
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div>
      <EventProvider>
        {!isAdminRoute && <UserLocationProvider />}
        {children}
      </EventProvider>
      <Toaster richColors />
    </div>
  )
}
