"use client";

import { DenunciaCard } from "@/components/denuncia-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getDenunciasPorUsuario } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";

export default function MisDenunciasPage() {
  const { usuario, isAuthenticated } = useAuth();
  const [misDenuncias, setMisDenuncias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario) {
      setLoading(false);
      return;
    }
    // Usar userId, sub o id según lo que venga del backend
    const u = usuario as any;
    const userId = u.userId || u.sub || u.id;
    if (!userId) {
      setLoading(false);
      setError("No se pudo obtener tu usuario. Intenta recargar la página.");
      return;
    }
    setLoading(true);
    getDenunciasPorUsuario(userId)
      .then((data) => {
        setMisDenuncias(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar tus denuncias");
        setLoading(false);
      });
  }, [usuario]);

  let content;
  if (!isAuthenticated) {
    content = (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
          <CardContent className="pt-6 text-center space-y-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                Inicia sesión para ver tus denuncias
              </h2>
              <p className="text-muted-foreground">
                Necesitas una cuenta para acceder a esta sección
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/registro">Registrarse</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (loading) {
    content = (
      <div className="container mx-auto px-4 py-12 text-center">
        Cargando tus denuncias...
      </div>
    );
  } else if (error) {
    content = (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    );
  } else {
    content = (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Mis Denuncias
            </h1>
            <p className="text-muted-foreground text-lg">
              Seguimiento de tus reportes
            </p>
          </div>
          <Button asChild>
            <Link href="/nueva-denuncia">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Denuncia
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{misDenuncias.length}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {misDenuncias.filter((d) => d.estado === "pendiente").length}
              </div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {misDenuncias.filter((d) => d.estado === "en-revision").length}
              </div>
              <p className="text-sm text-muted-foreground">En Revisión</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {misDenuncias.filter((d) => d.estado === "resuelta").length}
              </div>
              <p className="text-sm text-muted-foreground">Resueltas</p>
            </CardContent>
          </Card>
        </div>

        {/* Denuncias Grid */}
        {misDenuncias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {misDenuncias.map((denuncia) => (
              <DenunciaCard
                key={denuncia.id}
                denuncia={denuncia}
                showDelete={true}
                onDelete={() => {
                  setMisDenuncias((prev) =>
                    prev.filter((d: any) => d.id !== denuncia.id)
                  );
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
            <CardContent className="pt-6 text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No tienes denuncias aún
              </h3>
              <p className="text-muted-foreground mb-4">
                Comienza reportando un problema en tu comunidad
              </p>
              <Button asChild>
                <Link href="/nueva-denuncia">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Denuncia
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return content;
}
