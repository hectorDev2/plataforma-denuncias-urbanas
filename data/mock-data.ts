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

export const mockDenuncias: Denuncia[] = [];

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
};
