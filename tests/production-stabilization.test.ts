import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { api, apiRequest } from "@/lib/api";
import { aggregateColleges } from "@/lib/leaderboard-api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("production API contract", () => {
  it("accepts the backend health status contract", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    ));
    await expect(api.checkBackend()).resolves.toBe(true);
  });

  it("does not retry state-changing requests", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);
    await expect(apiRequest("/api/auth/firebase", { method: "POST" })).rejects.toMatchObject({ retryable: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("Firebase custom auth domain", () => {
  it("proxies Firebase auth helpers through the purchased domain", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8"));
    expect(config.rewrites).toContainEqual({
      source: "/__/auth/:path*",
      destination: "https://sschscquiz.firebaseapp.com/__/auth/:path*",
    });
    expect(config.rewrites).toContainEqual({
      source: "/__/firebase/init.json",
      destination: "https://sschscquiz.firebaseapp.com/__/firebase/init.json",
    });
  });
});

describe("College Wars aggregation", () => {
  it("uses real entry scores and ignores profiles without an institution", () => {
    const rows = aggregateColleges([
      { rank: 1, name: "A", points: 1400, collegeName: "ঢাকা কলেজ" },
      { rank: 2, name: "B", points: 1200, collegeName: "ঢাকা কলেজ" },
      { rank: 3, name: "C", points: 1500, collegeName: "নটর ডেম কলেজ" },
      { rank: 4, name: "D", points: 2000 },
    ]);
    expect(rows).toEqual([
      { name: "ঢাকা কলেজ", score: 2600, studentCount: 2, topScore: 1400, avgScore: 1300 },
      { name: "নটর ডেম কলেজ", score: 1500, studentCount: 1, topScore: 1500, avgScore: 1500 },
    ]);
  });
});
