import { ApiError } from "./api-error";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const REQUEST_TIMEOUT = 15_000; // 15s

/** Internal fetch wrapper with timeout and error handling */
export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("A requisição excedeu o tempo limite. Tente novamente.");
    }

    if (error instanceof TypeError) {
      throw new ApiError("Sem conexão com o servidor. Verifique sua internet.");
    }

    throw new ApiError("Ocorreu um erro inesperado. Tente novamente.");
  } finally {
    clearTimeout(timeout);
  }
}
