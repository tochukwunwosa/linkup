// components/TimePickerPopover.tsx
"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function TimePickerPopover({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-40">
        <Input
          type="time"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
