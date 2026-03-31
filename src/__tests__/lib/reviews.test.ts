import { describe, it, expect, vi, beforeEach } from "vitest";
import { createReview, getReview } from "@/lib/reviews";

/* ── Helpers ── */
function mockFetch(body: unknown) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

/* ── Tests ── */
describe("createReview()", () => {
  it("sends POST /reviews with correct payload", async () => {
    const fetchFn = mockFetch({ id: "review-1" });

    const result = await createReview({
      language: "typescript",
      code: "const x = 1;",
      context: "test context",
    });

    expect(result).toEqual({ id: "review-1" });

    const [url, options] = fetchFn.mock.calls[0];
    expect(url).toContain("/reviews");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body.language).toBe("typescript");
    expect(body.code).toBe("const x = 1;");
    expect(body.context).toBe("test context");
  });
});

describe("getReview()", () => {
  it("sends GET /reviews/:id and returns response", async () => {
    const mockResponse = {
      id: "review-1",
      status: "done",
      result: {
        summary: "Good code",
        positives: [],
        issues: [],
        suggestions: [],
        questions: [],
        overallScore: 8,
      },
    };

    const fetchFn = mockFetch(mockResponse);
    const result = await getReview("review-1");

    expect(result).toEqual(mockResponse);

    const [url] = fetchFn.mock.calls[0];
    expect(url).toContain("/reviews/review-1");
  });
});
