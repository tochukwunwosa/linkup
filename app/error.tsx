"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console (in production, you'd send to an error tracking service)
    console.error("Error boundary caught:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <Card className="max-w-2xl w-full shadow-lg border-destructive/20">
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/10 rounded-full blur-xl"></div>
                <div className="relative bg-destructive/10 p-6 rounded-full">
                  <AlertTriangle className="h-16 w-16 md:h-20 md:w-20 text-destructive" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Something Went Wrong
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working on a fix.
              </p>
            </div>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <p className="text-xs font-mono text-destructive break-all">
                  <strong>Error:</strong> {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-muted-foreground mt-2">
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                onClick={reset}
                size="lg"
                className="gap-2"
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
              <p className="text-sm text-muted-foreground mb-3">
                What you can do:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto text-left list-disc list-inside">
                <li>Refresh the page and try again</li>
                <li>Clear your browser cache and cookies</li>
                <li>Return to the home page and navigate again</li>
                <li>If the problem persists, contact our support team</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
