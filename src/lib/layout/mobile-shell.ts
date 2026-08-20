import {
  detectStudyLevel,
  isActiveQuizPath,
  isStudyLevelPath,
  levelHubPath,
  type RouteLevel,
} from "@/lib/quiz/unified-routes";

export type MobileShellVariant = "default" | "study" | "quiz" | "auth";

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

const STUDY_PATHS = [
  "/live-test",
  "/leaderboard",
  "/dashboard",
  "/profile",
  "/ssc-board-questions",
  "/hsc-board-questions",
];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function getMobileShellVariant(pathname: string): MobileShellVariant {
  if (isActiveQuizPath(pathname)) return "quiz";
  if (AUTH_PATHS.some((route) => matchesRoute(pathname, route))) return "auth";
  if (
    isStudyLevelPath(pathname) ||
    STUDY_PATHS.some((route) => matchesRoute(pathname, route))
  ) {
    return "study";
  }
  return "default";
}

export function shouldShowMobileBottomNav(pathname: string): boolean {
  const variant = getMobileShellVariant(pathname);
  return variant !== "auth" && variant !== "quiz";
}

export function shouldShowGlobalNavbar(pathname: string): boolean {
  return getMobileShellVariant(pathname) !== "quiz";
}

export function shouldShowStudySidebar(pathname: string): boolean {
  return getMobileShellVariant(pathname) === "study";
}

export function resolveMobilePracticeHref(
  pathname: string,
  savedLevel: RouteLevel | null,
): string {
  return levelHubPath(detectStudyLevel(pathname) ?? savedLevel ?? "ssc");
}
