import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "@/lib/api-error";
import { request } from "@/lib/client";

/* ── Helpers ── */
function mockFetch(response: Partial<Response>) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    ...response,
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

/* ── Tests ── */
describe("request()", () => {
  it("makes a GET request and returns parsed JSON", async () => {
    const body = { id: "abc-123" };
    const fetchFn = mockFetch({
      ok: true,
      json: () => Promise.resolve(body),
    });

    const result = await request("/reviews/abc-123");

    expect(result).toEqual(body);
    expect(fetchFn).toHaveBeenCalledOnce();

    const [url, options] = fetchFn.mock.calls[0];
    expect(url).toBe("http://localhost:3001/reviews/abc-123");
    expect(options.headers).toEqual(
      expect.objectContaining({ "Content-Type": "application/json" }),
    );
  });

  it("makes a POST request with body", async () => {
    const responseBody = { id: "new-id" };
    const fetchFn = mockFetch({
      ok: true,
      json: () => Promise.resolve(responseBody),
    });

    const payload = { language: "typescript", code: "const x = 1;" };
    const result = await request("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    expect(result).toEqual(responseBody);

    const [, options] = fetchFn.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.body).toBe(JSON.stringify(payload));
  });

  it("throws ApiError on non-ok response", async () => {
    mockFetch({ ok: false, status: 404 });

    await expect(request("/reviews/bad-id")).rejects.toThrow(ApiError);
    await expect(request("/reviews/bad-id")).rejects.toThrow(
      "Request failed with status 404",
    );
  });

  it("throws ApiError with status on HTTP error", async () => {
    mockFetch({ ok: false, status: 500 });

    try {
      await request("/reviews/x");
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(500);
    }
  });

  it("throws ApiError on network failure (TypeError)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    await expect(request("/reviews")).rejects.toThrow(ApiError);
    await expect(request("/reviews")).rejects.toThrow(
      "Sem conexão com o servidor",
    );
  });

  it("throws ApiError on abort/timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        new DOMException("Aborted", "AbortError"),
      ),
    );

    await expect(request("/reviews")).rejects.toThrow(ApiError);
    await expect(request("/reviews")).rejects.toThrow(
      "requisição excedeu o tempo limite",
    );
  });

  it("throws generic ApiError on unknown errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Something weird")),
    );

    await expect(request("/reviews")).rejects.toThrow(ApiError);
    await expect(request("/reviews")).rejects.toThrow("erro inesperado");
  });
});

describe("ApiError", () => {
  it("has correct name and message", () => {
    const err = new ApiError("test message", 400);

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.name).toBe("ApiError");
    expect(err.message).toBe("test message");
    expect(err.status).toBe(400);
  });

  it("status is optional", () => {
    const err = new ApiError("no status");

    expect(err.status).toBeUndefined();
  });
});
