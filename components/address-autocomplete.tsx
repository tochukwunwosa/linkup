"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "./ui/input"

type Props = {
  value: string
  onChangeAction: (val: string) => void
  onSelectAction: (address: string, lat: number, lng: number) => void
}

type Suggestion = {
  name: string
  lat: number
  lng: number
  city: string
  country: string
}

export default function AddressAutocomplete({ value, onChangeAction, onSelectAction }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post("/api/geocode", {
        address: query,
        autocomplete: true,
      })

      if (res.data.suggestions) {
        setSuggestions(res.data.suggestions)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      // console.error("Error fetching address suggestions:", error)
      if (error) {
        setSuggestions([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  const handleSelect = (item: Suggestion) => {
    onChangeAction(item.name)
    onSelectAction(item.name, item.lat, item.lng)
    setSuggestions([])
  }

  return (
    <div className="relative">
      <Input
        placeholder="Enter address"
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
      />
      {isLoading && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-md shadow-lg w-full text-sm px-3 py-2 text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      )}
      {!isLoading && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-md shadow-lg w-full text-sm">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSelect(s)}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
