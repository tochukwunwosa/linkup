import { EventProvider } from '@/components/context/EventContext'
import React from 'react'
import { Toaster } from 'sonner'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <EventProvider>
        {children}
      </EventProvider>
      <Toaster richColors />
    </div>
  )
}
