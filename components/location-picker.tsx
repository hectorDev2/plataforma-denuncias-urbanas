"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "lucide-react"
import type { Ubicacion } from "@/lib/types"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import map to avoid SSR
const InteractiveMap = dynamic(() => import("@/components/ui/interactive-map"), {
  loading: () => <Skeleton className="h-full w-full bg-muted" />,
  ssr: false,
})

interface LocationPickerProps {
  onLocationSelect: (ubicacion: Ubicacion) => void
  initialLocation?: Ubicacion
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [direccion, setDireccion] = useState(initialLocation?.direccion || "")
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    initialLocation
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : { lat: -13.516, lng: -71.977 } // Default to Cusco
  )
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Update internal address state if initialLocation changes
  useEffect(() => {
    if (initialLocation?.direccion) {
      setDireccion(initialLocation.direccion);
    }
  }, [initialLocation]);


  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCoords(newCoords)
          setIsGettingLocation(false)

          // Trigger update with generic address, allow user to refine
          updateLocation(newCoords.lat, newCoords.lng, direccion || "Ubicación detectada (Editar dirección)")
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        }
      )
    } else {
      setIsGettingLocation(false)
    }
  }

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setCoords({ lat, lng })
    updateLocation(lat, lng, direccion)
  }

  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDir = e.target.value
    setDireccion(newDir)
    updateLocation(coords.lat, coords.lng, newDir)
  }

  const updateLocation = (lat: number, lng: number, dir: string) => {
    onLocationSelect({
      lat,
      lng,
      direccion: dir
    })
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            placeholder="Ej: Calle Principal #123, Col. Centro"
            value={direccion}
            onChange={handleDireccionChange}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isGettingLocation ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
        </Button>

        <div className="h-[300px] w-full rounded-lg overflow-hidden border relative z-0">
          <InteractiveMap center={coords} onLocationSelect={handleMapLocationSelect} />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Arrastra el marcador o haz clic en el mapa para ajustar la ubicación exacta
        </p>
      </CardContent>
    </Card>
  )
}
