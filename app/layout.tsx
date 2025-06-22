import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import { siteConfig } from "@/lib/metadata"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = siteConfig

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
