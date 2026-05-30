import { describe, it, expect } from "vitest";
import { registerSchema } from "@/schema/register.validade";

describe("registerSchema (unity)", () => {
  it("should validate register", () => {
    const dataFake = {
      email: "xlzthiago@gmail.com",
      username: "tiago",
      password: "123456",
    };

    const result = registerSchema.safeParse(dataFake);

    expect(result.success).toBe(true);
  });

  it("should error email ", () => {
    const dataFake = {
      email: "xlzthiagmail.com",
      username: "tiago",
      password: "123456",
    };
    const result = registerSchema.safeParse(dataFake);

    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe("Email inválido");
  });

  it("should error password ", () => {
    const dataFake = {
      email: "xlzthiago@gmail.com",
      username: "tiago",
      password: "123",
    };
    const result = registerSchema.safeParse(dataFake);

    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe(
      "Senha precisa ter 6 há mais de caracteres",
    );
  });

  it("should error username", () => {
    const dataFake = {
      email: "xlzthiago@gmail.com",
      username: "T",
      password: "123456",
    };

    const result = registerSchema.safeParse(dataFake);

    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe(
      "Nome precisa ter 2 há mais de caracteres",
    );
  });
});
