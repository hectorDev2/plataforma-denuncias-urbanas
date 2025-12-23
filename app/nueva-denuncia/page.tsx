"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { categoriasConfig } from "@/data/mock-data"
import type { CategoriaDenuncia, Ubicacion } from "@/lib/types"
import { Upload, CheckCircle2, AlertCircle, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { LocationPicker } from "@/components/location-picker"

export default function NuevaDenunciaPage() {
  const { isAuthenticated, usuario } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "" as CategoriaDenuncia | "",
    ubicacion: null as Ubicacion | null,
    imagen: null as File | null,
  })

  const handleChange = (field: string, value: string | File | null | Ubicacion) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleChange("imagen", file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isAuthenticated) {
      setError("Debes iniciar sesión para crear una denuncia")
      return
    }

    if (!formData.categoria) {
      setError("Por favor selecciona una categoría")
      return
    }

    if (!formData.ubicacion) {
      setError("Por favor selecciona una ubicación en el mapa")
      return
    }

    if (!formData.imagen) {
      setError("Por favor sube una imagen del problema")
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setIsLoading(false)

    setTimeout(() => {
      router.push("/mis-denuncias")
    }, 2000)
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Inicia sesión para continuar</h2>
              <p className="text-muted-foreground">Necesitas una cuenta para crear denuncias</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <a href="/login">Iniciar Sesión</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/registro">Registrarse</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Denuncia Enviada</h2>
              <p className="text-muted-foreground">Tu reporte ha sido registrado exitosamente.</p>
              <p className="text-sm text-muted-foreground">Las autoridades lo revisarán pronto.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Nueva Denuncia</h1>
          <p className="text-muted-foreground text-lg">Reporta un problema urbano en tu comunidad</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Problema</CardTitle>
            <CardDescription>Completa todos los campos para ayudarnos a resolver el problema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Bache profundo en Av. Principal"
                  value={formData.titulo}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => handleChange("categoria", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoriasConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.icon} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el problema con el mayor detalle posible..."
                  value={formData.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  required
                  disabled={isLoading}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Incluye detalles como tamaño, tiempo que lleva el problema, etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Ubicación *</Label>
                <LocationPicker
                  onLocationSelect={(loc) => handleChange("ubicacion", loc)}
                  initialLocation={formData.ubicacion || undefined}
                />
                <input type="hidden" name="direccion" value={formData.ubicacion?.direccion || ""} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen">Fotografía *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors hover:bg-muted/50">
                  <input
                    id="imagen"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <label htmlFor="imagen" className="cursor-pointer block w-full h-full">
                    {formData.imagen ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.imagen)}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-md object-contain"
                        />
                        <div className="mt-2 text-sm text-muted-foreground">
                          {formData.imagen.name} (Clic para cambiar)
                        </div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Haz clic para subir una imagen
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Denuncia"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
