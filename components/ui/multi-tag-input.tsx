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
    <div
      className={cn(
        "w-full border rounded-md min-h-[40px] flex flex-wrap gap-1 items-center px-2",
        className
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="bg-white border text-blue-800 text-sm px-2 py-1 rounded flex items-center gap-1"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>
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
        className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0 bg-transparent shadow-none px-0 py-0 text-sm w-auto flex-1"
      />
      {filteredSuggestions.length > 0 && (
        <div className="absolute top-full z-50 w-fit bg-white border border-gray-200 rounded-md shadow-lg h-[250px] overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              onClick={() => addTag(suggestion)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
