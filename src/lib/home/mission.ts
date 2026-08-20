import type { UserProfile } from "@/context/AuthContext";
import { parseSubjectKey, subjectPracticeHref } from "@/lib/dashboard-analytics";
import { subjectLabel } from "@/lib/profile-options";
import type { RouteLevel } from "@/lib/quiz/unified-routes";

export interface HomeMissionDashboard {
  weakChapters?: Array<{ slug: string; count: number }>;
  smartAnalysis?: {
    weakAreas?: Array<{
      slug: string;
      attempts: number;
      accuracy: number;
      wrongAnswers: number;
    }>;
  };
  player?: { streak?: number };
}

export interface HomeMissionViewModel {
  personalized: boolean;
  title: string;
  context: string;
  href: string;
  streak: number;
  rank: number | null;
}

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

function toBanglaDigits(value: string): string {
  return value.replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)] ?? digit);
}

function savedWeakSubject(value?: string): string | null {
  if (!value) return null;
  return ["physics", "chemistry", "biology", "higher-math", "math"].find(
    (subject) => value.toLowerCase().includes(subject),
  ) ?? null;
}

function weakMissionCopy(slug: string): { title: string; subject: string } {
  const subject = parseSubjectKey(slug);
  const chapter = slug.match(/chapter[-_/ ]?(\d+)/i)?.[1];
  return {
    subject,
    title: chapter
      ? `${subjectLabel(subject)} · অধ্যায় ${toBanglaDigits(chapter.padStart(2, "0"))}`
      : `${subjectLabel(subject)} ফোকাস`,
  };
}

export function buildMissionViewModel({
  level,
  user,
  dashboard,
}: {
  level: RouteLevel;
  user: UserProfile | null;
  dashboard: HomeMissionDashboard | null;
}): HomeMissionViewModel {
  if (!user) {
    return {
      personalized: false,
      title: `${level.toUpperCase()} Science Starter`,
      context: "শুরু করার জন্য বাছাই করা practice",
      href: `/${level}`,
      streak: 0,
      rank: null,
    };
  }

  const weakSlug =
    dashboard?.weakChapters?.[0]?.slug ??
    dashboard?.smartAnalysis?.weakAreas?.[0]?.slug ??
    null;
  const savedSubject = savedWeakSubject(user.weakSubjects);
  const weak = weakSlug
    ? weakMissionCopy(weakSlug)
    : savedSubject
      ? { subject: savedSubject, title: `${subjectLabel(savedSubject)} ফোকাস` }
      : null;

  return {
    personalized: Boolean(weak),
    title: weak?.title ?? "আজকের Science Practice",
    context: weak ? "তোমার সাম্প্রতিক ফল অনুযায়ী" : "আজকের ধারাবাহিকতা ধরে রাখো",
    href: weak ? subjectPracticeHref(weak.subject, level) : `/${level}`,
    streak: dashboard?.player?.streak ?? user.streak ?? 0,
    rank: user.rank ?? null,
  };
}
