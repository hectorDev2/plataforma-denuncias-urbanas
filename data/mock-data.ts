import type {
  Denuncia,
  Usuario,
  CategoriaDenuncia,
  EstadoDenuncia,
} from "@/lib/types";

export const mockUsuarios: Usuario[] = [
  {
    id: "1",
    nombre: "Rosa Huamán Quispe",
    email: "rosa.huaman@gmail.com",
    rol: "ciudadano",
  },
  {
    id: "2",
    nombre: "Carlos Mamani Torres",
    email: "carlos.mamani@hotmail.com",
    rol: "ciudadano",
  },
  {
    id: "3",
    nombre: "Luis Condori Apaza",
    email: "lcondori@municusco.gob.pe",
    rol: "autoridad",
  },
];

export const mockDenuncias: Denuncia[] = [
  {
    id: "1",
    titulo: "Bache profundo en Av. de la Cultura",
    descripcion:
      "Hay un bache muy grande a la altura del Óvalo Pachacútec que está causando daños a los vehículos. Mide aproximadamente 1 metro de diámetro y tiene más de 20cm de profundidad. Urge reparación antes de la temporada de lluvias.",
    categoria: "bache",
    estado: "pendiente",
    fecha: "2025-10-05T10:30:00Z",
    ubicacion: {
      lat: -13.5226,
      lng: -71.9673,
      direccion: "Av. de la Cultura 456, Óvalo Pachacútec, Wanchaq",
    },
    imagen: "/bache-en-calle.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Rosa Huamán Quispe",
  },
  {
    id: "2",
    titulo: "Acumulación de basura cerca al Mercado de Wanchaq",
    descripcion:
      "Lleva más de una semana sin recolectarse la basura en la esquina del Mercado de Wanchaq. Está generando malos olores y atrayendo perros callejeros. Los vecinos estamos preocupados por temas de salud pública. Contacto: 984 123 456",
    categoria: "basura",
    estado: "en-revision",
    fecha: "2025-10-04T15:45:00Z",
    ubicacion: {
      lat: -13.5253,
      lng: -71.9625,
      direccion: "Esquina Av. Huscar con Jr. Unión, Mercado Wanchaq",
    },
    imagen: "/basura-acumulada-en-calle.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "Carlos Mamani Torres",
  },
  {
    id: "3",
    titulo: "Poste de luz sin funcionar en Av. El Sol",
    descripcion:
      "El alumbrado público de este tramo de la Av. El Sol no funciona desde hace 5 días. La zona queda muy oscura por las noches y hay mucho movimiento turístico. Representa un riesgo de seguridad.",
    categoria: "alumbrado",
    estado: "resuelta",
    fecha: "2025-09-28T08:20:00Z",
    ubicacion: {
      lat: -13.5184,
      lng: -71.9785,
      direccion: "Av. El Sol 612, frente al Qorikancha",
    },
    imagen: "/poste-de-luz-apagado-de-noche.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Rosa Huamán Quispe",
  },
  {
    id: "4",
    titulo: "Semáforo malogrado en Plaza San Francisco",
    descripcion:
      "El semáforo del cruce de la Plaza San Francisco está intermitente en amarillo desde ayer, causando confusión entre conductores y riesgo de accidentes en pleno centro histórico. Contacto: 984 567 890",
    categoria: "semaforo",
    estado: "en-revision",
    fecha: "2025-10-06T12:00:00Z",
    ubicacion: {
      lat: -13.5195,
      lng: -71.9812,
      direccion: "Plaza San Francisco, cruce con Calle Santa Clara",
    },
    imagen: "/semaforo-en-amarillo-intermitente.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "Carlos Mamani Torres",
  },
  {
    id: "5",
    titulo: "Tapa de alcantarilla hundida en Calle Plateros",
    descripcion:
      "La tapa de la alcantarilla está hundida y rota en plena zona turística de Calle Plateros. Representa un peligro para peatones y turistas. Varios visitantes ya han tropezado.",
    categoria: "alcantarilla",
    estado: "pendiente",
    fecha: "2025-10-07T09:15:00Z",
    ubicacion: {
      lat: -13.5166,
      lng: -71.9784,
      direccion: "Calle Plateros 358, Centro Histórico",
    },
    imagen: "/alcantarilla-rota-en-calle.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Rosa Huamán Quispe",
  },
  {
    id: "6",
    titulo: "Grafiti en muro del Templo de San Blas",
    descripcion:
      "Pintas vandálicas en el muro exterior del tradicional barrio de San Blas, afectando el patrimonio cultural. Urge limpieza para mantener la estética del barrio artesanal.",
    categoria: "grafiti",
    estado: "resuelta",
    fecha: "2025-09-25T14:30:00Z",
    ubicacion: {
      lat: -13.5141,
      lng: -71.9764,
      direccion: "Cuesta San Blas 651, Barrio de San Blas",
    },
    imagen: "/grafiti-en-pared-de-edificio.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "Carlos Mamani Torres",
  },
  {
    id: "7",
    titulo: "Árbol caído bloqueando vereda en Av. Pardo",
    descripcion:
      "Un árbol de gran tamaño se cayó durante la ventisca de anoche y está bloqueando completamente la vereda de la Av. Pardo. Los peatones tienen que bajar a la pista. Necesitamos retiro urgente. Tel: 984 234 567",
    categoria: "otro",
    estado: "en-revision",
    fecha: "2025-10-06T16:45:00Z",
    ubicacion: {
      lat: -13.5215,
      lng: -71.9698,
      direccion: "Av. Pardo 1245, altura Óvalo Pachacútec",
    },
    imagen: "/arbol-caido-en-banqueta.jpg",
    ciudadanoId: "1",
    ciudadanoNombre: "Rosa Huamán Quispe",
  },
  {
    id: "8",
    titulo: "Bache peligroso frente al Colegio Educandas",
    descripcion:
      "Bache profundo justo en la entrada del Colegio Educandas en pleno centro. Representa un riesgo para los estudiantes que cruzan diariamente. Las lluvias lo están empeorando. Urgente.",
    categoria: "bache",
    estado: "pendiente",
    fecha: "2025-10-07T07:30:00Z",
    ubicacion: {
      lat: -13.5173,
      lng: -71.9797,
      direccion: "Jr. Arequipa 442, frente al Colegio Educandas",
    },
    imagen: "/bache-frente-a-escuela.jpg",
    ciudadanoId: "2",
    ciudadanoNombre: "Carlos Mamani Torres",
  },
];

export const categoriasConfig: Record<
  CategoriaDenuncia,
  { label: string; color: string; icon: string }
> = {
  bache: { label: "Bache", color: "bg-orange-500", icon: "🕳️" },
  basura: { label: "Basura", color: "bg-green-500", icon: "🗑️" },
  alumbrado: { label: "Alumbrado", color: "bg-yellow-500", icon: "💡" },
  semaforo: { label: "Semáforo", color: "bg-red-500", icon: "🚦" },
  alcantarilla: { label: "Alcantarilla", color: "bg-blue-500", icon: "⚠️" },
  grafiti: { label: "Grafiti", color: "bg-purple-500", icon: "🎨" },
  otro: { label: "Otro", color: "bg-gray-500", icon: "📋" },
};

export const estadosConfig: Record<
  EstadoDenuncia,
  { label: string; color: string }
> = {
  pendiente: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  "en-revision": {
    label: "En Revisión",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  resuelta: {
    label: "Resuelta",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  rechazada: {
    label: "Rechazada",
    color: "bg-red-100 text-red-800 border-red-300",
  },
};
