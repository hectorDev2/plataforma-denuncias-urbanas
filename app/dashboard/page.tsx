"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { DenunciaCard } from "@/components/denuncia-card"
import { calcularEstadisticas, obtenerDenunciasPorEstado } from "@/lib/estadisticas"
import { categoriasConfig } from "@/data/mock-data"
import { FileText, Clock, CheckCircle2, XCircle, TrendingUp, AlertCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts"

export default function DashboardPage() {
  const { usuario, isAuthenticated } = useAuth()
  const [selectedView, setSelectedView] = useState<"overview" | "pending">("overview")

  if (!isAuthenticated || usuario?.rol !== "autoridad") {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Acceso Restringido</h2>
              <p className="text-muted-foreground">
                Esta sección es solo para autoridades. Inicia sesión con una cuenta de autoridad.
              </p>
            </div>
            <Button asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = calcularEstadisticas()
  const denunciasPendientes = obtenerDenunciasPorEstado("pendiente")
  const tasaResolucion = stats.total > 0 ? Math.round((stats.resueltas / stats.total) * 100) : 0

  // Datos para gráficos
  const dataCategoria = Object.entries(stats.porCategoria).map(([key, value]) => ({
    name: categoriasConfig[key as keyof typeof categoriasConfig].label,
    cantidad: value,
  }))

  const dataEstado = [
    { name: "Pendientes", value: stats.pendientes, color: "#eab308" },
    { name: "En Revisión", value: stats.enRevision, color: "#3b82f6" },
    { name: "Resueltas", value: stats.resueltas, color: "#22c55e" },
    { name: "Rechazadas", value: stats.rechazadas, color: "#ef4444" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard de Autoridades</h1>
        <p className="text-muted-foreground text-lg">Panel de control y estadísticas de denuncias urbanas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Denuncias"
          value={stats.total}
          icon={FileText}
          description="Todas las denuncias registradas"
        />
        <StatCard
          title="Pendientes"
          value={stats.pendientes}
          icon={Clock}
          description="Requieren atención"
          colorClass="text-yellow-600"
        />
        <StatCard
          title="En Revisión"
          value={stats.enRevision}
          icon={AlertCircle}
          description="Siendo evaluadas"
          colorClass="text-blue-600"
        />
        <StatCard
          title="Resueltas"
          value={stats.resueltas}
          icon={CheckCircle2}
          description={`${tasaResolucion}% de resolución`}
          colorClass="text-green-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Denuncias por Categoría</CardTitle>
            <CardDescription>Distribución de problemas reportados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataCategoria}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Estados */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de las Denuncias</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tasaResolucion}%</p>
                <p className="text-sm text-muted-foreground">Tasa de Resolución</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.enRevision + stats.pendientes}</p>
                <p className="text-sm text-muted-foreground">Casos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rechazadas}</p>
                <p className="text-sm text-muted-foreground">Rechazadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reports Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Denuncias Pendientes</CardTitle>
              <CardDescription>Requieren atención inmediata</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/denuncias">Ver Todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {denunciasPendientes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {denunciasPendientes.slice(0, 3).map((denuncia) => (
                <DenunciaCard key={denuncia.id} denuncia={denuncia} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <p className="text-muted-foreground">No hay denuncias pendientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
