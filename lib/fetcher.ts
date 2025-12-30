import { API_URL } from "./config";

export async function apiFetch(input: string, init?: RequestInit) {
  const url = input.startsWith("http")
    ? input
    : `${API_URL}${input.startsWith("/") ? "" : "/"}${input}`;

  const headers = new Headers((init?.headers as HeadersInit) || {});
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    // Logout on 401: remove token and redirect to login (client-side)
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      try {
        // preserve current path to return after login if desired
        window.location.href = "/login";
      } catch (e) {
        // noop
      }
    }
    throw new Error("No autenticado");
  }

  return res;
}
