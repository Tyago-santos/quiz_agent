import {
  describe,
  it,
  beforeEach,
  vi,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { loginService } from "@/services/loginService";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

describe("login service", () => {
  beforeEach(() => {
    // Substitua a linha antiga por esta para garantir que o fetch global comece limpo
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    // Restaura o ambiente original do Vitest após cada teste
    vi.unstubAllGlobals();
  });

  it("should call login function", async () => {
    // Cria o mock mockando a resposta resolvida
    const fetchMock = vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: "ikajsdkasjdkasjk",
          token_type: "bearer",
        }),
      }),
    );

    const data = {
      email: "xlzthiago@gmail.com",
      password: "123456",
    };

    const response = await loginService(data);

    // Valida a URL e também as configurações da requisição (método, headers e body)
    await loginService(data);

    // Corrigido para a URL exata e validação direta do objeto
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/login", // Mudado de http://localhost:8000... para /api/...
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    );

    expect(response).toEqual({
      access_token: "ikajsdkasjdkasjk",
      token_type: "bearer",
    });
  });
});

// 1. Cria o servidor mock local para interceptar as requisições deste arquivo
const server = setupServer(
  // Intercepta requisições POST para a rota relativa ou absoluta
  http.post("*/api/auth/login", async ({ request }) => {
    // Retorna o sucesso idêntico ao que sua API real devolveria
    return HttpResponse.json({
      access_token: "ikajsdkasjdkasjk",
      token_type: "bearer",
    });
  }),
);

describe("login service", () => {
  // 2. Gerencia o ciclo de vida do servidor MSW durante os testes
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should call login function and return credentials", async () => {
    const data = {
      email: "xlzthiago@gmail.com",
      password: "123456",
    };

    // O serviço executa o fetch real, o MSW intercepta no nível de rede
    const response = await loginService(data);

    // Valida se o retorno foi processado corretamente pela sua função
    expect(response).toEqual({
      access_token: "ikajsdkasjdkasjk",
      token_type: "bearer",
    });
  });
});
