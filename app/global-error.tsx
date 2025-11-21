"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console (in production, you'd send to an error tracking service)
    console.error("Global error boundary caught:", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
          <Card className="max-w-2xl w-full shadow-lg border-red-200">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                {/* Error Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-100 rounded-full blur-xl"></div>
                    <div className="relative bg-red-100 p-6 rounded-full">
                      <AlertTriangle className="h-16 w-16 md:h-20 md:w-20 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    Critical Error
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">
                    A critical error occurred that prevented the application from loading properly. Please try refreshing the page.
                  </p>
                </div>

                {/* Error Details (Development) */}
                {process.env.NODE_ENV === "development" && (
                  <div className="bg-gray-100 rounded-lg p-4 text-left">
                    <p className="text-xs font-mono text-red-600 break-all">
                      <strong>Error:</strong> {error.message}
                    </p>
                    {error.digest && (
                      <p className="text-xs font-mono text-gray-600 mt-2">
                        <strong>Digest:</strong> {error.digest}
                      </p>
                    )}
                    {error.stack && (
                      <pre className="text-xs font-mono text-gray-600 mt-2 overflow-x-auto max-h-40">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button
                    onClick={reset}
                    size="lg"
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Link href="/">
                      <Home className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                </div>

                {/* Helpful Information */}
                <div className="pt-6 border-t mt-8">
                  <p className="text-sm text-gray-600 mb-3">
                    If this error persists:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 max-w-md mx-auto text-left list-disc list-inside">
                    <li>Try clearing your browser cache and cookies</li>
                    <li>Check your internet connection</li>
                    <li>Try accessing the site in a private/incognito window</li>
                    <li>Contact support if the problem continues</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
