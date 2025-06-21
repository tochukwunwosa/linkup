"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LocationPermissionModal({ open, onAllow, onDeny }: { open: boolean, onAllow: () => void, onDeny: () => void }) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Allow Location Access</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm text-muted-foreground">
          Enable location access to discover events happening near you.
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDeny}>Deny</Button>
          <Button onClick={onAllow}>Allow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 