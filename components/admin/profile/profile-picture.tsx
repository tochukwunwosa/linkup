"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfilePictureProps {
  user: {
    name: string
    avatar?: string
  }
}

export function ProfilePicture({ user }: ProfilePictureProps) {
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simulate upload process
    setIsUploading(true)

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setTimeout(() => {
        setAvatar(reader.result as string)
        setIsUploading(false)
      }, 1500) // Simulate network delay
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatar || "/placeholder.svg?height=96&width=96"} alt={user.name} />
        <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Button
        size="icon"
        variant="secondary"
        className={cn(
          "absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md",
          isUploading && "opacity-50 cursor-not-allowed",
        )}
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
      </Button>
    </div>
  )
}
