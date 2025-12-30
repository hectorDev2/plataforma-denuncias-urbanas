"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Trash2, MoreVertical, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import type { Denuncia } from "@/lib/types";
import { categoriasConfig, estadosConfig } from "@/data/mock-data";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { eliminarDenuncia, actualizarEstadoDenuncia } from "@/lib/denuncias-api";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DenunciaCardProps {
  denuncia: Denuncia;
  showDelete?: boolean; // Deprecated but kept for compatibility
  onDelete?: () => void;
}

export function DenunciaCard({ denuncia, showDelete, onDelete }: DenunciaCardProps) {
  const { usuario } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(denuncia.estado);

  const isAuthority = usuario?.rol === "autoridad";

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eliminarDenuncia(denuncia.id);
      toast.success("Denuncia eliminada");
      if (onDelete) onDelete();
      router.refresh();
    } catch (error) {
      toast.error("Error al eliminar la denuncia");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      toast.loading("Actualizando estado...");
      await actualizarEstadoDenuncia(denuncia.id, newStatus);
      setCurrentStatus(newStatus as any);
      toast.dismiss();
      toast.success(`Estado actualizado a ${estadosConfig[newStatus as any].label}`);
      router.refresh(); // Refresh data to reflect changes in lists
    } catch (error) {
      toast.dismiss();
      toast.error("Error al actualizar el estado");
    }
  };

  const categoriaInfo = categoriasConfig[denuncia.categoria] || {
    label: denuncia.categoria || "Sin categoría",
    color: "bg-gray-400",
  };

  // Use currentStatus state for rendering
  const estadoInfo = estadosConfig[currentStatus] || {
    label: currentStatus || "Sin estado",
    color: "bg-gray-400",
  };

  // Si la imagen es relativa (empieza con /uploads), prepende el dominio del backend
  let imageUrl = denuncia.imagen;
  if (imageUrl && imageUrl.startsWith("/uploads")) {
    imageUrl = `http://localhost:3000${imageUrl}`;
  }

  // Prevent click propagation for interactive elements
  const stopProp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative group h-full">
      <Link href={`/denuncias/${denuncia.id}`} className="block h-full">
        <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col border-white/40 bg-white/60 backdrop-blur-md shadow-md">
          <div className="p-3 relative">
            <div className="relative aspect-video w-full bg-muted rounded-xl overflow-hidden shadow-sm">
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

            {/* Admin Controls Overlay */}
            {isAuthority && (
              <div className="absolute top-5 left-5 z-20" onClick={stopProp}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md bg-white/90 backdrop-blur hover:bg-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Gestionar Denuncia</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange("pendiente")}>
                      <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                      Marcar Pendiente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("en-revision")}>
                      <AlertCircle className="mr-2 h-4 w-4 text-blue-600" />
                      Marcar En Revisión
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("resuelta")}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Marcar Resuelta
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange("rechazada")} className="text-red-600 focus:text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Rechazar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
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

            {/* Delete button only if REJECTED and AUTHORITY */}
            {isAuthority && currentStatus === "rechazada" && (
              <div className="w-full mt-3 pt-2 border-t flex justify-end" onClick={stopProp}>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar Definitivamente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar definitivamente?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción borrará la denuncia de la base de datos y no se podrá recuperar.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                        {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
