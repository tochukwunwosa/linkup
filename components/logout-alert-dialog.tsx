// components/LogoutAlertDialog.tsx
"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ReactNode } from "react"

interface LogoutAlertDialogProps {
  trigger: ReactNode
  onConfirm: () => void
}

export function LogoutAlertDialog({ trigger, onConfirm }: LogoutAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          {/* <AlertDialogDescription>
            You will be logged out from all sessions and redirected to the login page.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="ring ring-destructive hover:bg-destructive bg-transparent text-destructive hover:text-white">Log out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
