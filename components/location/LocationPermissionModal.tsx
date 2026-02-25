"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationPermissionModalProps {
  open: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export default function LocationPermissionModal({ open, onAllow, onDeny }: LocationPermissionModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onDeny();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <DialogTitle className="text-lg">Allow Location Access</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Enable location access to discover events happening near you. This helps us show you relevant events in your area.
          </p>

          <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-600">
            <strong>Why we need this:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Find events within your vicinity</li>
              <li>• Calculate distances to event locations</li>
              <li>• Provide location-based recommendations</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onDeny} className="flex-1 sm:flex-none">
            Not Now
          </Button>
          <Button onClick={onAllow} className="flex-1 sm:flex-none">
            Allow Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}