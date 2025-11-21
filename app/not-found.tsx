import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* 404 Number */}
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-bold text-primary/10 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-20 w-20 md:h-24 md:w-24 text-primary/30" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. The event or page may have been moved or deleted.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="gap-2"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Link href="javascript:history.back()">
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="pt-6 border-t mt-8">
              <p className="text-sm text-muted-foreground mb-3">
                You might want to:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  href="/"
                  className="text-sm text-primary hover:underline"
                >
                  Browse Events
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/?category=Web+Development"
                  className="text-sm text-primary hover:underline"
                >
                  Web Development Events
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/?category=AI%2FML"
                  className="text-sm text-primary hover:underline"
                >
                  AI/ML Events
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
