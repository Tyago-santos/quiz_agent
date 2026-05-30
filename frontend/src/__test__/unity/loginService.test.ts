import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginService } from "@/services/loginService";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("loginService", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return token on success", async () => {
    const fakeToken = { access_token: "abc123", token_type: "bearer" };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeToken),
    });

    const result = await loginService({
      email: "test@email.com",
      password: "123456",
    });

    expect(result).toEqual(fakeToken);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@email.com", password: "123456" }),
      }),
    );
  });

  it("should throw on invalid credentials", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: "Credenciais inválidas" }),
    });

    await expect(
      loginService({ email: "wrong@email.com", password: "wrong" }),
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("should fallback message when no detail", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    await expect(
      loginService({ email: "x@y.com", password: "123456" }),
    ).rejects.toThrow("Erro ao fazer login");
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(
      loginService({ email: "x@y.com", password: "123456" }),
    ).rejects.toThrow("Network error");
  });
});
