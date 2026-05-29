const BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:5000"

export async function apiFetch(
  path: string,
  options: RequestInit & { token?: string } = {}
) {
  const { token, ...init } = options
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BACKEND_URL}${path}`, { ...init, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || "API error")
  }
  return res.json()
}

export const api = {
  get: (path: string, token?: string) => apiFetch(path, { token }),
  post: (path: string, body: unknown, token?: string) =>
    apiFetch(path, { method: "POST", body: JSON.stringify(body), token }),
  put: (path: string, body: unknown, token?: string) =>
    apiFetch(path, { method: "PUT", body: JSON.stringify(body), token }),
  patch: (path: string, body: unknown, token?: string) =>
    apiFetch(path, { method: "PATCH", body: JSON.stringify(body), token }),
  delete: (path: string, token?: string) =>
    apiFetch(path, { method: "DELETE", token }),
}
