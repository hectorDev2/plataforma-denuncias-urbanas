import type { Denuncia, Usuario, CategoriaDenuncia, EstadoDenuncia } from "@/lib/types"

export const mockUsuarios: Usuario[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan@email.com",
    rol: "ciudadano",
  },
  {
    id: "2",
    nombre: "María González",
    email: "maria@email.com",
    rol: "ciudadano",
  },
  {
    id: "3",
    nombre: "Carlos Rodríguez",
    email: "carlos@gobierno.gob",
    rol: "autoridad",
  },
]

export const mockDenuncias: Denuncia[] = [
  {
    id: "1",
    titulo: "Bache profundo en Av. Principal",
    descripcion:
      "Hay un bache muy grande que está causando daños a los vehículos. Mide aproximadamente 1 metro de diámetro y tiene más de 15cm de profundidad.",
    categoria: "bache",
    estado: "pendiente",
    fecha: "2024-01-15T10:30:00Z",
    ubicacion: {
      lat: 19.4326,
      lng: -99.1332,
      direccion: "Av. Principal #123, Col. Centro",
    },
    imagen: "/bache-en-calle.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Juan Pérez",
  },
  {
    id: "2",
    titulo: "Acumulación de basura en esquina",
    descripcion:
      "Lleva más de una semana sin recolectarse la basura en esta esquina. Está generando malos olores y atrayendo plagas.",
    categoria: "basura",
    estado: "en-revision",
    fecha: "2024-01-14T15:45:00Z",
    ubicacion: {
      lat: 19.4285,
      lng: -99.1277,
      direccion: "Calle Reforma esquina con Juárez",
    },
    imagen: "/basura-acumulada-en-calle.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "María González",
  },
  {
    id: "3",
    titulo: "Poste de luz sin funcionar",
    descripcion:
      "El alumbrado público de esta cuadra no funciona desde hace 3 días. La zona queda muy oscura por las noches.",
    categoria: "alumbrado",
    estado: "resuelta",
    fecha: "2024-01-10T08:20:00Z",
    ubicacion: {
      lat: 19.435,
      lng: -99.141,
      direccion: "Calle Hidalgo #456",
    },
    imagen: "/poste-de-luz-apagado-de-noche.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Juan Pérez",
  },
  {
    id: "4",
    titulo: "Semáforo descompuesto",
    descripcion: "El semáforo de este cruce está intermitente en amarillo, causando confusión y riesgo de accidentes.",
    categoria: "semaforo",
    estado: "en-revision",
    fecha: "2024-01-13T12:00:00Z",
    ubicacion: {
      lat: 19.43,
      lng: -99.135,
      direccion: "Cruce de Av. Insurgentes y Calle 5 de Mayo",
    },
    imagen: "/semaforo-en-amarillo-intermitente.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "María González",
  },
  {
    id: "5",
    titulo: "Tapa de alcantarilla rota",
    descripcion: "La tapa de la alcantarilla está rota y representa un peligro para peatones y ciclistas.",
    categoria: "alcantarilla",
    estado: "pendiente",
    fecha: "2024-01-16T09:15:00Z",
    ubicacion: {
      lat: 19.428,
      lng: -99.13,
      direccion: "Av. Juárez #789",
    },
    imagen: "/alcantarilla-rota-en-calle.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Juan Pérez",
  },
  {
    id: "6",
    titulo: "Grafiti en edificio público",
    descripcion: "Grafiti vandálico en la fachada del centro comunitario.",
    categoria: "grafiti",
    estado: "resuelta",
    fecha: "2024-01-08T14:30:00Z",
    ubicacion: {
      lat: 19.432,
      lng: -99.138,
      direccion: "Centro Comunitario, Calle Morelos #234",
    },
    imagen: "/grafiti-en-pared-de-edificio.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "María González",
  },
  {
    id: "7",
    titulo: "Árbol caído bloqueando banqueta",
    descripcion: "Un árbol se cayó durante la tormenta y está bloqueando completamente la banqueta.",
    categoria: "otro",
    estado: "en-revision",
    fecha: "2024-01-15T16:45:00Z",
    ubicacion: {
      lat: 19.434,
      lng: -99.132,
      direccion: "Parque Central, entrada norte",
    },
    imagen: "/arbol-caido-en-banqueta.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Juan Pérez",
  },
  {
    id: "8",
    titulo: "Bache en zona escolar",
    descripcion: "Bache peligroso justo frente a la escuela primaria, representa un riesgo para los niños.",
    categoria: "bache",
    estado: "pendiente",
    fecha: "2024-01-17T07:30:00Z",
    ubicacion: {
      lat: 19.431,
      lng: -99.129,
      direccion: "Frente a Escuela Primaria Benito Juárez",
    },
    imagen: "/bache-frente-a-escuela.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "María González",
  },
]

export const categoriasConfig: Record<CategoriaDenuncia, { label: string; color: string; icon: string }> = {
  bache: { label: "Bache", color: "bg-orange-500", icon: "🕳️" },
  basura: { label: "Basura", color: "bg-green-500", icon: "🗑️" },
  alumbrado: { label: "Alumbrado", color: "bg-yellow-500", icon: "💡" },
  semaforo: { label: "Semáforo", color: "bg-red-500", icon: "🚦" },
  alcantarilla: { label: "Alcantarilla", color: "bg-blue-500", icon: "⚠️" },
  grafiti: { label: "Grafiti", color: "bg-purple-500", icon: "🎨" },
  otro: { label: "Otro", color: "bg-gray-500", icon: "📋" },
}

export const estadosConfig: Record<EstadoDenuncia, { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  "en-revision": { label: "En Revisión", color: "bg-blue-100 text-blue-800 border-blue-300" },
  resuelta: { label: "Resuelta", color: "bg-green-100 text-green-800 border-green-300" },
  rechazada: { label: "Rechazada", color: "bg-red-100 text-red-800 border-red-300" },
}
