import { describe, it, expect, vi, beforeEach } from "vitest";
import { askService } from "@/services/quizService";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("quizService", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return response on success", async () => {
    const fakeResponse = { response: "Resposta", lesson: "Lição" };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeResponse),
    });

    const result = await askService("quem é pelé?", "token123");

    expect(result).toEqual(fakeResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/quiz/ask",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
        body: JSON.stringify({ message: "quem é pelé?" }),
      }),
    );
  });

  it("should throw on error response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(askService("pergunta", "token")).rejects.toThrow(
      "Erro ao obter resposta",
    );
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(askService("pergunta", "token")).rejects.toThrow(
      "Network error",
    );
  });
});
