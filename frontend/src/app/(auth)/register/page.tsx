"use client";

import { RegisterComponent } from "@/components/RegisterComponent";
import { registerService } from "@/services/registerService";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleRegister(data: {
    email: string;
    username: string;
    password: string;
  }) {
    setError("");
    try {
      await registerService(data);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md px-4 py-8">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        <RegisterComponent onSubmit={handleRegister} />
      </div>
    </div>
  );
}
