import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapComponent } from "@/components/map-component"
import { mockDenuncias, categoriasConfig, estadosConfig } from "@/data/mock-data"
import { MapPin, Calendar, User, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function DenunciaDetallePage({ params }: { params: { id: string } }) {
  const denuncia = mockDenuncias.find((d) => d.id === params.id)

  if (!denuncia) {
    notFound()
  }

  const categoriaInfo = categoriasConfig[denuncia.categoria]
  const estadoInfo = estadosConfig[denuncia.estado]

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/denuncias">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a denuncias
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-muted">
            <Image
              src={denuncia.imagen || "/placeholder.svg"}
              alt={denuncia.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={`${categoriaInfo.color} text-white border-0`}>
                {categoriaInfo.label}
              </Badge>
              <Badge className={estadoInfo.color}>{estadoInfo.label}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-balance">{denuncia.titulo}</h1>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">{denuncia.descripcion}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Historial</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="w-px h-full bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Denuncia creada</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(denuncia.fecha), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                  </p>
                </div>
              </div>

              {denuncia.estado === "en-revision" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">En revisión</p>
                    <p className="text-sm text-muted-foreground">Las autoridades están evaluando el caso</p>
                  </div>
                </div>
              )}

              {denuncia.estado === "resuelta" && (
                <>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <div className="w-px h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="font-medium">En revisión</p>
                      <p className="text-sm text-muted-foreground">Caso evaluado por las autoridades</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Resuelta</p>
                      <p className="text-sm text-muted-foreground">El problema ha sido solucionado</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Información</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-muted-foreground">{denuncia.ubicacion.direccion}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Fecha de reporte</p>
                      <p className="text-muted-foreground">
                        {format(new Date(denuncia.fecha), "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Reportado por</p>
                      <p className="text-muted-foreground">{denuncia.ciudadanoNombre}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Coordenadas</h3>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">Lat: {denuncia.ubicacion.lat.toFixed(6)}</p>
                  <p className="text-muted-foreground">Lng: {denuncia.ubicacion.lng.toFixed(6)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MapComponent ubicacion={denuncia.ubicacion} className="h-[300px]" />
        </div>
      </div>
    </div>
  )
}
