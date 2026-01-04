"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, FileText, MessageCircle, ThumbsUp, Lock } from "lucide-react";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/lib/comentarios-api";

export default function PerfilPage() {
  const { usuario: authUsuario, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    avatar: "",
    contrasenaActual: "",
    contrasenaNueva: "",
    contrasenaConfirmar: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({
        nombre: data.nombre,
        avatar: data.avatar || "",
        contrasenaActual: "",
        contrasenaNueva: "",
        contrasenaConfirmar: "",
      });
    } catch (error) {
      toast.error("Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasenaNueva && formData.contrasenaNueva !== formData.contrasenaConfirmar) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.contrasenaNueva && !formData.contrasenaActual) {
      toast.error("Ingresa tu contraseña actual");
      return;
    }

    try {
      const updateData: any = {
        nombre: formData.nombre,
        avatar: formData.avatar,
      };

      if (formData.contrasenaNueva) {
        updateData.contrasena = formData.contrasenaNueva;
        updateData.contrasenaActual = formData.contrasenaActual;
      }

      await updateProfile(updateData);
      toast.success("Perfil actualizado");
      setEditing(false);
      await loadProfile();
      
      // Limpiar campos de contraseña
      setFormData({
        ...formData,
        contrasenaActual: "",
        contrasenaNueva: "",
        contrasenaConfirmar: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar perfil");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Error al cargar perfil</p>
      </div>
    );
  }

  const rolLabel = profile.rol === "admin" ? "Administrador" : 
                   profile.rol === "authority" || profile.rol === "autoridad" ? "Autoridad" : 
                   "Ciudadano";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Columna Izquierda - Información Básica */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">
                  {profile.nombre.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold">{profile.nombre}</h2>
                <Badge variant={profile.rol === "admin" || profile.rol === "authority" || profile.rol === "autoridad" ? "default" : "secondary"}>
                  {rolLabel}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="break-all">{profile.correo}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Estadísticas</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Denuncias</span>
                  </div>
                  <span className="font-semibold">{profile._count?.denuncias || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Comentarios</span>
                  </div>
                  <span className="font-semibold">{profile._count?.comentarios || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span>Apoyos dados</span>
                  </div>
                  <span className="font-semibold">{profile._count?.votos || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Columna Derecha - Edición */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal y contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">URL del Avatar (opcional)</Label>
                <Input
                  id="avatar"
                  type="url"
                  placeholder="https://ejemplo.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <h3 className="font-semibold">Cambiar Contraseña</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasenaActual">Contraseña actual</Label>
                  <Input
                    id="contrasenaActual"
                    type="password"
                    value={formData.contrasenaActual}
                    onChange={(e) => setFormData({ ...formData, contrasenaActual: e.target.value })}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasenaNueva">Nueva contraseña</Label>
                  <Input
                    id="contrasenaNueva"
                    type="password"
                    value={formData.contrasenaNueva}
                    onChange={(e) => setFormData({ ...formData, contrasenaNueva: e.target.value })}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasenaConfirmar">Confirmar nueva contraseña</Label>
                  <Input
                    id="contrasenaConfirmar"
                    type="password"
                    value={formData.contrasenaConfirmar}
                    onChange={(e) => setFormData({ ...formData, contrasenaConfirmar: e.target.value })}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {!editing ? (
                  <Button type="button" onClick={() => setEditing(true)}>
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button type="submit">Guardar Cambios</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          nombre: profile.nombre,
                          avatar: profile.avatar || "",
                          contrasenaActual: "",
                          contrasenaNueva: "",
                          contrasenaConfirmar: "",
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
