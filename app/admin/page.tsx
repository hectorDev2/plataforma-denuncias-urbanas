"use client";

import { useAuth } from "@/lib/auth-context";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { DenunciaCard } from "@/components/denuncia-card";
import {
    calcularEstadisticas,
    obtenerDenunciasPorEstado,
} from "@/lib/estadisticas";
import { categoriasConfig } from "@/data/mock-data";
import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    AlertCircle,
    BarChart3,
    Shield,
    MapPin,
} from "lucide-react";
import Link from "next/link";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Pie,
    PieChart,
    Cell,
} from "recharts";

export default function AdminDashboardPage() {
    const { usuario, isAuthenticated } = useAuth();

    if (!isAuthenticated || usuario?.rol !== "autoridad") {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
                    <CardContent className="pt-6 text-center space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Acceso Restringido</h2>
                            <p className="text-muted-foreground">
                                Esta sección es exclusiva para autoridades.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/login">Iniciar Sesión</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = calcularEstadisticas();
    const denunciasPendientes = obtenerDenunciasPorEstado("pendiente");
    const denunciasEnRevision = obtenerDenunciasPorEstado("en-revision");
    const tasaResolucion =
        stats.total > 0
            ? Math.round((stats.resueltas / stats.total) * 100)
            : 0;

    // Datos para gráficos
    const dataCategoria = Object.entries(stats.porCategoria).map(
        ([key, value]) => ({
            name: categoriasConfig[key as keyof typeof categoriasConfig].label,
            cantidad: value,
        })
    );

    const dataEstado = [
        { name: "Pendientes", value: stats.pendientes, color: "#eab308" },
        { name: "En Revisión", value: stats.enRevision, color: "#3b82f6" },
        { name: "Resueltas", value: stats.resueltas, color: "#22c55e" },
        { name: "Rechazadas", value: stats.rechazadas, color: "#ef4444" },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl md:text-4xl font-bold">Panel de Administración</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Bienvenido, Autoridad {usuario.nombre}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/denuncias">Ver Todas las Denuncias</Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Denuncias"
                    value={stats.total}
                    icon={FileText}
                    description="Reportes totales"
                />
                <StatCard
                    title="Pendientes"
                    value={stats.pendientes}
                    icon={Clock}
                    description="Prioridad Alta"
                    colorClass="text-yellow-600"
                />
                <StatCard
                    title="Casos Activos"
                    value={stats.enRevision}
                    icon={BarChart3}
                    description="En proceso de solución"
                    colorClass="text-blue-600"
                />
                <StatCard
                    title="Tasa de Resolución"
                    value={`${tasaResolucion}%`}
                    icon={TrendingUp}
                    description={`${stats.resueltas} resueltas`}
                    colorClass="text-green-600"
                />
            </div>

            {/* Actions Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm border-l-4 border-l-yellow-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            Pendientes de Asignación
                        </CardTitle>
                        <CardDescription>Denuncias nuevas que requieren revisión inicial</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{stats.pendientes}</div>
                        <p className="text-muted-foreground text-sm mb-4">Caso(s) esperando triaje</p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/denuncias?estado=pendiente">Gestionar Pendientes</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            Seguimiento de Campo
                        </CardTitle>
                        <CardDescription>Denuncias actualmente en proceso de reparación</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{stats.enRevision}</div>
                        <p className="text-muted-foreground text-sm mb-4">Caso(s) asignados a cuadrillas</p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/denuncias?estado=en-revision">Ver casos en proceso</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
                    <CardHeader>
                        <CardTitle>Denuncias por Categoría</CardTitle>
                        <CardDescription>
                            Distribución de problemas reportados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataCategoria}>
                                <XAxis
                                    dataKey="name"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "var(--radius)",
                                    }}
                                />
                                <Bar
                                    dataKey="cantidad"
                                    fill="hsl(var(--primary))"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
                    <CardHeader>
                        <CardTitle>Estado Global</CardTitle>
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
                                    label={({ name, percent }: any) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
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

            {/* Recent List */}
            <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Últimas Denuncias Ingresadas</CardTitle>
                            <CardDescription>
                                Monitoreo en tiempo real de reportes ciudadanos
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/denuncias">Ver Todas</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {denunciasPendientes.length > 0 || denunciasEnRevision.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...denunciasPendientes, ...denunciasEnRevision]
                                .slice(0, 3)
                                .map((denuncia) => (
                                    <DenunciaCard key={denuncia.id} denuncia={denuncia} />
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
                            <p className="text-muted-foreground">
                                No hay denuncias recientes activas
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
