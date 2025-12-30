import { API_URL } from "./api";

export async function crearDenuncia({
  title,
  description,
  category,
  image,
  lat,
  lng,
  address,
}: {
  title: string;
  description: string;
  category: string;
  image: File;
  lat?: number;
  lng?: number;
  address?: string;
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("image", image);
  if (lat) formData.append("lat", lat.toString());
  if (lng) formData.append("lng", lng.toString());
  if (address) formData.append("address", address);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${API_URL}/denuncias`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al crear denuncia");
  }
  return res.json();
}

export async function eliminarDenuncia(id: string | number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${API_URL}/denuncias/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la denuncia");
  }
  return res.json();
}

export async function actualizarEstadoDenuncia(id: string | number, estado: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Map frontend status to backend status
  const statusMap: Record<string, string> = {
    "pendiente": "Pending",
    "en-revision": "In Progress",
    "resuelta": "Resolved",

  };

  const backendStatus = statusMap[estado];
  if (!backendStatus) throw new Error("Estado no válido");

  const res = await fetch(`${API_URL}/denuncias/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ status: backendStatus }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar estado");
  }
  return res.json();
}
