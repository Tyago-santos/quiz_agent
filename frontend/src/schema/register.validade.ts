import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  username: z.string().min(2, "Nome precisa ter 2 há mais de caracteres"),
  password: z.string().min(6, "Senha precisa ter 6 há mais de caracteres"),
});
