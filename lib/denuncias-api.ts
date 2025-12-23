import { API_URL } from "./api";

export async function crearDenuncia({
  title,
  description,
  category,
  image,
}: {
  title: string;
  description: string;
  category: string;
  image?: string;
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("image", image);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${API_URL}/denuncias`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) throw new Error("Error al crear denuncia");
  return res.json();
}
