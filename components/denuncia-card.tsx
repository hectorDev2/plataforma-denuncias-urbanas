"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Trash2 } from "lucide-react";
import type { Denuncia } from "@/lib/types";
import { categoriasConfig, estadosConfig } from "@/data/mock-data";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { eliminarDenuncia } from "@/lib/denuncias-api";
import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DenunciaCardProps {
  denuncia: Denuncia;
  showDelete?: boolean;
  onDelete?: () => void;
}

export function DenunciaCard({ denuncia, showDelete = false, onDelete }: DenunciaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation since card is wrapped in Link (wait, button inside link is bad)
    // Actually the card is wrapped in Link. We need to stop propagation.
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eliminarDenuncia(denuncia.id);
      toast.success("Denuncia eliminada");
      if (onDelete) onDelete();
    } catch (error) {
      toast.error("Error al eliminar la denuncia");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const categoriaInfo = categoriasConfig[denuncia.categoria] || {
    label: denuncia.categoria || "Sin categoría",
    color: "bg-gray-400",
  };
  const estadoInfo = estadosConfig[denuncia.estado] || {
    label: denuncia.estado || "Sin estado",
    color: "bg-gray-400",
  };

  // Si la imagen es relativa (empieza con /uploads), prepende el dominio del backend
  let imageUrl = denuncia.imagen;
  if (imageUrl && imageUrl.startsWith("/uploads")) {
    imageUrl = `http://localhost:3000${imageUrl}`;
  }
  return (
    <div className="relative group">
      <Link href={`/denuncias/${denuncia.id}`} className="block h-full">
        <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col border-white/40 bg-white/60 backdrop-blur-md shadow-md">
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={denuncia.titulo || "Denuncia"}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Badge className={estadoInfo.color}>{estadoInfo.label}</Badge>
            </div>
          </div>

          <CardContent className="pt-4 space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${categoriaInfo.color} text-white border-0`}
              >
                {categoriaInfo.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2 text-balance">
              {denuncia.titulo || "Sin título"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {denuncia.descripcion || "Sin descripción"}
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 text-xs text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2 w-full">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">
                {denuncia.ubicacion?.direccion ?? "Sin dirección"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {denuncia.fecha
                    ? formatDistanceToNow(new Date(denuncia.fecha), {
                      addSuffix: true,
                      locale: es,
                    })
                    : "Sin fecha"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{denuncia.ciudadanoNombre ?? "Anónimo"}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
      {showDelete && (
        <div className="absolute top-3 left-3 z-10 transition-opacity opacity-0 group-hover:opacity-100">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La denuncia será eliminada permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
