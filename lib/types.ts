export type EstadoDenuncia = "pendiente" | "en-revision" | "resuelta" | "rechazada"

export type CategoriaDenuncia = "bache" | "basura" | "alumbrado" | "semaforo" | "alcantarilla" | "grafiti" | "otro"

export interface Ubicacion {
  lat: number
  lng: number
  direccion: string
}

export interface Denuncia {
  id: string
  titulo: string
  descripcion: string
  categoria: CategoriaDenuncia
  estado: EstadoDenuncia
  fecha: string
  ubicacion: Ubicacion
  imagen: string
  ciudadanoId: string
  ciudadanoNombre: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: "ciudadano" | "autoridad"
  avatar?: string
}

export interface Estadisticas {
  total: number
  pendientes: number
  enRevision: number
  resueltas: number
  rechazadas: number
  porCategoria: Record<CategoriaDenuncia, number>
}
