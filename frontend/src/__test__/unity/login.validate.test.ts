import { describe, it, expect } from "vitest";
import { loginSchema } from "@/schema/login.validade";

describe("loginSchema (unity)", () => {
  it("should validade login", () => {
    const dataFake = {
      email: "xlzthiago@gmail.com",
      password: "123456",
    };

    const result = loginSchema.safeParse(dataFake);

    expect(result.success).toBe(true);
  });

  it("should error email ", () => {
    const dataFake = {
      email: "xlzthiagmail.com",

      password: "123456",
    };
    const result = loginSchema.safeParse(dataFake);

    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe("Email inválido");
  });

  it("should error password ", () => {
    const dataFake = {
      email: "xlzthiago@gmail.com",

      password: "123",
    };
    const result = loginSchema.safeParse(dataFake);

    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe(
      "Senha precisa ter 6 há mais de caracteres",
    );
  });
});
