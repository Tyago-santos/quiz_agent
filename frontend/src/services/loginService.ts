export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

function getApiUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL || "http://backend:8000";
  }
  return "/api";
}

export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erro ao fazer login" }));
    throw new Error(err.detail || "Erro ao fazer login");
  }

  return res.json();
}
