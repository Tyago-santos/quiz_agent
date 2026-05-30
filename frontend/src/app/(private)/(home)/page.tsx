"use client";

import { HomeComponent } from "@/components/HomeComponent";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

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
        router.push("/login");
      }
      throw new Error("Erro ao obter resposta");
    }
    return res.json();
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-8">
      <HomeComponent onAsk={handleAsk} />
    </div>
  );
}
