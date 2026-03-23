"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

export interface AddressDetails {
  formattedAddress: string
  state?: string
  city?: string
  county?: string
}

interface ServiceAreaCircle {
  centerLat: number
  centerLng: number
  radiusMiles: number
}

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  onSelect: (address: string, details: AddressDetails) => void
  onReject?: () => void
  placeholder?: string
}

// Parse service area circles from env var
const SERVICE_AREAS: ServiceAreaCircle[] = (() => {
  try {
    const raw = process.env.NEXT_PUBLIC_SERVICE_AREAS || "[]"
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (c: unknown): c is ServiceAreaCircle =>
        typeof c === "object" &&
        c !== null &&
        typeof (c as ServiceAreaCircle).centerLat === "number" &&
        typeof (c as ServiceAreaCircle).centerLng === "number" &&
        typeof (c as ServiceAreaCircle).radiusMiles === "number"
    )
  } catch {
    return []
  }
})()

// Haversine distance in miles between two lat/lng points
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Check if a lat/lng falls within any service area circle
function isInServiceArea(lat: number, lng: number): boolean {
  if (SERVICE_AREAS.length === 0) return true
  return SERVICE_AREAS.some(
    (circle) =>
      haversineDistance(lat, lng, circle.centerLat, circle.centerLng) <=
      circle.radiusMiles
  )
}

// Compute a combined location bias from all circles
function getLocationBias(): { lat: number; lng: number; radiusMeters: number } | null {
  if (SERVICE_AREAS.length === 0) return null
  if (SERVICE_AREAS.length === 1) {
    const c = SERVICE_AREAS[0]
    return { lat: c.centerLat, lng: c.centerLng, radiusMeters: c.radiusMiles * 1609.34 }
  }
  const avgLat = SERVICE_AREAS.reduce((s, c) => s + c.centerLat, 0) / SERVICE_AREAS.length
  const avgLng = SERVICE_AREAS.reduce((s, c) => s + c.centerLng, 0) / SERVICE_AREAS.length
  let maxReach = 0
  for (const c of SERVICE_AREAS) {
    const dist = haversineDistance(avgLat, avgLng, c.centerLat, c.centerLng) + c.radiusMiles
    if (dist > maxReach) maxReach = dist
  }
  return { lat: avgLat, lng: avgLng, radiusMeters: maxReach * 1609.34 }
}

declare global {
  interface Window {
    google: typeof google
    initGooglePlaces: () => void
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  onReject,
  placeholder = "Start typing your address...",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (window.google?.maps?.places) {
      setIsLoaded(true)
      initAutocomplete()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsLoaded(true)
      initAutocomplete()
    }
    document.head.appendChild(script)

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return
    if (autocompleteRef.current) return

    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: "us" },
      types: ["address"],
      fields: ["formatted_address", "address_components", "geometry"],
    }

    // Bias autocomplete suggestions toward service area circles
    const bias = getLocationBias()
    if (bias) {
      const degOffset = bias.radiusMeters / 111320
      const lngOffset = bias.radiusMeters / (111320 * Math.cos((bias.lat * Math.PI) / 180))
      options.bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(bias.lat - degOffset, bias.lng - lngOffset),
        new google.maps.LatLng(bias.lat + degOffset, bias.lng + lngOffset)
      )
    }

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, options)

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace()
      if (!place?.formatted_address) return

      let state = ""
      let city = ""
      let county = ""
      let lat: number | undefined
      let lng: number | undefined

      place.address_components?.forEach((component) => {
        if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name
        }
        if (component.types.includes("locality")) {
          city = component.long_name
        }
        if (component.types.includes("administrative_area_level_2")) {
          county = component.long_name
        }
      })

      if (place.geometry?.location) {
        lat = place.geometry.location.lat()
        lng = place.geometry.location.lng()
      }

      // Hard block addresses outside service area circles
      if (lat !== undefined && lng !== undefined && !isInServiceArea(lat, lng)) {
        setError("Sorry, we don\u2019t currently service this area. Please enter an address within our coverage area.")
        onChange("")
        if (onReject) onReject()
        return
      }

      setError("")
      const details: AddressDetails = {
        formattedAddress: place.formatted_address,
        state,
        city,
        county,
      }

      onChange(place.formatted_address)
      onSelect(place.formatted_address, details)
    })
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <MapPin className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setError("") }}
        className={`h-12 pl-10 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 ${error ? "border-red-400" : ""}`}
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--accent)]" />
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
