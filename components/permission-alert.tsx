"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface PermissionAlertProps {
  description?: string;
  onBack?: () => void;
  buttonLabel?: string;
}

export function PermissionAlert({
  description = "You are not authorized to view this page.",
  onBack,
  buttonLabel = "Go back",
}: PermissionAlertProps) {
  return (
    <Alert variant="destructive" className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 stroke-destructive" />
        <AlertTitle className="font-medium text-destructive">Permission Required</AlertTitle>
      </div>
      <AlertDescription className="text-sm">{description}</AlertDescription>

      {onBack && (
        <Button variant="ghost" onClick={onBack} className="w-fit text-sm cursor-pointer text-primary hover:!text-secondary">
          <ArrowLeft className="mr-1 h-4 w-4" /> {buttonLabel}
        </Button>
      )}
    </Alert>
  );
}
