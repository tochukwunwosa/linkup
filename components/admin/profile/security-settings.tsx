"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface SecuritySettingsProps {
  user: {
    name: string
    email: string
    role: string
  }
  isSuperAdmin: boolean
}

export function SecuritySettings({ isSuperAdmin }: SecuritySettingsProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast.success("Password updated")
    }, 1000)
  }

  if (!isSuperAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4 stroke-red-500" />
        <AlertTitle className="font-medium text-red-500">Permission Required</AlertTitle>
        <AlertDescription className="text-sm">
          Only Super Admins can change passwords. Please contact a Super Admin if you need to reset your password.
        </AlertDescription>
      </Alert>
    )
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  )
}
