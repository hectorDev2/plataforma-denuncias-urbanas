"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { categoriasConfig, estadosConfig } from "@/data/mock-data";
import { actualizarEstadoDenuncia, eliminarDenuncia } from "@/lib/denuncias-api";
import { getDenunciaPorId as getDenunciaApi } from "@/lib/api";
// Note: reusing the standard api getter or the specific one.
// lib/api.ts has getDenunciaPorId which does mapping. lib/denuncias-api.ts seems to have write ops.
// I should use the one that maps data correctly. lib/api.ts 'getDenunciaPorId' does the mapping.

import type { Denuncia } from "@/lib/types";
import { MapPin, Calendar, User, MoreVertical, Clock, AlertCircle, CheckCircle, XCircle, Trash2 } from "lucide-react";
import DenunciaMapWrapper from "@/components/DenunciaMapWrapper";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function DenunciaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { usuario } = useAuth();
  const id = params?.id as string;

  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDenunciaApi(id)
      .then((data) => {
        setDenuncia(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // notFound(); // Cannot easily call notFound() in useEffect, better to show error state
      });
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando detalle...</div>;
  }

  if (!denuncia) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Denuncia no encontrada</h1>
        <Button asChild><Link href="/denuncias">Volver</Link></Button>
      </div>
    );
  }

  const isAuthority = usuario?.rol === "autoridad";

  const handleStatusChange = async (newStatus: string) => {
    if (!denuncia) return;
    try {
      toast.loading("Actualizando estado...");
      await actualizarEstadoDenuncia(denuncia.id, newStatus);
      // Update local state
      setDenuncia({ ...denuncia, estado: newStatus as any });
      toast.dismiss();
      toast.success(`Estado actualizado.`);
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error("Error al actualizar el estado");
    }
  };

  const confirmDelete = async () => {
    if (!denuncia) return;
    setIsDeleting(true);
    try {
      await eliminarDenuncia(denuncia.id);
      toast.success("Denuncia eliminada permanentemente");
      router.push("/admin"); // Redirect to admin or list
      router.refresh();
    } catch (error) {
      toast.error("Error al eliminar la denuncia");
      console.error(error);
      setIsDeleting(false);
    }
  };


  const categoriaInfo = categoriasConfig[denuncia.categoria] || {
    label: denuncia.categoria,
    color: "bg-gray-400",
  };

  // Use estadosConfig for proper labeling (fixes "in progress" -> "En Revisión")
  const estadoInfo = estadosConfig[denuncia.estado] || {
    label: denuncia.estado,
    color: "bg-gray-200 text-gray-800 border-gray-300",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/denuncias">
            <span className="inline-flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a denuncias
            </span>
          </Link>
        </Button>

        {/* Admin Actions Header */}
        {isAuthority && (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Gestionar Estado
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange("pendiente")}>
                  <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                  Pendiente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("en-revision")}>
                  <AlertCircle className="mr-2 h-4 w-4 text-blue-600" />
                  En Revisión
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("resuelta")}>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Resuelta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange("rechazada")} className="text-red-600 focus:text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {denuncia.estado === "rechazada" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
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
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-muted">
            <Image
              src={
                denuncia.imagen
                  ? denuncia.imagen.startsWith("http")
                    ? denuncia.imagen
                    : `http://localhost:3000${denuncia.imagen.startsWith("/") ? "" : "/"
                    }${denuncia.imagen}`
                  : "/placeholder.svg"
              }
              alt={denuncia.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`${categoriaInfo.color} text-white border-0`}
              >
                {categoriaInfo.label}
              </Badge>
              <Badge className={estadoInfo.color}>{estadoInfo.label}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              {denuncia.titulo}
            </h1>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">
              {denuncia.descripcion}
            </p>
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
                    {new Date(denuncia.fecha).toLocaleString("es-ES")}
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
                    <p className="text-sm text-muted-foreground">
                      Las autoridades están evaluando el caso
                    </p>
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
                      <p className="text-sm text-muted-foreground">
                        Caso evaluado por las autoridades
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Resuelta</p>
                      <p className="text-sm text-muted-foreground">
                        El problema ha sido solucionado
                      </p>
                    </div>
                  </div>
                </>
              )}
              {denuncia.estado === "rechazada" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Rechazada</p>
                    <p className="text-sm text-muted-foreground">
                      Esta denuncia no ha sido aceptada.
                    </p>
                  </div>
                </div>
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
                      <p className="text-muted-foreground">
                        {denuncia.ubicacion.direccion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Fecha de reporte</p>
                      <p className="text-muted-foreground">
                        {new Date(denuncia.fecha).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Reportado por</p>
                      <p className="text-muted-foreground">
                        {denuncia.ciudadanoNombre}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Coordenadas</h3>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">
                    Lat:{" "}
                    {typeof denuncia.ubicacion.lat === "number" &&
                      !isNaN(denuncia.ubicacion.lat)
                      ? denuncia.ubicacion.lat.toFixed(6)
                      : "N/A"}
                  </p>
                  <p className="text-muted-foreground">
                    Lng:{" "}
                    {typeof denuncia.ubicacion.lng === "number" &&
                      !isNaN(denuncia.ubicacion.lng)
                      ? denuncia.ubicacion.lng.toFixed(6)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="h-[300px] w-full rounded-md overflow-hidden">
            {denuncia.ubicacion &&
              typeof denuncia.ubicacion.lat === 'number' &&
              typeof denuncia.ubicacion.lng === 'number' ? (
              <DenunciaMapWrapper
                lat={denuncia.ubicacion.lat}
                lng={denuncia.ubicacion.lng}
                readonly={true}
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Sin ubicación registrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
