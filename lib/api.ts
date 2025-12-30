import { apiFetch } from "./fetcher";
import { API_URL } from "./config";

// Obtener una denuncia por su ID
export async function getDenunciaPorId(id: string | number) {
  const res = await apiFetch(`/denuncias/${id}`, { method: "GET" });
  if (!res.ok) throw new Error("Error al obtener la denuncia");
  const d = await res.json();
  return {
    id: String(d.id),
    titulo: d.title,
    descripcion: d.description,
    categoria: (d.category || "").toLowerCase(),
    estado: (d.status || "")
      .toLowerCase()
      .replace("pending", "pendiente")
      .replace("resolved", "resuelta")

      .replace("in progress", "en-revision"),
    fecha: d.createdAt,
    ubicacion: {
      lat: d.lat,
      lng: d.lng,
      direccion: d.address || "",
    },
    imagen: d.imageUrl,
    ciudadanoId: String(d.userId),
    ciudadanoNombre: d.user?.name || "Anónimo",
  };
}
// NOTE: API_URL ahora viene de `lib/config.ts`

// Obtener denuncias de un usuario específico
export async function getDenunciasPorUsuario(userId: string | number) {
  const res = await apiFetch(`/denuncias/usuario/${userId}`, { method: "GET" });
  if (!res.ok) throw new Error("Error al obtener denuncias del usuario");
  const data = await res.json();
  return data.map((d: any) => ({
    id: String(d.id),
    titulo: d.title,
    descripcion: d.description,
    categoria: (d.category || "").toLowerCase(),
    estado: (d.status || "")
      .toLowerCase()
      .replace("pending", "pendiente")
      .replace("resolved", "resuelta")

      .replace("in progress", "en-revision"),
    fecha: d.createdAt,
    ubicacion: {
      lat: d.lat,
      lng: d.lng,
      direccion: d.address || "",
    },
    imagen: d.imageUrl,
    ciudadanoId: String(d.userId),
    ciudadanoNombre: d.user?.name || "Anónimo",
  }));
}

// Obtener denuncias desde el backend
export async function getDenuncias(filters?: {
  estado?: string;
  categoria?: string;
}) {
  const params = new URLSearchParams();

  if (filters?.estado) {
    const statusMap: Record<string, string> = {
      pendiente: "Pending",
      "en-revision": "In Progress",
      resuelta: "Resolved",
    };
    if (statusMap[filters.estado]) {
      params.append("status", statusMap[filters.estado]);
    }
  }

  if (filters?.categoria) {
    params.append("category", filters.categoria);
  }

  const res = await apiFetch(`/denuncias?${params.toString()}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error al obtener denuncias");
  const data = await res.json();
  // Adaptar los campos del backend a los que espera el frontend
  return data.map((d: any) => ({
    id: String(d.id),
    titulo: d.title,
    descripcion: d.description,
    categoria: (d.category || "").toLowerCase(),
    estado: (d.status || "")
      .toLowerCase()
      .replace("pending", "pendiente")
      .replace("resolved", "resuelta")

      .replace("in progress", "en-revision"),
    fecha: d.createdAt,
    ubicacion: {
      lat: d.lat,
      lng: d.lng,
      direccion: d.address || "",
    },
    imagen: d.imageUrl,
    ciudadanoId: String(d.userId),
    ciudadanoNombre: d.user?.name || "Anónimo",
  }));
}
// helpers/api.ts

export async function register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await apiFetch(`/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Error en el registro");
  return res.json();
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await apiFetch(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await apiFetch(`/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al solicitar reseteo");
  }
  return res.json();
}

export async function resetPassword(token: string, password: string) {
  const res = await apiFetch(`/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al restablecer la contraseña");
  }
  return res.json();
}

export async function getMe(token: string) {
  const res = await apiFetch(`/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autenticado");
  const data = await res.json();
  // Map backend roles to frontend types
  return {
    ...data,
    rol: data.role === "authority" ? "autoridad" : "ciudadano",
  };
}

// Obtener estadísticas del dashboard
export async function getDashboardStats() {
  const res = await apiFetch(`/denuncias/stats/dashboard`, { method: "GET" });
  if (!res.ok) throw new Error("Error al obtener estadísticas");
  const d = await res.json();

  // Mapear respuesta del backend al formato del frontend
  const stats = {
    total: d.total,
    pendientes: d.byStatus["Pending"] || 0,
    enRevision: d.byStatus["In Progress"] || 0,
    resueltas: d.byStatus["Resolved"] || 0,

    porCategoria: {
      bache: d.byCategory["bache"] || 0,
      basura: d.byCategory["basura"] || 0,
      alumbrado: d.byCategory["alumbrado"] || 0,
      semaforo: d.byCategory["semaforo"] || 0,
      alcantarilla: d.byCategory["alcantarilla"] || 0,
      grafiti: d.byCategory["grafiti"] || 0,
      otro: d.byCategory["otro"] || 0,
    },
  };
  return stats;
}
