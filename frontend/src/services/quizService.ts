export interface AskRequest {
  message: string;
}

export interface AskResponse {
  response: string;
  lesson: string;
}

function getApiUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

export async function askService(message: string, token: string): Promise<AskResponse> {
  const res = await fetch(`${getApiUrl()}/quiz/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Erro ao obter resposta");
  }

  return res.json();
}
