"use client";

import { HomeComponent } from "@/components/HomeComponent";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function handleAsk(message: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/quiz/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      },
    );
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0";
        router.push("/login");
      }
      throw new Error("Erro ao obter resposta");
    }
    return res.json();
  }

  return (
    <div className="flex flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-8">
      <HomeComponent onAsk={handleAsk} />
    </div>
  );
}
