"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "./ui/input"

type Props = {
  value: string
  onChange: (val: string) => void
  onSelect: (address: string, lat: number, lng: number) => void
}

type PhotonFeature = {
  properties: {
    name: string
    city?: string
    country?: string
  }
  geometry: {
    coordinates: [number, number] // [lon, lat]
  }
}

export default function AddressAutocomplete({ value, onChange, onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<{ name: string; lat: number; lon: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) return

    setIsLoading(true)
    try {
      const res = await axios.get("https://photon.komoot.io/api/", {
        params: { q: query, limit: 5 },
      })

      const features: PhotonFeature[] = res.data.features

      const results = features.map((f) => ({
        name: `${f.properties.name}, ${f.properties.city ?? f.properties.country ?? ""}`,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
      }))

      setSuggestions(results)
    } catch (error) {
      console.error("Error fetching address suggestions:", error)
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

  const handleSelect = (item: { name: string; lat: number; lon: number }) => {
    onChange(item.name)
    onSelect(item.name, item.lat, item.lon)
    setSuggestions([])
  }

  return (
    <div className="relative">
      <Input
        placeholder="Enter address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
