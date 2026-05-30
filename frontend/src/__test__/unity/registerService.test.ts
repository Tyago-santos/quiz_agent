import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerService } from "@/services/registerService";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("registerService", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return user on success", async () => {
    const fakeUser = { id: 1, username: "tiago", email: "test@email.com" };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeUser),
    });

    const result = await registerService({
      username: "tiago",
      email: "test@email.com",
      password: "123456",
    });

    expect(result).toEqual(fakeUser);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "tiago",
          email: "test@email.com",
          password: "123456",
        }),
      }),
    );
  });

  it("should throw on duplicate user", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: "Usuário já existe" }),
    });

    await expect(
      registerService({
        username: "tiago",
        email: "test@email.com",
        password: "123456",
      }),
    ).rejects.toThrow("Usuário já existe");
  });

  it("should fallback message when no detail", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    await expect(
      registerService({
        username: "tiago",
        email: "test@email.com",
        password: "123456",
      }),
    ).rejects.toThrow("Erro ao cadastrar");
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(
      registerService({
        username: "tiago",
        email: "test@email.com",
        password: "123456",
      }),
    ).rejects.toThrow("Network error");
  });
});
