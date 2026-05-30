"use client";

import { HomeComponent } from "@/components/HomeComponent";
import { askService } from "@/services/quizService";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function handleAsk(message: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      throw new Error("Não autenticado");
    }
    try {
      return await askService(message, token);
    } catch {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0";
      router.push("/login");
      throw new Error("Erro ao obter resposta");
    }
  }

  return (
    <div className="flex flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-8">
      <HomeComponent onAsk={handleAsk} />
    </div>
  );
}
