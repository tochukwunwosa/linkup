import { EventProvider } from '@/components/context/EventContext'
import React from 'react'
import { Toaster } from 'sonner'
import UserLocationProvider from '@/components/location/UserLocationProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <EventProvider>
        <UserLocationProvider />
        {children}
      </EventProvider>
      <Toaster richColors />
    </div>
  )
}
