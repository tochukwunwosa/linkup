"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { nigerianStates } from "@/constants/nigeria-states";

interface NigerianStatesComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  loading?: boolean;
}

export function NigerianStatesCombobox({
  value,
  onValueChange,
  className,
  loading = false,
}: NigerianStatesComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const flatStates = nigerianStates.flatMap((g) => g.items);
  const selectedLabel =
    flatStates.find((item) => item.value === value)?.label || "Select a state";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={selectedLabel}
          disabled={loading}
          className={cn(
            "bg-white hover:!bg-white w-full justify-between disabled:!bg-muted",
            className
          )}
        >
          <div className="flex justify-between w-full items-center gap-2">
            
            {selectedLabel}
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[220px]">
        <Command>
          <CommandInput placeholder="Search state..." />
          <CommandList className="max-h-[250px] overflow-y-auto">
            <CommandEmpty>No state found.</CommandEmpty>
            {nigerianStates.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(val) => {
                      onValueChange(val);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
