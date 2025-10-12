"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface DatePickerProps {
  label: string
  date: Date | undefined
  onChange: (date: Date | undefined) => void
  minDate?: Date
  required?: boolean
}

export function DatePicker({ label, date, onChange, minDate, required }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const currentYear = new Date().getFullYear()
  const startMonth = new Date(1900, 0) // January 1900
  const endMonth = new Date(currentYear + 100, 11) // December (current year + 100)

  return (
    <div className="flex flex-col gap-2">
      <Label className="px-1">
        {label} {required && <span className="text-destructive text-xs">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal bg-transparent">
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onChange(d)
              setOpen(false)
            }}
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            hidden={minDate ? { before: minDate } : undefined}
            modifiersClassNames={{
              selected: "bg-primary text-white",
              today: "border border-muted-foreground",
              hover: "bg-accent text-accent-foreground",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
