const API_URL = "http://localhost:3000";

// Obtener denuncias desde el backend
export async function getDenuncias() {
  const res = await fetch(`${API_URL}/denuncias`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error al obtener denuncias");
  const data = await res.json();
  // Adaptar los campos del backend a los que espera el frontend
  return data.map((d: any) => ({
    id: String(d.id),
    titulo: d.title,
    descripcion: d.description,
    categoria: (d.category || '').toLowerCase(),
    estado: (d.status || '').toLowerCase().replace('pending', 'pendiente').replace('resolved', 'resuelta').replace('rejected', 'rechazada').replace('in_review', 'en-revision'),
    fecha: d.createdAt,
    ubicacion: {
      lat: d.lat,
      lng: d.lng,
      direccion: '', // No hay dirección en la respuesta, puedes adaptarlo si tu backend la provee
    },
    imagen: d.imageUrl,
    ciudadanoId: String(d.userId),
    ciudadanoNombre: d.user?.name || 'Anónimo',
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
  const res = await fetch(`${API_URL}/auth/register`, {
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
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autenticado");
  return res.json();
}
