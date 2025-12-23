"use client"

import dynamic from "next/dynamic"
import type { Ubicacion } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import LeafMap with no SSR, as Leaflet requires window
const LeafMap = dynamic(() => import("@/components/ui/leaf-map"), {
  loading: () => <Skeleton className="h-full w-full bg-muted" />,
  ssr: false,
})

interface MapComponentProps {
  ubicacion: Ubicacion
  className?: string
}

export function MapComponent({ ubicacion, className = "" }: MapComponentProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden border ${className}`}>
      <LeafMap ubicacion={ubicacion} />
    </div>
  )
}
