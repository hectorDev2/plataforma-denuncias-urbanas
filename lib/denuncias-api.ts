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
