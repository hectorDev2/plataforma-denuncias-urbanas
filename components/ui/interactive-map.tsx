"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type { Ubicacion } from "@/lib/types"

// Reuse icons
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

interface InteractiveMapProps {
    center: { lat: number; lng: number }
    onLocationSelect: (lat: number, lng: number) => void
}

// Component to handle map clicks
function LocationMarker({ position, onPositionChange }: {
    position: { lat: number, lng: number },
    onPositionChange: (lat: number, lng: number) => void
}) {
    // Handle map clicks
    useMapEvents({
        click(e) {
            onPositionChange(e.latlng.lat, e.latlng.lng)
        },
    })

    // Draggable marker
    const markerRef = useRef<L.Marker>(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    const { lat, lng } = marker.getLatLng()
                    onPositionChange(lat, lng)
                }
            },
        }),
        [onPositionChange],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            icon={customIcon}
            ref={markerRef}
        >
            <Popup>Ubicación del reporte</Popup>
        </Marker>
    )
}

// Component to fly to new center when props change
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo([center.lat, center.lng], 16)
    }, [center, map])
    return null
}

export default function InteractiveMap({ center, onLocationSelect }: InteractiveMapProps) {
    // If center changes from parent (e.g. geolocation), we want to respect it
    // But we also want local state for immediate feedback if needed, 
    // actually LocationMarker handles local interactions primarily via parent callback

    return (
        <MapContainer center={[center.lat, center.lng]} zoom={15} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={center} onPositionChange={onLocationSelect} />
            <MapUpdater center={center} />
        </MapContainer>
    )
}
