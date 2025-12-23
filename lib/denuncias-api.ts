import { API_URL } from "./api";

export async function crearDenuncia({ title, description, category, image }: {
  title: string;
  description: string;
  category: string;
  image?: string;
}) {
  const res = await fetch(`${API_URL}/denuncias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, category, image }),
  });
  if (!res.ok) throw new Error("Error al crear denuncia");
  return res.json();
}
