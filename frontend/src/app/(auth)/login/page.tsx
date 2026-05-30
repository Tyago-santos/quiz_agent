"use client";

import { LoginComponent } from "@/components/LoginComponent";
import { loginService } from "@/services/loginService";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogin(data: { email: string; password: string }) {
    setError("");
    try {
      const result = await loginService(data);
      localStorage.setItem("token", result.access_token);
      document.cookie = `token=${result.access_token}; path=/; max-age=86400; SameSite=Lax`;
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
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
        <LoginComponent onSubmit={handleLogin} />
      </div>
    </div>
  );
}
