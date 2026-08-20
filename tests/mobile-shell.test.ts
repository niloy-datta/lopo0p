import { describe, expect, it } from "vitest";
import {
  getMobileShellVariant,
  resolveMobilePracticeHref,
  shouldShowGlobalNavbar,
  shouldShowMobileBottomNav,
  shouldShowStudySidebar,
} from "@/lib/layout/mobile-shell";

describe("mobile shell routing", () => {
  it("uses focus mode for active quizzes", () => {
    expect(
      getMobileShellVariant("/ssc/physics/chapter/chapter-01/set/set-01"),
    ).toBe("quiz");
    expect(
      getMobileShellVariant("/hsc/physics-1st-paper/model-tests/model-01"),
    ).toBe("quiz");
  });

  it("uses an auth shell without persistent mobile navigation", () => {
    for (const pathname of [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password/token-1",
    ]) {
      expect(getMobileShellVariant(pathname)).toBe("auth");
      expect(shouldShowMobileBottomNav(pathname)).toBe(false);
    }
  });

  it("uses the study shell for discovery and account routes", () => {
    for (const pathname of [
      "/ssc",
      "/hsc/physics-1st-paper",
      "/ssc-board-questions",
      "/live-test",
      "/leaderboard/college-wars",
      "/dashboard",
      "/profile",
    ]) {
      expect(getMobileShellVariant(pathname)).toBe("study");
    }
  });

  it("keeps regular landing routes in the default shell", () => {
    expect(getMobileShellVariant("/")).toBe("default");
    expect(getMobileShellVariant("/premium")).toBe("default");
  });

  it("hides bottom navigation only for auth and quiz focus modes", () => {
    expect(shouldShowMobileBottomNav("/")).toBe(true);
    expect(shouldShowMobileBottomNav("/leaderboard")).toBe(true);
    expect(
      shouldShowMobileBottomNav("/ssc/physics/chapter/chapter-01/set/set-01"),
    ).toBe(false);
  });

  it("removes competing global chrome from active quiz routes", () => {
    const quizPath = "/ssc/physics/chapter/chapter-01/set/set-01";
    expect(shouldShowGlobalNavbar(quizPath)).toBe(false);
    expect(shouldShowStudySidebar(quizPath)).toBe(false);
    expect(shouldShowGlobalNavbar("/login")).toBe(true);
    expect(shouldShowStudySidebar("/ssc-board-questions")).toBe(true);
  });

  it("keeps the practice destination aligned with the visible or saved level", () => {
    expect(resolveMobilePracticeHref("/hsc/chemistry-1st-paper", "ssc")).toBe(
      "/hsc",
    );
    expect(resolveMobilePracticeHref("/profile", "hsc")).toBe("/hsc");
    expect(resolveMobilePracticeHref("/", null)).toBe("/ssc");
  });
});
