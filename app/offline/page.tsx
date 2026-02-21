import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <WifiOff className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3">You&apos;re Offline</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            It looks like you&apos;ve lost your internet connection. Some features may not be available right now.
          </p>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">What you can do:</p>
              <ul className="text-left space-y-1 text-muted-foreground">
                <li>• Check your internet connection</li>
                <li>• Try refreshing the page</li>
                <li>• View previously loaded content</li>
              </ul>
            </div>

            <Button asChild className="w-full">
              <Link href="/">Try Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground mt-8">
        TechLinkUp works best with an active internet connection
      </p>
    </div>
  );
}
