import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useData } from "@/lib/data-context"
import type { Denuncia } from "@/lib/types"
import { categoriasConfig, estadosConfig } from "@/data/mock-data"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface DenunciaCardProps {
  denuncia: Denuncia
  isOwner?: boolean
}

export function DenunciaCard({ denuncia, isOwner = false }: DenunciaCardProps) {
  const categoriaInfo = categoriasConfig[denuncia.categoria]
  const estadoInfo = estadosConfig[denuncia.estado]

  const { removeDenuncia } = useData()

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // The dialog handles the actual logic, this is just to prevent the link click
  }

  const confirmDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeDenuncia(denuncia.id)
  }

  return (
    <div className="relative h-full group">
      {isOwner && (
        <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full shadow-md"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente tu denuncia sobre "{denuncia.titulo}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Link href={`/denuncias/${denuncia.id}`} className="block h-full">
        <Card className="overflow-hidden h-full transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 border-muted-foreground/20 dark:border-muted-foreground/30 dark:bg-card/50 flex flex-col">
          <div className="p-3 pb-0">
            <div className="relative h-48 w-full bg-muted rounded-xl overflow-hidden shadow-sm">
              <Image
                src={denuncia.imagen || "/placeholder.svg"}
                alt={denuncia.titulo}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className={`${estadoInfo.color} shadow-sm backdrop-blur-sm bg-opacity-90`}>{estadoInfo.label}</Badge>
              </div>
            </div>
          </div>

          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${categoriaInfo.color} text-white border-0`}>
                {categoriaInfo.label}
              </Badge>
            </div>

            <h3 className="font-semibold text-lg line-clamp-2 text-balance">{denuncia.titulo}</h3>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{denuncia.descripcion}</p>
          </CardContent>


          <CardFooter className="flex flex-col gap-2 text-xs text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2 w-full">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{denuncia.ubicacion.direccion}</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(new Date(denuncia.fecha), { addSuffix: true, locale: es })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{denuncia.ciudadanoNombre}</span>
              </div>
            </div>
          </CardFooter>


        </Card>
      </Link>
    </div>
  )
}
