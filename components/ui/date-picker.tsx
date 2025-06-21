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

  return (
    <div className="flex flex-col gap-2">
      <Label className="px-1">{label} {required && <span className='text-destructive text-xs'>*</span>}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
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
            fromDate={minDate}
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
