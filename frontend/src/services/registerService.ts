export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

function getApiUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

export async function registerService(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(`${getApiUrl()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erro ao cadastrar" }));
    throw new Error(err.detail || "Erro ao cadastrar");
  }

  return res.json();
}
