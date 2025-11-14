"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface MultiTagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  className?: string
}

export default function MultiTagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add category",
  className = ""
}: MultiTagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedInput = useDebounce(inputValue, 300)

  useEffect(() => {
    if (debouncedInput.trim() === "") {
      setFilteredSuggestions([])
      return
    }

    const filtered = suggestions.filter(
      (item) =>
        item.toLowerCase().includes(debouncedInput.toLowerCase()) &&
        !value.includes(item)
    )
    setFilteredSuggestions(filtered)
  }, [debouncedInput, suggestions, value])

  const addTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    }
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "w-full border-2 border-input rounded-md min-h-[40px] flex flex-wrap gap-1.5 items-center p-2 bg-white dark:bg-gray-950 shadow-sm hover:border-gray-400 dark:hover:border-gray-600 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-[border-color,box-shadow]",
          className
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 dark:bg-primary/20 border border-primary/30 text-primary dark:text-primary-foreground text-sm px-2 py-1 rounded flex items-center gap-1"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0 bg-transparent shadow-none px-0 py-0 text-sm w-auto flex-1 h-auto min-h-0"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="absolute top-full mt-1 z-50 w-full bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-md shadow-lg max-h-[250px] overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              onClick={() => addTag(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
