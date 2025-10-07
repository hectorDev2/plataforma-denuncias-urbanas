"use client" // Indica que el componente se ejecuta en el cliente

import type React from "react"
import { useState } from "react" 
import { useRouter } from "next/navigation" 
import Link from "next/link" 
import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" 
import { Input } from "@/components/ui/input" 
import { Label } from "@/components/ui/label" 
import { Alert, AlertDescription } from "@/components/ui/alert" 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" 
import { MapPin, CheckCircle2 } from "lucide-react" 

export default function RegistroPage() {
  // Estado principal del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "ciudadano",
  })
  const [error, setError] = useState("") 
  const [success, setSuccess] = useState(false) 
  const [isLoading, setIsLoading] = useState(false) 
  const router = useRouter() 

  // 🔹 Función que maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // 🔸 Condicional: verifica que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    // 🔸 Condicional: valida longitud mínima de la contraseña
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    // 🔹 Simula un registro (espera 1 segundo)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 🔸 Cambia a estado de éxito
    setSuccess(true)
    setIsLoading(false)

    // 🔹 Redirige al login luego de 2 segundos
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  // 🔹 Función que actualiza los valores del formulario
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 🔸 Condicional: si el registro fue exitoso muestra mensaje
  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" /> 
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Registro Exitoso</h2>
              <p className="text-muted-foreground">Tu cuenta ha sido creada correctamente.</p>
              <p className="text-sm text-muted-foreground">Redirigiendo al inicio de sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🔹 Render principal del formulario de registro
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-foreground" /> 
            </div>
          </div>
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-muted-foreground">Únete a la comunidad de Denuncias Urbanas</p>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Completa el formulario para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 🔸 Condicional: si hay error, muestra alerta */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Campo: Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Campo: Correo */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Campo: Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Campo: Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Selección de tipo de cuenta */}
              <div className="space-y-3">
                <Label>Tipo de Cuenta</Label>
                <RadioGroup value={formData.rol} onValueChange={(value) => handleChange("rol", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ciudadano" id="ciudadano" />
                    <Label htmlFor="ciudadano" className="font-normal cursor-pointer">
                      Ciudadano - Reportar problemas urbanos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="autoridad" id="autoridad" />
                    <Label htmlFor="autoridad" className="font-normal cursor-pointer">
                      Autoridad - Gestionar denuncias
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Botón para enviar el formulario */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Enlace al login */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
