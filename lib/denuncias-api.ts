import { API_URL } from "./api";

export async function crearDenuncia({
  title,
  description,
  category,
  image,
  lat,
  lng,
}: {
  title: string;
  description: string;
  category: string;
  image: File;
  lat?: number;
  lng?: number;
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("image", image);
  if (lat) formData.append("lat", lat.toString());
  if (lng) formData.append("lng", lng.toString());

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
