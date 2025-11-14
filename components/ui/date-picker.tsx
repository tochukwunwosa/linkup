"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive ">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-between font-normal border-input flex h-10 w-full min-w-0 rounded-md border-2 bg-white px-3 py-2 shadow-sm dark:bg-gray-950 hover:border-gray-400 dark:hover:border-gray-600 focus-visible:border-primary focus-visible:ring-primary/20",
              "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-4",
              "hover:border-gray-400 dark:hover:border-gray-600",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            )}
          >
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
              selected: "bg-primary text-white rounded-md",
              today: "border border-muted-foreground rounded-md",
              hover: "bg-accent text-accent-foreground rounded-md",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
