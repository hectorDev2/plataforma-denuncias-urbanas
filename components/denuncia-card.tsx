import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User } from "lucide-react";
import type { Denuncia } from "@/lib/types";
import { categoriasConfig, estadosConfig } from "@/data/mock-data";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface DenunciaCardProps {
  denuncia: Denuncia;
}

export function DenunciaCard({ denuncia }: DenunciaCardProps) {
  const categoriaInfo = categoriasConfig[denuncia.categoria] || {
    label: denuncia.categoria || "Sin categoría",
    color: "bg-gray-400",
  };
  const estadoInfo = estadosConfig[denuncia.estado] || {
    label: denuncia.estado || "Sin estado",
    color: "bg-gray-400",
  };

  return (
    <Link href={`/denuncias/${denuncia.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={denuncia.imagen || "/placeholder.svg"}
            alt={denuncia.titulo || "Denuncia"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={estadoInfo.color}>{estadoInfo.label}</Badge>
          </div>
        </div>

        <CardContent className="pt-4 space-y-3">
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
  );
}
