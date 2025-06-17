"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ProfileFormProps {
  user: {
    name: string
    email: string
    role: string
    bio?: string
  }
  isSuperAdmin: boolean
}

export function ProfileForm({ user, isSuperAdmin }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || "",
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
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Profile updated")
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={!isSuperAdmin}
            required
          />
          {!isSuperAdmin && (
            <p className="text-xs text-muted-foreground">
              Only Super Admins can change names. Contact a Super Admin for assistance.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!isSuperAdmin}
            required
          />
          {!isSuperAdmin && (
            <p className="text-xs text-muted-foreground">
              Only Super Admins can change email addresses.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell us a bit about yourself"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            This will be displayed on your profile.
          </p>
        </div>
      </div>

      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
