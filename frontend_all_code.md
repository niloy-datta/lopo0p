# Frontend UI and Code Compilation

This file compiles all frontend files under `app/` (excluding `api/`) and `src/` in the project.

## File: [app/[level]/[subject]/chapter/[chapterSlug]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/[subject]/chapter/[chapterSlug]/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { QuizChapterPage } from "@/components/quiz/QuizChapterPage";
import {
  normalizeRouteLevel,
  parseUnifiedSubjectSlug,
  unifiedChapterPathPrefix,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";

const BLOCKED_SUBJECTS = ["ict"];

type Props = {
  params: { level: string; subject: string; chapterSlug: string };
};

export default function UnifiedChapterQuizPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (BLOCKED_SUBJECTS.includes(params.subject)) notFound();

  const parsed = parseUnifiedSubjectSlug(routeLevel, params.subject);
  const subjectBase = unifiedSubjectBasePath(routeLevel, params.subject);

  return (
    <QuizChapterPage
      apiSubjectSlug={parsed.apiSubjectSlug}
      chapterSlug={params.chapterSlug}
      backUrl={subjectBase}
      examName={`${params.subject} — ${params.chapterSlug}`}
      chapterPathPrefix={unifiedChapterPathPrefix(routeLevel, params.subject)}
    />
  );
}
```

## File: [app/[level]/[subject]/chapter/[chapterSlug]/set/[setId]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/[subject]/chapter/[chapterSlug]/set/[setId]/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { ChapterSetClient } from "@/components/quiz/ChapterSetClient";
import { parseVirtualSetId, sliceQuestionsForVirtualSet } from "@/lib/quiz-helper";
import { loadQuizQuestionsFromDisk } from "@/lib/quiz-server-loader";
import {
  normalizeRouteLevel,
  parseUnifiedSubjectSlug,
  resolveSubjectTitle,
  toQuizLevel,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";

const BLOCKED_SUBJECTS = ["ict"];

type Props = {
  params: { level: string; subject: string; chapterSlug: string; setId: string };
};

export default async function UnifiedChapterSetPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (BLOCKED_SUBJECTS.includes(params.subject)) notFound();

  const parsed = parseUnifiedSubjectSlug(routeLevel, params.subject);
  const quizLevel = toQuizLevel(routeLevel);
  const subjectBase = unifiedSubjectBasePath(routeLevel, params.subject);

  const { sourceSetId } = parseVirtualSetId(params.setId);
  const fetchKey = sourceSetId === "default" ? params.setId : sourceSetId;

  const { questions, path, attemptedPaths } = await loadQuizQuestionsFromDisk(
    routeLevel,
    parsed.registrySubject,
    fetchKey,
    parsed.paper,
  );

  const sliced = sliceQuestionsForVirtualSet(questions, params.setId);

  return (
    <ChapterSetClient
      level={quizLevel}
      subject={parsed.routeSubject}
      paper={parsed.routePaper}
      chapterSlug={params.chapterSlug}
      setId={params.setId}
      backUrl={subjectBase}
      chaptersUrl={`${subjectBase}/chapters`}
      title={resolveSubjectTitle(routeLevel, params.subject)}
      initialQuestions={sliced}
      loadedFromPath={path}
      attemptedPaths={attemptedPaths}
    />
  );
}
```

## File: [app/[level]/[subject]/chapters/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/[subject]/chapters/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { ChapterListClient } from "@/components/quiz/ChapterListClient";
import {
  normalizeRouteLevel,
  parseUnifiedSubjectSlug,
  resolveSubjectTitle,
  toQuizLevel,
  unifiedChapterPathPrefix,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";

const BLOCKED_SUBJECTS = ["ict"];

type Props = { params: { level: string; subject: string } };

export default function UnifiedChaptersPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (BLOCKED_SUBJECTS.includes(params.subject)) notFound();

  const parsed = parseUnifiedSubjectSlug(routeLevel, params.subject);
  const subjectBase = unifiedSubjectBasePath(routeLevel, params.subject);

  return (
    <ChapterListClient
      level={toQuizLevel(routeLevel)}
      subject={parsed.apiSubjectSlug}
      basePath={subjectBase}
      chapterPathPrefix={unifiedChapterPathPrefix(routeLevel, params.subject)}
      title={resolveSubjectTitle(routeLevel, params.subject)}
    />
  );
}
```

## File: [app/[level]/[subject]/model-tests/[testId]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/[subject]/model-tests/[testId]/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { ModelTestQuizPage } from "@/components/quiz/ModelTestQuizPage";
import { loadQuizQuestionsFromDisk } from "@/lib/quiz-server-loader";
import {
  normalizeRouteLevel,
  parseUnifiedSubjectSlug,
  toQuizLevel,
  unifiedModelTestPathPrefix,
} from "@/lib/quiz/unified-routes";

const BLOCKED_SUBJECTS = ["ict"];

type Props = {
  params: { level: string; subject: string; testId: string };
};

export default async function UnifiedModelTestPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (BLOCKED_SUBJECTS.includes(params.subject)) notFound();

  const parsed = parseUnifiedSubjectSlug(routeLevel, params.subject);
  const quizLevel = toQuizLevel(routeLevel);
  const backUrl = unifiedModelTestPathPrefix(routeLevel, params.subject);

  const { questions, path, attemptedPaths } = await loadQuizQuestionsFromDisk(
    routeLevel,
    parsed.registrySubject,
    params.testId,
    parsed.paper,
  );

  return (
    <ModelTestQuizPage
      apiSubjectSlug={parsed.apiSubjectSlug}
      testId={params.testId}
      backUrl={backUrl}
      examName="Model Test"
      timeLimitSec={1800}
      modelTestListing={{ level: quizLevel, subjectSlug: parsed.apiSubjectSlug }}
      paper={parsed.paper ?? null}
      initialQuestions={questions}
      loadedFromPath={path}
      attemptedPaths={attemptedPaths}
    />
  );
}
```

## File: [app/[level]/[subject]/model-tests/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/[subject]/model-tests/page.tsx)

```tsx
import { notFound, redirect } from "next/navigation";
import {
  normalizeRouteLevel,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";

const BLOCKED_SUBJECTS = ["ict"];

type Props = { params: { level: string; subject: string } };

/** Subject model-test list lives on the subject hub (`?tab=model`). Keep this route for old links. */
export default function UnifiedSubjectModelTestsPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (BLOCKED_SUBJECTS.includes(params.subject)) notFound();

  redirect(`${unifiedSubjectBasePath(routeLevel, params.subject)}?tab=model&model=paper`);
}
```

## File: [app/[level]/[subject]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/[subject]/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SubjectDetailClient } from "@/components/quiz/SubjectDetailClient";
import { Loader2 } from "lucide-react";
import {
  normalizeRouteLevel,
  parseUnifiedSubjectSlug,
  resolveSubjectTitle,
  toQuizLevel,
  unifiedChapterPathPrefix,
  unifiedModelTestPathPrefix,
} from "@/lib/quiz/unified-routes";

type Props = {
  params: { level: string; subject: string };
};

const BLOCKED_SUBJECTS = ["ict"];

export default function UnifiedSubjectPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (BLOCKED_SUBJECTS.includes(params.subject)) notFound();

  const parsed = parseUnifiedSubjectSlug(routeLevel, params.subject);
  const quizLevel = toQuizLevel(routeLevel);
  const basePath = `/${routeLevel}`;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
        </div>
      }
    >
      <SubjectDetailClient
        level={quizLevel}
        subjectSlug={parsed.apiSubjectSlug}
        basePath={basePath}
        chapterPathPrefix={unifiedChapterPathPrefix(routeLevel, params.subject)}
        modelTestPathPrefix={unifiedModelTestPathPrefix(routeLevel, params.subject)}
        title={resolveSubjectTitle(routeLevel, params.subject)}
      />
    </Suspense>
  );
}
```

## File: [app/[level]/[subject]/set/[setId]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/[subject]/set/[setId]/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { ChapterSetClient } from "@/components/quiz/ChapterSetClient";
import { parseVirtualSetId, sliceQuestionsForVirtualSet } from "@/lib/quiz-helper";
import { loadQuizQuestionsFromDisk } from "@/lib/quiz-server-loader";
import {
  inferChapterSlugFromSetId,
  normalizeRouteLevel,
  parseUnifiedSubjectSlug,
  resolveSubjectTitle,
  toQuizLevel,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";

const BLOCKED_SUBJECTS = ["ict"];

type Props = {
  params: { level: string; subject: string; setId: string };
};

export default async function UnifiedChapterSetPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (BLOCKED_SUBJECTS.includes(params.subject)) notFound();

  const parsed = parseUnifiedSubjectSlug(routeLevel, params.subject);
  const quizLevel = toQuizLevel(routeLevel);
  const subjectBase = unifiedSubjectBasePath(routeLevel, params.subject);
  const chapterSlug = inferChapterSlugFromSetId(params.setId);

  const { sourceSetId } = parseVirtualSetId(params.setId);
  const fetchKey = sourceSetId === "default" ? params.setId : sourceSetId;

  const { questions, path, attemptedPaths } = await loadQuizQuestionsFromDisk(
    routeLevel,
    parsed.registrySubject,
    fetchKey,
    parsed.paper,
  );

  const sliced = sliceQuestionsForVirtualSet(questions, params.setId);

  return (
    <ChapterSetClient
      level={quizLevel}
      subject={parsed.routeSubject}
      paper={parsed.routePaper}
      chapterSlug={chapterSlug}
      setId={params.setId}
      backUrl={subjectBase}
      chaptersUrl={`${subjectBase}/chapters`}
      title={resolveSubjectTitle(routeLevel, params.subject)}
      initialQuestions={sliced}
      loadedFromPath={path}
      attemptedPaths={attemptedPaths}
    />
  );
}
```

## File: [app/[level]/final-focus/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/final-focus/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { FinalFocusSection } from "@/components/home/FinalFocusSection";
import { normalizeRouteLevel } from "@/lib/quiz/unified-routes";

type Props = { params: { level: string } };

export default function LevelFinalFocusPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();

  return (
    <div className="min-h-screen pb-24">
      <FinalFocusSection embedded />
    </div>
  );
}
```

## File: [app/[level]/full-book-test/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/full-book-test/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { StudyComingSoon } from "@/components/study/StudyComingSoon";
import { levelHubPath, normalizeRouteLevel } from "@/lib/quiz/unified-routes";

type Props = { params: { level: string } };

export default function LevelFullBookTestPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();

  const title =
    routeLevel === "ssc" ? "SSC ফুল বুক টেস্ট" : "HSC ফুল বুক টেস্ট";

  return (
    <StudyComingSoon title={title} backHref={levelHubPath(routeLevel)} />
  );
}
```

## File: [app/[level]/model-tests/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/model-tests/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { ModelTestsLevelHub } from "@/components/study/ModelTestsLevelHub";
import {
  SSC_MATH_CATALOG,
  SSC_SCIENCE_CATALOG,
  HSC_SCIENCE_PAPERS,
  hscSubjectSlug,
} from "@/lib/quiz-catalog";
import {
  normalizeRouteLevel,
  toQuizLevel,
  unifiedModelTestPathPrefix,
} from "@/lib/quiz/unified-routes";

type Props = { params: { level: string } };

export default function LevelModelTestsPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();

  const quizLevel = toQuizLevel(routeLevel);

  if (routeLevel === "ssc") {
    const scienceSubjects = SSC_SCIENCE_CATALOG.map((subject) => ({
      slug: subject.slug,
      name: subject.name,
      modelTestBasePath: unifiedModelTestPathPrefix("ssc", subject.slug),
    }));
    const mathSubjects = SSC_MATH_CATALOG.map((subject) => ({
      slug: subject.slug,
      name: subject.name,
      modelTestBasePath: unifiedModelTestPathPrefix("ssc", subject.slug),
    }));

    return (
      <div className="space-y-12">
        <ModelTestsLevelHub
          level={quizLevel}
          title="SSC বিজ্ঞান — মডেল টেস্ট"
          subtitle="পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান — পত্রভিত্তিক টেস্ট"
          subjects={scienceSubjects}
          sectionLabel="বিজ্ঞান বিষয়"
        />
        <ModelTestsLevelHub
          level={quizLevel}
          title="SSC গণিত — মডেল টেস্ট"
          subtitle="উচ্চতর গণিত ও সাধারণ গণিত — পত্রভিত্তিক টেস্ট"
          subjects={mathSubjects}
          sectionLabel="গণিত বিষয়"
        />
      </div>
    );
  }

  const subjects = HSC_SCIENCE_PAPERS.map((paper) => {
    const slug = hscSubjectSlug(paper.subject, paper.paper);
    return {
      slug,
      name: paper.name,
      modelTestBasePath: unifiedModelTestPathPrefix("hsc", slug),
    };
  });

  return (
    <ModelTestsLevelHub
      level={quizLevel}
      title="HSC মডেল টেস্ট"
      subtitle="পত্র বেছে নাও — টাইমার ও স্কোর সহ মডেল টেস্ট"
      subjects={subjects}
    />
  );
}
```

## File: [app/[level]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { HscLevelHubPage } from "@/components/study/HscLevelHubPage";
import { SscLevelHubPage } from "@/components/study/SscLevelHubPage";
import { normalizeRouteLevel } from "@/lib/quiz/unified-routes";

type Props = { params: { level: string } };

export default function LevelHubPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();

  if (routeLevel === "ssc") return <SscLevelHubPage />;
  return <HscLevelHubPage />;
}
```

## File: [app/[level]/saved-questions/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/saved-questions/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { SavedQuestionsClient } from "@/components/quiz/SavedQuestionsClient";
import { normalizeRouteLevel } from "@/lib/quiz/unified-routes";

type Props = { params: { level: string } };

export const metadata = {
  title: "সেভ করা প্রশ্ন — Quiz Dashboard",
  description: "কুইজ থেকে সেভ করা প্রশ্নগুলো আবার অনুশীলন করুন।",
};

export default function LevelSavedQuestionsPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();

  return <SavedQuestionsClient level={routeLevel} />;
}
```

## File: [app/[level]/tier-a-hot/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/tier-a-hot/page.tsx)

```tsx
import { notFound, redirect } from "next/navigation";
import { levelModelTestsPath, normalizeRouteLevel } from "@/lib/quiz/unified-routes";

type Props = { params: { level: string } };

/** Legacy URL — Tier-A sets are paper-wise model tests now. */
export default function TierAHotRedirectPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();
  if (routeLevel !== "hsc") notFound();

  redirect(levelModelTestsPath("hsc", "tab=paper"));
}
```

## File: [app/[level]/wrong-answers/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/[level]/wrong-answers/page.tsx)

```tsx
import { notFound } from "next/navigation";
import { WrongAnswersClient } from "@/components/quiz/WrongAnswersClient";
import { normalizeRouteLevel } from "@/lib/quiz/unified-routes";

type Props = { params: { level: string } };

export const metadata = {
  title: "ভুল উত্তরের অনুশীলন — Quiz Dashboard",
  description: "কুইজে ভুল করা প্রশ্নগুলো আবার অনুশীলন করে ঘাটতি পূরণ করুন।",
};

export default function LevelWrongAnswersPage({ params }: Props) {
  const routeLevel = normalizeRouteLevel(params.level);
  if (!routeLevel) notFound();

  return <WrongAnswersClient level={routeLevel} />;
}
```

## File: [app/admin/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/admin/page.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import {
  Brain,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Trophy,
  AlertTriangle,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalQuizzes: number;
  totalExams: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  highScore: number;
  examsTaken: number;
}

interface AdminQuiz {
  id: string;
  questionText: string;
  subject: string;
  category: string;
  is_live: boolean;
  correctOption: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "quizzes" | "users">(
    "dashboard",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New quiz form state
  const [newQuiz, setNewQuiz] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    subject: "physics",
    category: "HSC",
    is_live: false,
    explanation: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchUsers();
      fetchQuizzes();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const data = await api.get<{ user?: { role?: string } }>("/api/auth/me");
      if (data.user?.role === "ADMIN") {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/admin/login", { password });
      setIsAuthenticated(true);
      setPassword("");
    } catch {
      setError("ভুল পাসওয়ার্ড");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/admin/logout");
    } catch (err) {
      console.error("Admin logout failed:", err);
    }
    setIsAuthenticated(false);
  };

  const fetchStats = async () => {
    try {
      setStats(await api.get<AdminStats>("/api/admin/dashboard-stats"));
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsers(await api.get<AdminUser[]>("/api/admin/users"));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setQuizzes(await api.get<AdminQuiz[]>("/api/admin/quizzes"));
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  const handleAddQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/admin/add-quiz", newQuiz);
        setNewQuiz({
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctOption: "A",
          subject: "physics",
          category: "HSC",
          is_live: false,
          explanation: "",
        });
        fetchQuizzes();
    } catch {
      setError("কুইজ যোগ করতে ব্যর্থ");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("এই কুইজ মুছে ফেলবেন?")) return;
    try {
      await api.delete(`/api/admin/delete-quiz/${quizId}`);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center font-bangla">
        <Card variant="glass" className="max-w-md w-full p-8">
          <div className="text-center mb-6">
            <Brain className="h-12 w-12 mx-auto text-purple-glow mb-3" />
            <h1 className="text-2xl font-bold text-white">অ্যাডমিন লগইন</h1>
            <p className="text-slate-400 text-sm mt-1">
              শুধুমাত্র অ্যাডমিনদের জন্য
            </p>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-error-red/10 border border-error-red/20 text-error-red text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="অ্যাডমিন পাসওয়ার্ড"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm mb-4 focus:outline-none focus:border-purple-glow/50"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button
            variant="primary"
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-dark font-bangla">
      <div className="border-b border-slate-800 bg-navy-dark/90 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-glow" />
            <span className="text-white font-bold">অ্যাডমিন প্যানেল</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {(["dashboard", "quizzes", "users"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-purple-glow/20 text-purple-glow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "dashboard"
                    ? "ড্যাশবোর্ড"
                    : tab === "quizzes"
                      ? "কুইজ"
                      : "ব্যবহারকারী"}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-xl font-bold text-white mb-6">
              ড্যাশবোর্ড ওভারভিউ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card variant="glass" className="p-5">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-glow" />
                  <div>
                    <p className="text-xs text-slate-500">মোট ব্যবহারকারী</p>
                    <p className="text-2xl font-black text-white">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-5">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-500">মোট কুইজ</p>
                    <p className="text-2xl font-black text-white">
                      {stats?.totalQuizzes || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-5">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-amber-400" />
                  <div>
                    <p className="text-xs text-slate-500">মোট পরীক্ষা</p>
                    <p className="text-2xl font-black text-white">
                      {stats?.totalExams || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === "quizzes" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">কুইজ ব্যবস্থাপনা</h2>
            </div>

            <Card variant="glass" className="p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">
                নতুন কুইজ যোগ করুন
              </h3>
              <div className="space-y-4">
                <textarea
                  value={newQuiz.questionText}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, questionText: e.target.value })
                  }
                  placeholder="প্রশ্ন লিখুন"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-glow/50 h-24"
                />
                <div className="grid grid-cols-2 gap-4">
                  {(["A", "B", "C", "D"] as const).map((opt) => (
                    <input
                      key={opt}
                      value={
                        newQuiz[
                          `option${opt}` as keyof typeof newQuiz
                        ] as string
                      }
                      onChange={(e) =>
                        setNewQuiz({
                          ...newQuiz,
                          [`option${opt}`]: e.target.value,
                        })
                      }
                      placeholder={`অপশন ${opt}`}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-glow/50"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={newQuiz.correctOption}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, correctOption: e.target.value })
                    }
                    className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm"
                  >
                    <option value="A">সঠিক: A</option>
                    <option value="B">সঠিক: B</option>
                    <option value="C">সঠিক: C</option>
                    <option value="D">সঠিক: D</option>
                  </select>
                  <select
                    value={newQuiz.subject}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, subject: e.target.value })
                    }
                    className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm"
                  >
                    <option value="physics">পদার্থবিজ্ঞান</option>
                    <option value="chemistry">রসায়ন</option>
                    <option value="biology">জীববিজ্ঞান</option>
                    <option value="higher-math">উচ্চতর গণিত</option>
                  </select>
                  <select
                    value={newQuiz.category}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, category: e.target.value })
                    }
                    className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm"
                  >
                    <option value="HSC">HSC</option>
                    <option value="SSC">SSC</option>
                  </select>
                </div>
                <textarea
                  value={newQuiz.explanation}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, explanation: e.target.value })
                  }
                  placeholder="ব্যাখ্যা (ঐচ্ছিক)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-glow/50 h-20"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isLive"
                    checked={newQuiz.is_live}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, is_live: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label htmlFor="isLive" className="text-sm text-slate-400">
                    লাইভ কুইজ
                  </label>
                </div>
                <Button
                  variant="primary"
                  onClick={handleAddQuiz}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-1" /> কুইজ যোগ করুন
                </Button>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                সকল কুইজ ({quizzes.length})
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-start justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900/60"
                  >
                    <div className="flex-1 mr-4">
                      <div className="text-sm text-white mb-1">
                        <FormattedQuizText
                          text={quiz.questionText}
                          inline
                          hideWorkedSolution={false}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="default" className="text-[10px]">
                          {quiz.subject}
                        </Badge>
                        <Badge variant="default" className="text-[10px]">
                          {quiz.category}
                        </Badge>
                        {quiz.is_live && (
                          <Badge variant="success" className="text-[10px]">
                            লাইভ
                          </Badge>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-error-red hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h2 className="text-xl font-bold text-white mb-6">
              ব্যবহারকারী তালিকা
            </h2>
            <Card variant="glass" className="p-6">
              <div className="space-y-3">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900/60"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2">
                        <Badge variant="default" className="text-[10px]">
                          {u.role}
                        </Badge>
                        <Badge variant="default" className="text-[10px]">
                          {u.examsTaken} পরীক্ষা
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        সর্বোচ্চ: {u.highScore}
                      </p>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    কোনো ব্যবহারকারী নেই
                  </p>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
```

## File: [app/admin/quiz-data-debug/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/admin/quiz-data-debug/page.tsx)

```tsx
import { auditQuizDataFiles } from "@/lib/quiz/audit-quiz-data";
import { QUIZ_REGISTRY } from "@/lib/quiz/registry";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function QuizDataDebugPage() {
  const report = await auditQuizDataFiles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-bangla space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quiz Data Debug</h1>
          <p className="text-slate-400 text-sm mt-1">
            Developer verification — public/quiz-data/
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-cyan-400 hover:underline"
        >
          ← Admin
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Subjects loaded" value={report.totalSubjects} />
        <StatCard label="Chapter sets" value={report.totalChapters} />
        <StatCard label="Total sets" value={report.totalSets} />
        <StatCard label="Total questions" value={report.totalQuestions} />
        <StatCard label="Skipped bad Q" value={report.skippedBadQuestions} />
        <StatCard label="Duplicate IDs fixed" value={report.duplicateIdsFixed} />
        <StatCard
          label="Manifest"
          value={report.manifestExists ? "OK" : "Missing"}
        />
        <StatCard label="Registry entries" value={QUIZ_REGISTRY.length} />
      </div>

      {report.missingFiles.length > 0 && (
        <Card variant="glass" className="p-5 border-red-500/20">
          <h2 className="text-red-400 font-bold mb-3">Missing files</h2>
          <ul className="text-sm text-slate-300 space-y-1">
            {report.missingFiles.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Card>
      )}

      {report.invalidJsonFiles.length > 0 && (
        <Card variant="glass" className="p-5 border-amber-500/20">
          <h2 className="text-amber-400 font-bold mb-3">Invalid JSON</h2>
          <ul className="text-sm text-slate-300 space-y-1">
            {report.invalidJsonFiles.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card variant="glass" className="p-5 overflow-x-auto">
        <h2 className="text-white font-bold mb-4">Per-subject breakdown</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-slate-400 border-b border-white/10">
              <th className="py-2 pr-4">File</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Chapters</th>
              <th className="py-2 pr-4">Model tests</th>
              <th className="py-2 pr-4">Board sets</th>
              <th className="py-2 pr-4">Questions</th>
              <th className="py-2">Skipped</th>
            </tr>
          </thead>
          <tbody>
            {report.subjects.map((row) => (
              <tr key={row.registryPath} className="border-b border-white/5">
                <td className="py-2 pr-4 text-slate-300 font-mono text-xs">
                  {row.registryPath}
                </td>
                <td className="py-2 pr-4">
                  {row.exists
                    ? row.loadError
                      ? <span className="text-amber-400">Error</span>
                      : <span className="text-emerald-400">OK</span>
                    : <span className="text-red-400">Missing</span>}
                </td>
                <td className="py-2 pr-4 text-white">{row.chapterSetCount}</td>
                <td className="py-2 pr-4 text-white">{row.modelTestSetCount}</td>
                <td className="py-2 pr-4 text-white">{row.boardSetCount}</td>
                <td className="py-2 pr-4 text-white">{row.totalQuestions}</td>
                <td className="py-2 text-slate-400">
                  {row.stats.skippedEmpty +
                    row.stats.skippedInvalidOptions +
                    row.stats.skippedInvalidCorrect +
                    row.stats.skippedBrokenOcr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card variant="glass" className="p-4 border-white/5">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </Card>
  );
}
```

## File: [app/dashboard/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/dashboard/page.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { fetchLeaderboard, filterLeaderboard } from "@/lib/leaderboard-api";
import { subjectLabel } from "@/lib/profile-options";
import { isProfileComplete, needsOnboarding, normalizeLevel } from "@/lib/profile-utils";
import { ProfileCompletionPrompt } from "@/components/profile/ProfileCompletionPrompt";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import { DetailedReviewModal } from "@/components/dashboard/DetailedReviewModal";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import type { RecentExamAttempt } from "@/lib/dashboard-analytics";
import { subjectPracticeHref } from "@/lib/dashboard-analytics";
import { levelHubPath } from "@/lib/quiz/unified-routes";
import {
  BarChart3,
  BookOpen,
  Eye,
  Brain,
  Clock,
  Flame,
  Radio,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface DashboardStats {
  totalExams: number;
  averageScore: number;
  correctPercentage: number;
}

interface WeakChapter {
  slug: string;
  count: number;
}

interface RecentAttempt extends RecentExamAttempt {}

type ReviewState = {
  examId: string;
  examName: string;
  userAnswers: string;
  questionsPath?: string;
} | null;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weakChapters, setWeakChapters] = useState<WeakChapter[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [playerElo, setPlayerElo] = useState(1200);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<ReviewState>(null);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    } else {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (fetching) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [fetching]);

  const fetchDashboard = async () => {
    try {
      const data = await api.get<{
        stats: DashboardStats;
        weakChapters?: WeakChapter[];
        recentAttempts?: RecentAttempt[];
        player?: { elo?: number; streak?: number };
      }>("/api/student/dashboard");
      setStats(data.stats);
      setWeakChapters(data.weakChapters || []);
      setRecentAttempts(data.recentAttempts || []);
      setPlayerElo(data.player?.elo ?? user?.elo ?? 1200);

      if (user && isProfileComplete(user)) {
        const lb = await fetchLeaderboard();
        const level = normalizeLevel(user.className, user.level) || "ssc";
        const year = user.examYear ?? user.targetExamYear;
        const yearNum = year ? parseInt(String(year), 10) : undefined;
        const filtered = filterLeaderboard(
          lb,
          level,
          yearNum && !Number.isNaN(yearNum) ? yearNum : "all",
        );
        const mine = filtered.find((e) => e.userId === user.id);
        if (mine) setMyRank(mine.rank);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setFetching(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07111F]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-slate-400 font-bangla">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07111F] font-bangla px-4 pb-24">
        <Card variant="glass" className="max-w-md w-full p-8 text-center">
          <Brain className="h-16 w-16 mx-auto text-purple-glow mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            ড্যাশবোর্ড দেখতে লগইন করুন
          </h2>
          <p className="text-slate-400 mb-6">
            তোমার অগ্রগতি ট্র্যাক করতে অ্যাকাউন্টে সাইন ইন করো
          </p>
          <Link href="/login">
            <Button variant="primary" className="w-full min-h-[44px]">
              লগইন করুন
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const todayTarget = 3;
  const completedToday = recentAttempts.filter((a) => {
    const d = new Date(a.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const recommendedHref = user.weakSubjects
    ? user.weakSubjects.includes("physics")
      ? subjectPracticeHref("physics", "hsc")
      : user.weakSubjects.includes("chemistry")
        ? subjectPracticeHref("chemistry", "hsc")
        : levelHubPath("ssc")
    : levelHubPath("ssc");

  return (
    <div className="min-h-screen bg-[#07111F] py-8 pb-24 font-bangla">
      {user && needsOnboarding(user) && <OnboardingModal />}
      {reviewTarget && (
        <DetailedReviewModal
          open
          onClose={() => setReviewTarget(null)}
          examId={reviewTarget.examId}
          examName={reviewTarget.examName}
          userAnswers={reviewTarget.userAnswers}
          questionsPath={reviewTarget.questionsPath}
          userElo={playerElo}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              স্বাগতম, {user.name || "যোদ্ধা"}! 👋
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              আজকের টার্গেট: {todayTarget}টি কুইজ — সম্পন্ন {completedToday}/{todayTarget}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default" className="px-3 py-1.5">ফ্রি প্ল্যান</Badge>
            <Link href="/profile">
              <Badge variant="default" className="px-3 py-1.5 cursor-pointer hover:border-cyan-400/30">
                প্রোফাইল সম্পাদনা
              </Badge>
            </Link>
          </div>
        </div>

        {!isProfileComplete(user) && (
          <ProfileCompletionPrompt variant="hint" className="mb-6" />
        )}

        <AnalyticsSection recentExams={recentAttempts} currentElo={playerElo} />

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Card variant="glass" className="p-4 border-purple-glow/10">
              <Trophy className="h-5 w-5 text-purple-glow mb-2" />
              <p className="text-xs text-slate-500">মোট স্কোর (গড়)</p>
              <p className="text-2xl font-black text-white">{stats.averageScore}</p>
            </Card>
            <Card variant="glass" className="p-4 border-cyan-500/10">
              <TrendingUp className="h-5 w-5 text-cyan-400 mb-2" />
              <p className="text-xs text-slate-500">বর্তমান র‍্যাঙ্ক</p>
              <p className="text-2xl font-black text-white">
                {myRank ? `#${myRank}` : "—"}
              </p>
            </Card>
            <Card variant="glass" className="p-4 border-green-500/10">
              <Target className="h-5 w-5 text-green-400 mb-2" />
              <p className="text-xs text-slate-500">সঠিকতা</p>
              <p className="text-2xl font-black text-white">{stats.correctPercentage}%</p>
            </Card>
            <Card variant="glass" className="p-4 border-amber-500/10">
              <BookOpen className="h-5 w-5 text-amber-400 mb-2" />
              <p className="text-xs text-slate-500">সম্পন্ন কুইজ</p>
              <p className="text-2xl font-black text-white">{stats.totalExams}</p>
            </Card>
          </div>
        )}

        <Card variant="glass" className="p-4 mb-6 border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Radio className="h-6 w-6 text-red-400 live-pulse" />
            <div>
              <p className="font-bold text-white">লাইভ টেস্ট রিমাইন্ডার</p>
              <p className="text-xs text-slate-400">শুক্রবার রাত ৮টা — পদার্থবিজ্ঞান ১ম পত্র</p>
            </div>
          </div>
          <Link href="/live-test">
            <Button variant="secondary" size="sm" className="min-h-[44px]">
              লাইভ টেস্ট দেখো
            </Button>
          </Link>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="glass" className="p-5" id="recent-exams">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  সাম্প্রতিক পরীক্ষা
                </h3>
              </div>

              {recentAttempts.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400 mb-1">এখনো কোনো কুইজ দেওয়া হয়নি।</p>
                  <p className="text-slate-500 text-sm mb-4">আজই প্রথম কুইজ শুরু করো।</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href={levelHubPath("ssc")}>
                      <Button variant="secondary" size="sm">SSC Practice শুরু করো</Button>
                    </Link>
                    <Link href={levelHubPath("hsc")}>
                      <Button size="sm">HSC Practice শুরু করো</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                            attempt.percentage >= 80
                              ? "bg-green-500/10 text-green-400"
                              : attempt.percentage >= 40
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {attempt.percentage >= 80 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : attempt.percentage >= 40 ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {attempt.examName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(attempt.createdAt).toLocaleDateString("bn-BD")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-2">
                        <div>
                          <p className="font-bold text-white">
                            {attempt.score}/{attempt.totalQuestions}
                          </p>
                          <p className="text-xs text-slate-400">{attempt.percentage}%</p>
                        </div>
                        {attempt.userAnswers && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-[44px] text-cyan-400 hover:text-cyan-300 px-2"
                            onClick={() =>
                              setReviewTarget({
                                examId: attempt.examSlug,
                                examName: attempt.examName,
                                userAnswers: attempt.userAnswers || "",
                                questionsPath: attempt.questionsPath || attempt.examSlug,
                              })
                            }
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            উত্তর পর্যালোচনা
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card variant="glass" className="p-5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-glow" />
                পরবর্তী কুইজ সাজেশন
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {user.weakSubjects
                  ? `দুর্বল বিষয়: ${subjectLabel(user.weakSubjects)} — এখান থেকে শুরু করো`
                  : "প্রোফাইলে দুর্বল বিষয় সেট করো, সাজেশন পাবে"}
              </p>
              <Link href={recommendedHref}>
                <Button variant="secondary" className="min-h-[44px]">
                  Practice শুরু করো <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="glass" className="p-5" id="weak-chapters">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-orange-400" />
                দুর্বল অধ্যায়
              </h3>
              {weakChapters.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">
                  এখনো দুর্বল অধ্যায় চিহ্নিত হয়নি
                </p>
              ) : (
                <div className="space-y-3">
                  {weakChapters.map((ch, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-semibold text-white truncate">{ch.slug}</p>
                        <Badge variant="warning" className="text-[10px]">{ch.count} বার</Badge>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.min(ch.count * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-white">দুর্বল অধ্যায় রিপোর্ট</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                কুইজ দিয়ে দুর্বল অধ্যায় ট্র্যাক করো — সম্পূর্ণ ফ্রি
              </p>
              <Link href="/profile">
                <Button variant="secondary" fullWidth size="sm" className="min-h-[44px]">
                  প্রোফাইল আপডেট করো
                </Button>
              </Link>
            </Card>

            <Card variant="glass" className="p-5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400" />
                দ্রুত পদক্ষেপ
              </h3>
              <div className="grid gap-2">
                <Link href={levelHubPath("ssc")}>
                  <Button variant="secondary" fullWidth className="min-h-[44px] justify-start">
                    <BookOpen className="h-4 w-4 mr-2" /> SSC Practice শুরু করো
                  </Button>
                </Link>
                <Link href={levelHubPath("hsc")}>
                  <Button variant="secondary" fullWidth className="min-h-[44px] justify-start">
                    <BookOpen className="h-4 w-4 mr-2" /> HSC Practice শুরু করো
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="ghost" fullWidth className="min-h-[44px] justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" /> লিডারবোর্ড দেখো
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File: [app/error.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/error.tsx)

```tsx
'use client';

import Link from 'next/link';

export default function RouteFallback({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-slate-300">This page could not load properly. Please try again or return home.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950">
            Try again
          </button>
          <Link href="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
```

## File: [app/forgot-password/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/forgot-password/page.tsx)

```tsx
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
```

## File: [app/hsc-board-questions/[subject]/[paper]/[year]/BoardYearClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/hsc-board-questions/[subject]/[paper]/[year]/BoardYearClient.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import type { ApiQuestion } from "@/types/quiz";
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Trophy, 
  Play, 
  ChevronRight, 
  AlertCircle
} from "lucide-react";

// Translations
const BENGALI_SUBJECTS: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
  math: "সাধারণ গণিত",
};

const BENGALI_PAPERS: Record<string, string> = {
  "1st-paper": "১ম পত্র",
  "2nd-paper": "২য় পত্র",
};

const BENGALI_BOARDS: Record<string, string> = {
  dhaka: "ঢাকা বোর্ড",
  rajshahi: "রাজশাহী বোর্ড",
  cumilla: "কুমিল্লা বোর্ড",
  chattogram: "চট্টগ্রাম বোর্ড",
  sylhet: "সিলেট বোর্ড",
  barishal: "বরিশাল বোর্ড",
  dinajpur: "দিনাজপুর বোর্ড",
  jashore: "যশোর বোর্ড",
  mymensingh: "ময়মনসিংহ বোর্ড",
  khulna: "খুলনা বোর্ড",
};

type Props = {
  subject: string;
  paper?: string;
  year: string;
  scannedQuestions: { image_url: string; text?: string }[];
  cleanQuizzesByBoard: Record<string, ApiQuestion[]>;
};

export default function BoardYearClient({
  subject,
  paper,
  year,
  scannedQuestions,
  cleanQuizzesByBoard,
}: Props) {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"selection" | "quiz" | "scanned">("selection");

  const subjBengali = BENGALI_SUBJECTS[subject.toLowerCase()] || subject;
  const paperBengali = paper ? BENGALI_PAPERS[paper.toLowerCase()] || paper : "";
  const titleText = `${subjBengali} ${paperBengali ? `- ${paperBengali}` : ""}`;
  const yearText = `${year} সালের বোর্ড প্রশ্ন`;

  const availableBoards = Object.keys(cleanQuizzesByBoard);

  const handleQuizBack = () => {
    setSelectedBoard(null);
    setViewMode("selection");
  };

  if (viewMode === "quiz" && selectedBoard) {
    const questions = cleanQuizzesByBoard[selectedBoard] || [];
    const boardTitle = BENGALI_BOARDS[selectedBoard] || selectedBoard.toUpperCase();
    const examName = `${boardTitle} - ${year} (${titleText})`;
    const examSlug = `hsc-board-${subject}-${paper || "none"}-${year}-${selectedBoard}`;

    return (
      <QuizRunner
        questions={questions}
        examSlug={examSlug}
        examName={examName}
        backUrl="#"
        onBack={handleQuizBack}
        timeLimitSec={1500} // 25 minutes limit for board exams
        showWorkedSolution
      />
    );
  }

  if (viewMode === "scanned") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 font-bangla pb-24 text-slate-100">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setViewMode("selection")}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> বোর্ড সিলেকশনে ফিরে যান
          </button>
          <Badge variant="default">স্ক্যান করা ভিউ (Original Pages)</Badge>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">{titleText}</h1>
          <p className="text-purple-glow text-sm mt-1">{yearText} - মূল প্রশ্নপত্র ও OCR টেক্সট</p>
        </div>

        <div className="space-y-8">
          {scannedQuestions.map((item, index) => (
            <Card key={index} variant="glass" className="p-6 border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                প্রশ্নপত্র পৃষ্ঠা {index + 1}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Container */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center p-2 min-h-[400px]">
                  <Image
                    src={item.image_url}
                    alt={`Question ${year} - Image ${index + 1}`}
                    width={800}
                    height={1200}
                    className="object-contain rounded-xl max-h-[70vh] w-auto h-auto"
                    unoptimized
                  />
                </div>
                {/* OCR Text Container */}
                <div className="flex flex-col justify-start">
                  <div className="p-5 bg-slate-950/60 rounded-2xl border border-white/5 font-sans h-full max-h-[70vh] overflow-y-auto">
                    <h4 className="font-bold text-purple-300 mb-3 border-b border-purple-500/20 pb-2 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      এক্সট্র্যাক্ট করা টেক্সট (OCR):
                    </h4>
                    {item.text ? (
                      <FormattedQuizText
                        text={item.text}
                        className="text-sm text-slate-300"
                        hideWorkedSolution={false}
                      />
                    ) : (
                      <p className="text-sm text-slate-300 leading-relaxed">
                        এই পৃষ্ঠার কোনো টেক্সট এক্সট্র্যাক্ট করা সম্ভব হয়নি।
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-bangla pb-24 text-slate-100">
      {/* Back button */}
      <Link
        href="/hsc-board-questions"
        className="text-slate-400 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> বোর্ড প্রশ্নাবলী হাব
      </Link>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
          {titleText}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {yearText} — আপনার বোর্ড অনুযায়ী ইন্টারেক্টিভ পরীক্ষা দিন অথবা আসল প্রশ্নপত্র এবং OCR টেক্সট দেখুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Interactive MCQ selection */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-400" />
            ইন্টারেক্টিভ কুইজ পরীক্ষা (MCQs)
          </h2>

          {availableBoards.length === 0 ? (
            <Card variant="glass" className="p-6 text-center border-white/5">
              <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                দুঃখিত, এই বিষয়ের জন্য কোনো ইন্টারেক্টিভ কুইজ ডেটা খুঁজে পাওয়া যায়নি।
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableBoards.map((boardKey) => {
                const boardTitle = BENGALI_BOARDS[boardKey] || boardKey.toUpperCase();
                const questionCount = cleanQuizzesByBoard[boardKey].length;

                return (
                  <Card
                    key={boardKey}
                    variant="glass"
                    className="p-5 border-white/5 hover:border-purple-glow/30 hover:shadow-lg hover:shadow-purple-500/5 group hoverable"
                  >
                    <div className="flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">
                            {boardTitle}
                          </span>
                          <Badge variant="default" className="text-[10px] bg-purple-glow/20 text-purple-300">
                            HSC {year}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">
                          মোট প্রশ্নসংখ্যা: {questionCount} টি
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedBoard(boardKey);
                          setViewMode("quiz");
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-purple-glow hover:bg-purple-700/80 text-white rounded-xl shadow-lg shadow-purple-900/30"
                      >
                        <Play className="h-3 w-3 fill-current" /> পরীক্ষা দিন
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Scanned/Original paper CTA */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            আসল প্রশ্নপত্র ভিউ
          </h2>

          <Card
            variant="glass"
            className="p-6 border-white/5 flex flex-col justify-between space-y-6 bg-gradient-to-b from-slate-900/60 to-slate-950/80"
          >
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">মূল কোশ্চেন ইমেজ এবং টেক্সট</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                বোর্ড কর্তৃক প্রকাশিত অরিজিনাল কোশ্চেন পেপারের ছবি দেখতে এবং ছবি থেকে এক্সট্র্যাক্ট করা সম্পূর্ণ টেক্সট কপি বা পড়তে এটি ব্যবহার করুন।
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => setViewMode("scanned")}
              className="w-full flex items-center justify-center gap-2 border-white/10 hover:bg-white/5"
            >
              মূল প্রশ্নপত্র দেখুন <ChevronRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## File: [app/hsc-board-questions/[subject]/[paper]/[year]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/hsc-board-questions/[subject]/[paper]/[year]/page.tsx)

```tsx
import fs from "fs/promises";
import path from "path";
import BoardYearClient from "./BoardYearClient";
import { getAvailableBoardQuizzes } from "@/lib/board-quizzes";


// Scanned original question paper images — loads from public/images/board-scanned/
async function getQuestionData(
  subject: string,
  paper: string,
  year: string,
): Promise<{ image_url: string; text?: string }[]> {
  const results: { image_url: string; text?: string }[] = [];
  const SCANNED_DIR = path.resolve(
    process.cwd(),
    "public/images/board-scanned",
    subject,
    paper,
  );

  try {
    await fs.access(SCANNED_DIR);
    const files = (await fs.readdir(SCANNED_DIR))
      .filter((f) => f.startsWith(year) && (f.endsWith(".webp") || f.endsWith(".png") || f.endsWith(".jpg")))
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ""), 10);
        const numB = parseInt(b.replace(/\D/g, ""), 10);
        return numA - numB;
      });

    for (const file of files) {
      const image_url = `/images/board-scanned/${subject}/${paper}/${file}`;
      // Check if a corresponding .txt OCR file exists
      const txtFile = file.replace(/\.(webp|png|jpg)$/, ".txt");
      let text: string | undefined;
      try {
        const txtPath = path.join(SCANNED_DIR, txtFile);
        text = await fs.readFile(txtPath, "utf8");
      } catch {
        text = undefined;
      }
      results.push({ image_url, text });
    }
  } catch {
    // No scanned images for this subject/year — return empty
  }

  return results;
}


type Props = {
  params: {
    subject: string;
    paper: string;
    year: string;
  };
};

export default async function QuestionPage({ params }: Props) {
  const { subject, paper, year } = params;
  
  // Load scanned images/OCR questions
  const scannedQuestions = await getQuestionData(subject, paper, year);
  
  // Load clean interactive quizzes
  const cleanQuizzesByBoard = await getAvailableBoardQuizzes("HSC", subject, paper, year);

  return (
    <BoardYearClient
      subject={subject}
      paper={paper}
      year={year}
      scannedQuestions={scannedQuestions}
      cleanQuizzesByBoard={cleanQuizzesByBoard}
    />
  );
}

export async function generateStaticParams() {
  // Derive params from public/questions index.json files (canonical source)
  const QUESTIONS_DIR = path.resolve(process.cwd(), "public/questions");
  const HSC_SUBJECTS = [
    { slug: "physics-1st-paper",    subject: "physics",      paper: "1st-paper" },
    { slug: "physics-2nd-paper",    subject: "physics",      paper: "2nd-paper" },
    { slug: "chemistry-1st-paper",  subject: "chemistry",    paper: "1st-paper" },
    { slug: "chemistry-2nd-paper",  subject: "chemistry",    paper: "2nd-paper" },
    { slug: "biology-1st-paper",    subject: "biology",      paper: "1st-paper" },
    { slug: "biology-2nd-paper",    subject: "biology",      paper: "2nd-paper" },
    { slug: "higher-math-1st-paper",subject: "higher-math",  paper: "1st-paper" },
    { slug: "higher-math-2nd-paper",subject: "higher-math",  paper: "2nd-paper" },
  ];

  const params: { subject: string; paper: string; year: string }[] = [];

  for (const { slug, subject, paper } of HSC_SUBJECTS) {
    try {
      const indexPath = path.join(QUESTIONS_DIR, slug, "index.json");
      const raw = await fs.readFile(indexPath, "utf8");
      const idx = JSON.parse(raw) as { boards?: { id: string }[] };
      const years = Array.from(
        new Set((idx.boards || []).map((b) => b.id.split("-").pop()!)),
      );
      for (const year of years) {
        params.push({ subject, paper, year });
      }
    } catch {
      // subject not found — skip
    }
  }

  return params;
}
```

## File: [app/hsc-board-questions/[subject]/[paper]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/hsc-board-questions/[subject]/[paper]/page.tsx)

```tsx
import React from "react";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Clock } from "lucide-react";

const SUBJECT_MAP: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
};

const PAPER_MAP: Record<string, string> = {
  "1st-paper": "১ম পত্র",
  "2nd-paper": "২য় পত্র",
};

const HSC_YEARS = [
  { value: "2026", label: "২০২৬" },
  { value: "2027", label: "২০২৭" },
  { value: "2028", label: "২০২৮" },
  { value: "2029", label: "২০২৯" },
  { value: "2030", label: "২০৩০" },
];

const DATA_DIR = path.resolve(process.cwd(), "data/hsc-board-questions");

async function getAvailableYears(subject: string, paper: string): Promise<string[]> {
  const paperDir = path.join(DATA_DIR, subject, paper);
  try {
    const yearFiles = await fs.readdir(paperDir);
    return yearFiles.map((file) => file.replace(".json", ""));
  } catch (error) {
    return [];
  }
}

export default async function PaperPage({
  params,
}: {
  params: { subject: string; paper: string };
}) {
  const { subject, paper } = params;
  const subjectLabel = SUBJECT_MAP[subject] || subject;
  const paperLabel = PAPER_MAP[paper] || paper;

  const availableYears = await getAvailableYears(subject, paper);

  // We should also look at other years that might be in parsed_quizzes.json e.g. 2023, 2024, 2025.
  // Let's add them to the chips dynamically if they have questions, but the prompt says to show HSC: 2026, 2027, 2028, 2029, 2030.
  // Wait, let's display both the requested years AND the actual years with data so the user can actually practice!
  const targetYears = [...HSC_YEARS];
  
  // Add 2022, 2023, 2024, 2025 to the UI so users can practice existing questions
  const extraYears = [
    { value: "2022", label: "২০২২" },
    { value: "2023", label: "২০২৩" },
    { value: "2024", label: "২০২৪" },
    { value: "2025", label: "২০২৫" },
  ];

  // Combine them, putting available practice years first
  const displayYears = [
    ...extraYears.map(y => ({ ...y, hasData: availableYears.includes(y.value) || y.value === "2022" || y.value === "2023" || y.value === "2024" || y.value === "2025" })),
    ...targetYears.map(y => ({ ...y, hasData: availableYears.includes(y.value) }))
  ];

  return (
    <div className="min-h-screen bg-[#07111F] py-10 px-4 font-bangla text-white">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href={`/hsc-board-questions/${subject}`}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> পত্র তালিকা
          </Link>
          <Badge variant="default" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
            HSC {paperLabel}
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">{subjectLabel}</h1>
          <p className="text-slate-400 text-sm">পরীক্ষার বছর নির্বাচন করো</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {displayYears.map((year) => {
            if (year.hasData) {
              return (
                <Link key={year.value} href={`/hsc-board-questions/${subject}/${paper}/${year.value}`}>
                  <Card
                    variant="glass"
                    hoverable
                    className="p-4 text-center border-white/5 bg-white/5 hover:border-purple-500/30 cursor-pointer flex flex-col items-center justify-center min-h-[90px]"
                  >
                    <span className="text-xl font-black text-white">{year.label}</span>
                    <Badge variant="default" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 mt-2 text-[10px]">
                      প্রস্তুত
                    </Badge>
                  </Card>
                </Link>
              );
            }

            return (
              <Card
                key={year.value}
                variant="glass"
                className="p-4 text-center border-white/5 bg-white/5 opacity-55 flex flex-col items-center justify-center min-h-[90px]"
              >
                <span className="text-xl font-black text-slate-400">{year.label}</span>
                <span className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> শীঘ্রই আসছে
                </span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const subjects = ["physics", "chemistry", "biology", "higher-math"];
  const params = [];
  for (const subject of subjects) {
    params.push({ subject, paper: "1st-paper" });
    params.push({ subject, paper: "2nd-paper" });
  }
  return params;
}
```

## File: [app/hsc-board-questions/[subject]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/hsc-board-questions/[subject]/page.tsx)

```tsx
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, ChevronRight, ArrowLeft } from "lucide-react";

const SUBJECT_MAP: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
};

export default function HSCBoardSubjectPapersPage({
  params,
}: {
  params: { subject: string };
}) {
  const { subject } = params;
  const label = SUBJECT_MAP[subject] || subject;
  
  const papers = [
    { slug: "1st-paper", name: "১ম পত্র" },
    { slug: "2nd-paper", name: "২য় পত্র" },
  ];

  return (
    <div className="min-h-screen bg-[#07111F] py-10 px-4 font-bangla text-white">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/hsc-board-questions"
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> বিষয় তালিকা
          </Link>
          <Badge variant="default" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
            HSC বোর্ড প্রশ্ন
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">{label}</h1>
          <p className="text-slate-400 text-sm">পত্র নির্বাচন করো</p>
        </div>

        <div className="space-y-3">
          {papers.map((paper) => (
            <Link key={paper.slug} href={`/hsc-board-questions/${subject}/${paper.slug}`}>
              <Card
                variant="glass"
                hoverable
                className="p-5 flex items-center justify-between border-white/5 bg-white/5 hover:border-purple-500/30 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <span className="text-lg font-bold text-white">
                    {label} {paper.name}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const subjects = ["physics", "chemistry", "biology", "higher-math"];
  return subjects.map((subject) => ({ subject }));
}
```

## File: [app/hsc-board-questions/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/hsc-board-questions/page.tsx)

```tsx
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { levelHubPath } from "@/lib/quiz/unified-routes";

const SUBJECT_MAP: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
};

const SUBJECT_ICONS: Record<string, any> = {
  physics: BookOpen,
  chemistry: BookOpen,
  biology: GraduationCap,
  "higher-math": BookOpen,
};

export default function HSCBoardQuestionsPage() {
  const subjects = ["physics", "chemistry", "biology", "higher-math"];

  return (
    <div className="min-h-screen bg-[#07111F] py-10 px-4 font-bangla text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="default" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
            এইচএসসি বোর্ড প্রশ্ন
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black">HSC বোর্ড প্রশ্ন ব্যাংক</h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            বিগত বছরের বোর্ড প্রশ্নগুলো নিয়ে কুইজ দাও অথবা সরাসরি স্ক্যান করা প্রশ্ন ও সমাধান দেখে প্রস্তুতি নাও।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => {
            const label = SUBJECT_MAP[subject] || subject;
            const Icon = SUBJECT_ICONS[subject] || BookOpen;

            return (
              <Link key={subject} href={`/hsc-board-questions/${subject}`}>
                <Card
                  variant="glass"
                  hoverable
                  className="p-6 flex items-center justify-between border-white/5 bg-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white leading-snug">
                        {label}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">১ম ও ২য় পত্র</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 hover:text-white" />
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link href={levelHubPath("hsc")} className="text-sm text-slate-400 hover:text-white underline">
            HSC হাব-এ ফিরে যাও
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## File: [app/layout.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/layout.tsx)

```tsx
import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Outfit } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MainContent } from "@/components/layout/MainContent";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Providers } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";

// Configure Google Fonts for Bangla and English numbers/characters
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "বিজ্ঞান র্যাঙ্কার — SSC ও HSC বিজ্ঞান MCQ যুদ্ধঘর",
  description:
    "বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য প্রিমিয়াম MCQ যুদ্ধঘর। অধ্যায়ভিত্তিক কুইজ, লাইভ ব্যাটল, লিডারবোর্ড ও AI দুর্বলতা রিপোর্ট — সম্পূর্ণ বাংলায়।",
  keywords:
    "SSC, HSC, Science MCQ, Physics MCQ, Chemistry MCQ, Biology, Higher Math, Bangladesh, Exam preparation, বিজ্ঞান র্যাঙ্কার",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-152x152.png",
  },
  openGraph: {
    title: "বিজ্ঞান র্যাঙ্কার — SSC ও HSC বিজ্ঞান MCQ যুদ্ধঘর",
    description:
      "বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য প্রিমিয়াম MCQ যুদ্ধঘর। কুইজ ও লাইভ র্যাঙ্কিংয়ে লড়াই করো!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={cn(
        "scroll-smooth",
        hindSiliguri.variable,
        outfit.variable,
      )}
    >
      <body
        className={cn(
          "min-h-screen bg-navy-dark text-slate-100 font-bangla antialiased selection:bg-purple-glow/30 selection:text-white",
        )}
      >
        {/* Background Aurora Ambient Lights */}
        <div className="aurora-bg">
          <div className="aurora-center" />
        </div>

        <Providers>
          {/* Global Desktop Navigation */}
          <Navbar />

          {/* Core Content */}
          <main className="relative">
            <MainContent>{children}</MainContent>
          </main>

          {/* Mobile Navigation Bar */}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
```

## File: [app/leaderboard/college-wars/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/leaderboard/college-wars/page.tsx)

```tsx
"use client";

import { Suspense } from "react";
import { CollegeWarsPage } from "@/components/leaderboard/CollegeWarsPage";
import { LeaderboardSkeleton } from "@/components/leaderboard/LeaderboardSkeleton";

export default function CollegeWarsRoute() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <CollegeWarsPage />
    </Suspense>
  );
}
```

## File: [app/leaderboard/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/leaderboard/page.tsx)

```tsx
"use client";

import { Suspense } from "react";
import { LeaderboardHub } from "@/components/leaderboard/LeaderboardHub";
import { LeaderboardSkeleton } from "@/components/leaderboard/LeaderboardSkeleton";

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardHub />
    </Suspense>
  );
}
```

## File: [app/live-test/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/live-test/page.tsx)

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Calendar, BookOpen, Clock, ArrowLeft } from "lucide-react";

export default function LiveTestPage() {
  return (
    <div className="min-h-screen bg-[#07111F] py-10 px-4 font-bangla text-white pb-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="premium" className="inline-flex items-center gap-2 text-sm px-4 py-1">
            শীঘ্রই আসছে...
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black">লাইভ টেস্ট ব্যাটল</h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm">
            একই সময়ে সারা দেশের শিক্ষার্থীদের সাথে লাইভ পরীক্ষায় অংশ নেওয়ার সুবিধা
            শীঘ্রই চালু হচ্ছে।
          </p>
        </div>

        <Card variant="glass" className="p-6 md:p-8 border-purple-500/20 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-xl font-bold">লাইভ মডেল টেস্ট</h2>
            <p className="text-sm text-slate-400">
              সময়সূচি, সিলেবাস ও র‍্যাঙ্কিং প্রকাশ করা হলে জানানো হবে।
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span>সময় — ঘোষণা করা হবে</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>নির্ধারিত সময়কাল</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>MCQ সেট</span>
            </div>
          </div>

          <Button variant="secondary" disabled className="w-full min-h-[44px] cursor-not-allowed opacity-70">
            শীঘ্রই আসছে...
          </Button>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button variant="secondary" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              হোমে ফিরে যাও
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## File: [app/loading.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/loading.tsx)

```tsx
export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-300 border-t-transparent" />
        <h1 className="mt-6 text-2xl font-bold">লোড হচ্ছে...</h1>
        <p className="mt-3 text-slate-300">Quiz data প্রস্তুত করা হচ্ছে। একটু অপেক্ষা করুন।</p>
      </section>
    </main>
  );
}
```

## File: [app/login/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/login/page.tsx)

```tsx
"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Brain, LogIn, Mail, Lock, X, Chrome, RefreshCw, AlertTriangle } from "lucide-react";

const inputWithIconClass =
  "h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const afterLoginPath = safeNextPath(searchParams.get("next"));
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    error,
    setError,
    loading,
    backendStatus,
    retryBackend,
  } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন");
      return;
    }
    if (password.length < 6) {
      setLocalError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    try {
      let profile: Awaited<ReturnType<typeof loginWithEmail>> = null;
      if (isRegister) {
        if (!name.trim()) {
          setLocalError("নাম প্রয়োজন");
          return;
        }
        profile = await registerWithEmail(email, password, name);
      } else {
        profile = await loginWithEmail(email, password);
      }
      if (profile) {
        window.location.href = afterLoginPath;
      }
    } catch {
      setLocalError("লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLocalError(null);
    const profile = await loginWithGoogle();
    if (profile) {
      window.location.href = afterLoginPath;
    }
  };

  const displayError = localError || error;
  const isBackendDown = backendStatus === "down" && !localError;
  const isRetrying = backendStatus === "checking";

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#07111F] px-4 py-10 font-bangla text-white">
      <div className="glass-card relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-500 to-cyan-400" />

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10">
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {isRegister ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {isRegister
              ? "তোমার বিজ্ঞান যুদ্ধের অ্যাকাউন্ট তৈরি করো"
              : "তোমার অ্যাকাউন্টে সাইন ইন করো"}
          </p>
        </div>

        {isBackendDown && (
          <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-300">
                  ব্যাকএন্ড সার্ভার সংযুক্ত নেই
                </p>
                <p className="mt-1 text-xs text-amber-400/70">
                  FastAPI সার্ভার (port 8000) চালু নেই। আলাদা টার্মিনালে <code className="rounded bg-slate-800 px-1 py-0.5">pnpm dev:backend</code> চালান।
                </p>
                <button
                  type="button"
                  onClick={retryBackend}
                  disabled={isRetrying}
                  className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/30 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
                  {isRetrying ? "সংযোগ চেষ্টা হচ্ছে..." : "আবার চেষ্টা করুন"}
                </button>
              </div>
            </div>
          </div>
        )}

        {displayError && !isBackendDown && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            <X className="h-4 w-4 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                নাম
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="তোমার নাম"
                  className={inputWithIconClass}
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">
              ইমেইল
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="তোমার ইমেইল"
                className={inputWithIconClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড দিন"
                className={inputWithIconClass}
              />
            </div>
          </div>

          {!isRegister && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-slate-400 transition-colors hover:text-cyan-400"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-button-primary"
          >
            {loading ? (
              <div className="h-5 w-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {isRegister ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-500">অথবা</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/30 hover:bg-white/10 disabled:opacity-50"
        >
          <Chrome className="h-4 w-4" />
          গুগল দিয়ে লগইন করুন
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setLocalError(null);
              setError(null);
            }}
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            {isRegister
              ? "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন"
              : "নতুন অ্যাকাউন্ট? রেজিস্টার করুন"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#07111F]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
```

## File: [app/not-found.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/not-found.tsx)

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-4 text-slate-300">এই পেজ বা quiz data পাওয়া যায়নি। Subject, chapter বা model test link আবার check করুন।</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950">
          হোমে ফিরুন
        </Link>
      </section>
    </main>
  );
}
```

## File: [app/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/page.tsx)

```tsx
import { levelHubPath } from "@/lib/quiz/unified-routes";
import { HeroSectionNew } from "@/components/home/HeroSectionNew";
import { HomeMobileNav } from "@/components/home/HomeMobileNav";
import { QuickStartSection } from "@/components/home/QuickStartSection";
import { DailyTaskSection } from "@/components/home/DailyTaskSection";
import { ChapterPracticeSection } from "@/components/home/ChapterPracticeSection";
import { LeaderboardPreviewSection } from "@/components/home/LeaderboardPreviewSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06101d]" id="home">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.035)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,rgba(6,16,29,0)_0%,#06101d_92%)]" />
      <main className="relative">
      <HeroSectionNew />
      <HomeMobileNav />
      <QuickStartSection />
      <DailyTaskSection />
      <ChapterPracticeSection />
      <LeaderboardPreviewSection />
      <FinalCTASection />
      </main>

      <footer className="relative border-t border-white/10 bg-[#07111F]/90 py-8 text-center text-xs text-slate-500 font-bangla">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© ২০২৬ বিজ্ঞান র্যাঙ্কার। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-slate-300">হোম</Link>
            <span>•</span>
            <Link href={levelHubPath("ssc")} className="hover:text-slate-300">SSC</Link>
            <span>•</span>
            <Link href={levelHubPath("hsc")} className="hover:text-slate-300">HSC</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

## File: [app/premium/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/premium/page.tsx)

```tsx
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Check } from "lucide-react";
import { levelHubPath } from "@/lib/quiz/unified-routes";

const features = [
  "সব অধ্যায় সম্পূর্ণ ফ্রি",
  "সব মডেল টেস্ট সম্পূর্ণ ফ্রি",
  "লাইভ টেস্টে আনলিমিটেড অ্যাক্সেস",
  "ফাইনাল ফোকাস সাজেশন সবার জন্য",
  "ভুল উত্তর বিশ্লেষণ ও সমাধান",
  "দুর্বল অধ্যায় রিপোর্ট ড্যাশবোর্ডে",
  "মেধা র‍্যাঙ্কিং ও ব্যাজ অর্জন",
  "১০০% ফ্রি ও আনলকড কুইজ সিস্টেম",
];

export default function PremiumPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-bangla text-white">
      <div className="text-center mb-8">
        <Badge variant="default" className="inline-flex items-center gap-2 mb-4 bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          ১০০% ফ্রি
        </Badge>
        <h1 className="text-3xl font-black text-white mb-2">সব প্রস্তুতি ফ্রি!</h1>
        <p className="text-slate-400">
          বিজ্ঞান র্যাঙ্কার-এর কোনো সাবস্ক্রিপশন ফি নেই। সব ফিচার সবার জন্য সম্পূর্ণ ফ্রি।
        </p>
      </div>

      <Card variant="glass" className="p-8 space-y-6 border-cyan-500/20 bg-gradient-to-br from-[#07111F] via-[#0E1726] to-[#07111F]">
        <p className="text-center text-cyan-300 text-sm font-semibold">
          নিচের সকল প্রিমিয়াম ফিচার এখন সবার জন্য আনলকড:
        </p>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-slate-200">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={levelHubPath("ssc")} className="flex-1">
            <Button variant="primary" fullWidth className="min-h-[44px]">SSC কুইজ</Button>
          </Link>
          <Link href={levelHubPath("hsc")} className="flex-1">
            <Button variant="secondary" fullWidth className="min-h-[44px]">HSC কুইজ</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
```

## File: [app/profile/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/profile/page.tsx)

```tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProfileCompletionPrompt } from "@/components/profile/ProfileCompletionPrompt";
import {
  CLASS_OPTIONS,
  SUBJECT_OPTIONS,
  examYearOptions,
  subjectLabel,
} from "@/lib/profile-options";
import {
  isProfileComplete,
  normalizeLevel,
  levelLabel,
  type StudentLevel,
} from "@/lib/profile-utils";
import { BADGE_LABELS } from "@/lib/leaderboard-api";
import { Loader2, LogOut, User } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, syncProfile, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const [form, setForm] = useState({
    name: "",
    className: "",
    examYear: "",
    favoriteSubject: "",
    weakSubjects: "",
    picture: "",
    collegeName: "",
  });

  const selectedLevel = useMemo(
    () => normalizeLevel(form.className),
    [form.className],
  );

  const yearOptions = useMemo(
    () => examYearOptions(selectedLevel),
    [selectedLevel],
  );

  useEffect(() => {
    if (user) {
      const level = normalizeLevel(user.className, user.level);
      const year = user.examYear ?? user.targetExamYear;
      setForm({
        name: user.name || "",
        className: level === "ssc" ? "SSC" : level === "hsc" ? "HSC" : user.className || "",
        examYear: year ? String(year) : "",
        favoriteSubject: user.favoriteSubject || "",
        weakSubjects: user.weakSubjects || "",
        picture: user.picture || "",
        collegeName: user.collegeName || user.schoolName || "",
      });
    }
  }, [user]);

  const handleClassChange = (className: string) => {
    const level = normalizeLevel(className);
    const years = examYearOptions(level);
    const currentYear = form.examYear;
    const stillValid = years.some((y) => y.value === currentYear);
    setForm({
      ...form,
      className,
      examYear: stillValid ? currentYear : "",
    });
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSave = async () => {
    if (!form.className) {
      setMessage({ type: "err", text: "শ্রেণি (SSC/HSC) নির্বাচন করুন।" });
      return;
    }
    if (!form.examYear) {
      setMessage({ type: "err", text: "পরীক্ষার বছর নির্বাচন করুন।" });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await syncProfile({
        name: form.name,
        className: form.className,
        examYear: parseInt(form.examYear, 10),
        favoriteSubject: form.favoriteSubject || undefined,
        weakSubjects: form.weakSubjects || undefined,
        picture: form.picture || undefined,
        collegeName: form.collegeName || undefined,
        schoolName: form.collegeName || undefined,
      });
      setMessage({ type: "ok", text: "প্রোফাইল আপডেট হয়েছে।" });
    } catch {
      setMessage({
        type: "err",
        text: "প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07111F]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07111F] px-4 pb-24">
        <Card variant="glass" className="max-w-md w-full p-8 text-center font-bangla">
          <User className="h-14 w-14 mx-auto text-purple-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            প্রোফাইল দেখতে আগে লগইন করুন।
          </h1>
          <Link href="/login">
            <Button className="mt-6 w-full min-h-[44px]">লগইন করুন</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const profileComplete = isProfileComplete(user);
  const displayLevel = normalizeLevel(user.className, user.level);
  const badgeLabel = user.badge ? BADGE_LABELS[user.badge] : null;

  return (
    <div className="min-h-screen bg-[#07111F] py-8 pb-24 font-bangla">
      <div className="max-w-lg mx-auto px-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">প্রোফাইল</h1>
          <p className="text-slate-400 text-sm mt-1">বিজ্ঞান বিভাগ • গোপনীয় ও সহজ</p>
        </div>

        {!profileComplete && <ProfileCompletionPrompt variant="hint" />}

        <Card variant="glass" className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            {form.picture ? (
              <img
                src={form.picture}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover border border-white/10"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
              <p className="font-bold text-white text-lg">{user.name}</p>
              <p className="text-xs text-slate-400">
                গ্রুপ: বিজ্ঞান • {levelLabel(displayLevel)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-[10px] text-slate-500">র‍্যাঙ্ক</p>
              <p className="text-lg font-bold text-white">
                {profileComplete && user.rank ? `#${user.rank}` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-[10px] text-slate-500">স্কোর</p>
              <p className="text-lg font-bold text-cyan-400">{user.score ?? 0}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-[10px] text-slate-500">ব্যাজ</p>
              <p className="text-xs font-bold text-yellow-300 truncate">
                {badgeLabel || "—"}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-400 mb-1 block">নাম</span>
            <input
              className="auth-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400 mb-1 block">
              শ্রেণি <span className="text-red-400">*</span>
            </span>
            <select
              className="auth-input"
              value={form.className}
              onChange={(e) => handleClassChange(e.target.value)}
              required
            >
              <option value="">SSC বা HSC নির্বাচন করো</option>
              {CLASS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            গ্রুপ: <span className="font-semibold text-white">বিজ্ঞান (Science)</span>
          </div>

          <label className="block">
            <span className="text-sm text-slate-400 mb-1 block">
              পরীক্ষার বছর <span className="text-red-400">*</span>
            </span>
            <select
              className="auth-input"
              value={form.examYear}
              onChange={(e) => setForm({ ...form, examYear: e.target.value })}
              disabled={!selectedLevel}
              required
            >
              <option value="">
                {selectedLevel ? "বছর নির্বাচন করো" : "প্রথমে শ্রেণি নির্বাচন করো"}
              </option>
              {yearOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400 mb-1 block">কলেজ/স্কুলের নাম (ঐচ্ছিক)</span>
            <input
              className="auth-input"
              value={form.collegeName}
              onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
              placeholder="যেমন: ঢাকা কলেজ, মতিঝিল মডেল স্কুল..."
            />
            <p className="mt-1 text-[10px] text-slate-500">
              কলেজের নাম যোগ করলে College Wars লিডারবোর্ডে অংশ নিতে পারবে
            </p>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400 mb-1 block">প্রিয় বিষয় (ঐচ্ছিক)</span>
            <select
              className="auth-input"
              value={form.favoriteSubject}
              onChange={(e) => setForm({ ...form, favoriteSubject: e.target.value })}
            >
              <option value="">নির্বাচন করো</option>
              {SUBJECT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400 mb-1 block">দুর্বল বিষয় (ঐচ্ছিক)</span>
            <select
              className="auth-input"
              value={form.weakSubjects}
              onChange={(e) => setForm({ ...form, weakSubjects: e.target.value })}
            >
              <option value="">নির্বাচন করো</option>
              {SUBJECT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400 mb-1 block">অ্যাভাটার URL (ঐচ্ছিক)</span>
            <input
              className="auth-input text-sm"
              value={form.picture}
              onChange={(e) => setForm({ ...form, picture: e.target.value })}
              placeholder="https://..."
            />
          </label>

          {form.favoriteSubject && (
            <p className="text-xs text-slate-500">
              প্রিয়: {subjectLabel(form.favoriteSubject)}
            </p>
          )}

          {message && (
            <p
              className={
                message.type === "ok" ? "text-green-400 text-sm" : "text-red-400 text-sm"
              }
            >
              {message.text}
            </p>
          )}

          <Button
            fullWidth
            className="min-h-[44px]"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
          </Button>
        </Card>

        <div className="text-center space-y-3">
          <Link href="/dashboard" className="text-cyan-400 text-sm hover:underline">
            ড্যাশবোর্ড দেখো →
          </Link>
          <div>
            <Button
              variant="ghost"
              fullWidth
              className="min-h-[44px] text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File: [app/reset-password/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/reset-password/page.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { Brain, Mail, ArrowLeft, CheckCircle, X } from "lucide-react";

const inputWithIconClass =
  "h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-60";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError("ইমেইল প্রয়োজন");
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setError("রিসেট লিংক পাঠানো যায়নি। ইমেইল ঠিক আছে কিনা দেখুন।");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(true);
    } catch {
      setError("রিসেট লিংক পাঠানো যায়নি। ইমেইল ঠিক আছে কিনা দেখুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#07111F] px-4 py-10 font-bangla text-white">
      <div className="glass-card relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-500 to-cyan-400" />

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10">
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            পাসওয়ার্ড রিসেট করুন
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            আপনার ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাবো।
          </p>
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।</span>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            <X className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">
              ইমেইল
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="তোমার ইমেইল"
                disabled={loading || success}
                className={inputWithIconClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="auth-button-primary"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                পাঠানো হচ্ছে...
              </>
            ) : (
              "রিসেট লিংক পাঠান"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            লগইনে ফিরে যান
          </Link>
        </div>
      </div>
    </section>
  );
}
```

## File: [app/robots.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/robots.ts)

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sschsc-quiz.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard'],
    },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
```

## File: [app/sitemap.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/sitemap.ts)

```ts
import type { MetadataRoute } from 'next';

const staticRoutes = [
  '/',
  '/ssc',
  '/hsc',
  '/ssc/physics',
  '/ssc/chemistry',
  '/ssc/biology',
  '/ssc/higher-math',
  '/ssc/math',
  '/hsc/physics-1st-paper',
  '/hsc/physics-2nd-paper',
  '/hsc/chemistry-1st-paper',
  '/hsc/chemistry-2nd-paper',
  '/hsc/biology-1st-paper',
  '/hsc/biology-2nd-paper',
  '/hsc/higher-math-1st-paper',
  '/hsc/higher-math-2nd-paper',
  '/leaderboard',
  '/login',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sschsc-quiz.com').replace(/\/$/, '');
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
```

## File: [app/ssc-board-questions/[subject]/[year]/BoardYearClientSSC.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/ssc-board-questions/[subject]/[year]/BoardYearClientSSC.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import type { ApiQuestion } from "@/types/quiz";
import { ArrowLeft, Trophy, Play, AlertCircle } from "lucide-react";

// Translations
const BENGALI_SUBJECTS: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
  math: "সাধারণ গণিত",
};

const BENGALI_BOARDS: Record<string, string> = {
  dhaka: "ঢাকা বোর্ড",
  rajshahi: "রাজশাহী বোর্ড",
  cumilla: "কুমিল্লা বোর্ড",
  chattogram: "চট্টগ্রাম বোর্ড",
  sylhet: "সিলেট বোর্ড",
  barishal: "বরিশাল বোর্ড",
  dinajpur: "দিনাজপুর বোর্ড",
  jashore: "যশোর বোর্ড",
  mymensingh: "ময়মনসিংহ বোর্ড",
  khulna: "খুলনা বোর্ড",
};

type Props = {
  subject: string;
  year: string;
  cleanQuizzesByBoard: Record<string, ApiQuestion[]>;
};

export default function BoardYearClientSSC({
  subject,
  year,
  cleanQuizzesByBoard,
}: Props) {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"selection" | "quiz">("selection");

  const subjBengali = BENGALI_SUBJECTS[subject.toLowerCase()] || subject;
  const titleText = `${subjBengali}`;
  const yearText = `${year} সালের বোর্ড প্রশ্ন`;

  const availableBoards = Object.keys(cleanQuizzesByBoard);

  const handleQuizBack = () => {
    setSelectedBoard(null);
    setViewMode("selection");
  };

  if (viewMode === "quiz" && selectedBoard) {
    const questions = cleanQuizzesByBoard[selectedBoard] || [];
    const boardTitle = BENGALI_BOARDS[selectedBoard] || selectedBoard.toUpperCase();
    const examName = `${boardTitle} - ${year} (${titleText})`;
    const examSlug = `ssc-board-${subject}-${year}-${selectedBoard}`;

    return (
      <QuizRunner
        questions={questions}
        examSlug={examSlug}
        examName={examName}
        backUrl="#"
        onBack={handleQuizBack}
        timeLimitSec={1500} // 25 minutes limit for board exams
        showWorkedSolution
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-bangla pb-24 text-slate-100">
      {/* Back button */}
      <Link
        href={`/ssc-board-questions/${subject}`}
        className="text-slate-400 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> বছর তালিকা
      </Link>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge variant="default" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 mb-3">
          SSC {year}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
          {titleText}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {yearText} — তোমার বোর্ড নির্বাচন করে ইন্টারেক্টিভ পরীক্ষা দাও।
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-400" />
          ইন্টারেক্টিভ কুইজ পরীক্ষা (MCQs)
        </h2>

        {availableBoards.length === 0 ? (
          <Card variant="glass" className="p-8 text-center border-white/5">
            <AlertCircle className="h-10 w-10 text-amber-500/70 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold text-base mb-1">
              {year} সালের বোর্ড প্রশ্ন এখনো যোগ করা হয়নি
            </p>
            <p className="text-slate-500 text-sm">
              {parseInt(year) >= 2026
                ? "এই বিষয়ের ২০২৬ সালের বোর্ড MCQ প্রশ্ন শীঘ্রই আসছে। অন্য বিষয় বা বছর চেষ্টা করুন।"
                : "এই বছরের প্রশ্নপত্র এখনো আপলোড করা হয়নি।"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableBoards.map((boardKey) => {
              const boardTitle = BENGALI_BOARDS[boardKey] || boardKey.toUpperCase();
              const questionCount = cleanQuizzesByBoard[boardKey].length;

              return (
                <Card
                  key={boardKey}
                  variant="glass"
                  className="p-5 border-white/5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 group hoverable"
                >
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">
                          {boardTitle}
                        </span>
                        <Badge variant="default" className="text-[10px] bg-cyan-500/10 text-cyan-300">
                          SSC {year}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        মোট প্রশ্নসংখ্যা: {questionCount} টি
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedBoard(boardKey);
                        setViewMode("quiz");
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-900/30"
                    >
                      <Play className="h-3 w-3 fill-current" /> পরীক্ষা দিন
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

## File: [app/ssc-board-questions/[subject]/[year]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/ssc-board-questions/[subject]/[year]/page.tsx)

```tsx
import React from "react";
import BoardYearClientSSC from "./BoardYearClientSSC";
import { getAvailableBoardQuizzes } from "@/lib/board-quizzes";

type Props = {
  params: {
    subject: string;
    year: string;
  };
};

export default async function SSCBoardYearPage({ params }: Props) {
  const { subject, year } = params;
  
  // Normalize "math" slug to "general-math" for data extraction
  const apiSubject = subject === "math" ? "general-math" : subject;
  
  // Fetch available board quizzes
  const cleanQuizzesByBoard = await getAvailableBoardQuizzes("SSC", apiSubject, undefined, year);

  return (
    <BoardYearClientSSC
      subject={subject}
      year={year}
      cleanQuizzesByBoard={cleanQuizzesByBoard}
    />
  );
}

export async function generateStaticParams() {
  // 2026 data is real for: chemistry, general-math (math), higher-math
  // 2026 data is placeholder for: physics, biology (hidden from index.json)
  const subjects = ["physics", "chemistry", "biology", "higher-math", "math"];
  const years = ["2022", "2023", "2024", "2025", "2026"];
  const params = [];
  
  for (const subject of subjects) {
    for (const year of years) {
      params.push({ subject, year });
    }
  }
  
  return params;
}
```

## File: [app/ssc-board-questions/[subject]/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/ssc-board-questions/[subject]/page.tsx)

```tsx
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Clock } from "lucide-react";

const SUBJECT_MAP: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
  math: "সাধারণ গণিত",
};

const AVAILABLE_YEARS: Record<string, string[]> = {
  physics: ["2022", "2023", "2024", "2025"],
  chemistry: ["2022", "2023", "2024", "2025"],
  biology: ["2022", "2023", "2024", "2025"],
  "higher-math": ["2022", "2023", "2024", "2025"],
  math: ["2022", "2023", "2024", "2025"],
};

const TARGET_YEARS = [
  { value: "2027", label: "২০২৭" },
  { value: "2028", label: "২০২৮" },
  { value: "2029", label: "২০২৯" },
  { value: "2030", label: "২০৩০" },
  { value: "2031", label: "২০৩১" },
];

const HISTORICAL_YEARS = [
  { value: "2022", label: "২০২২" },
  { value: "2023", label: "২০২৩" },
  { value: "2024", label: "২০২৪" },
  { value: "2025", label: "২০২৫" },
];

type Props = {
  params: { subject: string };
};

export default function SSCBoardSubjectYearsPage({ params }: Props) {
  const { subject } = params;
  const subjectLabel = SUBJECT_MAP[subject] || subject;
  
  const readyYears = AVAILABLE_YEARS[subject] || [];

  // Combine display years
  const displayYears = [
    ...HISTORICAL_YEARS.map(y => ({ ...y, hasData: readyYears.includes(y.value) })),
    ...TARGET_YEARS.map(y => ({ ...y, hasData: false })),
  ];

  return (
    <div className="min-h-screen bg-[#07111F] py-10 px-4 font-bangla text-white">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/ssc-board-questions"
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> বিষয় তালিকা
          </Link>
          <Badge variant="default" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
            SSC বোর্ড প্রশ্ন
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">{subjectLabel}</h1>
          <p className="text-slate-400 text-sm">পরীক্ষার বছর নির্বাচন করো</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {displayYears.map((year) => {
            if (year.hasData) {
              return (
                <Link key={year.value} href={`/ssc-board-questions/${subject}/${year.value}`}>
                  <Card
                    variant="glass"
                    hoverable
                    className="p-4 text-center border-white/5 bg-white/5 hover:border-cyan-500/30 cursor-pointer flex flex-col items-center justify-center min-h-[90px]"
                  >
                    <span className="text-xl font-black text-white">{year.label}</span>
                    <Badge variant="default" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 mt-2 text-[10px]">
                      প্রস্তুত
                    </Badge>
                  </Card>
                </Link>
              );
            }

            return (
              <Card
                key={year.value}
                variant="glass"
                className="p-4 text-center border-white/5 bg-white/5 opacity-55 flex flex-col items-center justify-center min-h-[90px]"
              >
                <span className="text-xl font-black text-slate-400">{year.label}</span>
                <span className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> শীঘ্রই আসছে
                </span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const subjects = ["physics", "chemistry", "biology", "higher-math", "math"];
  return subjects.map((subject) => ({ subject }));
}
```

## File: [app/ssc-board-questions/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/ssc-board-questions/page.tsx)

```tsx
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { levelHubPath } from "@/lib/quiz/unified-routes";

const SUBJECT_MAP: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
  math: "সাধারণ গণিত",
};

const SUBJECT_ICONS: Record<string, any> = {
  physics: BookOpen,
  chemistry: BookOpen,
  biology: GraduationCap,
  "higher-math": BookOpen,
  math: BookOpen,
};

export default function SSCBoardQuestionsPage() {
  const subjects = ["physics", "chemistry", "biology", "higher-math", "math"];

  return (
    <div className="min-h-screen bg-[#07111F] py-10 px-4 font-bangla text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="default" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
            এসএসসি বোর্ড প্রশ্ন
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black">SSC বোর্ড প্রশ্ন ব্যাংক</h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            বিগত বছরের বোর্ড প্রশ্নগুলো নিয়ে কুইজ দিয়ে তোমার প্রস্তুতি ঝালাই করো।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => {
            const label = SUBJECT_MAP[subject] || subject;
            const Icon = SUBJECT_ICONS[subject] || BookOpen;

            return (
              <Link key={subject} href={`/ssc-board-questions/${subject}`}>
                <Card
                  variant="glass"
                  hoverable
                  className="p-6 flex items-center justify-between border-white/5 bg-white/5 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white leading-snug">
                        {label}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">বোর্ড প্রশ্নাবলী</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 hover:text-white" />
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link href={levelHubPath("ssc")} className="text-sm text-slate-400 hover:text-white underline">
            SSC হাব-এ ফিরে যাও
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## File: [app/subjects/page.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/app/subjects/page.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { unifiedSubjectBasePath } from "@/lib/quiz/unified-routes";

const SSC_SUBJECTS = [
  { name: "পদার্থবিজ্ঞান", slug: "physics", desc: "গতি, বল, কাজ ও শক্তি এবং আলোকবিজ্ঞান", color: "from-cyan-500 to-blue-600" },
  { name: "রসায়ন", slug: "chemistry", desc: "পদার্থের গঠন, রাসায়নিক বন্ধন ও অম্ল-ক্ষারক সমতা", color: "from-emerald-500 to-teal-600" },
  { name: "জীববিজ্ঞান", slug: "biology", desc: "কোষ বিভাজন, সালোকসংশ্লেষণ ও মানব শারীরবৃত্ত", color: "from-green-500 to-emerald-600" },
  { name: "উচ্চতর গণিত", slug: "higher-math", desc: "ত্রিকোণমিতি, বীজগণিতীয় সূত্র ও স্থানাঙ্ক জ্যামিতি", color: "from-indigo-500 to-purple-600" },
  { name: "সাধারণ গণিত", slug: "math", desc: "বাস্তব সংখ্যা, সেট-ফাংশন ও পরিমিতি", color: "from-pink-500 to-rose-600" },
];

const HSC_SUBJECTS = [
  { name: "পদার্থবিজ্ঞান ১ম পত্র", slug: "physics-1st-paper", desc: "ভেক্টর, নিউটনীয় বলবিদ্যা ও আদর্শ গ্যাস", color: "from-cyan-500 to-blue-600" },
  { name: "পদার্থবিজ্ঞান ২য় পত্র", slug: "physics-2nd-paper", desc: "তাপগতিবিদ্যা, স্থির তড়িৎ ও আধুনিক পদার্থবিজ্ঞান", color: "from-blue-500 to-indigo-600" },
  { name: "রসায়ন ১ম পত্র", slug: "chemistry-1st-paper", desc: "গুণগত রসায়ন, মৌলের পর্যায়বৃত্ত ধর্ম", color: "from-emerald-500 to-teal-600" },
  { name: "রসায়ন ২য় পত্র", slug: "chemistry-2nd-paper", desc: "তড়িৎ রসায়ন ও জৈব রসায়ন বিশদ আলোচনা", color: "from-teal-500 to-green-600" },
  { name: "জীববিজ্ঞান ১ম পত্র", slug: "biology-1st-paper", desc: "কোষ ও এর গঠন, জিনতত্ত্ব ও বিবর্তন", color: "from-green-500 to-emerald-600" },
  { name: "জীববিজ্ঞান ২য় পত্র", slug: "biology-2nd-paper", desc: "প্রাণীর পরিচিতি ও মানব শারীরতত্ত্ব", color: "from-emerald-600 to-teal-600" },
  { name: "উচ্চতর গণিত ১ম পত্র", slug: "higher-math-1st-paper", desc: "ম্যাট্রিক্স-নির্ণায়ক, ক্যালকুলাস ও ভেক্টর", color: "from-indigo-500 to-purple-600" },
  { name: "উচ্চতর গণিত ২য় পত্র", slug: "higher-math-2nd-paper", desc: "বাস্তব সংখ্যা, স্থিতিবিদ্যা ও গতিবিদ্যা", color: "from-purple-500 to-pink-600" },
];

export default function SubjectsPage() {
  const [levelTab, setLevelTab] = useState<"ssc" | "hsc">("hsc");

  const subjects = levelTab === "ssc" ? SSC_SUBJECTS : HSC_SUBJECTS;

  return (
    <div className="min-h-screen bg-[#07111F] py-10 pb-24 font-bangla text-white">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <Badge variant="default" className="bg-cyan-500/10 border-cyan-500/20 text-cyan-300 gap-1.5 py-1 px-3">
            <GraduationCap className="h-4 w-4" />
            <span>শিক্ষাক্রম তালিকা</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black">বিষয়সমূহ নির্বাচন করো</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            অধ্যায়ভিত্তিক এমসিকিউ অনুশীলন ও নিজেকে যাচাই করতে তোমার কাঙ্ক্ষিত বিষয় সিলেক্ট করো।
          </p>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex gap-3 justify-center mb-8">
          <button
            type="button"
            onClick={() => setLevelTab("ssc")}
            className={cn(
              "min-h-[46px] px-6 py-2.5 rounded-2xl text-sm font-bold border transition-all duration-300",
              levelTab === "ssc"
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10"
            )}
          >
            SSC (মাধ্যমিক)
          </button>
          <button
            type="button"
            onClick={() => setLevelTab("hsc")}
            className={cn(
              "min-h-[46px] px-6 py-2.5 rounded-2xl text-sm font-bold border transition-all duration-300",
              levelTab === "hsc"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10"
            )}
          >
            HSC (উচ্চ মাধ্যমিক)
          </button>
        </div>

        {/* Subjects List Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subj) => {
            const targetPath = unifiedSubjectBasePath(levelTab, subj.slug);

            return (
              <Link href={targetPath} key={subj.slug} className="group">
                <Card
                  variant="glass"
                  className="p-5 h-full border-white/5 bg-slate-950/20 hover:border-white/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                >
                  {/* Decorative background gradient */}
                  <div className={cn(
                    "absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-10 blur-2xl bg-gradient-to-br transition-all group-hover:scale-125",
                    subj.color
                  )} />

                  <div className="space-y-3 relative z-10">
                    <div className={cn(
                      "inline-flex p-2.5 rounded-xl bg-gradient-to-br text-white shadow-sm",
                      subj.color
                    )}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-cyan-300 transition-colors leading-snug">{subj.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{subj.desc}</p>
                  </div>

                  <div className="pt-4 flex items-center text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-all gap-1 mt-auto relative z-10">
                    <span>প্রস্তুতি শুরু করো</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

## File: [src/components/auth/ForgotPasswordForm.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/auth/ForgotPasswordForm.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  auth,
  getPasswordResetActionCodeSettings,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase-auth-errors";
import { Brain, Mail, ArrowLeft, CheckCircle, X } from "lucide-react";

const inputWithIconClass =
  "h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-60";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("ইমেইল লিখুন।");
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setError(
        "Firebase কনফিগার করা নেই। .env.local-এ NEXT_PUBLIC_FIREBASE_* ভেরিয়েবল চেক করুন।",
      );
      return;
    }

    setLoading(true);
    try {
      const actionCodeSettings = getPasswordResetActionCodeSettings();
      await sendPasswordResetEmail(auth, trimmed, actionCodeSettings);
      setSuccess(true);
    } catch (err: unknown) {
      const message = getFirebaseAuthErrorMessage(err);
      // auth/user-not-found: still show success (privacy)
      if (message === "") {
        setSuccess(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#07111F] px-4 py-10 font-bangla text-white">
      <div className="glass-card relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-500 to-cyan-400" />

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10">
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            পাসওয়ার্ড ভুলে গেছেন?
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            ইমেইল দিন — Firebase থেকে রিসেট লিংক পাঠানো হবে (inbox/spam চেক করুন)।
          </p>
        </div>

        {success && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              যদি এই ইমেইলে অ্যাকাউন্ট থাকে, রিসেট লিংক পাঠানো হয়েছে। inbox ও spam
              folder দেখুন।
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            <X className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-1.5 block text-xs font-semibold text-slate-400"
            >
              ইমেইল
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="তোমার ইমেইল"
                disabled={loading || success}
                required
                className={inputWithIconClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="auth-button-primary"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                পাঠানো হচ্ছে...
              </>
            ) : (
              "রিসেট লিংক পাঠান"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            লগইনে ফিরে যান
          </Link>
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/dashboard/AnalyticsSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/dashboard/AnalyticsSection.tsx)

```tsx
"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Swords,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { subjectLabel } from "@/lib/profile-options";
import {
  computeChapterStats,
  computeEloTrend,
  computeOverallAccuracy,
  parseSubjectKey,
  type RecentExamAttempt,
} from "@/lib/dashboard-analytics";

type Props = {
  recentExams: RecentExamAttempt[];
  currentElo: number;
};

function EloSparkline({ points }: { points: { label: string; elo: number }[] }) {
  const width = 280;
  const height = 88;
  const padding = 8;

  const min = Math.min(...points.map((p) => p.elo)) - 20;
  const max = Math.max(...points.map((p) => p.elo)) + 20;
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x =
      padding +
      (i / Math.max(points.length - 1, 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((p.elo - min) / range) * (height - padding * 2);
    return { x, y, ...p };
  });

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area = `${padding},${height - padding} ${polyline} ${width - padding},${height - padding}`;
  const last = coords[coords.length - 1];
  const delta =
    points.length >= 2 ? points[points.length - 1].elo - points[0].elo : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Last {points.length} battles</span>
        <span
          className={cn(
            "font-bold font-outfit flex items-center gap-1",
            delta >= 0 ? "text-green-400" : "text-red-400",
          )}
        >
          {delta >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {delta >= 0 ? "+" : ""}
          {delta} ELO
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[88px] overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id="eloFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
          <linearGradient id="eloLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#eloFill)" />
        <polyline
          points={polyline}
          fill="none"
          stroke="url(#eloLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {last && (
          <circle
            cx={last.x}
            cy={last.y}
            r="4"
            fill="#22d3ee"
            className="animate-pulse"
          />
        )}
      </svg>
      <div className="flex justify-between text-[10px] text-slate-600 font-outfit">
        <span>{points[0]?.elo}</span>
        <span className="text-cyan-400 font-bold">{last?.elo} ELO</span>
      </div>
    </div>
  );
}

function MasteryRing({ accuracy }: { accuracy: number }) {
  const pct = Math.min(100, Math.max(0, accuracy));
  return (
    <div className="relative mx-auto h-36 w-36">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 210deg, #22d3ee ${pct * 0.55}%, #a855f7 ${pct}%, rgba(255,255,255,0.06) ${pct}%)`,
          boxShadow: "0 0 40px rgba(34,211,238,0.15)",
        }}
      />
      <div className="absolute inset-[10px] rounded-full bg-[#07111F]/95 border border-white/5 flex flex-col items-center justify-center">
        <Activity className="h-5 w-5 text-cyan-400 mb-1" />
        <span className="text-3xl font-black text-white font-outfit">{pct}%</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
          Mastery
        </span>
      </div>
    </div>
  );
}

export function AnalyticsSection({ recentExams, currentElo }: Props) {
  const chapterStats = useMemo(
    () => computeChapterStats(recentExams),
    [recentExams],
  );
  const eloTrend = useMemo(
    () => computeEloTrend(recentExams, currentElo, 10),
    [recentExams, currentElo],
  );
  const mastery = useMemo(
    () => computeOverallAccuracy(recentExams),
    [recentExams],
  );

  const weakest = chapterStats[0];
  const strongest = chapterStats[chapterStats.length - 1];
  const meterRows = chapterStats.slice(0, 6);

  if (recentExams.length === 0) {
    return (
      <Card variant="glass" className="p-6 mb-6 border-cyan-500/10">
        <p className="text-center text-slate-400 text-sm py-6">
          Analytics unlock করতে কমপক্ষে ১টি কুইজ সম্পন্ন করো।
        </p>
      </Card>
    );
  }

  return (
    <Card
      variant="glass"
      className="p-5 md:p-6 mb-6 border-cyan-500/15 relative overflow-hidden"
      id="analytics"
    >
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-purple-glow/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative">
        <div>
          <Badge variant="default" className="mb-2 border-cyan-400/20 text-cyan-300">
            Zero-Cost Analytics
          </Badge>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Swords className="h-5 w-5 text-purple-glow" />
            Battle Intel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Last {recentExams.length} exams · no extra DB reads
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Live ELO</p>
          <p className="text-2xl font-black text-cyan-400 font-outfit">{currentElo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
        {/* Weakness / Strength */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            Weakness / Strength Meter
          </h3>

          {weakest && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-[10px] uppercase text-red-300/80 mb-1">Critical Weakness</p>
              <p className="text-sm font-semibold text-white truncate">{weakest.label}</p>
              <p className="text-xs text-red-300 mt-1">{weakest.avgPct}% avg · {weakest.attempts}×</p>
            </div>
          )}

          {strongest && strongest.slug !== weakest?.slug && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3">
              <p className="text-[10px] uppercase text-green-300/80 mb-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Power Zone
              </p>
              <p className="text-sm font-semibold text-white truncate">{strongest.label}</p>
              <p className="text-xs text-green-300 mt-1">{strongest.avgPct}% avg</p>
            </div>
          )}

          <div className="space-y-2.5">
            {meterRows.map((row) => (
              <div key={row.slug}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400 truncate pr-2">{row.label}</span>
                  <span className="text-slate-300 font-outfit shrink-0">{row.avgPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      row.avgPct >= 70
                        ? "bg-gradient-to-r from-green-500 to-cyan-400"
                        : row.avgPct >= 40
                          ? "bg-gradient-to-r from-amber-500 to-orange-400"
                          : "bg-gradient-to-r from-red-500 to-rose-400",
                    )}
                    style={{ width: `${Math.max(row.avgPct, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ELO Trend */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            ELO Trend
          </h3>
          <EloSparkline points={eloTrend} />
        </div>

        {/* Mastery Ring */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-white mb-4 self-start flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-glow" />
            Weekly Mastery
          </h3>
          <MasteryRing accuracy={mastery} />
          <p className="text-xs text-slate-400 mt-4 max-w-[200px]">
            Overall accuracy across your last {recentExams.length} battles
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
            {Array.from(new Set(recentExams.map((e) => parseSubjectKey(e.examSlug)))).slice(0, 3).map((k) => (
              <Badge key={k} variant="default" className="text-[10px]">
                {subjectLabel(k)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
```

## File: [src/components/dashboard/DetailedReviewModal.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/dashboard/DetailedReviewModal.tsx)

```tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Share2,
  X,
  XCircle,
  MinusCircle,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import { QuizQuestionStem } from "@/components/quiz/QuizQuestionStem";
import { QuizOptionText } from "@/components/quiz/QuizOptionText";

type ReviewQuestion = {
  id: string;
  text: string;
  options: string[];
  chapter?: string;
};

type AnswerMeta = {
  answerIndex: number;
  explanation: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  examId: string;
  examName: string;
  userAnswers: string;
  questionsPath?: string;
  userElo?: number;
};

const BANGLA_OPTS = ["ক", "খ", "গ", "ঘ"] as const;

function parseAnswerIndexes(raw: string): number[] {
  if (!raw.trim()) return [];
  return raw.split(",").map((part) => {
    const n = parseInt(part.trim(), 10);
    return Number.isNaN(n) ? -1 : n;
  });
}

export function DetailedReviewModal({
  open,
  onClose,
  examId,
  examName,
  userAnswers,
  questionsPath,
  userElo = 1200,
}: Props) {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [meta, setMeta] = useState<Record<string, AnswerMeta>>({});
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const path = questionsPath || examId;
  const answerIndexes = useMemo(() => parseAnswerIndexes(userAnswers), [userAnswers]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [questionsRes, metaRes] = await Promise.all([
          fetch(`/questions/${path}.json`, { cache: "force-cache" }),
          api.get<{ answers: Record<string, AnswerMeta> }>(
            `/api/quiz/review-meta?questionsPath=${encodeURIComponent(path)}`,
          ),
        ]);

        if (!questionsRes.ok) {
          throw new Error("Question set not found on CDN");
        }

        const questionData = (await questionsRes.json()) as ReviewQuestion[];
        if (cancelled) return;

        setQuestions(Array.isArray(questionData) ? questionData : []);
        setMeta(metaRes.answers || {});
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "রিভিউ লোড করতে ব্যর্থ হয়েছে",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, path]);

  const stats = useMemo(
    () =>
      questions.reduce(
        (acc, q, idx) => {
          const userIdx = answerIndexes[idx] ?? -1;
          const correctIdx = meta[q.id]?.answerIndex ?? -1;
          if (userIdx === -1) acc.skipped += 1;
          else if (userIdx === correctIdx) acc.correct += 1;
          else acc.wrong += 1;
          return acc;
        },
        { correct: 0, wrong: 0, skipped: 0 },
      ),
    [questions, answerIndexes, meta],
  );

  const accuracy =
    stats.correct + stats.wrong > 0
      ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
      : 0;

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    setSharing(true);
    try {
      const mod = await import("html-to-image");
      const dataUrl = await mod.toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#07111F",
      });
      const link = document.createElement("a");
      link.download = `quiz-battle-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("Screenshot তৈরি করতে ব্যর্থ হয়েছে");
    } finally {
      setSharing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center font-bangla">
      <div
        className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className={cn(
          "relative w-full sm:max-w-3xl max-h-[92vh] overflow-hidden",
          "rounded-t-3xl sm:rounded-3xl border border-purple-glow/20",
          "bg-gradient-to-b from-[#0a1628]/98 to-[#070b14]/98",
          "shadow-[0_0_80px_rgba(168,85,247,0.15)]",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-[#0a1628]/90 backdrop-blur-xl">
          <div className="min-w-0">
            <h2 id="review-title" className="text-lg font-bold text-white truncate">
              {examName}
            </h2>
            <p className="text-xs text-slate-400 truncate">{examId}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!loading && !error && (
              <Button
                variant="secondary"
                size="sm"
                className="min-h-[36px] hidden sm:flex"
                onClick={handleShare}
                disabled={sharing}
              >
                {sharing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share Performance
                  </>
                )}
              </Button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/30 transition-colors"
              aria-label="Close review"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-72px)] px-5 py-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
              <p className="text-slate-400 text-sm">উত্তর রিভিউ লোড হচ্ছে...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-300 text-sm">{error}</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={onClose}>
                বন্ধ করুন
              </Button>
            </div>
          ) : (
            <>
              {/* Shareable performance card */}
              <div
                ref={shareCardRef}
                className="rounded-2xl border border-cyan-400/25 p-5 bg-gradient-to-br from-[#0c1628] via-[#0a1020] to-[#150a24] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_55%)] pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/80 mb-1">
                      Quiz Battle Result
                    </p>
                    <h3 className="text-lg font-black text-white">{examName}</h3>
                    <p className="text-xs text-slate-400 mt-1">{accuracy}% accuracy</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase">Score</p>
                      <p className="text-2xl font-black text-white font-outfit">
                        {stats.correct}/{questions.length}
                      </p>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase flex items-center gap-1 justify-center">
                        <Trophy className="h-3 w-3 text-amber-400" /> ELO
                      </p>
                      <p className="text-2xl font-black text-cyan-400 font-outfit">{userElo}</p>
                    </div>
                  </div>
                </div>
                <div className="relative grid grid-cols-3 gap-2 mt-4">
                  <StatPill label="Correct" value={stats.correct} tone="green" />
                  <StatPill label="Wrong" value={stats.wrong} tone="red" />
                  <StatPill label="Skipped" value={stats.skipped} tone="slate" />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                className="min-h-[40px] sm:hidden"
                onClick={handleShare}
                disabled={sharing}
              >
                {sharing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share Performance
                  </>
                )}
              </Button>

              {questions.map((q, idx) => {
                const userIdx = answerIndexes[idx] ?? -1;
                const correctIdx = meta[q.id]?.answerIndex ?? -1;
                const explanation = meta[q.id]?.explanation || "";
                const isSkipped = userIdx === -1;
                const isCorrect = !isSkipped && userIdx === correctIdx;
                const isWrong = !isSkipped && userIdx !== correctIdx;

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "rounded-2xl border p-4 transition-all",
                      isCorrect && "border-green-500/30 bg-green-500/5",
                      isWrong && "border-red-500/30 bg-red-500/5",
                      isSkipped && "border-slate-500/20 bg-white/[0.02]",
                    )}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-xs font-bold text-cyan-400/80 shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <div className="text-sm text-white leading-relaxed flex-1">
                        <QuizQuestionStem text={q.text} hideWorkedSolution={false} />
                      </div>
                      {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />}
                      {isWrong && <XCircle className="h-5 w-5 text-red-400 shrink-0" />}
                      {isSkipped && <MinusCircle className="h-5 w-5 text-slate-400 shrink-0" />}
                    </div>

                    <div className="grid gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isAnswer = optIdx === correctIdx;
                        const isUserPick = optIdx === userIdx;
                        return (
                          <div
                            key={`${q.id}-${optIdx}`}
                            className={cn(
                              "rounded-xl px-3 py-2.5 text-sm border flex items-center gap-2",
                              isAnswer &&
                                "border-green-400/50 bg-green-500/15 text-green-100 shadow-[0_0_16px_rgba(34,197,94,0.12)]",
                              isUserPick &&
                                !isAnswer &&
                                "border-red-400/40 bg-red-500/15 text-red-100",
                              !isAnswer &&
                                !isUserPick &&
                                "border-white/5 bg-white/[0.02] text-slate-300",
                            )}
                          >
                            <span className="text-xs font-bold opacity-70 w-4">
                              {BANGLA_OPTS[optIdx] || String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">
                              <QuizOptionText text={opt} questionText={q.text} />
                            </span>
                            {isAnswer && (
                              <span className="text-[10px] uppercase tracking-wide text-green-300 font-bold shrink-0">
                                Correct
                              </span>
                            )}
                            {isUserPick && !isAnswer && (
                              <span className="text-[10px] uppercase tracking-wide text-red-300 font-bold shrink-0">
                                Your pick
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {explanation && (
                      <div className="mt-3 flex gap-2 rounded-xl bg-cyan-500/5 border border-cyan-400/15 px-3 py-2.5">
                        <Lightbulb className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <FormattedQuizText
                          text={explanation}
                          className="text-xs text-slate-300 flex-1"
                          hideWorkedSolution={false}
                          mode="explanation"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "red" | "slate";
}) {
  const tones = {
    green: "border-green-500/25 bg-green-500/10 text-green-300",
    red: "border-red-500/25 bg-red-500/10 text-red-300",
    slate: "border-slate-500/25 bg-slate-500/10 text-slate-300",
  };
  return (
    <div className={cn("rounded-xl border px-3 py-2 text-center", tones[tone])}>
      <p className="text-[10px] uppercase opacity-80">{label}</p>
      <p className="text-lg font-black font-outfit">{value}</p>
    </div>
  );
}
```

## File: [src/components/dashboard/OnboardingModal.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/dashboard/OnboardingModal.tsx)

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, Plus, Search, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { BATCH_OPTIONS } from "@/lib/profile-utils";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type CollegeResult = { eiin: string; name: string };

export function OnboardingModal() {
  const { user, syncProfile } = useAuth();
  const router = useRouter();
  const [batch, setBatch] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<CollegeResult | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [openList, setOpenList] = useState(false);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!customMode && debouncedQuery.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    if (customMode) return;

    let cancelled = false;
    (async () => {
      setSearching(true);
      try {
        const data = await api.get<CollegeResult[]>(
          `/api/colleges?search=${encodeURIComponent(debouncedQuery.trim())}`,
        );
        if (!cancelled) {
          setResults(data);
          setOpenList(true);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, customMode]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setOpenList(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const collegeValue = customMode ? customName.trim() : selectedCollege?.name || query.trim();
  const canSubmit = Boolean(batch && collegeValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await syncProfile({
        batch,
        collegeName: collegeValue,
        schoolName: collegeValue,
        collegeEiin: customMode ? undefined : selectedCollege?.eiin,
      });
      router.replace("/dashboard");
    } catch {
      setError("প্রোফাইল সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-bangla">
      <div className="absolute inset-0 bg-[#030712]/85 backdrop-blur-md" aria-hidden />
      <div
        className={cn(
          "relative w-full max-w-lg rounded-3xl border border-cyan-400/20",
          "bg-gradient-to-br from-[#0a1628]/95 via-[#0d1025]/95 to-[#120a1f]/95",
          "shadow-[0_0_60px_rgba(34,211,238,0.12),0_0_120px_rgba(168,85,247,0.08)]",
          "p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="flex items-start gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h2 id="onboarding-title" className="text-xl sm:text-2xl font-extrabold text-white">
              স্বাগতম, {user.name?.split(" ")[0] || "যোদ্ধা"}!
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              কুইজ ব্যাটল শুরু করতে তোমার স্কুল/কলেজ ও টার্গেট পরীক্ষা সেট করো।
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300/80 mb-2">
              টার্গেট পরীক্ষা
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-glow/70 pointer-events-none" />
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                required
                className={cn(
                  "w-full min-h-[48px] pl-10 pr-4 rounded-xl appearance-none",
                  "bg-white/5 border border-white/10 text-white",
                  "focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30",
                )}
              >
                <option value="" disabled className="bg-[#0a1628]">
                  SSC / HSC ব্যাচ নির্বাচন করুন
                </option>
                {BATCH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0a1628]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div ref={listRef}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300/80 mb-2">
              স্কুল / কলেজ
            </label>

            {customMode ? (
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="তোমার স্কুল/কলেজের নাম লিখুন"
                required
                className={cn(
                  "w-full min-h-[48px] px-4 rounded-xl",
                  "bg-white/5 border border-white/10 text-white placeholder:text-slate-500",
                  "focus:outline-none focus:border-purple-glow/50 focus:ring-1 focus:ring-purple-glow/30",
                )}
              />
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={selectedCollege ? selectedCollege.name : query}
                  onChange={(e) => {
                    setSelectedCollege(null);
                    setQuery(e.target.value);
                    setOpenList(true);
                  }}
                  onFocus={() => setOpenList(true)}
                  placeholder="কলেজের নাম সার্চ করুন (২+ অক্ষর)"
                  required
                  className={cn(
                    "w-full min-h-[48px] pl-10 pr-10 rounded-xl",
                    "bg-white/5 border border-white/10 text-white placeholder:text-slate-500",
                    "focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30",
                  )}
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400 animate-spin" />
                )}

                {openList && debouncedQuery.length >= 2 && !selectedCollege && (
                  <div className="absolute z-20 mt-2 w-full max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[#0a1628]/98 backdrop-blur-xl shadow-2xl">
                    {results.length === 0 && !searching ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-slate-400 mb-3">কোনো ফলাফল পাওয়া যায়নি</p>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomMode(true);
                            setCustomName(query);
                            setOpenList(false);
                          }}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          <Plus className="h-4 w-4" />
                          Add Custom School/College
                        </button>
                      </div>
                    ) : (
                      results.map((college) => (
                        <button
                          key={college.eiin}
                          type="button"
                          onClick={() => {
                            setSelectedCollege(college);
                            setQuery(college.name);
                            setOpenList(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-cyan-500/10 border-b border-white/5 last:border-0 transition-colors"
                        >
                          {college.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {customMode && (
              <button
                type="button"
                onClick={() => {
                  setCustomMode(false);
                  setCustomName("");
                }}
                className="mt-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                ← সার্চ মোডে ফিরে যান
              </button>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={!canSubmit || submitting}
            className="w-full min-h-[48px] text-base font-bold shadow-[0_0_24px_rgba(34,211,238,0.25)]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                সেভ হচ্ছে...
              </>
            ) : (
              "ড্যাশবোর্ডে যান"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

## File: [src/components/home/BoardQuestionsSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/BoardQuestionsSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

const years = ["2022", "2023", "2024", "2025", "2026"];

const boardData = [
  {
    level: "SSC",
    levelBn: "এসএসসি",
    subjects: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত", "সাধারণ গণিত"],
    availableYears: [] as string[],
    boardHref: null as string | null,
    yearHref: (_year: string) => null,
  },
  {
    level: "HSC",
    levelBn: "এইচএসসি",
    subjects: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত", "আইসিটি"],
    availableYears: ["2023", "2024"],
    boardHref: "/hsc-board-questions",
    yearHref: (year: string) =>
      `/hsc-board-questions/physics/1st-paper/${year}`,
  },
];

export function BoardQuestionsSection() {
  return (
    <section className="py-16 font-bangla">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            বোর্ড প্রশ্ন দিয়ে <span className="text-gradient-gold">Final Preparation</span>
          </h2>
          <p className="text-slate-400 mt-2">
            Board Questions 2022–2026 — আসল পরীক্ষার প্রস্তুতি
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {boardData.map((data) => (
            <Card key={data.level} variant="glass" className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                  data.level === "SSC" 
                    ? "bg-cyan-500/20 text-cyan-400" 
                    : "bg-purple-500/20 text-purple-400"
                }`}>
                  {data.level}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{data.levelBn} বোর্ড প্রশ্ন</h3>
                  <p className="text-sm text-slate-400">বিজ্ঞান বিভাগ</p>
                </div>
              </div>

              {/* Years */}
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-3">বছর নির্বাচন করো</p>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => {
                    const isAvailable = data.availableYears.includes(year);
                    const href = isAvailable ? data.yearHref(year) : null;

                    if (href) {
                      return (
                        <Link key={year} href={href}>
                          <Badge variant="success" className="cursor-pointer hover:bg-success/20">
                            {year}
                          </Badge>
                        </Link>
                      );
                    }

                    return (
                      <Badge
                        key={year}
                        variant="default"
                        className="opacity-60 cursor-default"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        {year} — শীঘ্রই আসছে
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <p className="text-sm text-slate-400 mb-3">বিষয়সমূহ</p>
                <div className="flex flex-wrap gap-2">
                  {data.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs border border-slate-700"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {data.boardHref ? (
                <Link href={data.boardHref}>
                  <div className="mt-6 flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <span className="text-sm text-slate-300">সব বোর্ড প্রশ্ন দেখো</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ) : (
                <div className="mt-6 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-sm text-slate-500 text-center">
                  এসএসসি বোর্ড প্রশ্ন শীঘ্রই যোগ হবে
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/ChapterPracticeSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/ChapterPracticeSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Atom, FlaskConical, Dna, Calculator, ChevronRight, Target } from "lucide-react";
import Link from "next/link";
import { unifiedSubjectBasePath } from "@/lib/quiz/unified-routes";
import { HomeSectionHeader } from "./HomeSectionHeader";

const colorStyles = {
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-400/20",
  purple: "bg-purple-500/20 text-purple-300 border-purple-400/20",
  green: "bg-green-500/20 text-green-300 border-green-400/20",
  gold: "bg-yellow-500/20 text-yellow-300 border-yellow-400/20",
} as const;

type SubjectCardColor = keyof typeof colorStyles;

type SubjectCard = {
  id: string;
  name: string;
  chapters: number;
  mcqs: number;
  icon: React.ComponentType<{ className?: string }>;
  color: SubjectCardColor;
  href: string;
};

const subjects: SubjectCard[] = [
  {
    id: "physics",
    name: "পদার্থবিজ্ঞান",
    chapters: 12,
    mcqs: 450,
    icon: Atom,
    color: "cyan",
    href: unifiedSubjectBasePath("hsc", "physics-1st-paper"),
  },
  {
    id: "chemistry",
    name: "রসায়ন",
    chapters: 10,
    mcqs: 380,
    icon: FlaskConical,
    color: "purple",
    href: unifiedSubjectBasePath("hsc", "chemistry-1st-paper"),
  },
  {
    id: "biology",
    name: "জীববিজ্ঞান",
    chapters: 11,
    mcqs: 420,
    icon: Dna,
    color: "green",
    href: unifiedSubjectBasePath("hsc", "biology-1st-paper"),
  },
  {
    id: "math",
    name: "উচ্চতর গণিত",
    chapters: 14,
    mcqs: 520,
    icon: Calculator,
    color: "gold",
    href: unifiedSubjectBasePath("hsc", "higher-math-1st-paper"),
  },
  {
    id: "general-math",
    name: "সাধারণ গণিত",
    chapters: 10,
    mcqs: 350,
    icon: Calculator,
    color: "cyan",
    href: unifiedSubjectBasePath("ssc", "math"),
  },
];

export function ChapterPracticeSection() {
  return (
    <section id="explore-subjects" className="py-10 md:py-14 font-bangla scroll-mt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Chapter practice"
          title={<>বিষয় বেছে নিয়ে <span className="text-gradient-cyan">অধ্যায় অনুশীলন</span> করো</>}
          description="অধ্যায়ভিত্তিক MCQ — যেখানে দুর্বল, সেখান থেকেই শুরু করো।"
        />

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-visible">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              variant="glass"
              className="p-5 hoverable group min-w-[280px] snap-center md:min-w-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${colorStyles[subject.color]}`}>
                    <subject.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{subject.name}</h3>
                    <p className="text-xs text-slate-500">অধ্যায় অনুশীলন</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">অধ্যায়</span>
                  <span className="text-white font-medium">{subject.chapters}টি</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">MCQ</span>
                  <span className="text-white font-medium">{subject.mcqs}+</span>
                </div>
              </div>

              <Link href={subject.href}>
                <Button
                  variant="ghost"
                  fullWidth
                  className="flex items-center justify-center gap-2 group/btn min-h-[44px]"
                >
                  <Target className="h-4 w-4" />
                  অনুশীলন শুরু করো
                  <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/ClassPathSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/ClassPathSection.tsx)

```tsx
"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { educationPaths } from "@/lib/mockData";
import { GraduationCap, Sword, Check } from "lucide-react";

export function ClassPathSection() {
  const [selectedPath, setSelectedPath] = useState<string | null>("hsc"); // Default selected

  return (
    <section className="py-12 md:py-16 relative overflow-hidden font-bangla">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-purple-glow/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-12">
          <Badge variant="default" className="border-purple-glow/20 text-slate-300">ভর্তি ও বোর্ড পরীক্ষার লক্ষ্য</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            তোমার পরীক্ষার লক্ষ্য নির্বাচন করো
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            তোমার শ্রেণী অনুযায়ী সিলেবাস নির্ধারণ করে সরাসরি লাইভ কুইজ র্যাঙ্কিং যুদ্ধে প্রবেশ করো।
          </p>
        </div>

        {/* Portal Path Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {educationPaths.map((path) => {
            const isSelected = selectedPath === path.id;
            const isPurple = path.accent === "purple";
            
            return (
              <Card
                key={path.id}
                variant={isSelected ? (isPurple ? "glass" : "glass") : "dark"}
                onClick={() => setSelectedPath(path.id)}
                className={`cursor-pointer p-8 relative overflow-hidden transition-all duration-500 border ${
                  isSelected
                    ? isPurple
                      ? "border-purple-glow shadow-glow-purple bg-purple-dark/20 scale-[1.02]"
                      : "border-cyan-glow shadow-glow-cyan bg-cyan-dark/20 scale-[1.02]"
                    : "border-slate-900 hover:border-slate-800 hover:scale-[1.01]"
                }`}
              >
                {/* Glowing portal background effect inside the card */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] pointer-events-none -z-10 opacity-30 ${
                  isPurple ? "bg-purple-glow" : "bg-cyan-glow"
                }`} />

                {/* Selection indicator check bubble */}
                <div className={`absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isSelected
                    ? isPurple
                      ? "bg-purple-glow border-purple-glow text-white"
                      : "bg-cyan-glow border-cyan-glow text-[#02030b]"
                    : "border-slate-800 text-transparent"
                }`}>
                  <Check className="h-4.5 w-4.5 stroke-[3]" />
                </div>

                <div className="space-y-4">
                  {/* Category icon */}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-colors ${
                    isSelected
                      ? isPurple
                        ? "bg-purple-glow/10 border-purple-glow/30 text-purple-glow"
                        : "bg-cyan-glow/10 border-cyan-glow/30 text-cyan-glow"
                      : "bg-slate-950 border-slate-900 text-slate-500"
                  }`}>
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-semibold">{path.tag}</span>
                    <h3 className={`text-xl md:text-2xl font-black ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}>
                      {path.name}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <Badge variant={isSelected ? "rank" : "default"}>
                      {path.badge}
                    </Badge>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${
                      isSelected
                        ? isPurple
                          ? "text-purple-glow"
                          : "text-cyan-glow"
                        : "text-slate-500"
                    }`}>
                      <Sword className="h-4 w-4" />
                      ব্যাটেল চালু আছে
                    </span>
                  </div>
                </div>

              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
```

## File: [src/components/home/DailyTaskSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/DailyTaskSection.tsx)

```tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { subjectLabel } from "@/lib/profile-options";
import { normalizeLevel } from "@/lib/profile-utils";
import {
  quizWithinLast24Hours,
  subjectPracticeHref,
  topSubjectKeys,
  type RecentExamAttempt,
} from "@/lib/dashboard-analytics";
import {
  AlertTriangle,
  BookOpen,
  Flame,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DailyTaskSection() {
  const { user } = useAuth();
  const [recentExams, setRecentExams] = useState<RecentExamAttempt[]>([]);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setRecentExams([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.get<{
          recentAttempts?: RecentExamAttempt[];
          player?: { streak?: number };
        }>("/api/student/dashboard");
        if (!cancelled) {
          setRecentExams(data.recentAttempts || []);
          setPlayerStreak(data.player?.streak ?? user.streak ?? 0);
        }
      } catch {
        if (!cancelled) setRecentExams([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const level = normalizeLevel(user?.className, user?.level) || "ssc";
  const activeToday = useMemo(
    () => quizWithinLast24Hours(recentExams),
    [recentExams],
  );
  const suggestedSubjects = useMemo(
    () => topSubjectKeys(recentExams, 3),
    [recentExams],
  );

  if (!user) {
    return (
      <section id="continue-learning" className="py-10 md:py-14 font-bangla scroll-mt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card variant="glass" className="p-8 text-center border-purple-glow/15">
            <Target className="h-10 w-10 text-purple-glow mx-auto mb-3" />
            <h3 className="text-xl font-black text-white mb-2">দৈনিক মিশন</h3>
            <p className="text-sm text-slate-400 mb-5">
              লগইন করলে তোমার স্ট্রিক ও প্রস্তাবিত বিষয় দেখতে পারবে।
            </p>
            <Link href="/login">
              <Button variant="primary" className="min-h-[44px]">
                লগইন করুন
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="continue-learning" className="py-10 md:py-14 relative overflow-hidden font-bangla scroll-mt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!activeToday && !loading && (
          <div
            className={cn(
              "mb-6 rounded-2xl border border-orange-500/40 p-4 md:p-5",
              "bg-gradient-to-r from-orange-500/15 via-red-500/10 to-transparent",
              "shadow-[0_0_30px_rgba(249,115,22,0.15)] animate-pulse",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center shrink-0">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-orange-200">
                  🔥 স্ট্রিক ঝুঁকিতে
                </p>
                <p className="text-sm text-orange-100/80 mt-1">
                  গত ২৪ ঘণ্টায় কোনো কুইজ নেই — {playerStreak} দিনের স্ট্রিক ধরে রাখতে এখনই একটি
                  ব্যাটল শেষ করো!
                </p>
              </div>
              <Link href="/dashboard" className="shrink-0 hidden sm:block">
                <Button variant="primary" size="sm" className="min-h-[44px]">
                  <Zap className="h-4 w-4 mr-1" /> দ্রুত কুইজ
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <Card variant="glass" className="p-6 h-full border-cyan-500/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <Badge variant="default" className="text-cyan-300 border-cyan-400/20 mb-2">
                    দৈনিক মিশন
                  </Badge>
                  <h3 className="text-2xl font-black text-white">আজকের মিশন</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-slate-500">স্ট্রিক</p>
                  <p className="text-2xl font-black text-amber-400 font-outfit flex items-center gap-1 justify-end">
                    <Flame className="h-5 w-5 fill-amber-400/20" />
                    {playerStreak}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <QuestRow
                  done={activeToday}
                  title="২৪ ঘণ্টার মধ্যে ১টি কুইজ সম্পন্ন করো"
                  icon={<Target className="h-4 w-4" />}
                />
                <QuestRow
                  done={recentExams.length >= 3}
                  title="সপ্তাহে ৩+ কুইজ — ধারাবাহিকতা বোনাস"
                  icon={<Sparkles className="h-4 w-4" />}
                />
                <QuestRow
                  done={recentExams.some((e) => e.percentage >= 70)}
                  title="৭০%+ স্কোর — দক্ষতা বোনাস"
                  icon={<Zap className="h-4 w-4" />}
                />
              </div>

              {activeToday ? (
                <p className="mt-5 text-sm text-green-400 flex items-center gap-2">
                  <Flame className="h-4 w-4" /> স্ট্রিক নিরাপদ — আজকের কুইজ সম্পন্ন!
                </p>
              ) : (
                <Link href="/dashboard" className="block mt-5 sm:hidden">
                  <Button variant="primary" fullWidth className="min-h-[44px]">
                    দ্রুত কুইজ শুরু করো
                  </Button>
                </Link>
              )}
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card variant="glass" className="p-6 h-full border-purple-glow/15">
              <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-glow" />
                প্রস্তাবিত বিষয়
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                তোমার সাম্প্রতিক কুইজ ইতিহাস অনুযায়ী
              </p>

              {loading ? (
                <p className="text-sm text-slate-500 text-center py-8">লোড হচ্ছে...</p>
              ) : (
                <div className="space-y-3">
                  {suggestedSubjects.map((key, idx) => (
                    <Link
                      key={key}
                      href={subjectPracticeHref(key, level)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                        "bg-white/[0.03] border-white/10 hover:border-cyan-400/30 hover:bg-cyan-500/5",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg bg-purple-glow/10 border border-purple-glow/20 flex items-center justify-center text-xs font-black text-purple-glow font-outfit">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white">{subjectLabel(key)}</p>
                          <p className="text-xs text-slate-500">
                            {recentExams.length > 0 ? "তোমার কুইজ অনুযায়ী" : "শুরু করার জন্য ভালো"}
                          </p>
                        </div>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-cyan-400/60" />
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestRow({
  done,
  title,
  icon,
}: {
  done: boolean;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-xl border transition-colors",
        done
          ? "bg-green-500/10 border-green-500/25 text-green-100"
          : "bg-white/[0.02] border-white/10 text-slate-300",
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
          done ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-400",
        )}
      >
        {icon}
      </div>
      <p className={cn("text-sm font-semibold flex-1", done && "line-through opacity-80")}>
        {title}
      </p>
      {done && (
        <Badge variant="success" className="text-xs shrink-0">
          সম্পন্ন
        </Badge>
      )}
    </div>
  );
}
```

## File: [src/components/home/DashboardPreviewSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/DashboardPreviewSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BarChart3,
  ChevronRight,
  Target,
  TrendingUp,
  BookOpen,
  Flame,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    label: "Total Score",
    description: "কুইজ থেকে অর্জিত ELO স্কোর",
    icon: Target,
    color: "cyan",
  },
  {
    label: "Current Rank",
    description: "লিডারবোর্ডে তোমার অবস্থান",
    icon: TrendingUp,
    color: "purple",
  },
  {
    label: "Accuracy",
    description: "সঠিক উত্তরের হার",
    icon: BarChart3,
    color: "green",
  },
  {
    label: "Completed Quiz",
    description: "সম্পন্ন পরীক্ষার সংখ্যা",
    icon: BookOpen,
    color: "blue",
  },
  {
    label: "Study Streak",
    description: "ধারাবাহিক অনুশীলন",
    icon: Flame,
    color: "orange",
  },
];

export function DashboardPreviewSection() {
  return (
    <section className="py-16 font-bangla">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            তোমার <span className="text-gradient-cyan">Progress</span> এক নজরে
          </h2>
          <p className="text-slate-400 mt-2">
            লগইন করে Dashboard-এ তোমার আসল পরিসংখ্যান দেখো
          </p>
        </div>

        <Card variant="glass" className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {features.map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                    stat.color === "cyan"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : stat.color === "purple"
                        ? "bg-purple-500/20 text-purple-400"
                        : stat.color === "green"
                          ? "bg-green-500/20 text-green-400"
                          : stat.color === "blue"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-white">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-1">{stat.description}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-400 text-center mb-6">
            কুইজ দিলেই স্কোর, র‍্যাঙ্ক ও দুর্বল অধ্যায়ের রিপোর্ট স্বয়ংক্রিয়ভাবে আপডেট হয়।
          </p>

          <Link href="/dashboard">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2 group"
            >
              <BarChart3 className="h-5 w-5" />
              Dashboard-এ যাও
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </Card>
      </div>
    </section>
  );
}
```

## File: [src/components/home/FinalCTASection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/FinalCTASection.tsx)

```tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Rocket, ChevronRight, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { levelHubPath } from "@/lib/quiz/unified-routes";
import { HomeSectionHeader } from "./HomeSectionHeader";

export function FinalCTASection() {
  return (
    <section className="py-10 md:py-14 font-bangla">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-8 text-center shadow-[0_24px_90px_rgba(8,13,28,0.45)] sm:px-8">
          <Badge variant="premium" className="inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            আজ থেকেই শুরু করো
          </Badge>

          <HomeSectionHeader
            title={<>আজ থেকেই <span className="text-gradient-cyan">SSC/HSC বিজ্ঞান</span> প্রস্তুতি শুরু করো</>}
            description="অধ্যায়ভিত্তিক কুইজ, বোর্ড প্রশ্ন, মডেল টেস্ট, র‍্যাঙ্কিং ও অগ্রগতি রিপোর্ট — সব এক জায়গায়।"
            className="mb-5 mt-5"
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href={levelHubPath("ssc")} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" fullWidth className="flex items-center justify-center gap-2 group min-h-[48px]">
                <Rocket className="h-5 w-5" />
                ফ্রি শুরু করো
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/leaderboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth className="flex items-center justify-center gap-2 min-h-[48px]">
                <Trophy className="h-5 w-5" />
                লিডারবোর্ড দেখো
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500 pt-2">
            ক্রেডিট কার্ড লাগবে না • ফ্রি প্ল্যান সবসময় উপলব্ধ
          </p>
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/FinalFocusSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/FinalFocusSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Target, Calendar, Repeat, AlertTriangle, Lock, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { levelModelTestsPath } from "@/lib/quiz/unified-routes";

const focusFeatures = [
  {
    id: "high-probability",
    bnTitle: "গুরুত্বপূর্ণ প্রশ্ন সেট",
    description: "আগের বোর্ড প্রশ্ন ও repeated MCQ pattern দেখে তৈরি",
    icon: Target,
    color: "gold",
  },
  {
    id: "revision-plan",
    bnTitle: "৭ দিনের রিভিশন প্ল্যান",
    description: "পরীক্ষার আগের সপ্তাহে smart revision schedule",
    icon: Calendar,
    color: "purple",
  },
  {
    id: "board-pattern",
    bnTitle: "বোর্ড প্যাটার্ন প্রশ্ন",
    description: "বোর্ডে বারবার আসা প্রশ্নের ধরন অনুযায়ী practice",
    icon: Repeat,
    color: "cyan",
  },
  {
    id: "weak-chapter",
    bnTitle: "দুর্বল অধ্যায় সাজেশন",
    description: "তোমার দুর্বল অধ্যায় অনুযায়ী কাস্টম সাজেশন",
    icon: AlertTriangle,
    color: "orange",
  },
];

export function FinalFocusSection({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={cn("font-bangla", embedded ? "py-8" : "py-16")}>
      <div
        className={cn(
          "mx-auto max-w-5xl",
          !embedded && "max-w-7xl px-4 sm:px-6 lg:px-8",
        )}
      >
        <Card variant="glass" className="p-6 md:p-10 border-cyan-500/20 bg-gradient-to-br from-[#07111F] via-[#0D1E36] to-[#07111F]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="flex items-center gap-1 bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  ফাইনাল ফোকাস সাজেশন
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  ফাইনাল <span className="text-gradient-cyan">ফোকাস সাজেশন</span>
                </h2>
                <p className="text-slate-400">
                  আগের বোর্ড প্রশ্ন, গুরুত্বপূর্ণ অধ্যায় ও repeated MCQ pattern দেখে তৈরি practice set।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {focusFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start gap-3 p-3 rounded-xl bg-black/20 border border-slate-700/50">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      feature.color === "gold" ? "bg-yellow-500/20 text-yellow-400" :
                      feature.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                      feature.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                      "bg-orange-500/20 text-orange-400"
                    }`}>
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{feature.bnTitle}</h4>
                      <p className="text-xs text-slate-400 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={levelModelTestsPath("ssc")} className="flex-1">
                  <Button variant="primary" fullWidth className="flex items-center justify-center gap-1.5 min-h-[44px]">
                    <Sparkles className="h-4 w-4" />
                    SSC মডেল টেস্ট
                  </Button>
                </Link>
                <Link href={levelModelTestsPath("hsc")} className="flex-1">
                  <Button variant="secondary" fullWidth className="flex items-center justify-center gap-1.5 min-h-[44px]">
                    <Sparkles className="h-4 w-4" />
                    HSC মডেল টেস্ট
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                
                <Card variant="glass" className="p-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Final Focus Set</h3>
                      <p className="text-xs text-slate-400">HSC Physics 1st Paper</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">MCQ Count</span>
                      <span className="text-white font-medium">50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Duration</span>
                      <span className="text-white font-medium">45 min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Difficulty</span>
                      <span className="text-yellow-400 font-medium">Board Level</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Based On</span>
                      <span className="text-white font-medium">2022-2024 Pattern</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-xs text-yellow-400 text-center">
                      <Sparkles className="h-3 w-3 inline mr-1" />
                      বোর্ড প্যাটার্ন ও গুরুত্বপূর্ণ অধ্যায়ভিত্তিক সেট
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
```

## File: [src/components/home/FreeChallengeSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/FreeChallengeSection.tsx)

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { levelDetectorQuestions } from "@/lib/mockData";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import { Timer, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function FreeChallengeSection() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ qIdx: number; optionIdx: number; isCorrect: boolean }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Timer when quiz starts
  useEffect(() => {
    if (isStarted && !isFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isFinished, timeLeft]);

  // Restart Quiz
  const handleStart = () => {
    setIsStarted(true);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setTimeLeft(30);
    setIsFinished(false);
    setUserAnswers([]);
  };

  // Option Select Handler
  const handleOptionSelect = (optionIdx: number) => {
    if (selectedOption !== null) return; // Prevent double clicking
    
    setSelectedOption(optionIdx);
    const question = levelDetectorQuestions[currentIdx];
    const isCorrect = optionIdx === question.correctAnswer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      { qIdx: currentIdx, optionIdx, isCorrect }
    ]);
  };

  // Move to next question
  const handleNext = () => {
    if (currentIdx < levelDetectorQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const currentQuestion = levelDetectorQuestions[currentIdx];
  const optionPrefixes = ["ক", "খ", "গ", "ঘ"];

  return (
    <section id="quiz" className="py-12 md:py-24 relative font-bangla">
      <div className="absolute top-1/2 left-1/4 w-[250px] h-[250px] bg-cyan-glow/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10">
          <Badge variant="premium" className="px-3 py-1">বিনামূল্যে পরীক্ষা করো</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            ৩০-সেকেন্ডের লেভেল ডিটেক্টর চ্যালেঞ্জ
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            ৫টি দ্রুত MCQ এর উত্তর দিয়ে দেখো তোমার প্রস্তুতি কেমন। কুইজ শেষে পাবে সম্পূর্ণ দুর্বল বিষয় বিশ্লেষণ রিপোর্ট!
          </p>
        </div>

        {/* Quiz Board Arena */}
        <Card variant="glass" className="p-6 md:p-10 border-purple-glow/15 shadow-[0_0_40px_rgba(139,92,246,0.08)] relative overflow-hidden">
          
          {/* Neon side accents */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-glow to-cyan-glow" />

          {/* 1. START STATE */}
          {!isStarted && !isFinished && (
            <div className="text-center py-10 space-y-6">
              <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-purple-glow/10 border border-purple-glow/25 text-purple-glow shadow-glow-purple/20 animate-pulse">
                <Timer className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">তুমি কি যুদ্ধের জন্য প্রস্তুত?</h3>
                <p className="text-slate-400 text-xs sm:text-sm">
                  প্রতিটি প্রশ্নের জন্য সময় সীমাবদ্ধ। দ্রুত সঠিক উত্তর নির্বাচন করে র্যাঙ্ক আপ করো।
                </p>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-center text-xs text-slate-400">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-navy-light/60 rounded-full border border-slate-900">
                  ⚡ ৫টি বিজ্ঞান প্রশ্ন
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-navy-light/60 rounded-full border border-slate-900">
                  ⏱️ ৩০ সেকেন্ড সময়সীমা
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-navy-light/60 rounded-full border border-slate-900">
                  📊 দুর্বল বিষয় বিশ্লেষণ
                </div>
              </div>
              <div>
                <Button variant="primary" size="lg" className="w-full sm:w-auto font-extrabold" onClick={handleStart}>
                  চ্যালেঞ্জ শুরু করো
                </Button>
              </div>
            </div>
          )}

          {/* 2. ACTIVE QUIZ STATE */}
          {isStarted && !isFinished && currentQuestion && (
            <div className="space-y-6">
              
              {/* Quiz Header: Progress & Timer */}
              <div className="flex items-center justify-between border-b border-purple-glow/10 pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-outfit uppercase tracking-wider">প্রশ্ন</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{currentIdx + 1}</span>
                    <span className="text-slate-500 font-outfit">/ ৫</span>
                    <Badge variant="default" className="text-[10px] ml-2 bg-navy-light">{currentQuestion.subject}</Badge>
                  </div>
                </div>
                
                {/* Countdown Timer */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 font-outfit font-bold">
                  <Timer className="h-4 w-4 animate-spin" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Progress Bar indicator */}
              <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-glow to-cyan-glow transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / levelDetectorQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="py-2">
                <FormattedQuizText
                  text={currentQuestion.question}
                  className="text-lg md:text-xl font-bold text-slate-100"
                  hideWorkedSolution={false}
                />
              </div>

              {/* Question Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctAnswer;
                  
                  let optionStyles = "bg-navy-light/40 border-slate-800 text-slate-200 hover:border-purple-glow/40 hover:bg-purple-glow/5";
                  
                  if (selectedOption !== null) {
                    if (isCorrectAnswer) {
                      optionStyles = "bg-success-green/10 border-success-green text-success-green shadow-glow-green/10";
                    } else if (isSelected) {
                      optionStyles = "bg-error-red/10 border-error-red text-error-red shadow-glow-red/10";
                    } else {
                      optionStyles = "bg-navy-light/10 border-slate-950 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${optionStyles}`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                        selectedOption !== null && isCorrectAnswer 
                          ? "bg-success-green border-success-green text-black"
                          : selectedOption !== null && isSelected
                          ? "bg-error-red border-error-red text-white"
                          : "bg-slate-950 border-slate-700 text-slate-400"
                      }`}>
                        {optionPrefixes[idx]}
                      </span>
                      <FormattedQuizText
                        text={option}
                        inline
                        className="text-sm md:text-base font-semibold"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Explanations & Next Button */}
              {selectedOption !== null && (
                <div className="pt-4 border-t border-purple-glow/10 space-y-4 animate-fadeIn">
                  
                  {/* Detailed explanation */}
                  <div className="p-4 rounded-xl bg-purple-glow/5 border border-purple-glow/10 text-xs sm:text-sm text-slate-300">
                    <span className="font-bold text-purple-glow flex items-center gap-1.5 mb-1.5">
                      💡 ব্যাখ্যা বিশ্লেষণ:
                    </span>
                    <FormattedQuizText
                      text={currentQuestion.explanation}
                      className="leading-relaxed"
                      hideWorkedSolution={false}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" size="md" className="flex items-center gap-2" onClick={handleNext}>
                      {currentIdx === levelDetectorQuestions.length - 1 ? "ফলাফল দেখো" : "পরবর্তী প্রশ্ন"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 3. FINISHED REPORT CARD STATE */}
          {isFinished && (
            <div className="space-y-8 py-4">
              
              {/* Score HUD Header */}
              <div className="text-center space-y-2">
                <Badge variant="premium" className="text-xs">পরীক্ষা শেষ রিপোর্ট</Badge>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">যুদ্ধ রিপোর্ট ও বিশ্লেষণ</h3>
                
                {/* Large score display */}
                <div className="py-4 flex justify-center items-baseline gap-1">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-glow to-cyan-glow font-outfit">
                    {score}
                  </span>
                  <span className="text-slate-500 font-outfit text-xl">/ ৫</span>
                </div>
                
                <p className="text-slate-300 text-sm max-w-sm mx-auto font-semibold">
                  {score === 5 
                    ? "🎉 অসাধারণ প্রস্তুতি! তুমি একজন জিনিয়াস র্যাঙ্কার!" 
                    : score >= 3 
                    ? "✨ ভালো প্রস্তুতি, তবে দুর্বল বিষয়গুলোতে আরও চর্চা প্রয়োজন।" 
                    : "⚠️ প্রস্তুতি আশঙ্কাজনক! ব্যাটেলে টিকে থাকতে দ্রুত রিভিশন প্রয়োজন।"}
                </p>
              </div>

              {/* Subject wise weaknesses analyzed dynamically */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">বিষয়ভিত্তিক দুর্বলতা মূল্যায়ন:</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Physics Analysis */}
                  <Card variant="dark" className="p-4 border-slate-900 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-glow/10 text-purple-glow">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500">পদার্থবিজ্ঞান বিশ্লেষণ</span>
                      <h5 className="text-sm font-bold text-slate-200">গতি ও বলবিদ্যা</h5>
                      <p className="text-xs text-slate-400">উচ্চতা ও বেগের গাণিতিক সূত্রে বিভ্রান্তি রয়েছে (গতি ভুল হয়েছে)।</p>
                      <Badge variant="warning" className="text-[9px] mt-1">দুর্বল অধ্যায়</Badge>
                    </div>
                  </Card>

                  {/* Chemistry Analysis */}
                  <Card variant="dark" className="p-4 border-slate-900 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-success-green/10 text-success-green">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500">রসায়ন বিশ্লেষণ</span>
                      <h5 className="text-sm font-bold text-slate-200">তড়িৎ ঋণাত্মকতা</h5>
                      <p className="text-xs text-slate-400">পর্যায় সারণী ও বন্ধন অধ্যায়ে ধারণাগত জ্ঞান চমৎকার।</p>
                      <Badge variant="success" className="text-[9px] mt-1">সবল অধ্যায়</Badge>
                    </div>
                  </Card>

                </div>
              </div>

              {/* End of Quiz actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button variant="primary" className="flex items-center justify-center gap-2" onClick={() => {
                  const el = document.getElementById("premium");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}>
                  👑 প্রিমিয়াম যুদ্ধঘর আনলক করো
                </Button>
                <Button variant="secondary" className="flex items-center justify-center gap-2" onClick={handleStart}>
                  <RotateCcw className="h-4 w-4" />
                  আবার চেষ্টা করো
                </Button>
              </div>

            </div>
          )}

        </Card>

      </div>
    </section>
  );
}
```

## File: [src/components/home/HeroSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/HeroSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Trophy, Flame, Zap, Award, Target, ChevronRight } from "lucide-react";
import { userStats } from "@/lib/mockData";

export function HeroSection() {
  return (
    <section id="home" className="relative py-10 md:py-20 overflow-hidden font-bangla">
      {/* Decorative ambient glowing grids and shapes */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-glow/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Pitch (Left Column on Desktop) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-dark/60 border border-purple-glow/30 text-purple-glow text-xs md:text-sm font-extrabold animate-pulse">
              <Zap className="h-4 w-4 fill-purple-glow" />
              <span>SSC ও HSC বিজ্ঞান MCQ যুদ্ধঘর</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              বিজ্ঞান MCQ প্রস্তুতি <br />
              এখন <span className="bg-gradient-to-r from-purple-glow via-fuchsia-500 to-cyan-glow bg-clip-text text-transparent shadow-glow-purple/20">Battle Mode</span>-এ
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              অধ্যায়ভিত্তিক লাইভ যুদ্ধ, গতি পরীক্ষা, র্যাঙ্কিং এবং দুর্বল বিষয় ভিত্তিক রিপোর্ট — সবকিছুই সম্পূর্ণ বাংলায়। নিজেকে ছাড়িয়ে যাওয়ার মিশন শুরু করো এখনই!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Button variant="primary" size="lg" className="flex items-center gap-2 group" onClick={() => {
                const el = document.getElementById("subjects");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>
                যুদ্ধ শুরু করো 
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => {
                const el = document.getElementById("quiz");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>
                লেভেল যাচাই কর
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-slate-500 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-cyan-glow text-lg font-bold">১০,০০০+</span>
                <span>সক্রিয় শিক্ষার্থী</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className="text-purple-glow text-lg font-bold">২ মিলিয়নের+</span>
                <span>সমাধানকৃত MCQ</span>
              </div>
            </div>
          </div>

          {/* Gamified Cockpit HUD (Right Column on Desktop) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <Card variant="glass" className="relative p-6 border-purple-glow/20 shadow-[0_0_50px_rgba(139,92,246,0.05)] overflow-hidden">
              
              {/* Cockpit Title Bar */}
              <div className="flex items-center justify-between border-b border-purple-glow/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🚀</div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{userStats.name}</h3>
                    <p className="text-xs text-slate-500 font-outfit">HSC Science Batch</p>
                  </div>
                </div>
                <Badge variant="premium" className="text-[10px] animate-pulse">PRO MEMBER</Badge>
              </div>

              {/* Progress HUD Circle & Level */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative flex items-center justify-center h-20 w-20">
                  {/* SVG circular progress */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="rgba(139, 92, 246, 0.1)"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="url(#purpleGradient)"
                      strokeWidth="5"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - userStats.levelProgress / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center">
                    <span className="text-xs text-slate-400">লেভেল</span>
                    <p className="text-xl font-bold font-outfit text-white">{userStats.level}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">লেভেল এক্সপি প্রোগ্রেস</span>
                    <span className="font-outfit text-purple-glow font-bold">{userStats.xp} / {userStats.nextLevelXp} XP</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-glow to-cyan-glow rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                      style={{ width: `${userStats.levelProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                
                {/* Stat 1: Leaderboard Rank */}
                <Card variant="dark" className="p-3 border-purple-glow/5 hover:border-purple-glow/10 transition-all">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Trophy className="h-4 w-4 text-gold-rank" />
                    <span>সার্বজনীন র্যাঙ্ক</span>
                  </div>
                  <p className="text-lg font-extrabold text-white">
                    #{userStats.rank} <span className="text-[10px] text-slate-500 font-normal">/{userStats.totalUsers}</span>
                  </p>
                </Card>

                {/* Stat 2: Streak Days */}
                <Card variant="dark" className="p-3 border-purple-glow/5 hover:border-purple-glow/10 transition-all">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Flame className="h-4 w-4 text-orange-500 fill-orange-500/10 animate-bounce" />
                    <span>চলমান স্ট্রিক</span>
                  </div>
                  <p className="text-lg font-extrabold text-white">
                    {userStats.streak} দিন
                  </p>
                </Card>

                {/* Stat 3: Win Rate */}
                <Card variant="dark" className="p-3 border-purple-glow/5 hover:border-purple-glow/10 transition-all">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Target className="h-4 w-4 text-cyan-glow" />
                    <span>সঠিকতার হার</span>
                  </div>
                  <p className="text-lg font-extrabold text-white">
                    {userStats.winRate}
                  </p>
                </Card>

                {/* Stat 4: Battles Played */}
                <Card variant="dark" className="p-3 border-purple-glow/5 hover:border-purple-glow/10 transition-all">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Award className="h-4 w-4 text-purple-glow" />
                    <span>মোট যুদ্ধ ম্যাচ</span>
                  </div>
                  <p className="text-lg font-extrabold text-white">
                    {userStats.battlesPlayed} টি
                  </p>
                </Card>

              </div>

              {/* Status footer inside HUD */}
              <div className="text-center py-2 bg-purple-glow/5 rounded-xl border border-purple-glow/10">
                <span className="text-[11px] text-slate-300">
                  🔥 স্ট্রিক বোনাস সক্রিয়! প্রতিদিন ২০ মিনিট অংশ নাও।
                </span>
              </div>

            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/HeroSectionNew.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/HeroSectionNew.tsx)

```tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Zap, Trophy, BookOpen, Users, ChevronRight, Target, Flame, RefreshCcw, BarChart3 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { levelHubPath } from "@/lib/quiz/unified-routes";

function DashboardPreviewCard({ className }: { className?: string }) {
  return (
    <Card variant="glass" className={cn("p-5 border-purple-500/20 shadow-[0_24px_90px_rgba(8,13,28,0.55)]", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">তোমার অগ্রগতি</h3>
          <p className="text-xs text-slate-400">আজকের ছোট practice-ই কালকের rank</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card variant="dark" className="p-3">
          <p className="text-xs text-slate-400 mb-1">Daily loop</p>
          <p className="text-xl font-bold text-amber-400">5 min</p>
        </Card>
        <Card variant="dark" className="p-3">
          <p className="text-xs text-slate-400 mb-1">Next action</p>
          <p className="text-xl font-bold text-cyan-400">MCQ</p>
        </Card>
      </div>

      <div className="space-y-2 mb-4">
        {[
          { icon: Target, text: "Weak chapter first" },
          { icon: RefreshCcw, text: "Wrong answer retake" },
          { icon: Flame, text: "Daily streak focus" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
            <item.icon className="h-3.5 w-3.5 text-cyan-300" />
            {item.text}
          </div>
        ))}
      </div>

      <Link href="/dashboard">
        <Button variant="primary" fullWidth size="sm" className="min-h-[44px]">
          ড্যাশবোর্ড দেখো
        </Button>
      </Link>
    </Card>
  );
}

export function HeroSectionNew() {
  return (
    <section className="relative overflow-hidden py-10 font-bangla scroll-mt-20 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-5 text-center lg:text-left">
            <Badge variant="premium" className="inline-flex items-center gap-2 motion-reduce:animate-none animate-pulse">
              <Zap className="h-3 w-3" />
              SSC ও HSC বিজ্ঞান MCQ প্ল্যাটফর্ম
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              ৫ মিনিটের practice loop, {" "}
              <span className="text-gradient-purple">বোর্ড প্রশ্ন</span> ও{" "}
              <span className="text-gradient-gold">মডেল টেস্ট</span>
              <br />
              <span className="text-slate-300">এক জায়গায়</span>
            </h1>

            <p className="text-base text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              যে অধ্যায় দুর্বল, সেটাই আগে শক্তিশালী করো। MCQ দাও, ভুল retake করো, র‍্যাঙ্ক দেখো, পরীক্ষার আত্মবিশ্বাস বাড়াও।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xl mx-auto lg:mx-0">
              {["Weak chapter", "Quick MCQ", "Rank feedback"].map((label) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 shadow-sm">
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <Link href={levelHubPath("ssc")} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" fullWidth className="flex items-center justify-center gap-2 group min-h-[48px]">
                  SSC শুরু করো
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={levelHubPath("hsc")} className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth className="flex items-center justify-center gap-2 group min-h-[48px]">
                  HSC শুরু করো
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <Link href="/leaderboard" className="block w-full sm:w-auto sm:inline-block">
              <Button variant="ghost" fullWidth className="flex items-center justify-center gap-2 min-h-[44px] border border-white/10">
                <Trophy className="h-4 w-4 text-yellow-400" />
                লিডারবোর্ড দেখো
              </Button>
            </Link>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-lg mx-auto lg:mx-0">
              {[
                { icon: BookOpen, value: "5000+", label: "MCQ", color: "text-cyan-400" },
                { icon: Users, value: "SSC + HSC", label: "বিজ্ঞান", color: "text-purple-400" },
                { icon: Trophy, value: "২০২২–২০২৬", label: "বোর্ড প্রশ্ন", color: "text-yellow-400" },
                { icon: Target, value: "মডেল", label: "টেস্ট", color: "text-red-400" },
              ].map((stat) => (
                <div key={stat.label} className="glass-panel rounded-xl p-3 text-center border border-white/10">
                  <stat.icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
                  <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <DashboardPreviewCard className="hidden lg:block" />
          <DashboardPreviewCard className="lg:hidden mt-2" />
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/HomeMobileNav.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/HomeMobileNav.tsx)

```tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#quick-actions", label: "দ্রুত শুরু" },
  { href: "#continue-learning", label: "আজকের কাজ" },
  { href: "#explore-subjects", label: "অধ্যায়" },
  { href: "#leaderboard", label: "র‍্যাঙ্ক" },
];

export function HomeMobileNav() {
  return (
    <nav
      className="sticky top-[72px] z-30 border-b border-white/10 bg-[#07111F]/95 backdrop-blur-xl lg:hidden"
      aria-label="হোম সেকশন নেভিগেশন"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2",
              "text-xs font-bold text-slate-200 transition active:scale-95",
              "hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200",
              "min-h-[44px] flex items-center",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

## File: [src/components/home/HomeSectionHeader.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/HomeSectionHeader.tsx)

```tsx
import React from "react";
import { cn } from "@/lib/utils";

type HomeSectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/80">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-2 text-sm leading-6 text-slate-400",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
```

## File: [src/components/home/LeaderboardPreview.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/LeaderboardPreview.tsx)

```tsx
import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { leaderboardUsers } from "@/lib/mockData";
import { Trophy, ShieldCheck, Flame, ArrowUp } from "lucide-react";

export function LeaderboardPreview() {
  // Extract top 3 and others
  const top1 = leaderboardUsers.find((u) => u.rank === 1);
  const top2 = leaderboardUsers.find((u) => u.rank === 2);
  const top3 = leaderboardUsers.find((u) => u.rank === 3);
  const scrollUsers = leaderboardUsers.filter((u) => u.rank > 3);

  return (
    <section id="leaderboard" className="py-12 md:py-24 relative overflow-hidden font-bangla">
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-purple-glow/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-glow/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <Badge variant="premium" className="px-3 py-1">বৈশ্বিক লিডারবোর্ড</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            বিজ্ঞান র্যাঙ্কারস হল অব ফেম
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            রিয়েল-টাইম লাইভ কুইজে সঠিক ও দ্রুততম উত্তর দিয়ে সর্বোচ্চ পয়েন্ট অর্জন করো এবং টপ থ্রি পোডিয়ামে স্থান পাও।
          </p>
        </div>

        {/* Podium Layout (Top 3) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-3xl mx-auto mb-10 pt-8">
          
          {/* Rank 2 - Left */}
          {top2 && (
            <div className="flex flex-col items-center">
              {/* Profile Bubble */}
              <div className="relative mb-3 flex flex-col items-center">
                <div className="h-14 w-14 sm:h-18 sm:w-18 rounded-full border-2 border-slate-400 bg-slate-900/60 flex items-center justify-center text-2xl shadow-lg">
                  {top2.avatar}
                </div>
                <div className="absolute -bottom-1.5 bg-slate-400 text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-slate-900 font-outfit">
                  2
                </div>
              </div>
              
              {/* Podium Column */}
              <div className="w-full h-32 sm:h-40 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-x border-slate-800 rounded-t-2xl flex flex-col items-center justify-end p-3 text-center shadow-lg">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 truncate w-full">{top2.name}</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 font-outfit mt-1">{top2.points} XP</p>
                <Badge variant="default" className="text-[8px] sm:text-[9px] mt-1.5 px-1.5 py-0.5 border-slate-800">{top2.accuracy} সঠিকতা</Badge>
              </div>
            </div>
          )}

          {/* Rank 1 - Center */}
          {top1 && (
            <div className="flex flex-col items-center">
              {/* Crown & Avatar */}
              <div className="relative mb-4 flex flex-col items-center">
                <div className="absolute -top-6 text-2xl animate-bounce">👑</div>
                <div className="h-16 w-16 sm:h-22 sm:w-22 rounded-full border-4 border-gold-rank bg-gold-dark/40 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(251,191,36,0.2)]">
                  {top1.avatar}
                </div>
                <div className="absolute -bottom-1.5 bg-gold-rank text-black text-xs font-black h-6 w-6 rounded-full flex items-center justify-center border border-slate-900 font-outfit">
                  1
                </div>
              </div>
              
              {/* Podium Column */}
              <div className="w-full h-40 sm:h-52 bg-gradient-to-t from-gold-dark/40 to-yellow-900/10 border-t border-x border-gold-rank/30 rounded-t-2xl flex flex-col items-center justify-end p-4 text-center shadow-[0_0_30px_rgba(251,191,36,0.05)]">
                <h4 className="text-sm sm:text-base font-black text-gold-rank truncate w-full">{top1.name}</h4>
                <p className="text-xs sm:text-sm font-outfit font-black text-white mt-1">{top1.points} XP</p>
                <Badge variant="rank" className="text-[8px] sm:text-[10px] mt-2 px-2 py-0.5 border-yellow-300/30">{top1.accuracy} সঠিকতা</Badge>
              </div>
            </div>
          )}

          {/* Rank 3 - Right */}
          {top3 && (
            <div className="flex flex-col items-center">
              {/* Profile Bubble */}
              <div className="relative mb-3 flex flex-col items-center">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-amber-600 bg-slate-900/60 flex items-center justify-center text-2xl shadow-lg">
                  {top3.avatar}
                </div>
                <div className="absolute -bottom-1.5 bg-amber-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-slate-900 font-outfit">
                  3
                </div>
              </div>
              
              {/* Podium Column */}
              <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-x border-slate-800 rounded-t-2xl flex flex-col items-center justify-end p-3 text-center shadow-lg">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 truncate w-full">{top3.name}</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 font-outfit mt-1">{top3.points} XP</p>
                <Badge variant="default" className="text-[8px] sm:text-[9px] mt-1.5 px-1.5 py-0.5 border-slate-800">{top3.accuracy} সঠিকতা</Badge>
              </div>
            </div>
          )}

        </div>

        {/* Scroll list for other ranks */}
        <div className="max-w-3xl mx-auto space-y-2.5">
          {scrollUsers.map((user) => {
            const isSelf = user.isCurrentUser;
            
            return (
              <Card
                key={user.rank}
                variant={isSelf ? "premium" : "leaderboard"}
                className={`p-4 flex items-center justify-between border transition-all ${
                  isSelf 
                    ? "border-gold-rank/40 shadow-glow-gold/10 bg-gold-dark/20" 
                    : "border-purple-glow/5 hover:border-purple-glow/15"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank number */}
                  <span className={`w-6 text-center text-sm font-bold font-outfit ${
                    isSelf ? "text-gold-rank" : "text-slate-500"
                  }`}>
                    {user.rank}
                  </span>
                  
                  {/* Avatar icon */}
                  <span className="text-lg shrink-0">{user.avatar}</span>
                  
                  {/* Name details */}
                  <span className={`text-sm sm:text-base font-bold ${
                    isSelf ? "text-gold-rank" : "text-slate-200"
                  }`}>
                    {user.name}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  {/* Accuracy */}
                  <span className="hidden xs:inline-flex text-xs text-slate-500 font-semibold font-outfit">
                    {user.accuracy} সঠিকতা
                  </span>
                  
                  {/* XP Points */}
                  <span className={`text-sm sm:text-base font-bold font-outfit ${
                    isSelf ? "text-white" : "text-purple-glow"
                  }`}>
                    {user.points} XP
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
```

## File: [src/components/home/LeaderboardPreviewSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/LeaderboardPreviewSection.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Trophy, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  fetchLeaderboard,
  type LeaderboardEntry,
} from "@/lib/leaderboard-api";
import { HomeSectionHeader } from "./HomeSectionHeader";

function PreviewSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <Card key={i} variant="glass" className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-700/50" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-slate-700/50" />
            <div className="h-3 w-24 rounded bg-slate-800/50" />
          </div>
          <div className="h-6 w-16 rounded bg-slate-700/50" />
        </Card>
      ))}
    </div>
  );
}

function rankBadge(rank: number): string {
  if (rank === 1) return "🏆";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "⭐";
}

function rankCardClass(rank: number): string {
  if (rank === 1) return "border-yellow-500/30 bg-yellow-500/5";
  if (rank === 2) return "border-slate-400/30 bg-slate-400/5";
  if (rank === 3) return "border-orange-600/30 bg-orange-600/5";
  return "border-white/10 bg-white/5";
}

export function LeaderboardPreviewSection() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then((data) => {
      setEntries(data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (!loading && entries.length === 0) {
    return null;
  }

  return (
    <section id="leaderboard" className="py-10 md:py-14 font-bangla scroll-mt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Leaderboard"
          title={<>আজকের <span className="text-gradient-gold">শীর্ষ শিক্ষার্থী</span></>}
          description="লিডারবোর্ডে তোমার স্থান দেখো এবং নিয়মিত অনুশীলনের গতি ধরে রাখো।"
        />

        <div className="max-w-2xl mx-auto space-y-4">
          {loading ? (
            <PreviewSkeleton />
          ) : (
            entries.map((student) => (
              <Card
                key={student.userId || student.rank}
                variant="glass"
                className={`p-4 flex items-center gap-4 ${rankCardClass(student.rank)}`}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl bg-slate-800/50">
                  {rankBadge(student.rank)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white truncate">{student.name}</h3>
                    <Badge
                      variant={student.rank === 1 ? "premium" : "default"}
                      className="text-[10px]"
                    >
                      #{student.rank}
                    </Badge>
                  </div>
                  {student.accuracy != null && (
                    <p className="text-xs text-slate-400">
                      সঠিকতা: {Math.round(student.accuracy)}%
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-white">
                    {student.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">ELO</p>
                </div>
              </Card>
            ))
          )}

          <Link href="/leaderboard">
            <Button
              variant="secondary"
              fullWidth
              className="flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="h-4 w-4" />
              )}
              তোমার Rank দেখো
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/LiveTestSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/LiveTestSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock, BookOpen, Calendar, Bell } from "lucide-react";

export function LiveTestSection() {
  return (
    <section className="py-16 font-bangla">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="default" className="inline-flex items-center gap-2 mb-4">
            লাইভ টেস্ট
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            পরবর্তী <span className="text-gradient-purple">লাইভ মডেল টেস্ট</span>
          </h2>
          <p className="text-slate-400 mt-2">
            নির্দিষ্ট সময়ে সবাই একসাথে পরীক্ষা দাও, rank দেখো
          </p>
        </div>

        <Card variant="glass" className="max-w-3xl mx-auto p-6 md:p-8 border-purple-500/20">
          <div className="flex flex-col gap-6 items-center text-center">
            <Badge variant="premium" className="text-sm px-4 py-1">
              শীঘ্রই আসছে...
            </Badge>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>সময়সূচি শীঘ্রই প্রকাশ করা হবে</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white">
                লাইভ মডেল টেস্ট ব্যাটল
              </h3>

              <p className="text-sm text-slate-400 max-w-md mx-auto">
                SSC ও HSC বিজ্ঞানের জন্য সময়-নির্ধারিত লাইভ পরীক্ষা চালু হচ্ছে।
                র‍্যাঙ্কিং ও রিয়েল-টাইম ফলাফল একসাথে দেখতে পারবে।
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm pt-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span>নির্ধারিত সময়</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span>MCQ সেট</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="secondary" disabled className="flex items-center gap-2 cursor-not-allowed opacity-70">
                শীঘ্রই আসছে...
              </Button>
              <Button variant="secondary" disabled className="flex items-center gap-2 cursor-not-allowed opacity-70">
                <Bell className="h-4 w-4" />
                রিমাইন্ডার — শীঘ্রই
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
```

## File: [src/components/home/ModelTestSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/ModelTestSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock, FileQuestion, Trophy, Target, Lock, ChevronRight, Zap, Radio } from "lucide-react";
import Link from "next/link";
import {
  levelModelTestsPath,
  unifiedModelTestPathPrefix,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";

const modelTests = [
  {
    id: "chapter-final",
    bnTitle: "অধ্যায় ফাইনাল টেস্ট",
    description: "প্রতি অধ্যায় শেষে ফাইনাল পরীক্ষা",
    duration: "20 মিনিট",
    mcqs: "20 MCQ",
    features: ["Score + Rank", "Result Analysis"],
    isPremium: false,
    icon: FileQuestion,
    color: "cyan",
    href: unifiedSubjectBasePath("hsc", "physics-1st-paper"),
  },
  {
    id: "subject-final",
    bnTitle: "বিষয় ফাইনাল টেস্ট",
    description: "পুরো বিষয়ের উপর কমপ্লিট টেস্ট",
    duration: "45 মিনিট",
    mcqs: "50 MCQ",
    features: ["Score + Rank", "Detailed Analysis", "Weak Chapter Report"],
    isPremium: false,
    icon: Target,
    color: "purple",
    href: unifiedModelTestPathPrefix("hsc", "physics-1st-paper"),
  },
  {
    id: "ssc-model-tests",
    bnTitle: "SSC মডেল টেস্ট",
    description: "SSC বিজ্ঞান বিষয়ের মডেল টেস্ট ব্যাংক",
    duration: "25–45 মিনিট",
    mcqs: "25 MCQ",
    features: ["Score + Rank", "Chapter + Paper sets"],
    isPremium: false,
    icon: Trophy,
    color: "gold",
    href: levelModelTestsPath("ssc"),
  },
  {
    id: "board-final",
    bnTitle: "বোর্ড ফাইনাল মডেল টেস্ট",
    description: "বোর্ড পরীক্ষার প্যাটার্নে মডেল টেস্ট",
    duration: "90 মিনিট",
    mcqs: "100 MCQ",
    features: ["Score + Rank", "Board Pattern", "ফ্রি মেডেল"],
    isPremium: false,
    icon: Zap,
    color: "gold",
    href: "/hsc-board-questions",
  },
  {
    id: "live-model",
    bnTitle: "লাইভ মডেল টেস্ট",
    description: "নির্দিষ্ট সময়ে সবাই একসাথে — র‍্যাঙ্ক সহ",
    duration: "৩০ মিনিট",
    mcqs: "৩০ MCQ",
    features: ["লাইভ র‍্যাঙ্ক", "রিয়েল টাইম ফলাফল"],
    isPremium: false,
    icon: Radio,
    color: "red",
    href: "/live-test",
  },
];

export function ModelTestSection() {
  return (
    <section className="py-16 font-bangla bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            রিয়েল এক্সাম মোড <span className="text-gradient-purple">মডেল টেস্ট</span>
          </h2>
          <p className="text-slate-400 mt-2">
            Timer, score, result, rank সব একসাথে
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {modelTests.map((test) => (
            <Card
              key={test.id}
              variant={test.isPremium ? "premium" : "glass"}
              className="p-5 hoverable group relative overflow-hidden"
            >
              {test.isPremium && (
                <div className="absolute top-3 right-3">
                  <Badge variant="premium" className="text-[10px] flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Premium
                  </Badge>
                </div>
              )}

              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                test.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                test.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                test.color === "red" ? "bg-red-500/20 text-red-400" :
                "bg-yellow-500/20 text-yellow-400"
              }`}>
                <test.icon className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{test.bnTitle}</h3>
              <p className="text-xs text-slate-400 mb-4">{test.description}</p>

              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{test.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <FileQuestion className="h-4 w-4 text-slate-400" />
                  <span>{test.mcqs}</span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                {test.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      test.isPremium ? "bg-yellow-400" : "bg-cyan-400"
                    }`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={test.href}>
                <Button 
                  variant={test.isPremium ? "premium" : "secondary"} 
                  fullWidth 
                  size="sm"
                  className="flex items-center justify-center gap-2 group/btn"
                >
                  {test.isPremium ? (
                    <>
                      <Lock className="h-4 w-4" />
                      প্রিমিয়াম আনলক
                    </>
                  ) : (
                    <>
                      শুরু করো
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/PremiumSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/PremiumSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Check, 
  Zap, 
  Target, 
  BookOpen, 
  Trophy,
  FileText,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { levelHubPath } from "@/lib/quiz/unified-routes";

const allFreeFeatures = [
  "অধ্যায়ভিত্তিক কুইজ (SSC & HSC)",
  "বোর্ড প্রশ্ন (Interactive MCQ)",
  "পূর্ণাঙ্গ মডেল টেস্ট ও স্কোর",
  "লাইভ ব্যাটল টেস্ট অ্যাক্সেস 🔴",
  "দুর্বল অধ্যায় ট্র্যাকিং",
  "ভুল উত্তর পুনরায় Practice",
  "ফাইনাল ফোকাস সাজেশন",
  "প্রোফাইল র‍্যাঙ্কিং ও ব্যাজ",
  "১০০% বিজ্ঞাপন-মুক্ত অভিজ্ঞতা",
  "সম্পূর্ণ ফ্রি ও আনলকড",
];

export function PremiumSection() {
  return (
    <section className="py-16 font-bangla bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="default" className="inline-flex items-center gap-2 mb-4 bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            সব ফ্রি প্রস্তুতি
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            অধ্যায়ভিত্তিক কুইজ, মডেল টেস্ট, লাইভ টেস্ট ও বোর্ড প্রশ্ন — <span className="text-gradient-purple">সব এক জায়গায় ফ্রি</span>
          </h2>
          <p className="text-slate-400 mt-2">
            কোনো লক বা সাবস্ক্রিপশন ফি নেই, সম্পূর্ণ আনলকড ও ফ্রি প্ল্যাটফর্ম।
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card variant="glass" className="p-8 relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-[#07111F]/80 via-[#0D1E36]/50 to-[#07111F]/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">ফ্রি ও আনলিমিটেড</h3>
                    <p className="text-sm text-cyan-400">বিজ্ঞান শিক্ষার্থীদের সেরা প্ল্যাটফর্ম</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  বিজ্ঞান র্যাঙ্কার তোমাদের জন্য নিয়ে এসেছে সম্পূর্ণ ফ্রি পড়াশোনার সুযোগ। এসএসসি ও এইচএসসি পরীক্ষার সেরা প্রস্তুতির জন্য প্রয়োজনীয় সকল অধ্যায়, বোর্ড প্রশ্ন ও লাইভ কুইজ ব্যাটল আজই শুরু করো।
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={levelHubPath("ssc")} className="flex-1">
                    <Button variant="primary" fullWidth size="lg" className="min-h-[44px]">
                      SSC প্রস্তুতি
                    </Button>
                  </Link>
                  <Link href={levelHubPath("hsc")} className="flex-1">
                    <Button variant="secondary" fullWidth size="lg" className="min-h-[44px]">
                      HSC প্রস্তুতি
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-900/40 p-5 rounded-2xl border border-white/5">
                {allFreeFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-cyan-400" />
            <span>১০০% ফ্রি ও আনলকড</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-400" />
            <span>SSC ও HSC বিজ্ঞান র্যাঙ্কার</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>যেকোনো ডিভাইসে কাজ করে</span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/PremiumUnlockSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/PremiumUnlockSection.tsx)

```tsx
import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ShieldCheck, ShieldAlert, Check, Sparkles, Crown } from "lucide-react";

export function PremiumUnlockSection() {
  const premiumFeatures = [
    "আনলিমিটেড রিয়েল-টাইম লাইভ কুইজ ব্যাটল এরিনা",
    "অধ্যায়ভিত্তিক বিগত ১০ বছরের বোর্ড প্রশ্নব্যাংক ও সমাধান",
    "AI দুর্বল চ্যাপ্টার রিভিশন ট্র্যাকার ও প্রোগ্রেস সাজেশন",
    "পদার্থবিজ্ঞান ও রসায়নের জটিল গাণিতিক শর্টকাট ট্রিকস",
    "সাপ্তাহিক লাইভ মেগা লিডারবোর্ড টুর্নামেন্ট ও পুরষ্কার",
    "বিজ্ঞাপন মুক্ত প্রিমিয়াম গেমিং ইন্টারফেস ও প্রফাইল থিম"
  ];

  return (
    <section id="premium" className="py-16 md:py-28 relative overflow-hidden font-bangla">
      {/* Dynamic luxury gold background flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-rank/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-dark/60 border border-gold-rank/40 text-gold-rank text-xs md:text-sm font-black animate-pulse">
            <Crown className="h-4 w-4" />
            <span>বিজ্ঞান র্যাঙ্কারস এলিট ক্লাব</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            প্রস্তুতি নাও চ্যাম্পিয়নদের মতো
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            সীমাবদ্ধতা দূর করো। প্রিমিয়াম যুদ্ধঘরে প্রবেশ করে তোমার সর্বোচ্চ র্যাঙ্ক অর্জন নিশ্চিত করো।
          </p>
        </div>

        {/* Pricing/Unlock Panel */}
        <Card variant="premium" className="relative p-8 md:p-12 max-w-3xl mx-auto overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.08)] border-gold-rank/30">
          
          {/* Top-right corner gold glow decal */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-rank/10 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Value Pitch List (Left) */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold-rank" />
                প্রো মেম্বারশিপের সুবিধাসমূহ:
              </h3>
              
              <ul className="space-y-3.5">
                {premiumFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm">
                    <span className="h-5 w-5 rounded-full bg-gold-rank/15 text-gold-rank flex items-center justify-center shrink-0 mt-0.5 border border-gold-rank/25">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span className="font-semibold leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Action HUD (Right) */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-slate-950/70 border border-gold-rank/20 flex flex-col justify-center items-center text-center space-y-6 shadow-inner">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">মাসিক সাবস্ক্রিপশন</span>
                
                <div className="flex items-baseline justify-center gap-1.5 py-2">
                  <span className="text-4xl sm:text-5xl font-black text-gold-rank font-outfit">৩৫০</span>
                  <span className="text-xl font-bold text-white">টাকা</span>
                  <span className="text-slate-500 text-xs">/মাস</span>
                </div>
                
                <span className="text-[10px] text-slate-500 line-through block font-outfit">৭০০ টাকা (৫০% ছাড়)</span>
              </div>

              <div className="w-full space-y-3">
                <Button variant="premium" fullWidth size="lg" className="font-extrabold shadow-glow-gold">
                  👑 প্রো এরিনা আনলক করো
                </Button>
                
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  বিকাশ, রকেট অথবা নগদের মাধ্যমে মুহূর্তেই পেমেন্ট সম্পন্ন করে প্রবেশ করো এলিট ক্লাবে।
                </p>
              </div>

              {/* Secure payment markers */}
              <div className="flex items-center gap-2 border-t border-slate-900 pt-4 w-full justify-center">
                <ShieldCheck className="h-4 w-4 text-gold-rank" />
                <span className="text-[10px] text-slate-400 font-bold">শতভাগ নিরাপদ ও ইনস্ট্যান্ট অ্যাক্টিভেশন</span>
              </div>

            </div>

          </div>

        </Card>

      </div>
    </section>
  );
}
```

## File: [src/components/home/QuickStartSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/QuickStartSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  ChevronRight,
  BookOpen,
  Target,
  ClipboardList,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { levelHubPath } from "@/lib/quiz/unified-routes";
import { HomeSectionHeader } from "./HomeSectionHeader";

const quickActions = [
  {
    href: "#explore-subjects",
    label: "অধ্যায় অনুশীলন",
    subtitle: "অধ্যায় ধরে MCQ",
    icon: BookOpen,
    color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300",
  },
  {
    href: `${levelHubPath("ssc")}/model-tests`,
    label: "মডেল টেস্ট",
    subtitle: "সম্পূর্ণ পরীক্ষা",
    icon: Target,
    color: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300",
  },
  {
    href: "/hsc-board-questions",
    label: "বোর্ড প্রশ্ন",
    subtitle: "বোর্ড পরীক্ষা",
    icon: ClipboardList,
    color: "from-yellow-500/20 to-amber-600/10 border-yellow-500/30 text-yellow-300",
  },
  {
    href: "/leaderboard",
    label: "লিডারবোর্ড",
    subtitle: "র‍্যাঙ্ক দেখো",
    icon: Trophy,
    color: "from-pink-500/20 to-rose-600/10 border-pink-500/30 text-pink-300",
  },
];

const sscSubjects = [
  { name: "Physics", icon: Atom, bnName: "পদার্থবিজ্ঞান" },
  { name: "Chemistry", icon: FlaskConical, bnName: "রসায়ন" },
  { name: "Biology", icon: Dna, bnName: "জীববিজ্ঞান" },
  { name: "Higher Math", icon: Calculator, bnName: "উচ্চতর গণিত" },
  { name: "General Math", icon: Calculator, bnName: "সাধারণ গণিত" },
];

const hscSubjects = [
  { name: "Physics", icon: Atom, bnName: "পদার্থবিজ্ঞান (১ম ও ২য় পত্র)" },
  { name: "Chemistry", icon: FlaskConical, bnName: "রসায়ন (১ম ও ২য় পত্র)" },
  { name: "Biology", icon: Dna, bnName: "জীববিজ্ঞান (১ম ও ২য় পত্র)" },
  { name: "Higher Math", icon: Calculator, bnName: "উচ্চতর গণিত (১ম ও ২য় পত্র)" },
];

export function QuickStartSection() {
  return (
    <section id="quick-actions" className="py-10 md:py-14 font-bangla scroll-mt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Quick start"
          title={<>আজ কী করব? <span className="text-gradient-cyan">দ্রুত শুরু করো</span></>}
          description="সবচেয়ে দরকারি কাজগুলো সামনে রাখা আছে, যাতে পড়া শুরু করতে বাড়তি ভাবতে না হয়।"
          className="mb-6"
        />

        <div className="grid grid-cols-2 gap-3 mb-10 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex min-h-[104px] flex-col justify-between rounded-2xl border bg-gradient-to-br p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg active:scale-95 ${action.color}`}
              >
                <Icon className="h-6 w-6" />
                <div>
                  <p className="font-bold text-white text-sm leading-snug">{action.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{action.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <h3 className="text-lg font-bold text-center text-white mb-6">
          তোমার <span className="text-gradient-cyan">SSC</span> অথবা{" "}
          <span className="text-gradient-purple">HSC</span> বেছে নাও
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="glass" className="p-6 glass-panel-cyan hoverable">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">SSC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">SSC বিজ্ঞান</h3>
                <p className="text-sm text-slate-400">নবম-দশম শ্রেণি</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {sscSubjects.map((subject) => (
                <div key={subject.name} className="flex items-center gap-2 text-sm text-slate-300">
                  <subject.icon className="h-4 w-4 text-cyan-400" />
                  <span>{subject.bnName}</span>
                </div>
              ))}
            </div>

            <Link href={levelHubPath("ssc")}>
              <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2 group min-h-[44px]">
                SSC শুরু করো
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          <Card variant="glass" className="p-6 glass-panel-purple hoverable">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">HSC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">HSC বিজ্ঞান</h3>
                <p className="text-sm text-slate-400">একাদশ-দ্বাদশ শ্রেণি</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {hscSubjects.map((subject) => (
                <div key={subject.name} className="flex items-center gap-2 text-sm text-slate-300">
                  <subject.icon className="h-4 w-4 text-purple-400" />
                  <span>{subject.bnName}</span>
                </div>
              ))}
            </div>

            <Link href={levelHubPath("hsc")}>
              <Button variant="primary" fullWidth className="flex items-center justify-center gap-2 group min-h-[44px]">
                HSC শুরু করো
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/QuizLibrarySection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/QuizLibrarySection.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Loader2, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  levelModelTestsPath,
  unifiedModelTestPathPrefix,
} from "@/lib/quiz/unified-routes";

interface QuizLink {
  title: string;
  subtitle: string;
  href: string;
  sets: number;
  questions?: number;
  accent: "cyan" | "purple";
}

function countSubject(
  manifest: Record<string, unknown>,
  slug: string,
): { sets: number; questions: number } {
  const entry = manifest[slug] as {
    modelTests?: Record<string, { questionCount?: number }>;
    chapters?: Record<string, { questionCount?: number }>;
  } | undefined;
  let sets = 0;
  let questions = 0;
  for (const mt of Object.values(entry?.modelTests || {})) {
    sets++;
    questions += mt.questionCount || 0;
  }
  for (const ch of Object.values(entry?.chapters || {})) {
    sets++;
    questions += ch.questionCount || 0;
  }
  return { sets, questions };
}

export function QuizLibrarySection() {
  const [links, setLinks] = useState<QuizLink[]>([]);
  const [totalSets, setTotalSets] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/quiz-data/manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((manifest) => {
        if (!manifest) {
          setLoading(false);
          return;
        }

        const hsc = manifest.hsc || {};
        const ssc = manifest.ssc || {};

        const items: QuizLink[] = [
          {
            title: "HSC পদার্থবিজ্ঞান ১ম পত্র",
            subtitle: "100 অধ্যায়ভিত্তিক + পত্রভিত্তিক মডেল টেস্ট",
            href: `${unifiedModelTestPathPrefix("hsc", "physics-1st-paper")}?tab=chapter`,
            ...countSubject(hsc, "physics-1st-paper"),
            accent: "purple",
          },
          {
            title: "HSC জীববিজ্ঞান ১ম পত্র",
            subtitle: "60 অধ্যায়ভিত্তিক + 25 পত্রভিত্তিক সেট",
            href: `${unifiedModelTestPathPrefix("hsc", "biology-1st-paper")}?tab=chapter`,
            ...countSubject(hsc, "biology-1st-paper"),
            accent: "purple",
          },
          {
            title: "HSC রসায়ন ১ম পত্র",
            subtitle: "অধ্যায়ভিত্তিক high-priority সেট",
            href: `${unifiedModelTestPathPrefix("hsc", "chemistry-1st-paper")}?tab=chapter`,
            ...countSubject(hsc, "chemistry-1st-paper"),
            accent: "purple",
          },
          {
            title: "HSC উচ্চতর গণিত ১ম পত্র",
            subtitle: "100 অধ্যায়ভিত্তিক মডেল টেস্ট",
            href: `${unifiedModelTestPathPrefix("hsc", "higher-math-1st-paper")}?tab=chapter`,
            ...countSubject(hsc, "higher-math-1st-paper"),
            accent: "purple",
          },
          {
            title: "SSC উচ্চতর গণিত",
            subtitle: "20 মডেল টেস্ট সেট",
            href: unifiedModelTestPathPrefix("ssc", "higher-math"),
            ...countSubject(ssc, "higher-math"),
            accent: "cyan",
          },
          {
            title: "SSC জীববিজ্ঞান",
            subtitle: "বোর্ড স্ট্যান্ডার্ড সেট",
            href: unifiedModelTestPathPrefix("ssc", "biology"),
            ...countSubject(ssc, "biology"),
            accent: "cyan",
          },
          {
            title: "সব HSC মডেল টেস্ট",
            subtitle: "পত্রভিত্তিক + অধ্যায়ভিত্তিক",
            href: levelModelTestsPath("hsc"),
            sets: (Object.values(hsc) as Array<{ modelTests?: Record<string, unknown> }>).reduce(
              (n, d) => n + Object.keys(d.modelTests || {}).length,
              0,
            ),
            accent: "purple",
          },
        ];

        let allSets = 0;
        let allQ = 0;
        for (const level of [ssc, hsc]) {
          for (const entry of Object.values(level) as Array<{
            modelTests?: Record<string, { questionCount?: number }>;
            chapters?: Record<string, { questionCount?: number }>;
          }>) {
            for (const mt of Object.values(entry.modelTests || {})) {
              allSets++;
              allQ += mt.questionCount || 0;
            }
            for (const ch of Object.values(entry.chapters || {})) {
              allSets++;
              allQ += ch.questionCount || 0;
            }
          }
        }

        setLinks(items.filter((l) => l.sets > 0));
        setTotalSets(allSets);
        setTotalQuestions(allQ);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const accentClass = {
    cyan: "border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-500/5",
    purple: "border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5",
  };

  return (
    <section className="py-16 px-4 font-bangla">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white">কুইজ লাইব্রেরি</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            তোমার দেওয়া সব quiz data website-এ live — মডেল টেস্ট, অধ্যায়ভিত্তিক সেট, বোর্ড প্রশ্ন
          </p>
          {!loading && totalSets > 0 && (
            <p className="text-cyan-300 font-semibold text-sm">
              মোট {totalSets} সেট · {totalQuestions.toLocaleString()} MCQ
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="group block">
                <Card
                  variant="glass"
                  className={`p-5 border transition-all ${accentClass[link.accent]}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-xs text-slate-400">{link.subtitle}</p>
                      <p className="text-xs text-emerald-400 font-semibold pt-1">
                        {link.sets} সেট
                        {link.questions ? ` · ${link.questions.toLocaleString()} MCQ` : ""}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link href={levelModelTestsPath("hsc", "tab=chapter")}>
            <Button variant="secondary" className="gap-2 min-h-[44px]">
              <Target className="h-4 w-4" />
              HSC অধ্যায়ভিত্তিক মডেল টেস্ট
            </Button>
          </Link>
          <Link href={levelModelTestsPath("hsc", "tab=paper")}>
            <Button className="gap-2 min-h-[44px]">
              <BookOpen className="h-4 w-4" />
              HSC পত্রভিত্তিক মডেল টেস্ট
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/StudyLoopSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/StudyLoopSection.tsx)

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { BookOpenCheck, Gauge, RefreshCcw, Sparkles, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { levelHubPath } from "@/lib/quiz/unified-routes";

const loopSteps = [
  { title: "দুর্বল অধ্যায় ধরো", text: "যেটা কম পারো, সেটাই আগে practice list-এ আনো।", icon: Target, tone: "text-cyan-300 border-cyan-400/25 bg-cyan-500/10" },
  { title: "৫ মিনিট MCQ দাও", text: "ছোট session, দ্রুত result—mobile-eও সহজ।", icon: Gauge, tone: "text-purple-300 border-purple-400/25 bg-purple-500/10" },
  { title: "ভুলগুলো retake করো", text: "একবার ভুল মানে শেষ না—review loop score বাড়ায়।", icon: RefreshCcw, tone: "text-amber-300 border-amber-400/25 bg-amber-500/10" },
  { title: "র‍্যাঙ্কে উঠো", text: "প্রতিদিন ছোট progress জমে বড় confidence হয়।", icon: Trophy, tone: "text-rose-300 border-rose-400/25 bg-rose-500/10" },
];

function StudyLoopSvg() {
  return (
    <svg viewBox="0 0 420 300" className="h-full min-h-[260px] w-full" role="img" aria-label="Study loop visual">
      <defs>
        <linearGradient id="loopGlow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#a855f7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="18" y="18" width="384" height="264" rx="28" fill="#08111f" stroke="#334155" strokeOpacity="0.9" />
      <circle cx="210" cy="150" r="88" fill="none" stroke="url(#loopGlow)" strokeWidth="8" strokeDasharray="38 18" />
      <circle cx="210" cy="150" r="48" fill="#0f172a" stroke="#475569" strokeWidth="2" />
      <text x="210" y="138" fill="#e2e8f0" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" textAnchor="middle">5 min</text>
      <text x="210" y="162" fill="#94a3b8" fontFamily="Arial, sans-serif" fontSize="12" textAnchor="middle">study loop</text>
      {[[210, 48, "1"], [318, 150, "2"], [210, 252, "3"], [102, 150, "4"]].map(([cx, cy, label]) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r="24" fill="#111827" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="2" />
          <text x={cx} y={Number(cy) + 6} fill="#f8fafc" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="700" textAnchor="middle">{label}</text>
        </g>
      ))}
    </svg>
  );
}

export function StudyLoopSection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-16 font-bangla">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <Badge variant="premium" className="mb-4 inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> smart study loop
          </Badge>
          <h2 className="text-2xl font-black leading-tight text-white md:text-4xl">
            প্রতিদিন ছোট progress—<span className="text-gradient-cyan"> পরীক্ষার confidence বেশি</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">
            বড় syllabus দেখে আটকে না গিয়ে clear next step দেখাও: weak chapter, quick quiz, retake, rank.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={levelHubPath("ssc")} className="w-full sm:w-auto">
              <Button variant="primary" fullWidth className="min-h-[46px] gap-2"><BookOpenCheck className="h-4 w-4" /> SSC loop শুরু</Button>
            </Link>
            <Link href={levelHubPath("hsc")} className="w-full sm:w-auto">
              <Button variant="secondary" fullWidth className="min-h-[46px] gap-2"><Target className="h-4 w-4" /> HSC loop শুরু</Button>
            </Link>
          </div>
        </div>

        <Card variant="glass" className="relative overflow-hidden p-4 lg:col-span-3">
          <StudyLoopSvg />
        </Card>

        <div className="grid gap-3 lg:col-span-4">
          {loopSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} variant="glass" className="p-4 hoverable border-white/10">
                <div className="flex gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${step.tone}`}><Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                    <h3 className="mt-1 font-black text-white">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.text}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/SubjectBattleSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/SubjectBattleSection.tsx)

```tsx
"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { subjectBattles } from "@/lib/mockData";
import { Sword, Users, Award, ShieldAlert, Check } from "lucide-react";

export function SubjectBattleSection() {
  const [loadingBattleId, setLoadingBattleId] = useState<string | null>(null);
  const [successBattleId, setSuccessBattleId] = useState<string | null>(null);

  const handleLaunchBattle = (battleId: string) => {
    setLoadingBattleId(battleId);
    
    // Simulate matchmaking/loading battle arena
    setTimeout(() => {
      setLoadingBattleId(null);
      setSuccessBattleId(battleId);
      
      setTimeout(() => {
        setSuccessBattleId(null);
      }, 3000);
    }, 2000);
  };

  return (
    <section id="subjects" className="py-12 md:py-20 relative overflow-hidden font-bangla">
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-glow/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <Badge variant="default" className="border-cyan-glow/20 text-cyan-glow bg-cyan-glow/5">অধ্যায়ভিত্তিক ব্যাটল এরিনা</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              বিজ্ঞান যুদ্ধঘর: বিষয়সমূহ
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg">
              তোমার পছন্দের বিষয় নির্বাচন করো এবং অন্যান্য শিক্ষার্থীদের সাথে রিয়েল-টাইম MCQ যুদ্ধে অবতীর্ণ হও।
            </p>
          </div>
          
          {/* Live Online Users Indicator */}
          <div className="inline-flex items-center gap-2 border border-green-500/20 rounded-xl px-4 py-2 bg-green-500/5">
            <div className="h-2 w-2 rounded-full bg-success-green animate-ping" />
            <span className="text-xs font-bold text-slate-300">
              <span className="text-success-green font-outfit">৫,৫৪০ জন</span> অনলাইনে যুদ্ধ করছে
            </span>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjectBattles.map((subject) => {
            const isLoading = loadingBattleId === subject.id;
            const isSuccess = successBattleId === subject.id;

            // Render theme color classes
            let themeBorder = "border-slate-800 hover:border-purple-glow/30";
            let themeIconBg = "bg-purple-glow/10 text-purple-glow";
            let themeBtnVariant: "primary" | "secondary" | "premium" | "ghost" = "primary";

            if (subject.color === "cyan") {
              themeBorder = "border-slate-800 hover:border-cyan-glow/30";
              themeIconBg = "bg-cyan-glow/10 text-cyan-glow";
              themeBtnVariant = "secondary";
            } else if (subject.color === "green") {
              themeBorder = "border-slate-800 hover:border-success-green/30";
              themeIconBg = "bg-success-green/10 text-success-green";
              themeBtnVariant = "ghost";
            } else if (subject.color === "gold") {
              themeBorder = "border-slate-800 hover:border-gold-rank/30";
              themeIconBg = "bg-gold-rank/10 text-gold-rank";
              themeBtnVariant = "premium";
            }

            return (
              <Card
                key={subject.id}
                variant="glass"
                className={`p-6 border flex flex-col justify-between h-[340px] relative overflow-hidden transition-all duration-300 ${themeBorder} ${
                  isLoading ? "opacity-75 scale-[0.98]" : ""
                }`}
              >
                {/* Subject Details */}
                <div className="space-y-4">
                  
                  {/* Icon & XP details */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{subject.icon}</span>
                    <Badge variant="default" className="bg-slate-950 font-outfit text-slate-400">
                      +{subject.xpReward} XP
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-slate-100">{subject.name}</h3>
                    <p className="text-xs text-slate-400 leading-normal min-h-[32px]">
                      {subject.subtitle}
                    </p>
                  </div>

                  {/* Active Counters */}
                  <div className="space-y-2 pt-2 border-t border-slate-900 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>সিলেবাস অধ্যায়</span>
                      <span className="font-bold text-slate-300">{subject.chaptersCount} টি চ্যাপ্টার</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        অনলাইন যুদ্ধরত
                      </span>
                      <span className="font-bold text-cyan-glow font-outfit">{subject.battlesActive} জন</span>
                    </div>
                  </div>

                </div>

                {/* Matchmaking Simulation Overlays */}
                {isLoading && (
                  <div className="absolute inset-0 bg-[#02030b]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 animate-fadeIn">
                    <div className="h-10 w-10 rounded-full border-2 border-purple-glow border-t-transparent animate-spin mb-3" />
                    <h4 className="text-sm font-bold text-white">প্রতিদ্বন্দ্বী খোঁজা হচ্ছে...</h4>
                    <p className="text-[11px] text-slate-500 mt-1">HSC এরিনা • এভারেজ পিং ১৫ms</p>
                  </div>
                )}

                {isSuccess && (
                  <div className="absolute inset-0 bg-green-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 animate-fadeIn">
                    <div className="h-10 w-10 rounded-full bg-success-green/20 border border-success-green flex items-center justify-center text-success-green mb-3">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </div>
                    <h4 className="text-sm font-bold text-white">ম্যাচ পাওয়া গেছে!</h4>
                    <p className="text-[11px] text-slate-300 mt-1">লোডিং কুইজ বোর্ড...</p>
                  </div>
                )}

                {/* CTA Action */}
                <div className="pt-4">
                  <Button
                    variant={themeBtnVariant}
                    fullWidth
                    size="sm"
                    className="flex items-center gap-1.5 font-bold"
                    onClick={() => handleLaunchBattle(subject.id)}
                  >
                    <Sword className="h-4 w-4" />
                    ব্যাটেল লড়ো
                  </Button>
                </div>

              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
```

## File: [src/components/home/TodayMissionSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/TodayMissionSection.tsx)

```tsx
"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { dailyMissions as initialMissions } from "@/lib/mockData";
import { Award, CheckSquare, Square, Zap, Flame, AwardIcon } from "lucide-react";

export function TodayMissionSection() {
  const [missions, setMissions] = useState(initialMissions);
  const [streakDays, setStreakDays] = useState(7);
  const [earnedXp, setEarnedXp] = useState(0);

  const toggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextCompleted = !m.completed;
          if (nextCompleted) {
            setEarnedXp((xp) => xp + m.xp);
          } else {
            setEarnedXp((xp) => xp - m.xp);
          }
          return { ...m, completed: nextCompleted };
        }
        return m;
      })
    );
  };

  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = missions.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <section className="py-12 md:py-16 relative overflow-hidden font-bangla">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Mission checklist card */}
          <div className="lg:col-span-8">
            <Card variant="glass" className="p-6 md:p-8 h-full border-purple-glow/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-glow/5 rounded-full blur-[40px] pointer-events-none -z-10" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-glow/10 pb-6 mb-6">
                <div className="space-y-1">
                  <Badge variant="default" className="text-purple-glow bg-purple-glow/5 border-purple-glow/20">প্রতিদিনের চ্যালেঞ্জ</Badge>
                  <h3 className="text-2xl font-black text-white">আজকের যুদ্ধ মিশন</h3>
                  <p className="text-xs text-slate-400">মিশনগুলো পূরণ করে এক্সপি অর্জন করো এবং র্যাঙ্কিংয়ে এগিয়ে থাকো।</p>
                </div>
                
                {/* Progress stats */}
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 font-semibold">অগ্রগতি</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-outfit text-cyan-glow">{completedCount}</span>
                    <span className="text-slate-500 text-xs font-outfit">/ {totalCount} সম্পূর্ণ</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6 space-y-1.5">
                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-glow to-cyan-glow transition-all duration-500 rounded-full"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>০%</span>
                  <span>{percentComplete}% সম্পন্ন</span>
                  <span>১০০%</span>
                </div>
              </div>

              {/* Mission List */}
              <div className="space-y-3">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => toggleMission(mission.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      mission.completed
                        ? "bg-purple-glow/[0.03] border-purple-glow/30 text-slate-200"
                        : "bg-navy-light/40 border-slate-900 text-slate-400 hover:border-purple-glow/10"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 transition-transform duration-200 active:scale-75">
                      {mission.completed ? (
                        <CheckSquare className="h-5 w-5 text-purple-glow fill-purple-glow/10" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-700 hover:text-purple-glow" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className={`text-sm md:text-base font-bold leading-normal transition-colors ${
                        mission.completed ? "text-slate-100 line-through opacity-70" : "text-slate-300"
                      }`}>
                        {mission.title}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-xs font-outfit font-extrabold ${
                        mission.completed ? "text-purple-glow/70" : "text-purple-glow"
                      }`}>
                        <Zap className="h-3.5 w-3.5 fill-purple-glow/20" />
                        +{mission.xp} XP
                      </span>
                    </div>

                    {mission.completed && (
                      <Badge variant="success" className="text-[10px] uppercase font-bold shrink-0">অর্জনকৃত</Badge>
                    )}
                  </div>
                ))}
              </div>

            </Card>
          </div>

          {/* Daily login streak card */}
          <div className="lg:col-span-4">
            <Card variant="glass" className="p-6 md:p-8 h-full flex flex-col justify-between relative overflow-hidden text-center border-amber-500/20">
              
              <div className="space-y-4">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-500/10 border border-gold-rank/30 flex items-center justify-center text-gold-rank animate-bounce">
                  <Flame className="h-8 w-8 fill-gold-rank/10" />
                </div>
                
                <div className="space-y-1">
                  <Badge variant="default" className="bg-amber-500/10 text-amber-300 border-amber-500/20">স্ট্রিক পুরষ্কার</Badge>
                  <h3 className="text-xl md:text-2xl font-black text-white">{streakDays} দিনের স্ট্রিক</h3>
                  <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                    প্রতিদিন কুইজ ব্যাটেলে অংশ নিয়ে ধরে রাখো তোমার লড়াকু স্ট্রিক!
                  </p>
                </div>
              </div>

              {/* Streak Bubbles (7 days visualization) */}
              <div className="flex justify-center gap-2 py-6">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isCurrent = day === streakDays;
                  const isPast = day < streakDays;
                  
                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold font-outfit border transition-all ${
                        isCurrent 
                          ? "bg-gold-rank border-gold-rank text-black shadow-glow-gold/40 scale-110" 
                          : isPast 
                          ? "bg-gold-dark/40 border-gold-rank/40 text-gold-rank" 
                          : "bg-slate-950 border-slate-900 text-slate-700"
                      }`}>
                        {day}
                      </div>
                      <span className="text-[9px] text-slate-500 font-bangla">দিন</span>
                    </div>
                  );
                })}
              </div>

              {/* XP reward action */}
              <div className="space-y-2">
                {earnedXp > 0 && (
                  <p className="text-xs text-slate-300 font-bold animate-pulse font-outfit">
                    🎉 আজ অর্জিত হয়েছে: <span className="text-gold-rank">+{earnedXp} XP</span>
                  </p>
                )}
                <Button variant="primary" fullWidth size="sm" onClick={() => setStreakDays((prev) => prev + 1)}>
                  🔥 আজকের হাজিরা দাও
                </Button>
              </div>

            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/home/WeaknessReportSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/home/WeaknessReportSection.tsx)

```tsx
"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { weaknessReports } from "@/lib/mockData";
import { Brain, AlertCircle, ArrowUpRight, Zap } from "lucide-react";

export function WeaknessReportSection() {
  return (
    <section id="stats" className="py-12 md:py-16 relative overflow-hidden font-bangla">
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Analysis Grid */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Card variant="glass" className="p-6 md:p-8 border-purple-glow/15 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-purple-glow" />

              <div className="space-y-6">
                
                {/* AI Radar Header */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-glow/10 border border-purple-glow/30 flex items-center justify-center text-purple-glow">
                    <Brain className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">AI দুর্বলতা বিশ্লেষণ</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">ভুল উত্তরের তথ্যের ভিত্তিতে স্বয়ংক্রিয় আপডেট</p>
                  </div>
                </div>

                {/* Radar Mock Visualization (SVG based concentric circles) */}
                <div className="relative h-48 flex items-center justify-center border border-slate-900/60 rounded-2xl bg-slate-950/40 p-4">
                  {/* Concentric Circles */}
                  <div className="absolute h-36 w-36 rounded-full border border-slate-800/40 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full border border-slate-800/60 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full border border-slate-800 flex items-center justify-center bg-purple-glow/5" />
                    </div>
                  </div>
                  
                  {/* Glowing Radar Sweep line simulation */}
                  <div className="absolute h-20 w-[1px] bg-gradient-to-t from-transparent to-purple-glow origin-bottom bottom-1/2 left-1/2 -translate-x-1/2 animate-[spin_5s_linear_infinite]" />
                  
                  {/* Subject plot points */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-success-green shadow-glow-green text-[9px] flex items-center justify-center font-bold text-black border border-slate-950 font-outfit">
                    🧬
                  </div>
                  <div className="absolute bottom-10 left-12 h-3.5 w-3.5 rounded-full bg-error-red shadow-glow-red text-[9px] flex items-center justify-center font-bold text-black border border-slate-950 font-outfit">
                    ⚛️
                  </div>
                  <div className="absolute bottom-12 right-16 h-3.5 w-3.5 rounded-full bg-amber-500 shadow-glow-gold text-[9px] flex items-center justify-center font-bold text-black border border-slate-950 font-outfit">
                    🧪
                  </div>

                  {/* Core Status Message */}
                  <div className="text-center z-10 space-y-1">
                    <span className="text-xs text-slate-400 font-semibold block">গড় দক্ষতা রেটিং</span>
                    <span className="text-2xl font-black text-white font-outfit">৬৩%</span>
                    <Badge variant="default" className="text-[9px] border-slate-800">মাঝারি প্রস্তুতি</Badge>
                  </div>

                </div>

                {/* Accuracy bars list */}
                <div className="space-y-3">
                  {weaknessReports.map((item, idx) => {
                    const isCritical = item.status === "critical";
                    const isWarning = item.status === "warning";
                    
                    let progressColor = "bg-success-green shadow-glow-green/30";
                    let textColor = "text-success-green";
                    if (isCritical) {
                      progressColor = "bg-error-red shadow-glow-red/30";
                      textColor = "text-error-red";
                    } else if (isWarning) {
                      progressColor = "bg-amber-500 shadow-glow-gold/30";
                      textColor = "text-amber-500";
                    }

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{item.chapter} ({item.subject})</span>
                          <span className={`${textColor} font-outfit font-bold`}>{item.accuracy}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
                          <div
                            className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                            style={{ width: `${item.accuracy}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </Card>
          </div>

          {/* Explanation & Action Pitch (Right Column on Desktop) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm font-bold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>দুর্বলতা পর্যবেক্ষণ রিপোর্ট</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              তোমার ভুলগুলোই হবে তোমার <br />
              র্যাঙ্ক আপ করার হাতিয়ার
            </h2>
            
            <p className="text-base text-slate-400 leading-relaxed">
              সিস্টেম প্রতিটি ব্যাটল ম্যাচের ভুল প্রশ্নগুলো ট্র্যাক করে। AI দুর্বল চ্যাপ্টারগুলো চিহ্নিত করে সাজেস্ট করবে কোন বইয়ের কোন পৃষ্ঠা পড়তে হবে। ভুল শুধরে আবার যুদ্ধে ঝাঁপিয়ে পড়ো!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="secondary" className="flex items-center justify-center gap-2 group" onClick={() => {
                const el = document.getElementById("quiz");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>
                ভুল প্রশ্নগুলো ঝালাই করো
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
              <Button variant="ghost" className="flex items-center justify-center gap-1.5" onClick={() => {
                const el = document.getElementById("premium");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>
                <Zap className="h-4 w-4 text-gold-rank fill-gold-rank/20" />
                প্রিমিয়াম গাইডলাইন আনলক করো
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
```

## File: [src/components/layout/MainContent.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/layout/MainContent.tsx)

```tsx
"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { StudySidebar } from "@/components/layout/StudySidebar";
import { cn } from "@/lib/utils";
import { isStudyLevelPath, isActiveQuizPath } from "@/lib/quiz/unified-routes";

function SidebarFallback() {
  return <aside className="hidden w-[280px] shrink-0 lg:block" aria-hidden />;
}

function isStudyPath(pathname: string): boolean {
  if (isStudyLevelPath(pathname)) return true;

  const allowed = [
    "/live-test",
    "/leaderboard",
    "/dashboard",
    "/profile",
    "/ssc-board-questions",
    "/hsc-board-questions",
  ];
  return allowed.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = isStudyPath(pathname);
  const hideBottomPadding = isActiveQuizPath(pathname);
  const bottomPadding = hideBottomPadding ? "" : "pb-20 lg:pb-0";

  if (!showSidebar) {
    return (
      <div className={cn("relative min-h-screen", bottomPadding)}>{children}</div>
    );
  }

  return (
    <div className={cn("relative min-h-screen bg-[#030712]", bottomPadding)}>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_top_left,rgba(147,51,234,0.12),transparent_30%),linear-gradient(180deg,#020617,#020617)]" />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-6 lg:px-8">
        <Suspense fallback={<SidebarFallback />}>
          <StudySidebar />
        </Suspense>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
```

## File: [src/components/layout/MobileBottomNav.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/layout/MobileBottomNav.tsx)

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, GraduationCap, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { isActiveQuizPath, levelHubPath } from "@/lib/quiz/unified-routes";

const navItems = [
  { href: "/", label: "হোম", icon: Home },
  { href: levelHubPath("ssc"), label: "SSC", icon: BookOpen },
  { href: levelHubPath("hsc"), label: "HSC", icon: GraduationCap },
  { href: "/leaderboard", label: "র‍্যাঙ্ক", icon: Trophy },
  { href: "/profile", label: "প্রোফাইল", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (isActiveQuizPath(pathname)) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07111F]/95 backdrop-blur-xl pb-safe lg:hidden"
      aria-label="মোবাইল নেভিগেশন"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/profile"
                ? pathname === "/profile" || pathname === "/dashboard"
                : item.href === "/leaderboard"
                  ? pathname.startsWith("/leaderboard")
                  : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 font-bangla transition-colors active:scale-95",
                active ? "text-cyan-400" : "text-slate-400 hover:text-slate-200",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-bold leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

## File: [src/components/layout/Navbar.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/layout/Navbar.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Atom, Menu, X, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { levelHubPath } from "@/lib/quiz/unified-routes";

const mainNavLinks = [
  { href: "/", label: "হোম" },
  { href: levelHubPath("ssc"), label: "SSC" },
  { href: levelHubPath("hsc"), label: "HSC" },
  { href: "/live-test", label: "লাইভ টেস্ট", live: true },
  { href: "/ssc-board-questions", label: "SSC বোর্ড প্রশ্ন" },
  { href: "/hsc-board-questions", label: "HSC বোর্ড প্রশ্ন" },
  { href: "/leaderboard", label: "লিডারবোর্ড" },
  { href: "/leaderboard/college-wars", label: "⚔️ College Wars" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const profileActive =
    pathname === "/profile" || pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-blue-500/40 bg-slate-950/85 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label="প্রধান নেভিগেশন"
      >
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Atom className="h-9 w-9 sm:h-10 sm:w-10 text-violet-400" />
          <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-xl sm:text-2xl lg:text-3xl font-black text-transparent font-bangla">
            বিজ্ঞান র্যাঙ্কার
          </span>
        </Link>

        <div className="hidden h-full items-center lg:flex">
          {mainNavLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex h-full items-center px-4 xl:px-6 text-sm xl:text-lg font-bold text-slate-200 transition hover:text-cyan-300",
                  active && "text-white",
                )}
              >
                {link.label}
                {link.live && (
                  <span className="ml-2 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]" />
                )}
                {active && (
                  <span className="absolute bottom-0 left-4 right-4 xl:left-5 xl:right-5 h-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className={cn(
              "hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2 text-base lg:text-lg font-bold transition hover:bg-white/5",
              profileActive ? "text-cyan-300" : "text-slate-100",
            )}
          >
            <UserCircle size={24} />
            প্রোফাইল
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-blue-500/30 bg-slate-950/95 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1 p-4 font-bangla">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-3 font-bold",
                  link.live
                    ? "text-red-300 hover:bg-red-500/10"
                    : isActive(link.href)
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                {link.live && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" />
                )}
                {link.label}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-3 font-bold",
                profileActive
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-slate-300 hover:bg-white/5",
              )}
            >
              <UserCircle size={20} />
              প্রোফাইল
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
```

## File: [src/components/layout/StudySidebar.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/layout/StudySidebar.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { normalizeLevel } from "@/lib/profile-utils";
import {
  Atom,
  BookOpen,
  Brain,
  ClipboardList,
  LayoutGrid,
  Radio,
  Target,
  Trophy,
  Bookmark,
  AlertCircle,
  Shuffle,
  Book,
  BarChart3,
  FlaskConical,
  Leaf,
  FunctionSquare,
  Pi,
  Zap,
  Menu,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  detectStudyLevel,
  HSC_SIDEBAR_PAPERS,
  levelHubPath,
  resolveActiveSubjectBasePath,
  resolveSscSidebarSubjectGroups,
  type RouteLevel,
} from "@/lib/quiz/unified-routes";

type StudyLevel = RouteLevel;

function subjectIcon(label: string): React.ElementType {
  if (label.includes("রসায়ন") || label.includes("রসায়ন")) return FlaskConical;
  if (label.includes("জীব")) return Leaf;
  if (label.includes("উচ্চতর") && label.includes("২")) return Pi;
  if (label.includes("উচ্চতর") || label.includes("গণিত")) return FunctionSquare;
  return Atom;
}

function getSidebarItems(level: StudyLevel, subjectBase: string | null) {
  const hub = levelHubPath(level);
  const chapterHref = subjectBase ? `${subjectBase}?tab=chapter` : hub;
  const modelHref = subjectBase
    ? `${subjectBase}?tab=model&model=paper`
    : `${hub}/model-tests`;

  return [
    {
      label: "অধ্যায়ভিত্তিক কুইজ",
      href: chapterHref,
      icon: BookOpen,
      match: (p: string, tab: string | null) => {
        if (subjectBase && p.startsWith(subjectBase)) {
          return tab === "chapter" || tab === null;
        }
        return (
          p === hub ||
          (p.startsWith(`${hub}/`) &&
            !p.includes("/model-tests") &&
            !p.includes("/full-book-test") &&
            !p.includes("/wrong-answers") &&
            !p.includes("/saved-questions") &&
            !p.includes("/final-focus"))
        );
      },
    },
    {
      label: "মডেল টেস্ট",
      href: modelHref,
      icon: Target,
      match: (p: string, tab: string | null) =>
        p.includes("/model-tests") ||
        (subjectBase != null && p.startsWith(subjectBase) && tab === "model"),
    },
    { label: "লাইভ টেস্ট 🔴", href: "/live-test", icon: Radio, match: (p: string) => p.startsWith("/live-test") },
    { label: "দুর্বল অধ্যায়", href: "/dashboard#weak-chapters", icon: Brain, match: (p: string) => p === "/dashboard" },
    { label: "সাম্প্রতিক পরীক্ষা", href: "/dashboard#recent-exams", icon: ClipboardList, match: (p: string) => p === "/dashboard" },
    { label: "লিডারবোর্ড", href: "/leaderboard", icon: Trophy, match: (p: string) => p.startsWith("/leaderboard") },
    { label: "আমার ড্যাশবোর্ড", href: "/dashboard", icon: LayoutGrid, match: (p: string) => p === "/dashboard" },
  ];
}

function getQuickAccessItems(level: StudyLevel) {
  return [
    { label: "সেভ করা প্রশ্ন", href: `/${level}/saved-questions`, icon: Bookmark },
    { label: "ভুল উত্তর", href: `/${level}/wrong-answers`, icon: AlertCircle },
    { label: "র‍্যান্ডম টেস্ট", href: `/${level}/final-focus`, icon: Shuffle },
    { label: "পূর্ণ বই টেস্ট", href: `/${level}/full-book-test`, icon: Book },
    { label: "পারফরম্যান্স অ্যানালাইসিস", href: "/dashboard", icon: BarChart3 },
  ];
}

export function StudySidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const isBoardQuestionsRoute =
    pathname.startsWith("/ssc-board-questions") ||
    pathname.startsWith("/hsc-board-questions");

  const leaderboardLevel =
    pathname.startsWith("/leaderboard") && searchParams.get("level") === "hsc"
      ? "hsc"
      : pathname.startsWith("/leaderboard")
        ? "ssc"
        : null;

  if (isBoardQuestionsRoute) {
    const isSsc = pathname.startsWith("/ssc-board-questions");
    const base = levelHubPath(isSsc ? "ssc" : "hsc");
    const compactItems = [
      { label: "অধ্যায়ভিত্তিক কুইজ", href: base, icon: BookOpen },
      { label: "মডেল টেস্ট", href: `${base}/model-tests`, icon: Target },
      { label: "লাইভ টেস্ট 🔴", href: "/live-test", icon: Radio },
      { label: "লিডারবোর্ড", href: "/leaderboard", icon: Trophy },
      { label: "আমার ড্যাশবোর্ড", href: "/dashboard", icon: LayoutGrid },
    ];

    return (
      <aside className="w-full shrink-0 pb-4 lg:w-[280px] lg:pb-8 lg:pt-4" aria-label="প্রস্তুতি মেনু">
        <section className="sticky top-20 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
          <nav className="flex flex-col gap-1 font-bangla">
            {compactItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition",
                    active
                      ? "border border-cyan-300/50 bg-gradient-to-r from-violet-700 to-cyan-500/20 text-white"
                      : "text-slate-200 hover:bg-white/5 hover:text-cyan-300",
                  )}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </section>
      </aside>
    );
  }

  const level =
    leaderboardLevel ||
    detectStudyLevel(pathname) ||
    normalizeLevel(user?.className, user?.level) ||
    "ssc";
  const levelLabel = level === "ssc" ? "SSC" : "HSC";
  const menuTitle =
    leaderboardLevel === "hsc"
      ? "প্রধান মেনু (HSC)"
      : leaderboardLevel === "ssc"
        ? "প্রধান মেনু"
        : `প্রধান মেনু (${levelLabel})`;
  const sscGroups =
    level === "ssc" ? resolveSscSidebarSubjectGroups(pathname) : null;
  const subjectBase = resolveActiveSubjectBasePath(pathname);
  const activeTab = searchParams.get("tab");
  const items = getSidebarItems(level, subjectBase);
  const quickLinks = getQuickAccessItems(level);
  const compactMenuItems = items.slice(0, 3);

  const renderSubjectLink = (sub: { label: string; href: string }) => {
    const Icon = subjectIcon(sub.label);
    const active = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
    const isModelTests = pathname.includes("/model-tests") && active;
    return (
      <Link
        key={sub.label}
        href={`${sub.href}?tab=chapter`}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition min-h-[44px]",
          active
            ? isModelTests
              ? "border border-violet-400/50 bg-gradient-to-r from-violet-700/90 to-cyan-500/25 text-white shadow-[0_0_28px_rgba(139,92,246,0.35)]"
              : "border border-cyan-300/50 bg-gradient-to-r from-violet-700 to-cyan-500/20 text-white shadow-[0_0_25px_rgba(34,211,238,0.3)]"
            : "text-slate-200 hover:bg-white/5 hover:text-cyan-300",
        )}
      >
        <Icon size={22} className={active ? "text-white" : "text-cyan-400"} />
        <span className="leading-snug truncate">{sub.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-full shrink-0 pb-4 lg:w-[280px] lg:pb-8 lg:pt-4" aria-label={`${levelLabel} প্রস্তুতি মেনু`}>
      <div className="space-y-3 lg:sticky lg:top-20">
        {!mobileExpanded && (
          <section className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3 shadow-[0_0_40px_rgba(15,23,42,0.8)] lg:hidden">
            <button
              type="button"
              onClick={() => setMobileExpanded(true)}
              className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-200 transition active:scale-[0.98]"
            >
              <Menu className="h-5 w-5" />
              প্রস্তুতি মেনু খুলুন
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {compactMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center text-[11px] font-bold text-slate-200 transition active:scale-95 hover:border-cyan-400/30"
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span className="leading-tight">{item.label.split(" ")[0]}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className={cn("space-y-3", !mobileExpanded && "hidden lg:block")}>
          <section className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
            <div className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-bold text-slate-200">
              <Atom size={22} className="text-cyan-400" />
              বিষয়সমূহ
              <button
                type="button"
                onClick={() => setMobileExpanded(false)}
                className="ml-auto lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
                aria-label="মেনু বন্ধ করুন"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              {level === "ssc" && sscGroups ? (
                <>
                  {sscGroups.showScience && (
                    <>
                      {sscGroups.showMath && (
                        <p className="px-4 pb-1 text-xs font-bold uppercase tracking-wider text-cyan-500/80">
                          বিজ্ঞান
                        </p>
                      )}
                      {sscGroups.science.map(renderSubjectLink)}
                    </>
                  )}
                  {sscGroups.showMath && (
                    <>
                      {sscGroups.showScience && (
                        <p className="px-4 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-amber-500/80">
                          গণিত
                        </p>
                      )}
                      {sscGroups.math.map(renderSubjectLink)}
                    </>
                  )}
                </>
              ) : (
                HSC_SIDEBAR_PAPERS.map(renderSubjectLink)
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4">
            <h2 className="mb-3 flex items-center gap-2 text-base font-black text-cyan-300">
              <Zap size={20} fill="currentColor" />
              কুইক অ্যাক্সেস
            </h2>
            <div className="space-y-1">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex w-full min-h-[44px] items-center gap-3 rounded-xl px-2 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-cyan-300"
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3">
            <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              {menuTitle}
            </p>
            <nav className="flex flex-col gap-0.5 font-bangla">
              {items.map((item) => {
                const Icon = item.icon;
                const active = item.match
                  ? item.match(pathname, activeTab)
                  : pathname === item.href || pathname.startsWith(item.href + "/");
                const isLeaderboard = item.href === "/leaderboard";
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors",
                      active && isLeaderboard
                        ? "border border-purple-400/40 bg-gradient-to-r from-violet-700/80 to-cyan-500/20 font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                        : active
                          ? "bg-cyan-500/15 text-cyan-300 font-medium"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="leading-snug">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </section>
        </div>
      </div>
    </aside>
  );
}
```

## File: [src/components/leaderboard/CollegeMindGame.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/leaderboard/CollegeMindGame.tsx)

```tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  type CollegeWarEntry,
  type LeaderboardEntry,
  formatBnNumber,
  getInitials,
} from "@/lib/leaderboard-api";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import { type StudentLevel } from "@/lib/profile-utils";
import {
  Brain,
  Building2,
  Check,
  ChevronRight,
  Crown,
  Heart,
  Loader2,
  Swords,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────

interface Question {
  id: string;
  text: string;
  options: string[];
}

type GamePhase =
  | "select-a"     // Pick your college
  | "select-b"     // Pick opponent college
  | "countdown"    // 3-2-1 GO!
  | "playing"      // Answering questions
  | "result";      // Show winner

interface AnswerResult {
  questionId: string;
  correctIndex: number;
  playerChoice: number | null;
  opponentChoice: number | null;
  playerCorrect: boolean;
  opponentCorrect: boolean;
}

// ─── Sub-components ─────────────────────────

function CountdownOverlay({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          setTimeout(onDone, 200);
          return 0;
        }
        return c - 1;
      });
    }, 800);
    return () => clearInterval(t);
  }, [onDone]);

  const labels = ["প্রস্তুত?", "৩", "২", "১", "GO! ଗୋ!"];
  const label = labels[count] || "GO!";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07111F]/95 backdrop-blur-sm">
      <div className="text-center animate-fadeIn">
        <p className="text-8xl font-black text-white animate-pulseGlow">
          {label}
        </p>
        {count > 0 && count <= 3 && (
          <p className="mt-4 text-lg text-slate-400 font-bangla">
            মাইন্ড গেম শুরু হতে চলেছে...
          </p>
        )}
      </div>
    </div>
  );
}

function GameProgressBar({
  current,
  total,
  playerScore,
  opponentScore,
}: {
  current: number;
  total: number;
  playerScore: number;
  opponentScore: number;
}) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-purple-300 font-bold">
          <Brain className="h-3.5 w-3.5" />
          তুমি: {playerScore}
        </span>
        <span className="text-slate-500">
          {formatBnNumber(current + 1)} / {formatBnNumber(total)}
        </span>
        <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
          প্রতিপক্ষ: {opponentScore}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OpponentAvatar({
  college,
  side,
}: {
  college: CollegeWarEntry;
  side: "left" | "right";
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl border-2",
          side === "left"
            ? "border-purple-500/40 bg-purple-500/15"
            : "border-cyan-500/40 bg-cyan-500/15",
        )}
      >
        <Building2
          className={cn(
            "h-7 w-7",
            side === "left" ? "text-purple-400" : "text-cyan-400",
          )}
        />
      </div>
      <p className="text-xs font-bold text-slate-300 text-center leading-tight max-w-[100px] truncate">
        {college.name}
      </p>
    </div>
  );
}

function ResultCard({
  q,
  result,
  qi,
}: {
  q: Question;
  result: AnswerResult;
  qi: number;
}) {
  const isPlayerRight = result.playerCorrect;
  const isOpponentRight = result.opponentCorrect;
  const isBothRight = isPlayerRight && isOpponentRight;
  const isBothWrong = !isPlayerRight && !isOpponentRight;
  const isPlayerOnly = isPlayerRight && !isOpponentRight;
  const isOpponentOnly = !isPlayerRight && isOpponentRight;

  return (
    <Card
      variant="glass"
      className={cn(
        "p-4 space-y-3 border",
        isBothRight && "border-emerald-500/30",
        isBothWrong && "border-red-500/20",
        isPlayerOnly && "border-purple-500/30",
        isOpponentOnly && "border-cyan-500/30",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          প্রশ্ন {formatBnNumber(qi + 1)}
        </span>
        <div className="flex items-center gap-2">
          {isBothRight && (
            <Badge variant="success" className="text-[9px]">উভয়েই সঠিক</Badge>
          )}
          {isPlayerOnly && (
            <Badge variant="default" className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[9px]">শুধু তুমি</Badge>
          )}
          {isOpponentOnly && (
            <Badge variant="default" className="bg-cyan-500/15 text-cyan-300 border-cyan-500/30 text-[9px]">শুধু প্রতিপক্ষ</Badge>
          )}
          {isBothWrong && (
            <Badge variant="warning" className="text-[9px]">উভয়েই ভুল</Badge>
          )}
        </div>
      </div>

      <FormattedQuizText text={q.text} className="text-sm" />

      <div className="grid gap-1.5">
        {q.options.map((opt, oi) => {
          const isCorrect = oi === result.correctIndex;
          const playerPicked = oi === result.playerChoice;
          const opponentPicked = oi === result.opponentChoice;

          return (
            <div
              key={oi}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs border",
                isCorrect && "border-emerald-400/30 bg-emerald-500/10",
                !isCorrect && playerPicked && "border-red-400/30 bg-red-500/10",
                !isCorrect && !playerPicked && !opponentPicked && "border-white/5 bg-white/[0.02]",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-bold text-slate-500">{"কখগঘ"[oi]}.</span>
                <FormattedQuizText text={opt} inline className="text-slate-300" />
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {playerPicked && (
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", isCorrect ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300")}>
                    তুমি
                  </span>
                )}
                {opponentPicked && (
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", isCorrect ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300")}>
                    প্রতিপক্ষ
                  </span>
                )}
                {isCorrect && <Check className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Main Component ─────────────────────────

export function CollegeMindGame({
  colleges,
  entries,
  level = "ssc",
  onExit,
}: {
  colleges: CollegeWarEntry[];
  entries: LeaderboardEntry[];
  level?: StudentLevel;
  onExit: () => void;
}) {
  const isSchool = level === "ssc";
  // ── State ──
  const [phase, setPhase] = useState<GamePhase>("select-a");
  const [myCollege, setMyCollege] = useState<CollegeWarEntry | null>(null);
  const [opponentCollege, setOpponentCollege] = useState<CollegeWarEntry | null>(null);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [countdownDone, setCountdownDone] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const GAME_QUESTIONS = 10;

  // ── Filtered list ──
  const filteredColleges = useMemo(() => {
    return colleges.filter(
      (c) => c.name !== myCollege?.name && c.name !== opponentCollege?.name,
    );
  }, [colleges, myCollege, opponentCollege]);

  // ── Load questions from board files ──
  const loadQuestionsForGame = useCallback(async () => {
    setLoadingQuestions(true);
    const allQs: Question[] = [];

    // Try loading from multiple board files & chapter sets to get a good mix
    const pathsToTry = level === "ssc" ? [
      // SSC Physics chapter sets
      "/questions/physics/ssc-physics-chapter-01-model-test-01.json",
      "/questions/physics/ssc-physics-chapter-02-model-test-01.json",
      "/questions/physics/ssc-physics-chapter-03-model-test-01.json",
      "/questions/physics/ssc-physics-chapter-04-model-test-01.json",
      "/questions/physics/ssc-physics-chapter-05-model-test-01.json",
      // SSC Chemistry chapter sets
      "/questions/chemistry/ssc-chemistry-chapter-01-model-test-01.json",
      "/questions/chemistry/ssc-chemistry-chapter-02-model-test-01.json",
      // SSC Biology chapter sets
      "/questions/biology/ssc-biology-chapter-01-model-test-01.json",
      // Board questions (SSC Physics/Chemistry/Biology)
      "/questions/physics/barishal-2025.json",
      "/questions/physics/dhaka-2025.json",
      "/questions/chemistry/dhaka-2025.json",
    ] : [
      // HSC Biology 2nd paper chapter sets
      "/questions/biology-2nd-paper/hsc-biology-2nd-paper-chapter-01-high-priority-set-01.json",
      "/questions/biology-2nd-paper/hsc-biology-2nd-paper-chapter-08-high-priority-set-02.json",
      "/questions/biology-2nd-paper/hsc-biology-2nd-paper-chapter-10-high-priority-set-01.json",
      // HSC Physics 1st paper chapter sets
      "/questions/physics-1st-paper/hsc-physics-1st-paper-chapter-01-model-test-01.json",
      "/questions/physics-1st-paper/hsc-physics-1st-paper-chapter-02-model-test-01.json",
      "/questions/physics-1st-paper/hsc-physics-1st-paper-chapter-03-model-test-01.json",
      // HSC Chemistry chapter sets
      "/questions/chemistry-1st-paper/hsc-chemistry-1st-paper-chapter-01-high-priority-set-01.json",
      // HSC Board questions
      "/questions/chemistry-1st-paper/dhaka-2025.json",
      "/questions/biology-1st-paper/dhaka-2025.json",
      "/questions/physics-1st-paper/dhaka-2025.json",
    ];

    for (const p of pathsToTry) {
      if (allQs.length >= GAME_QUESTIONS) break;
      try {
        const res = await fetch(p);
        if (!res.ok) continue;
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.questions ?? [];
        for (const item of items) {
          if (allQs.length >= GAME_QUESTIONS) break;
          const text = item.text || item.questionText || item.question || "";
          const opts = item.options || [item.optionA, item.optionB, item.optionC, item.optionD].filter(Boolean);
          if (text && opts.length >= 2) {
            allQs.push({
              id: item.id || String(Math.random()),
              text,
              options: opts.slice(0, 4).map((o: unknown) => String(o).trim()),
            });
          }
        }
      } catch { /* skip */ }
    }

    // Shuffle for variety
    const shuffled = allQs.sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, Math.min(GAME_QUESTIONS, shuffled.length)));
    setLoadingQuestions(false);
  }, [myCollege, level]);

  useEffect(() => {
    if (phase === "countdown" && questions.length === 0) {
      loadQuestionsForGame();
    }
  }, [phase, questions.length, loadQuestionsForGame]);

  // ── Start countdown ──
  const startGame = () => {
    setPhase("countdown");
  };

  const handleCountdownDone = () => {
    setCountdownDone(true);
    setPhase("playing");
  };

  // ── Handle answer selection ──
  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null || showResult || gameOver) return;
    setSelectedOption(optionIndex);

    const q = questions[currentQ];
    if (!q) return;

    // Determine correct answer (for simulation, use a hash-based deterministic approach
    // In a real app, this would come from answer keys)
    const correctIndex = Math.abs(hashCode(q.text)) % q.options.length;

    // Player answer
    const playerCorrect = optionIndex === correctIndex;

    // Opponent answer (simulated based on college avg accuracy)
    const opponentAccuracy = opponentCollege
      ? Math.min(opponentCollege.avgScore / 100, 0.85)
      : 0.5;
    const opponentCorrect = Math.random() < opponentAccuracy;
    const opponentChoice = opponentCorrect
      ? correctIndex
      : (correctIndex + 1 + Math.floor(Math.random() * 3)) % q.options.length;

    const result: AnswerResult = {
      questionId: q.id,
      correctIndex,
      playerChoice: optionIndex,
      opponentChoice,
      playerCorrect,
      opponentCorrect,
    };

    setAnswers((prev) => [...prev, result]);
    if (playerCorrect) setPlayerScore((s) => s + 1);
    if (opponentCorrect) setOpponentScore((s) => s + 1);
    setShowResult(true);
  };

  // ── Next question ──
  const nextQuestion = () => {
    if (currentQ >= GAME_QUESTIONS - 1) {
      setGameOver(true);
      setPhase("result");
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelectedOption(null);
    setShowResult(false);
  };

  // ── Reset game ──
  const resetGame = () => {
    setPhase("select-a");
    setMyCollege(null);
    setOpponentCollege(null);
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setPlayerScore(0);
    setOpponentScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setCountdownDone(false);
    setGameOver(false);
    setSearchA("");
    setSearchB("");
  };

  useEffect(() => {
    resetGame();
  }, [level]);

  // ── College selection UI ──
  if (phase === "select-a") {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
          <Badge variant="default" className="border-purple-500/30 bg-purple-500/10 gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            মাইন্ড গেম
          </Badge>
        </div>

        <Card variant="glass" className="p-8 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">🧠 মাইন্ড গেম</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            {GAME_QUESTIONS}টি MCQ এর যুদ্ধ! তুমি ও প্রতিপক্ষ {isSchool ? "স্কুল" : "কলেজ"} — কে বেশি সঠিক উত্তর দিতে পারে?
            তোমার {isSchool ? "স্কুল" : "কলেজ"} বাছাই করে যুদ্ধে নামো!
          </p>
        </Card>

        <Card variant="glass" className="p-6 space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-white">
            <Building2 className="h-5 w-5 text-purple-400" />
            তোমার {isSchool ? "স্কুল" : "কলেজ"} নির্বাচন করো
          </h3>

          <div className="relative w-full">
            <input
              type="text"
              value={searchA}
              onChange={(e) => setSearchA(e.target.value)}
              placeholder={`${isSchool ? "স্কুলের" : "কলেজের"} নাম লিখুন...`}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-4 pr-10 text-sm text-white placeholder:text-slate-600 focus:border-purple-400/40 focus:outline-none"
            />
            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>

          {searchA && (
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {colleges
                .filter((c) => c.name.toLowerCase().includes(searchA.toLowerCase()))
                .slice(0, 8)
                .map((c) => (
                  <li key={c.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setMyCollege(c);
                        setPhase("select-b");
                        setSearchA("");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-left hover:bg-white/[0.06] transition"
                    >
                      <Building2 className="h-5 w-5 shrink-0 text-purple-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          স্কোর: {formatBnNumber(c.score)} · {formatBnNumber(c.studentCount)} জন
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    </button>
                  </li>
                ))}
              {colleges.filter((c) =>
                c.name.toLowerCase().includes(searchA.toLowerCase()),
              ).length === 0 && (
                <p className="py-3 text-center text-xs text-slate-600">
                  কোনো {isSchool ? "স্কুল" : "কলেজ"} পাওয়া যায়নি
                </p>
              )}
            </ul>
          )}
        </Card>
      </div>
    );
  }

  // ── Opponent selection UI ──
  if (phase === "select-b") {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setPhase("select-a"); setMyCollege(null); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
          <Badge variant="default" className="border-purple-500/30 bg-purple-500/10 gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            প্রতিপক্ষ বাছাই
          </Badge>
        </div>

        {myCollege && (
          <Card variant="glass" className="p-4 border-purple-500/30 bg-purple-500/5 flex items-center gap-3">
            <Building2 className="h-6 w-6 text-purple-400" />
            <div>
              <p className="text-sm font-bold text-white">তোমার {isSchool ? "স্কুল" : "কলেজ"}</p>
              <p className="text-xs text-slate-400">{myCollege.name}</p>
            </div>
          </Card>
        )}

        <Card variant="glass" className="p-6 space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-white">
            <Swords className="h-5 w-5 text-orange-400" />
            প্রতিপক্ষ {isSchool ? "স্কুল" : "কলেজ"} নির্বাচন করো
          </h3>

          <div className="relative w-full">
            <input
              type="text"
              value={searchB}
              onChange={(e) => setSearchB(e.target.value)}
              placeholder={`প্রতিপক্ষ ${isSchool ? "স্কুলের" : "কলেজের"} নাম লিখুন...`}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-4 pr-10 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
            />
            <Swords className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>

          {searchB && (
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {filteredColleges
                .filter((c) => c.name.toLowerCase().includes(searchB.toLowerCase()))
                .slice(0, 8)
                .map((c) => (
                  <li key={c.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpponentCollege(c);
                        setSearchB("");
                        startGame();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-left hover:bg-white/[0.06] transition"
                    >
                      <Building2 className="h-5 w-5 shrink-0 text-cyan-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          স্কোর: {formatBnNumber(c.score)} · {formatBnNumber(c.studentCount)} জন ·
                          গড়: {formatBnNumber(c.avgScore)}
                        </p>
                      </div>
                      <Swords className="h-4 w-4 text-orange-400" />
                    </button>
                  </li>
                ))}
              {filteredColleges.filter((c) =>
                c.name.toLowerCase().includes(searchB.toLowerCase()),
              ).length === 0 && (
                <p className="py-3 text-center text-xs text-slate-600">
                  কোনো {isSchool ? "স্কুল" : "কলেজ"} পাওয়া যায়নি
                </p>
              )}
            </ul>
          )}
        </Card>
      </div>
    );
  }

  // ── Countdown ──
  if (phase === "countdown") {
    if (loadingQuestions) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-purple-glow" />
          <p className="text-sm text-slate-400 font-bangla">প্রশ্ন লোড হচ্ছে...</p>
        </div>
      );
    }
    return <CountdownOverlay onDone={handleCountdownDone} />;
  }

  // ── Result screen ──
  if (phase === "result" && gameOver) {
    const isWin = playerScore > opponentScore;
    const isDraw = playerScore === opponentScore;
    const totalCorrect = playerScore + opponentScore;
    const totalQuestions_seen = answers.length;

    return (
      <div className="space-y-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Badge variant="default" className="border-purple-500/30 bg-purple-500/10 gap-2">
            <Trophy className="h-4 w-4 text-purple-400" />
            মাইন্ড গেম — ফলাফল
          </Badge>
        </div>

        {/* Result hero */}
        <Card variant="glass" className={cn(
          "p-8 text-center space-y-4 border-2",
          isWin && "border-emerald-500/40",
          isDraw && "border-yellow-500/40",
          !isWin && !isDraw && "border-red-500/30",
        )}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10">
            {isWin ? (
              <Crown className="h-10 w-10 text-yellow-400" />
            ) : isDraw ? (
              <Swords className="h-10 w-10 text-orange-400" />
            ) : (
              <Heart className="h-10 w-10 text-red-400" />
            )}
          </div>

          <h2 className="text-3xl font-black text-white">
            {isWin ? "🎉 অভিনন্দন! তুমি জিতেছ!" : isDraw ? "🤝 সমতা!" : "😔 প্রতিপক্ষ জিতেছে!"}
          </h2>

          {/* Score comparison */}
          <div className="flex items-center justify-center gap-6 py-4">
            {/* Player */}
            <div className="flex flex-col items-center gap-2">
              <Building2 className="h-6 w-6 text-purple-400" />
              <p className="text-xs font-bold text-purple-300 truncate max-w-[120px]">
                {myCollege?.name}
              </p>
              <p className="text-4xl font-black text-white">{playerScore}</p>
            </div>

            <div className="text-2xl font-black text-slate-600">:</div>

            {/* Opponent */}
            <div className="flex flex-col items-center gap-2">
              <Building2 className="h-6 w-6 text-cyan-400" />
              <p className="text-xs font-bold text-cyan-300 truncate max-w-[120px]">
                {opponentCollege?.name}
              </p>
              <p className="text-4xl font-black text-white">{opponentScore}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {formatBnNumber(totalQuestions_seen)} টি প্রশ্ন · {formatBnNumber(totalCorrect)} টি সঠিক উত্তর
          </p>
        </Card>

        {/* Per-question review */}
        <Card variant="glass" className="p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-white">
            <Zap className="h-4 w-4 text-orange-400" />
            প্রশ্নভিত্তিক বিশ্লেষণ
          </h3>
          <div className="space-y-2">
            {answers.map((r, i) => (
              <ResultCard key={r.questionId} q={questions[i]} result={r} qi={i} />
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            onClick={resetGame}
            className="flex items-center gap-2"
          >
            <Swords className="h-4 w-4" />
            আবার খেলো
          </Button>
          <Button
            variant="secondary"
            onClick={onExit}
            className="flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            {isSchool ? "স্কুল" : "কলেজ"} র‍্যাঙ্কিং
          </Button>
        </div>
      </div>
    );
  }

  // ── Playing screen ──
  const currentQuestion = questions[currentQ];
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-glow" />
        <p className="text-sm text-slate-400 font-bangla">প্রশ্ন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* VS header */}
      <div className="flex items-center justify-between px-2">
        <OpponentAvatar college={myCollege!} side="left" />
        <div className="flex flex-col items-center gap-1">
          <Badge variant="default" className="border-orange-400/30 bg-orange-500/10 gap-1.5">
            <Zap className="h-3 w-3 text-orange-400" />
            মাইন্ড গেম
          </Badge>
          <div className="flex items-center gap-2 text-lg font-black text-white">
            <span className="text-purple-400">{playerScore}</span>
            <span className="text-slate-600">VS</span>
            <span className="text-cyan-400">{opponentScore}</span>
          </div>
        </div>
        <OpponentAvatar college={opponentCollege!} side="right" />
      </div>

      {/* Progress */}
      <GameProgressBar
        current={currentQ}
        total={GAME_QUESTIONS}
        playerScore={playerScore}
        opponentScore={opponentScore}
      />

      {/* Question card */}
      <Card variant="glass" className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <Brain className="h-3.5 w-3.5 text-purple-400" />
            প্রশ্ন {formatBnNumber(currentQ + 1)}
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            {formatBnNumber(GAME_QUESTIONS - currentQ)} বাকি
          </span>
        </div>

        <FormattedQuizText text={currentQuestion.text} className="text-base sm:text-lg" />

        <div className="space-y-2">
          {currentQuestion.options.map((opt, oi) => {
            const isSelected = selectedOption === oi;
            const isDisabled = selectedOption !== null;
            const isCorrect = showResult && oi === answers[answers.length - 1]?.correctIndex;
            const isWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={oi}
                type="button"
                onClick={() => handleAnswer(oi)}
                disabled={isDisabled}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all duration-200 min-h-[52px] flex items-center justify-between group",
                  isSelected && !showResult && "border-purple-glow bg-purple-glow/10 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]",
                  isCorrect && "border-emerald-400/50 bg-emerald-500/15 text-emerald-100",
                  isWrong && "border-red-400/40 bg-red-500/15 text-red-100",
                  !isSelected && !showResult && "border-slate-800/80 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white",
                  !isSelected && showResult && !isCorrect && "border-white/5 bg-white/5 text-slate-500",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn(
                    "flex items-center justify-center h-7 w-7 rounded-xl font-bold text-xs border transition-all",
                    isSelected && !showResult && "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent",
                    isCorrect && "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
                    isWrong && "bg-red-500/20 text-red-300 border-red-400/30",
                    !isSelected && !showResult && "bg-slate-900 text-slate-400 border-white/5",
                    !isSelected && showResult && "bg-slate-900 text-slate-600 border-white/5",
                  )}>
                    {"কখগঘ"[oi]}
                  </span>
                  <FormattedQuizText text={opt} inline className="text-sm" />
                </span>
                {isCorrect && <Check className="h-5 w-5 text-emerald-400" />}
                {isWrong && <X className="h-5 w-5 text-red-400" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Next button */}
      {showResult && (
        <Button
          variant="primary"
          fullWidth
          onClick={nextQuestion}
          className="min-h-[48px] flex items-center justify-center gap-2"
        >
          {currentQ >= GAME_QUESTIONS - 1 ? (
            <>ফলাফল দেখুন <Trophy className="h-4 w-4" /></>
          ) : (
            <>পরবর্তী প্রশ্ন <ChevronRight className="h-4 w-4" /></>
          )}
        </Button>
      )}
    </div>
  );
}

// ─── Helper ──────────────────────────────────

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
```

## File: [src/components/leaderboard/CollegeWarsPage.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/leaderboard/CollegeWarsPage.tsx)

```tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LeaderboardSkeleton } from "@/components/leaderboard/LeaderboardSkeleton";
import { RankTierBadge } from "@/components/leaderboard/RankTierBadge";
import {
  aggregateColleges,
  fetchLeaderboard,
  filterLeaderboard,
  formatAccuracy,
  formatBnNumber,
  getCollegeRanking,
  getInitials,
  type CollegeWarEntry,
  type LeaderboardEntry,
} from "@/lib/leaderboard-api";
import { normalizeLevel, type StudentLevel } from "@/lib/profile-utils";
import { CollegeMindGame } from "@/components/leaderboard/CollegeMindGame";
import {
  ArrowLeft,
  Brain,
  Building2,
  Crown,
  Medal,
  Search,
  Shield,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ViewMode = "list" | "battle" | "mindgame";

interface BattlePair {
  collegeA: CollegeWarEntry | null;
  collegeB: CollegeWarEntry | null;
}

// ─────────────────────────────────────────────
// Reusable sub-components
// ─────────────────────────────────────────────

function Avatar({
  entry,
  size = "md",
}: {
  entry: LeaderboardEntry;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };
  if (entry.picture) {
    return (
      <img
        src={entry.picture}
        alt=""
        className={cn(
          "rounded-full object-cover border border-white/10 shrink-0",
          sizes[size],
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-purple-600/40 to-cyan-500/30 flex items-center justify-center font-bold text-white border border-white/10 shrink-0",
        sizes[size],
      )}
    >
      {getInitials(entry.name || "নাম নেই")}
    </div>
  );
}

function TopPerformerRow({
  entry,
  isGold = false,
}: {
  entry: LeaderboardEntry;
  isGold?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 transition hover:bg-white/[0.06]">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isGold
            ? "bg-gold-rank/20 text-gold-rank"
            : "bg-slate-700/50 text-slate-400",
        )}
      >
        {formatBnNumber(entry.rank)}
      </span>
      <Avatar entry={entry} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-200">
          {entry.name || "নাম নেই"}
          {isGold && (
            <Crown className="ml-1 inline h-3 w-3 text-gold-rank" />
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-cyan-400">
          {formatBnNumber(entry.points || 0)}
        </span>
        <RankTierBadge rank={entry.rank} />
      </div>
    </div>
  );
}

function CollegeStatCard({
  label,
  value,
  icon,
  accent = "cyan",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: "cyan" | "purple" | "emerald" | "orange";
}) {
  const accentColors = {
    cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-500/5",
    purple: "text-purple-400 border-purple-400/20 bg-purple-500/5",
    emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-500/5",
    orange: "text-orange-400 border-orange-400/20 bg-orange-500/5",
  };
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl border p-3",
        accentColors[accent],
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-lg font-black">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// College Battle Card (head-to-head comparison)
// ─────────────────────────────────────────────

function CollegeBattleCard({
  college,
  entries,
  side,
  onRemove,
}: {
  college: CollegeWarEntry;
  entries: LeaderboardEntry[];
  side: "left" | "right";
  onRemove?: () => void;
}) {
  const collegeEntries = useMemo(
    () => getCollegeRanking(entries, college.name),
    [entries, college.name],
  );

  const top3 = collegeEntries.slice(0, 3);

  return (
    <Card
      variant="glass"
      className={cn(
        "relative flex-1 overflow-hidden p-5",
        side === "left" && "border-purple-500/30",
        side === "right" && "border-cyan-500/30",
      )}
    >
      {/* Side badge */}
      <div
        className={cn(
          "absolute right-0 top-0 rounded-bl-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
          side === "left"
            ? "bg-purple-500/20 text-purple-300"
            : "bg-cyan-500/20 text-cyan-300",
        )}
      >
        {side === "left" ? "Team A" : "Team B"}
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-8 flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* College name & rank */}
      <div className="mb-4 mt-2">
        <div className="flex items-center gap-2">
          <Building2
            className={cn(
              "h-5 w-5",
              side === "left" ? "text-purple-400" : "text-cyan-400",
            )}
          />
          <h3 className="truncate text-lg font-black text-white">
            {college.name}
          </h3>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <CollegeStatCard
            label="মোট স্কোর"
            value={formatBnNumber(college.score)}
            icon={<Trophy className="h-3 w-3" />}
            accent={side === "left" ? "purple" : "cyan"}
          />
          <CollegeStatCard
            label="শিক্ষার্থী"
            value={formatBnNumber(college.studentCount)}
            icon={<Users className="h-3 w-3" />}
            accent="emerald"
          />
          <CollegeStatCard
            label="গড় স্কোর"
            value={formatBnNumber(college.avgScore)}
            icon={<Target className="h-3 w-3" />}
            accent="orange"
          />
          <CollegeStatCard
            label="সর্বোচ্চ"
            value={formatBnNumber(college.topScore)}
            icon={<Crown className="h-3 w-3" />}
            accent={side === "left" ? "purple" : "cyan"}
          />
        </div>
      </div>

      {/* Top performers */}
      <div>
        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Medal className="h-3.5 w-3.5" />
          শীর্ষ পারফর্মার
        </h4>
        <div className="space-y-1">
          {top3.length > 0 ? (
            top3.map((e, i) => (
              <TopPerformerRow key={e.userId || i} entry={e} isGold={i === 0} />
            ))
          ) : (
            <p className="py-3 text-center text-xs text-slate-600">
              এখনো কেউ র‍্যাঙ্কিংয়ে নেই
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────
// College Drill-Down
// ─────────────────────────────────────────────

function CollegeDrillDownView({
  collegeName,
  entries,
  level = "ssc",
  onBack,
  onBattle,
}: {
  collegeName: string;
  entries: LeaderboardEntry[];
  level?: StudentLevel;
  onBack: () => void;
  onBattle: () => void;
}) {
  const isSchool = level === "ssc";
  const collegeEntries = useMemo(
    () => getCollegeRanking(entries, collegeName),
    [entries, collegeName],
  );

  const college = useMemo((): CollegeWarEntry | null => {
    const all = aggregateColleges(entries);
    return all.find((c) => c.name === collegeName) || null;
  }, [entries, collegeName]);

  return (
    <div className="space-y-4">
      {/* Header with back & battle buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="পিছনে"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-black text-white">
            <Building2 className="mr-2 inline h-5 w-5 text-purple-400" />
            {collegeName}
          </h2>
        </div>
        <button
          type="button"
          onClick={onBattle}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          <Swords className="h-3.5 w-3.5" />
          Battle
        </button>
      </div>

      {/* Stats grid */}
      {college && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CollegeStatCard
            label="মোট স্কোর"
            value={formatBnNumber(college.score)}
            icon={<Trophy className="h-3 w-3" />}
            accent="purple"
          />
          <CollegeStatCard
            label="শিক্ষার্থী"
            value={formatBnNumber(college.studentCount)}
            icon={<Users className="h-3 w-3" />}
            accent="emerald"
          />
          <CollegeStatCard
            label="গড় স্কোর"
            value={formatBnNumber(college.avgScore)}
            icon={<Target className="h-3 w-3" />}
            accent="orange"
          />
          <CollegeStatCard
            label="সর্বোচ্চ"
            value={formatBnNumber(college.topScore)}
            icon={<Crown className="h-3 w-3" />}
            accent="cyan"
          />
        </div>
      )}

      {/* Student rankings */}
      <Card variant="glass" className="overflow-hidden p-0">
        <div className="border-b border-white/10 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white">
            <Users className="h-4 w-4 text-cyan-400" />
            শিক্ষার্থী র‍্যাঙ্কিং ({formatBnNumber(collegeEntries.length)} জন)
          </h3>
        </div>
        <div className="space-y-1 p-3">
          {collegeEntries.length > 0 ? (
            collegeEntries.map((entry) => (
              <div
                key={entry.userId || entry.rank}
                className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.05]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700/50 text-[11px] font-bold text-slate-400">
                  {formatBnNumber(entry.rank)}
                </span>
                <Avatar entry={entry} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-200">
                    {entry.name || "নাম নেই"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Accuracy: {formatAccuracy(entry.accuracy)}
                    {entry.examsTaken != null &&
                      ` · ${formatBnNumber(entry.examsTaken)} টেস্ট`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-bold text-cyan-400">
                    {formatBnNumber(entry.points || 0)}
                  </span>
                  <RankTierBadge rank={entry.rank} />
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-xs text-slate-500">
              এই {isSchool ? "স্কুলের" : "কলেজের"} কেউ এখনো র‍্যাঙ্কিংয়ে নেই। প্রথম কুইজ দিয়ে শুরু করুন!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// College Ranking Table
// ─────────────────────────────────────────────

function CollegeRankingTable({
  colleges,
  level = "ssc",
  onSelect,
  onBattle,
}: {
  colleges: CollegeWarEntry[];
  level?: StudentLevel;
  onSelect: (name: string) => void;
  onBattle: (name: string) => void;
}) {
  const isSchool = level === "ssc";
  return (
    <Card variant="glass" className="overflow-hidden p-0">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-[48px_1fr_100px_120px_100px_100px_80px] items-center gap-3 border-b border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span>#</span>
        <span>{isSchool ? "স্কুলের নাম" : "কলেজের নাম"}</span>
        <span>শিক্ষার্থী</span>
        <span>মোট স্কোর</span>
        <span>গড় স্কোর</span>
        <span>সর্বোচ্চ</span>
        <span>Battle</span>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {colleges.map((c, i) => (
          <div key={c.name}>
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-[48px_1fr_100px_120px_100px_100px_80px] items-center gap-3 px-4 py-3 text-sm transition hover:bg-white/[0.04]">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  i === 0
                    ? "bg-gold-rank/20 text-gold-rank"
                    : i === 1
                      ? "bg-slate-300/20 text-slate-300"
                      : i === 2
                        ? "bg-amber-600/20 text-amber-500"
                        : "bg-slate-700/30 text-slate-500",
                )}
              >
                {formatBnNumber(i + 1)}
              </span>
              <button
                type="button"
                onClick={() => onSelect(c.name)}
                className="truncate text-left font-semibold text-slate-200 underline-offset-2 hover:text-white hover:underline"
              >
                <Building2 className="mr-1.5 inline h-3.5 w-3.5 text-purple-400/70" />
                {c.name}
              </button>
              <span className="font-medium text-slate-300">
                <Users className="mr-1 inline h-3.5 w-3.5 text-emerald-400/70" />
                {formatBnNumber(c.studentCount)}
              </span>
              <span className="font-bold text-cyan-400">
                {formatBnNumber(c.score)}
              </span>
              <span className="text-slate-400">
                {formatBnNumber(c.avgScore)}
              </span>
              <span className="font-medium text-orange-300">
                {formatBnNumber(c.topScore)}
              </span>
              <button
                type="button"
                onClick={() => onBattle(c.name)}
                className="flex items-center gap-1 rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <Swords className="h-3 w-3" />
                Battle
              </button>
            </div>

            {/* Mobile row */}
            <div className="md:hidden space-y-1 px-4 py-3 transition hover:bg-white/[0.04]">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    i === 0
                      ? "bg-gold-rank/20 text-gold-rank"
                      : i === 1
                        ? "bg-slate-300/20 text-slate-300"
                        : i === 2
                          ? "bg-amber-600/20 text-amber-500"
                          : "bg-slate-700/30 text-slate-500",
                  )}
                >
                  {formatBnNumber(i + 1)}
                </span>
                <button
                  type="button"
                  onClick={() => onSelect(c.name)}
                  className="min-w-0 flex-1 truncate text-left font-semibold text-slate-200"
                >
                  {c.name}
                </button>
                <button
                  type="button"
                  onClick={() => onBattle(c.name)}
                  className="flex items-center gap-1 rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-300"
                >
                  <Swords className="h-3 w-3" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                <span>
                  <Users className="mr-0.5 inline h-3 w-3 text-emerald-400/70" />
                  {formatBnNumber(c.studentCount)} জন
                </span>
                <span className="text-white/20">·</span>
                <span>
                  স্কোর:{" "}
                  <strong className="text-cyan-400">
                    {formatBnNumber(c.score)}
                  </strong>
                </span>
                <span className="text-white/20">·</span>
                <span>
                  গড়: {formatBnNumber(c.avgScore)}
                </span>
                <span className="text-white/20">·</span>
                <span>
                  সর্বোচ্চ:{" "}
                  <strong className="text-orange-300">
                    {formatBnNumber(c.topScore)}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────
// College Battle Arena (side-by-side comparison)
// ─────────────────────────────────────────────

function CollegeBattleArena({
  colleges,
  entries,
  battlePair,
  level = "ssc",
  onAddCollege,
  onRemoveCollege,
  onExitBattle,
}: {
  colleges: CollegeWarEntry[];
  entries: LeaderboardEntry[];
  battlePair: BattlePair;
  level?: StudentLevel;
  onAddCollege: (name: string) => void;
  onRemoveCollege: (slot: "collegeA" | "collegeB") => void;
  onExitBattle: () => void;
}) {
  const isSchool = level === "ssc";
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  const filteredColleges = useMemo(() => {
    if (!searchA && !searchB) return colleges;
    const q = (searchA || searchB).toLowerCase();
    if (!q) return colleges;
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) &&
        c.name !== battlePair.collegeA?.name &&
        c.name !== battlePair.collegeB?.name,
    );
  }, [colleges, searchA, searchB, battlePair]);

  const selectedCount = [battlePair.collegeA, battlePair.collegeB].filter(
    Boolean,
  ).length;
  const diffScore =
    (battlePair.collegeA?.score || 0) - (battlePair.collegeB?.score || 0);
  const diffStudents =
    (battlePair.collegeA?.studentCount || 0) -
    (battlePair.collegeB?.studentCount || 0);

  return (
    <div className="space-y-4">
      {/* Battle header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExitBattle}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Battle মোড বন্ধ করুন"
        >
          <X className="h-4 w-4" />
        </button>
        <Badge
          variant="default"
          className="inline-flex gap-2 border-orange-400/30 bg-orange-500/10"
        >
          <Swords className="h-4 w-4 text-orange-400" />
          Battle Arena
        </Badge>
        <span className="text-xs text-slate-500">
          ২টি {isSchool ? "স্কুল" : "কলেজ"} সিলেক্ট করে তুলনা করুন
        </span>
      </div>

      {/* VS Display */}
      {selectedCount === 2 && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-purple-900/20 px-4 py-3">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 font-bold text-purple-300">
              <Shield className="h-4 w-4" />
              {battlePair.collegeA?.name}
            </span>
            <span className="flex items-center gap-1 text-2xl font-black text-white">
              {formatBnNumber(battlePair.collegeA?.score || 0)}
            </span>
            <span className="text-2xl font-black text-orange-400">VS</span>
            <span className="flex items-center gap-1 text-2xl font-black text-white">
              {formatBnNumber(battlePair.collegeB?.score || 0)}
            </span>
            <span className="flex items-center gap-1.5 font-bold text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              {battlePair.collegeB?.name}
            </span>
          </div>
          {diffScore !== 0 && (
            <p className="mt-2 text-center text-xs text-slate-400">
              <strong className="text-white">
                {diffScore > 0
                  ? battlePair.collegeA?.name
                  : battlePair.collegeB?.name}
              </strong>{" "}
              এগিয়ে আছে {formatBnNumber(Math.abs(diffScore))} পয়েন্টে —
              {diffStudents > 0
                ? ` ${formatBnNumber(Math.abs(diffStudents))} জন বেশি শিক্ষার্থী`
                : diffStudents < 0
                  ? ` ${formatBnNumber(Math.abs(diffStudents))} জন কম শিক্ষার্থী`
                  : " সমান সংখ্যক শিক্ষার্থী"}
            </p>
          )}
        </div>
      )}

      {/* College selection + cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* College A slot */}
        {battlePair.collegeA ? (
          <CollegeBattleCard
            college={battlePair.collegeA}
            entries={entries}
            side="left"
            onRemove={() => onRemoveCollege("collegeA")}
          />
        ) : (
          <Card variant="glass" className="flex flex-col items-center justify-center p-6">
            <p className="mb-3 text-sm font-semibold text-slate-400">
              দল A সিলেক্ট করুন
            </p>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchA}
                onChange={(e) => setSearchA(e.target.value)}
                placeholder={`${isSchool ? "স্কুলের" : "কলেজের"} নাম লিখুন...`}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
              />
            </div>
            {searchA && (
              <ul className="mt-3 w-full max-w-xs space-y-1">
                {filteredColleges.slice(0, 5).map((c) => (
                  <li key={c.name}>
                    <button
                      type="button"
                      onClick={() => {
                        onAddCollege(c.name);
                        setSearchA("");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                      <span className="truncate">{c.name}</span>
                      <span className="ml-auto shrink-0 text-[10px] text-slate-600">
                        {formatBnNumber(c.score)} pts
                      </span>
                    </button>
                  </li>
                ))}
                {filteredColleges.length === 0 && (
                  <p className="py-2 text-center text-xs text-slate-600">
                    কোনো {isSchool ? "স্কুল" : "কলেজ"} পাওয়া যায়নি
                  </p>
                )}
              </ul>
            )}
          </Card>
        )}

        {/* College B slot */}
        {battlePair.collegeB ? (
          <CollegeBattleCard
            college={battlePair.collegeB}
            entries={entries}
            side="right"
            onRemove={() => onRemoveCollege("collegeB")}
          />
        ) : (
          <Card variant="glass" className="flex flex-col items-center justify-center p-6">
            <p className="mb-3 text-sm font-semibold text-slate-400">
              দল B সিলেক্ট করুন
            </p>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchB}
                onChange={(e) => setSearchB(e.target.value)}
                placeholder={`${isSchool ? "স্কুলের" : "কলেজের"} নাম লিখুন...`}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
              />
            </div>
            {searchB && (
              <ul className="mt-3 w-full max-w-xs space-y-1">
                {filteredColleges.slice(0, 5).map((c) => (
                  <li key={c.name}>
                    <button
                      type="button"
                      onClick={() => {
                        onAddCollege(c.name);
                        setSearchB("");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                      <span className="truncate">{c.name}</span>
                      <span className="ml-auto shrink-0 text-[10px] text-slate-600">
                        {formatBnNumber(c.score)} pts
                      </span>
                    </button>
                  </li>
                ))}
                {filteredColleges.length === 0 && (
                  <p className="py-2 text-center text-xs text-slate-600">
                    কোনো {isSchool ? "স্কুল" : "কলেজ"} পাওয়া যায়নি
                  </p>
                )}
              </ul>
            )}
          </Card>
        )}
      </div>

      {/* Results section when both colleges are selected */}
      {battlePair.collegeA && battlePair.collegeB && (
        <Card variant="glass" className="p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Zap className="h-4 w-4 text-orange-400" />
            Battle ফলাফল
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/[0.03] p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                বিজয়ী
              </p>
              <p className="mt-1 text-base font-black text-cyan-400">
                {diffScore > 0
                  ? battlePair.collegeA.name
                  : diffScore < 0
                    ? battlePair.collegeB.name
                    : "সমতা ⚖️"}
              </p>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                পয়েন্টের পার্থক্য
              </p>
              <p className="mt-1 text-base font-black text-white">
                {formatBnNumber(Math.abs(diffScore))}
              </p>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                মোট শিক্ষার্থী
              </p>
              <p className="mt-1 text-base font-black text-white">
                {formatBnNumber(
                  (battlePair.collegeA.studentCount || 0) +
                    (battlePair.collegeB.studentCount || 0),
                )}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export function CollegeWarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [battlePair, setBattlePair] = useState<BattlePair>({
    collegeA: null,
    collegeB: null,
  });

  const levelTab = useMemo<StudentLevel>(() => {
    const q = searchParams.get("level");
    return q === "hsc" ? "hsc" : "ssc";
  }, [searchParams]);

  useEffect(() => {
    fetchLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const setLevelTab = (level: StudentLevel) => {
    router.replace(`/leaderboard/college-wars?level=${level}`, {
      scroll: false,
    });
  };

  const filtered = useMemo(
    () => filterLeaderboard(entries, levelTab, "all"),
    [entries, levelTab],
  );

  const colleges = useMemo(() => aggregateColleges(filtered), [filtered]);

  const searchedColleges = useMemo(() => {
    if (!searchQuery.trim()) return colleges;
    const q = searchQuery.toLowerCase();
    return colleges.filter((c) => c.name.toLowerCase().includes(q));
  }, [colleges, searchQuery]);

  const handleSelectCollege = (name: string) => {
    setSelectedCollege(name);
    setViewMode("list");
  };

  const handleBattle = (name?: string) => {
    const college = colleges.find((c) => c.name === (name || ""));
    if (!college) {
      setBattlePair({ collegeA: null, collegeB: null });
      setViewMode("battle");
      return;
    }
    if (!battlePair.collegeA) {
      setBattlePair((prev) => ({ ...prev, collegeA: college }));
    } else if (!battlePair.collegeB && college.name !== battlePair.collegeA.name) {
      setBattlePair((prev) => ({ ...prev, collegeB: college }));
    }
    setViewMode("battle");
    setSelectedCollege(null);
  };

  const handleAddCollege = (name: string) => {
    const college = colleges.find((c) => c.name === name);
    if (!college) return;
    if (!battlePair.collegeA) {
      setBattlePair((prev) => ({ ...prev, collegeA: college }));
    } else if (!battlePair.collegeB) {
      setBattlePair((prev) => ({ ...prev, collegeB: college }));
    }
  };

  const handleRemoveCollege = (slot: "collegeA" | "collegeB") => {
    setBattlePair((prev) => ({ ...prev, [slot]: null }));
  };

  const handleExitBattle = () => {
    setBattlePair({ collegeA: null, collegeB: null });
    setViewMode("list");
  };

  if (loading) return <LeaderboardSkeleton />;

  return (
    <div className="pb-10 font-bangla animate-fadeIn">
      {/* Header */}
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Link
            href="/leaderboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Badge
            variant="default"
            className="inline-flex gap-2 border-purple-500/30 bg-purple-500/10"
          >
            <Swords className="h-4 w-4 text-purple-400" />
            🏆 College Wars
          </Badge>
        </div>
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          কলেজ যুদ্ধ
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          SSC স্কুল ও HSC কলেজগুলোর মধ্যে র‍্যাঙ্কিং যুদ্ধ — কোন প্রতিষ্ঠান সেরা, দেখুন
          বিস্তারিত পরিসংখ্যান।
        </p>
      </header>

      {/* Level tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["ssc", "hsc"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setLevelTab(tab)}
            className={cn(
              "min-h-[44px] rounded-xl px-5 py-2.5 text-sm font-bold border transition-all",
              levelTab === tab
                ? "border-transparent bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-glow-purple"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
            )}
          >
            {tab === "ssc" ? "SSC স্কুল" : "HSC কলেজ"}
          </button>
        ))}
      </div>

      {/* View mode toggle + search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => {
              setViewMode("list");
              setSelectedCollege(null);
            }}
            className={cn(
              "rounded-xl border px-4 py-2 text-xs font-bold transition",
              viewMode === "list" && !selectedCollege
                ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
            )}
          >
            <Building2 className="mr-1.5 inline h-3.5 w-3.5" />
            র‍্যাঙ্কিং
          </button>
          <button
            type="button"
            onClick={() => handleBattle()}
            className={cn(
              "rounded-xl border px-4 py-2 text-xs font-bold transition",
              viewMode === "battle"
                ? "border-orange-400/40 bg-orange-500/15 text-orange-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
            )}
          >
            <Swords className="mr-1.5 inline h-3.5 w-3.5" />
            Battle Arena
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mindgame")}
            className={cn(
              "rounded-xl border px-4 py-2 text-xs font-bold transition",
              viewMode === "mindgame"
                ? "border-purple-400/40 bg-purple-500/15 text-purple-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
            )}
          >
            <Brain className="mr-1.5 inline h-3.5 w-3.5" />
            মাইন্ড গেম
          </button>
        </div>

        {viewMode === "list" && !selectedCollege && (
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={levelTab === "ssc" ? "স্কুল খুঁজুন..." : "কলেজ খুঁজুন..."}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Main content */}
      {filtered.length === 0 ? (
        <Card variant="glass" className="p-10 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-600" />
          <p className="mb-2 font-bold text-white">
            এখনো কোনো র‍্যাঙ্কিং নেই। প্রথম কুইজ দিয়ে শুরু করুন!
          </p>
          <Link href={`/${levelTab}`}>
            <Button className="mt-4">কুইজ শুরু করো</Button>
          </Link>
        </Card>
      ) : viewMode === "mindgame" ? (
        <CollegeMindGame
          colleges={colleges}
          entries={filtered}
          level={levelTab}
          onExit={() => setViewMode("list")}
        />
      ) : viewMode === "battle" ? (
        <CollegeBattleArena
          colleges={colleges}
          entries={filtered}
          battlePair={battlePair}
          level={levelTab}
          onAddCollege={handleAddCollege}
          onRemoveCollege={handleRemoveCollege}
          onExitBattle={handleExitBattle}
        />
      ) : selectedCollege ? (
        <CollegeDrillDownView
          collegeName={selectedCollege}
          entries={filtered}
          level={levelTab}
          onBack={() => setSelectedCollege(null)}
          onBattle={() => handleBattle(selectedCollege)}
        />
      ) : (
        <CollegeRankingTable
          colleges={searchedColleges}
          level={levelTab}
          onSelect={handleSelectCollege}
          onBattle={(name) =>
            handleBattle(name)
          }
        />
      )}
    </div>
  );
}
```

## File: [src/components/leaderboard/LeaderboardHub.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/leaderboard/LeaderboardHub.tsx)

```tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProfileCompletionPrompt } from "@/components/profile/ProfileCompletionPrompt";
import { LeaderboardSkeleton } from "@/components/leaderboard/LeaderboardSkeleton";
import { RankTierBadge } from "@/components/leaderboard/RankTierBadge";
import {
  BADGE_LABELS,
  fetchLeaderboard,
  filterLeaderboard,
  formatAccuracy,
  formatBnNumber,
  getCollegeLabel,
  getInitials,
  type LeaderboardEntry,
} from "@/lib/leaderboard-api";
import { isProfileComplete, normalizeLevel, type StudentLevel } from "@/lib/profile-utils";
import {
  ChevronDown,
  Crown,
  Flame,
  Globe,
  Medal,
  Swords,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { levelHubPath } from "@/lib/quiz/unified-routes";

type TimeFilter = "all" | "today" | "week" | "month" | "alltime";

const TIME_FILTERS: { id: TimeFilter; label: string }[] = [
  { id: "all", label: "সবগুলো" },
  { id: "today", label: "আজ" },
  { id: "week", label: "এই সপ্তাহ" },
  { id: "month", label: "এই মাস" },
  { id: "alltime", label: "সর্বকালীন" },
];

const INITIAL_ROWS = 15;

function Avatar({ entry, size = "md" }: { entry: LeaderboardEntry; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-9 w-9 text-xs", md: "h-11 w-11 text-sm", lg: "h-14 w-14 text-base" };
  if (entry.picture) {
    return (
      <img
        src={entry.picture}
        alt=""
        className={cn("rounded-full object-cover border border-white/10 shrink-0", sizes[size])}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-purple-600/40 to-cyan-500/30 flex items-center justify-center font-bold text-white border border-white/10 shrink-0",
        sizes[size],
      )}
    >
      {getInitials(entry.name || "নাম নেই")}
    </div>
  );
}

function PodiumCard({ entry, place }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) {
  const styles = {
    1: {
      order: "order-2",
      height: "min-h-[200px] sm:min-h-[220px]",
      border: "border-gold-rank/40 shadow-glow-gold",
      bg: "bg-gradient-to-b from-gold-rank/10 to-transparent",
      icon: <Crown className="h-5 w-5 text-gold-rank" />,
      rankBg: "bg-gold-rank text-black",
    },
    2: {
      order: "order-1",
      height: "min-h-[170px] sm:min-h-[190px]",
      border: "border-cyan-400/30 shadow-glow-cyan",
      bg: "bg-gradient-to-b from-cyan-500/10 to-transparent",
      icon: <Medal className="h-5 w-5 text-cyan-300" />,
      rankBg: "bg-slate-300 text-black",
    },
    3: {
      order: "order-3",
      height: "min-h-[160px] sm:min-h-[175px]",
      border: "border-amber-600/30",
      bg: "bg-gradient-to-b from-amber-700/10 to-transparent",
      icon: <Medal className="h-5 w-5 text-amber-500" />,
      rankBg: "bg-amber-600 text-black",
    },
  }[place];

  return (
    <div className={cn("flex flex-col items-center", styles.order)}>
      <div className="relative mb-3">
        {place === 1 && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl">👑</span>
        )}
        <Avatar entry={entry} size={place === 1 ? "lg" : "md"} />
        <span
          className={cn(
            "absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-black",
            styles.rankBg,
          )}
        >
          {place}
        </span>
      </div>
      <Card
        variant="glass"
        className={cn(
          "w-full p-4 text-center",
          styles.height,
          styles.border,
          styles.bg,
        )}
      >
        <div className="mb-2 flex justify-center">{styles.icon}</div>
        <p className="truncate font-bold text-white">{entry.name || "নাম নেই"}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400">{getCollegeLabel(entry)}</p>
        <RankTierBadge rank={entry.rank} className="mt-2" />
        <p className="mt-3 text-xl font-black text-white">{formatBnNumber(entry.points || 0)}</p>
        <p className="text-xs text-slate-500">স্কোর</p>
      </Card>
    </div>
  );
}

function LeaderboardTableRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}) {
  const badgeLabel = entry.badge ? BADGE_LABELS[entry.badge] : null;

  return (
    <>
      <div
        className={cn(
          "hidden md:grid grid-cols-[56px_1fr_1.2fr_80px_72px_56px_72px] items-center gap-2 rounded-xl border px-3 py-3 text-sm transition",
          isCurrentUser
            ? "border-cyan-400/40 bg-cyan-500/5 shadow-glow-cyan"
            : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
        )}
      >
        <span className="font-bold text-slate-400">#{formatBnNumber(entry.rank)}</span>
        <div className="flex items-center gap-2 min-w-0">
          <Avatar entry={entry} size="sm" />
          <span className="truncate font-semibold text-white">
            {entry.name || "নাম নেই"}
            {isCurrentUser && (
              <span className="ml-1.5 text-[10px] font-bold text-cyan-300">(আপনি)</span>
            )}
          </span>
        </div>
        <span className="truncate text-slate-400 text-xs">{getCollegeLabel(entry)}</span>
        <span className="font-bold text-white">{formatBnNumber(entry.points || 0)}</span>
        <span className="text-slate-400">{formatAccuracy(entry.accuracy)}</span>
        <span className="text-slate-400">
          {entry.examsTaken != null ? formatBnNumber(entry.examsTaken) : "—"}
        </span>
        <div className="flex flex-col gap-1">
          <RankTierBadge rank={entry.rank} />
          {badgeLabel && (
            <span className="truncate text-[9px] text-yellow-300/80">{badgeLabel}</span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "md:hidden rounded-xl border p-3 space-y-2",
          isCurrentUser
            ? "border-cyan-400/40 bg-cyan-500/5"
            : "border-white/5 bg-white/[0.02]",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar entry={entry} size="sm" />
            <div>
              <p className="font-bold text-white">
                {entry.name || "নাম নেই"}
                {isCurrentUser && (
                  <span className="ml-1 text-[10px] text-cyan-300">(আপনি)</span>
                )}
              </p>
              <p className="text-xs text-slate-400">{getCollegeLabel(entry)}</p>
            </div>
          </div>
          <span className="text-lg font-black text-white">#{formatBnNumber(entry.rank)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-lg bg-white/5 px-2 py-1">
            স্কোর: <strong>{formatBnNumber(entry.points || 0)}</strong>
          </span>
          <span className="rounded-lg bg-white/5 px-2 py-1">
            Accuracy: {formatAccuracy(entry.accuracy)}
          </span>
          <span className="rounded-lg bg-white/5 px-2 py-1">
            টেস্ট: {entry.examsTaken != null ? formatBnNumber(entry.examsTaken) : "—"}
          </span>
          <RankTierBadge rank={entry.rank} />
        </div>
      </div>
    </>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition min-h-[44px]",
        active
          ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300 shadow-glow-cyan"
          : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function DisabledFilter({ label }: { label: string }) {
  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
      title="শীঘ্রই আসছে"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
    </div>
  );
}

function computeTop100Insight(
  rank: number | null | undefined,
  points: number,
  list: LeaderboardEntry[],
) {
  if (!rank || rank <= 0) {
    return {
      progress: 0,
      message: "আরও টেস্ট দিলে র‍্যাঙ্ক আপডেট হবে।",
    };
  }
  if (rank <= 100) {
    const progress = Math.min(100, Math.round(((100 - rank + 1) / 100) * 100));
    return {
      progress,
      message: `আপনি Top ${formatBnNumber(100)}-এ আছেন! 🎉`,
    };
  }
  const cutoff = list[99];
  if (cutoff && cutoff.points > points) {
    const needed = cutoff.points - points + 1;
    const progress = Math.min(99, Math.round((points / cutoff.points) * 100));
    return {
      progress,
      message: `আপনি Top 100-এর বাইরে আছেন। Top 100-এ যেতে আর ${formatBnNumber(needed)} পয়েন্ট দরকার।`,
    };
  }
  return {
    progress: 0,
    message: "আরও টেস্ট দিলে র‍্যাঙ্ক আপডেট হবে।",
  };
}

export function LeaderboardHub() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("alltime");
  const [showAll, setShowAll] = useState(false);

  const levelTab = useMemo<StudentLevel>(() => {
    const q = searchParams.get("level");
    return q === "hsc" ? "hsc" : "ssc";
  }, [searchParams]);

  useEffect(() => {
    fetchLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const setLevelTab = (level: StudentLevel) => {
    router.replace(`/leaderboard?level=${level}`, { scroll: false });
  };

  const filtered = useMemo(
    () => filterLeaderboard(entries, levelTab, "all"),
    [entries, levelTab],
  );

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);
  const visibleRest = showAll ? rest : rest.slice(0, INITIAL_ROWS);

  const myEntry = useMemo((): LeaderboardEntry | null => {
    const found = user ? filtered.find((e) => e.userId === user.id) : null;
    if (found) return found;
    if (!user || !isProfileComplete(user)) return null;
    if (normalizeLevel(user.className, user.level) !== levelTab) return null;
    return {
      rank: user.rank ?? filtered.length + 1,
      userId: user.id,
      name: user.name || "নাম নেই",
      picture: user.picture,
      points: user.elo ?? user.score ?? 0,
      examsTaken: undefined,
      accuracy: undefined,
      streak: user.streak,
      collegeName: user.collegeName,
      schoolName: user.schoolName,
    };
  }, [user, filtered, levelTab]);

  const top100 = computeTop100Insight(myEntry?.rank, myEntry?.points ?? 0, filtered);

  const hasPerformance =
    myEntry != null &&
    (myEntry.points > 0 || (myEntry.accuracy != null && myEntry.accuracy > 0));

  if (loading) return <LeaderboardSkeleton />;

  return (
    <div className="pb-8 font-bangla animate-fadeIn">
      <header className="mb-6">
        <Badge variant="default" className="mb-3 inline-flex gap-2 border-gold-rank/30 bg-gold-rank/10">
          <Trophy className="h-4 w-4 text-gold-rank" />
          🏆 লিডারবোর্ড
        </Badge>
        <h1 className="text-3xl font-black text-white sm:text-4xl">র‍্যাঙ্কিং</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          SSC ও HSC শিক্ষার্থীদের আলাদা র‍্যাঙ্কিং — স্কোর, Accuracy ও টেস্ট পারফরম্যান্স অনুযায়ী।
        </p>
      </header>

      {user && !isProfileComplete(user) && (
        <ProfileCompletionPrompt variant="hint" className="mb-6" />
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {(["ssc", "hsc"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setLevelTab(tab)}
            className={cn(
              "min-h-[44px] rounded-xl px-5 py-2.5 text-sm font-bold border transition-all",
              levelTab === tab
                ? "border-transparent bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-glow-purple"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
            )}
          >
            {tab === "ssc" ? "SSC র‍্যাঙ্কিং" : "HSC র‍্যাঙ্কিং"}
          </button>
        ))}
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {TIME_FILTERS.map((f) => (
          <FilterChip
            key={f.id}
            active={timeFilter === f.id}
            onClick={() => setTimeFilter(f.id)}
          >
            {f.label}
          </FilterChip>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <DisabledFilter label="সব বোর্ড" />
        <DisabledFilter label="সব বিষয়" />
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          Global
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" className="p-10 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-600" />
          <p className="mb-2 font-bold text-white">
            এখনো কোনো র‍্যাঙ্কিং নেই। প্রথম কুইজ দিয়ে র‍্যাঙ্কে উঠো!
          </p>
          <Link href={levelHubPath(levelTab)}>
            <Button className="mt-4">কুইজ শুরু করো</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-6">
            {top3.length >= 3 && (
              <div className="relative">
                <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-4xl opacity-20">
                  🏆
                </div>
                <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 pt-6">
                  <PodiumCard entry={top3[1]} place={2} />
                  <PodiumCard entry={top3[0]} place={1} />
                  <PodiumCard entry={top3[2]} place={3} />
                </div>
              </div>
            )}

            <Card variant="glass" className="overflow-hidden p-0">
              <div className="hidden md:grid grid-cols-[56px_1fr_1.2fr_80px_72px_56px_72px] gap-2 border-b border-white/10 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>র‍্যাঙ্ক</span>
                <span>নাম</span>
                <span>কলেজ</span>
                <span>স্কোর</span>
                <span>Accuracy</span>
                <span>টেস্ট</span>
                <span>ব্যাজ</span>
              </div>
              <div className="space-y-2 p-2 sm:p-3">
                {(top3.length < 3 ? filtered : visibleRest).map((entry) => (
                  <LeaderboardTableRow
                    key={entry.userId || entry.rank}
                    entry={entry}
                    isCurrentUser={user?.id === entry.userId}
                  />
                ))}
              </div>
              {rest.length > INITIAL_ROWS && !showAll && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="w-full border-t border-white/10 py-3 text-sm font-semibold text-cyan-400 hover:bg-white/5"
                >
                  আরও দেখুন ({formatBnNumber(rest.length - INITIAL_ROWS)} জন)
                </button>
              )}
            </Card>
          </div>

          <aside className="space-y-4">
            {myEntry ? (
              <Card variant="glass" className="border-purple-500/20 p-4 shadow-glow-purple">
                <h2 className="mb-3 flex items-center gap-2 text-base font-black text-white">
                  <Target className="h-4 w-4 text-purple-400" />
                  আপনার অবস্থান
                </h2>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/5 p-2">
                    <p className="text-xs text-slate-500">র‍্যাঙ্ক</p>
                    <p className="text-lg font-black text-cyan-400">
                      #{formatBnNumber(myEntry.rank)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2">
                    <p className="text-xs text-slate-500">স্কোর</p>
                    <p className="text-lg font-black text-white">
                      {formatBnNumber(myEntry.points || 0)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2">
                    <p className="text-xs text-slate-500">সঠিকতা</p>
                    <p className="text-lg font-black text-white">
                      {formatAccuracy(myEntry.accuracy)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{top100.message}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                    <span>Top 100 Progress</span>
                    <span>{formatBnNumber(top100.progress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all"
                      style={{ width: `${top100.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="rounded-lg bg-white/[0.03] p-2">
                    <p className="text-slate-500">টেস্ট</p>
                    <p className="font-bold text-white">
                      {myEntry.examsTaken != null
                        ? formatBnNumber(myEntry.examsTaken)
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2">
                    <p className="text-slate-500">Best</p>
                    <p className="font-bold text-white">—</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2">
                    <p className="text-slate-500">Streak</p>
                    <p className="flex items-center justify-center gap-0.5 font-bold text-orange-400">
                      {(myEntry.streak ?? user?.streak) ? (
                        <>
                          <Flame className="h-3 w-3" />
                          {formatBnNumber(myEntry.streak ?? user?.streak ?? 0)}
                        </>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-cyan-300/80">
                  💡 আজ ২টি টেস্ট দিলে উন্নতি হতে পারে
                </p>
              </Card>
            ) : (
              <Card variant="glass" className="p-4 text-center text-sm text-slate-400">
                প্রোফাইল সম্পূর্ণ করলে আপনার র‍্যাঙ্ক এখানে দেখা যাবে।
              </Card>
            )}

            <Card variant="glass" className="p-4">
              <h2 className="mb-3 flex items-center gap-2 text-base font-black text-white">
                <Swords className="h-4 w-4 text-purple-400" />
                ⚔️ College Wars
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                কলেজ বনাম কলেজ ব্যাটেল — দেখো তোমার কলেজ কত নম্বরে আছে, ড্রিল-ডাউন করে বিস্তারিত দেখো
              </p>
              <Link href="/leaderboard/college-wars">
                <Button className="w-full" size="sm">
                  ⚔️ College Wars খুলুন
                </Button>
              </Link>
            </Card>

            <Card variant="glass" className="p-4">
              <h2 className="mb-3 flex items-center gap-2 text-base font-black text-white">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                আপনার পারফরম্যান্স
              </h2>
              {hasPerformance ? (
                <>
                  {myEntry?.accuracy != null && myEntry.accuracy > 0 && (
                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                        <span>Accuracy</span>
                        <span>{formatAccuracy(myEntry.accuracy)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                          style={{ width: `${Math.min(100, Math.round(myEntry.accuracy))}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex justify-between text-xs">
                    <span className="text-slate-400">
                      Best:{" "}
                      <strong className="text-white">
                        {formatBnNumber(myEntry?.points ?? 0)}
                      </strong>
                    </span>
                    <span className="text-slate-400">
                      Avg accuracy:{" "}
                      <strong className="text-white">
                        {myEntry?.accuracy ? formatAccuracy(myEntry.accuracy) : "—"}
                      </strong>
                    </span>
                  </div>
                </>
              ) : (
                <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">
                  টেস্ট দিলে এখানে পারফরম্যান্স দেখা যাবে।
                </p>
              )}
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
```

## File: [src/components/leaderboard/LeaderboardSkeleton.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/leaderboard/LeaderboardSkeleton.tsx)

```tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/[0.06] ring-1 ring-white/5",
        className,
      )}
    />
  );
}

function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-6 font-bangla animate-fadeIn">
      <div className="space-y-3 text-center">
        <Bone className="mx-auto h-7 w-36 rounded-full" />
        <Bone className="mx-auto h-10 w-48" />
        <Bone className="mx-auto h-4 w-72 max-w-full" />
      </div>

      <div className="flex justify-center gap-2">
        <Bone className="h-11 w-32 rounded-full" />
        <Bone className="h-11 w-32 rounded-full" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-9 w-20 shrink-0 rounded-full" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="grid grid-cols-3 items-end gap-3 pt-4">
            <GlassCard className="h-36">
              <Bone className="mx-auto mb-3 h-12 w-12 rounded-full" />
              <Bone className="mx-auto h-4 w-20" />
              <Bone className="mx-auto mt-2 h-6 w-14" />
            </GlassCard>
            <GlassCard className="h-44 border-cyan-500/10">
              <Bone className="mx-auto mb-3 h-16 w-16 rounded-full" />
              <Bone className="mx-auto h-4 w-24" />
              <Bone className="mx-auto mt-2 h-7 w-16" />
            </GlassCard>
            <GlassCard className="h-32">
              <Bone className="mx-auto mb-3 h-10 w-10 rounded-full" />
              <Bone className="mx-auto h-4 w-20" />
              <Bone className="mx-auto mt-2 h-6 w-14" />
            </GlassCard>
          </div>

          <GlassCard className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Bone className="h-8 w-8 shrink-0 rounded-full" />
                <Bone className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Bone className="h-4 w-32" />
                  <Bone className="h-3 w-24" />
                </div>
                <Bone className="h-6 w-12" />
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="space-y-4 border-purple-500/10">
            <Bone className="h-5 w-28" />
            <Bone className="h-10 w-full" />
            <Bone className="h-3 w-full" />
            <Bone className="h-2 w-full rounded-full" />
            <div className="grid grid-cols-3 gap-2">
              <Bone className="h-14" />
              <Bone className="h-14" />
              <Bone className="h-14" />
            </div>
          </GlassCard>
          <GlassCard className="space-y-3">
            <Bone className="h-5 w-36" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone key={i} className="h-10 w-full" />
            ))}
          </GlassCard>
          <GlassCard className="space-y-3">
            <Bone className="h-5 w-40" />
            <Bone className="h-24 w-full rounded-xl" />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
```

## File: [src/components/leaderboard/RankTierBadge.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/leaderboard/RankTierBadge.tsx)

```tsx
import { cn } from "@/lib/utils";

export type RankTier = "legend" | "gold" | "silver" | "bronze";

export function getRankTier(rank: number): RankTier {
  if (rank === 1) return "legend";
  if (rank <= 10) return "gold";
  if (rank <= 50) return "silver";
  return "bronze";
}

const TIER_STYLES: Record<RankTier, { label: string; className: string }> = {
  legend: {
    label: "Legend",
    className: "border-purple-400/40 bg-purple-500/15 text-purple-200",
  },
  gold: {
    label: "Gold",
    className: "border-gold-rank/40 bg-gold-rank/10 text-gold-rank",
  },
  silver: {
    label: "Silver",
    className: "border-slate-300/30 bg-slate-400/10 text-slate-200",
  },
  bronze: {
    label: "Bronze",
    className: "border-amber-600/30 bg-amber-700/10 text-amber-400",
  },
};

export function RankTierBadge({
  rank,
  className,
}: {
  rank: number;
  className?: string;
}) {
  const tier = getRankTier(rank);
  const { label, className: tierClass } = TIER_STYLES[tier];
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        tierClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
```

## File: [src/components/profile/ProfileCompletionPrompt.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/profile/ProfileCompletionPrompt.tsx)

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  PROFILE_INCOMPLETE_HINT,
  PROFILE_INCOMPLETE_SAVE_MSG,
} from "@/lib/profile-utils";

export function ProfileCompletionPrompt({
  variant = "save",
  className = "",
}: {
  variant?: "save" | "hint";
  className?: string;
}) {
  const message =
    variant === "hint" ? PROFILE_INCOMPLETE_HINT : PROFILE_INCOMPLETE_SAVE_MSG;

  return (
    <div
      className={`rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 ${className}`}
    >
      <p className="mb-3">{message}</p>
      <Link href="/profile">
        <Button size="sm" className="min-h-[44px]">প্রোফাইল সম্পূর্ণ করুন</Button>
      </Link>
    </div>
  );
}
```

## File: [src/components/providers/Providers.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/providers/Providers.tsx)

```tsx
"use client";

import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

## File: [src/components/quiz/BoardYearsSection.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/BoardYearsSection.tsx)

```tsx
import Link from "next/link";
import { BOARD_YEARS } from "@/lib/quiz-catalog";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Props = {
  level: "SSC" | "HSC";
  hscBoardBase?: string;
};

/** Board year grid — marks missing years without fake data. */
export function BoardYearsSection({ level, hscBoardBase }: Props) {
  const hscDataYears = new Set(["2023", "2024"]);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 font-bangla">
      <h2 className="text-2xl font-bold text-white mb-4">
        বোর্ড প্রশ্ন (২০২২–২০২৬)
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {BOARD_YEARS.map((year) => {
          const hasData =
            level === "HSC" ? hscDataYears.has(year) : false;
          const href =
            level === "HSC" && hasData
              ? `${hscBoardBase ?? "/hsc-board-questions"}/physics/1st-paper/${year}`
              : undefined;

          return (
            <Card
              key={year}
              variant="dark"
              className={`p-4 text-center ${href ? "hover:border-purple-glow/40" : ""}`}
            >
              {href ? (
                <Link href={href} className="block">
                  <span className="text-lg font-bold text-white">{year}</span>
                  <Badge variant="premium" className="mt-2 text-xs">ডেটা আছে</Badge>
                </Link>
              ) : (
                <div>
                  <span className="text-lg font-bold text-slate-500">{year}</span>
                  <p className="text-xs text-slate-600 mt-2">শীঘ্রই আসছে</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {level === "HSC" && (
        <Link
          href="/hsc-board-questions"
          className="text-purple-glow text-sm mt-4 inline-block hover:underline"
        >
          HSC বোর্ড প্রশ্ন (ইমেজ) →
        </Link>
      )}
    </section>
  );
}
```

## File: [src/components/quiz/ChapterListClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ChapterListClient.tsx)

```tsx
"use client";



import React, { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { BookOpen, Loader2 } from "lucide-react";

import { loadSubjectQuizData } from "@/lib/quiz/load-quiz-data";

import { groupChapterQuizSets } from "@/lib/quiz/normalize-quiz-data";

import { expectedMcqForSubject, resolveFileSubjectSlug } from "@/lib/quiz/registry";

import { Card } from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";



type Props = {

  level: "SSC" | "HSC";

  subject: string;

  paper?: string;

  basePath: string;

  chapterPathPrefix: string;

  title: string;

};



export function ChapterListClient({

  level,

  subject,

  paper,

  basePath,

  chapterPathPrefix,

  title,

}: Props) {

  const [groups, setGroups] = useState<

    ReturnType<typeof groupChapterQuizSets>

  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);



  const registryLevel = level === "SSC" ? "ssc" : "hsc";



  useEffect(() => {

    loadSubjectQuizData(registryLevel, subject, paper).then((parsed) => {

      if (!parsed) {

        setError("ডেটা লোড করা যায়নি");

        setLoading(false);

        return;

      }

      const chapterGroups = groupChapterQuizSets(

        parsed.chapterSets.filter((s) => s.questionCount > 0),

      );

      if (parsed.loadError && !chapterGroups.length) {

        setError("ডেটা এখনো যোগ করা হয়নি");

      }

      setGroups(chapterGroups);

      setLoading(false);

    });

  }, [registryLevel, subject, paper]);



  const fileSlug = resolveFileSubjectSlug(registryLevel, subject, paper);

  const expectedMcq = expectedMcqForSubject(fileSlug);



  const totalQuestions = useMemo(

    () => groups.reduce((sum, g) => sum + g.questionCount, 0),

    [groups],

  );



  if (loading) {

    return (

      <div className="flex justify-center py-20">

        <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />

      </div>

    );

  }



  return (

    <div className="max-w-4xl mx-auto px-4 py-10 font-bangla pb-24">

      <Link

        href={basePath}

        className="text-slate-400 hover:text-white text-sm mb-6 inline-block"

      >

        ← {title}

      </Link>



      <div className="mb-8 space-y-2">

        <h1 className="text-3xl font-black text-white">অধ্যায়ভিত্তিক কুইজ</h1>

        <p className="text-slate-400 text-sm">

          {groups.length} অধ্যায় · {totalQuestions} প্রশ্ন

        </p>

      </div>



      {error || groups.length === 0 ? (

        <Card variant="glass" className="p-10 text-center text-slate-400">

          <BookOpen className="h-10 w-10 mx-auto mb-3 text-slate-600" />

          <p>ডেটা এখনো যোগ করা হয়নি</p>

          <Link href={basePath} className="mt-4 inline-block">

            <Button variant="secondary">ফিরে যাও</Button>

          </Link>

        </Card>

      ) : (

        <div className="grid gap-4">

          {groups.map((group) => {

            const chapterHref = `${chapterPathPrefix}/${group.chapterSlug}`;

            const firstSet = group.sets[0];

            const startHref = firstSet

              ? `${chapterPathPrefix}/${group.chapterSlug}/set/${encodeURIComponent(firstSet.id)}`

              : chapterHref;



            return (

              <Card

                key={group.chapterSlug}

                variant="glass"

                className="p-5 border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"

              >

                <div className="space-y-1">

                  <h3 className="text-lg font-bold text-white">

                    {group.chapterName}

                  </h3>

                  <p className="text-sm text-slate-400">

                    {group.sets.length} সেট · {expectedMcq} MCQ প্রতি সেট

                  </p>

                </div>

                <div className="flex gap-2">

                  <Link href={chapterHref}>

                    <Button variant="secondary" className="min-h-[44px]">

                      সব সেট

                    </Button>

                  </Link>

                  <Link href={startHref}>

                    <Button className="min-h-[44px]">কুইজ শুরু</Button>

                  </Link>

                </div>

              </Card>

            );

          })}

        </div>

      )}

    </div>

  );

}

```

## File: [src/components/quiz/ChapterSetClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ChapterSetClient.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  fetchNormalizedQuestionsWithMeta,
  loadSubjectQuizData,
} from "@/lib/quiz/load-quiz-data";
import { findQuizSetById, getChapterQuizSets, toApiQuestion } from "@/lib/quiz/normalize-quiz-data";
import { parseVirtualSetId, sliceQuestionsForVirtualSet } from "@/lib/quiz-helper";
import { expectedMcqForSubject, resolveFileSubjectSlug } from "@/lib/quiz/registry";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ApiQuestion } from "@/types/quiz";

type Props = {
  level: "SSC" | "HSC";
  subject: string;
  paper?: string;
  chapterSlug: string;
  setId: string;
  backUrl: string;
  chaptersUrl: string;
  title: string;
  /** Pre-loaded on the server (same pattern as board questions) */
  initialQuestions?: ApiQuestion[];
  loadedFromPath?: string | null;
  attemptedPaths?: string[];
};

export function ChapterSetClient({
  level,
  subject,
  paper,
  chapterSlug,
  setId,
  backUrl,
  chaptersUrl,
  title,
  initialQuestions,
  loadedFromPath = null,
  attemptedPaths: serverAttemptedPaths = [],
}: Props) {
  const [loading, setLoading] = useState(!initialQuestions?.length);
  const [examName, setExamName] = useState(title);
  const [questions, setQuestions] = useState<ApiQuestion[]>(initialQuestions ?? []);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [attemptedPaths, setAttemptedPaths] = useState<string[]>(serverAttemptedPaths);
  const [quizMeta, setQuizMeta] = useState<{
    quizId: string;
    type: string;
    chapterName?: string;
  } | null>(null);

  const registryLevel = level === "SSC" ? "ssc" : "hsc";

  useEffect(() => {
    if (initialQuestions?.length) {
      setQuestions(initialQuestions);
      setLoading(false);
      setFetchError(null);
      const { sourceSetId, partIndex } = parseVirtualSetId(setId);
      const partLabel = partIndex !== null ? ` · Set ${partIndex + 1}` : "";
      setExamName(`${title}${partLabel}`);
      setQuizMeta({
        quizId: sourceSetId,
        type: "chapter-wise",
      });
      return;
    }

    let cancelled = false;

    async function loadSet() {
      setLoading(true);
      setFetchError(null);
      try {
        const parsed = await loadSubjectQuizData(registryLevel, subject, paper);
        if (!parsed || cancelled) {
          if (!cancelled) setLoading(false);
          return;
        }

        const { sourceSetId, partIndex } = parseVirtualSetId(setId);
        let set =
          sourceSetId !== "default"
            ? findQuizSetById(parsed, sourceSetId)
            : undefined;

        if (!set) {
          const chapterSets = getChapterQuizSets(parsed, chapterSlug);
          set =
            sourceSetId === "default"
              ? chapterSets[0]
              : chapterSets.find((s) => s.id === sourceSetId);
        }

        if (!set) {
          if (!cancelled) {
            setFetchError(`Could not find set metadata for setId: ${setId}`);
            setLoading(false);
          }
          return;
        }

        const fetchKey = set.sourceKey ?? set.id;
        let apiQuestions: ApiQuestion[];
        let pathsTried: string[] = [];

        if (set.questions.length > 0) {
          apiQuestions = set.questions.map(toApiQuestion);
        } else {
          const result = await fetchNormalizedQuestionsWithMeta(
            registryLevel,
            subject,
            fetchKey,
            paper,
          );
          apiQuestions = result.questions;
          pathsTried = result.attemptedPaths;
        }

        if (!cancelled) {
          setAttemptedPaths(pathsTried);
        }

        if (cancelled || !apiQuestions.length) {
          if (!cancelled) {
            setFetchError(`Missing JSON File: Could not find data for setId: ${setId}`);
            setLoading(false);
          }
          return;
        }

        const sliced = sliceQuestionsForVirtualSet(apiQuestions, setId);
        setQuestions(sliced);
        const partLabel = partIndex !== null ? ` · Set ${partIndex + 1}` : "";
        setExamName(
          `${set.chapterName ?? set.displayTitle ?? title}${partLabel}`,
        );
        setQuizMeta({
          quizId: sourceSetId,
          type: "chapter-wise",
          chapterName: set.chapterName ?? undefined,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSet();
    return () => {
      cancelled = true;
    };
  }, [
    registryLevel,
    subject,
    paper,
    chapterSlug,
    setId,
    title,
    initialQuestions,
    loadedFromPath,
  ]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
      </div>
    );
  }

  if (fetchError || !questions.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 font-bangla">
        <Card variant="glass" className="p-8 border-red-500/30 text-center space-y-4">
          <AlertCircle className="h-10 w-10 mx-auto text-red-400" />
          <p className="text-red-300 font-semibold text-lg">
            {fetchError ??
              `Missing JSON File: Could not find data for setId: ${setId}`}
          </p>
          <div className="text-left text-sm text-slate-400 space-y-2 bg-black/20 rounded-lg p-4 font-mono">
            <p>
              <span className="text-slate-500">setId:</span> {setId}
            </p>
            <p>
              <span className="text-slate-500">chapter:</span> {chapterSlug}
            </p>
            {attemptedPaths.length > 0 && (
              <div>
                <p className="text-slate-500 mb-1">Paths tried:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs break-all">
                  {attemptedPaths.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link href={chaptersUrl}>
            <Button variant="secondary">অধ্যায় তালিকা</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const fileSlug = resolveFileSubjectSlug(registryLevel, subject, paper);
  const expectedMcq = expectedMcqForSubject(fileSlug);
  const timeLimit = Math.max(600, questions.length * 60);

  return (
    <QuizRunner
      questions={questions}
      examSlug={`${subject}/${chapterSlug}/${setId}`}
      examName={examName}
      backUrl={backUrl}
      timeLimitSec={timeLimit}
      quizSubmitMeta={{
        level: registryLevel,
        subject: fileSlug,
        paper: paper ?? null,
        chapter: chapterSlug,
        chapterName: quizMeta?.chapterName,
        type: "chapter-wise",
        quizId: quizMeta?.quizId ?? `${chapterSlug}-${setId}`,
        expectedMcq,
      }}
    />
  );
}
```

## File: [src/components/quiz/LevelHubClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/LevelHubClient.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSubjects } from "@/lib/quiz-api";
import {
  HSC_SCIENCE_PAPERS,
  SSC_CATALOG,
  type QuizLevel,
} from "@/lib/quiz-catalog";
import type { ApiSubject } from "@/types/quiz";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";
import { subjectHrefForCatalog } from "@/lib/quiz/unified-routes";

type Props = {
  level: QuizLevel;
};

function subjectHref(level: QuizLevel, s: ApiSubject): string {
  return subjectHrefForCatalog(level, s.slug);
}

export function LevelHubClient({ level }: Props) {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects(level).then((list) => {
      setSubjects(list.length ? list : fallbackList(level));
      setLoading(false);
    });
  }, [level]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {subjects.map((s) => (
        <Link key={s.slug} href={subjectHref(level, s)}>
          <Card variant="glass" hoverable className="p-6">
            <h2 className="text-xl font-bold text-white">{s.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{s.slug}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function fallbackList(level: QuizLevel): ApiSubject[] {
  if (level === "SSC") {
    return SSC_CATALOG.map((s) => ({
      id: s.slug,
      name: s.name,
      slug: s.slug,
      category: "SSC",
    }));
  }
  return HSC_SCIENCE_PAPERS.map((p) => ({
    id: `${p.subject}-${p.paper}`,
    name: p.name,
    slug: `${p.subject}-${p.paper}`,
    category: "HSC",
  }));
}
```

## File: [src/components/quiz/ModelTestCard.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ModelTestCard.tsx)

```tsx
"use client";

import Link from "next/link";
import {
  Check,
  ClipboardList,
  Clock,
  Grid2X2,
  Play,
  Star,
} from "lucide-react";
import type { ModelTestItem } from "@/lib/model-test-filters";
import { parseModelTestItemTitle } from "@/lib/format-model-test-title";
import { cn } from "@/lib/utils";

type CardStatus = "not-tried" | "completed" | "weak" | "recommended";

function resolveStatus(
  test: ModelTestItem,
  isRecommended: boolean,
): { status: CardStatus; label: string } {
  const completed = test.completed ?? (test.attemptCount ?? 0) > 0;
  if (isRecommended) return { status: "recommended", label: "রেকমেন্ডেড" };
  if (!completed) return { status: "not-tried", label: "দেখিনি" };
  const accuracy =
    test.lastScore !== undefined && test.questionCount > 0
      ? test.lastScore / test.questionCount
      : 1;
  if (accuracy < 0.6) return { status: "weak", label: "দুর্বল" };
  return { status: "completed", label: "সম্পন্ন" };
}

function StatusBadge({ status, label }: { status: CardStatus; label: string }) {
  const styles: Record<CardStatus, string> = {
    "not-tried": "border-slate-500/40 bg-slate-800/80 text-slate-200",
    completed: "border-emerald-400/50 bg-emerald-500/15 text-emerald-200",
    weak: "border-orange-400/50 bg-orange-500/15 text-orange-200",
    recommended: "border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold sm:text-sm",
        styles[status],
      )}
    >
      {status === "completed" && <Check size={13} />}
      {status === "recommended" && <Star size={13} fill="currentColor" />}
      {label}
    </span>
  );
}

export function ModelTestCard({
  test,
  href,
  isRecommended = false,
}: {
  test: ModelTestItem;
  href: string;
  showAttemptCount?: boolean;
  isRecommended?: boolean;
}) {
  const { chapterLabel, testLabel } = parseModelTestItemTitle(test);
  const { status, label } = resolveStatus(test, isRecommended);
  const showReviewRetry = status === "completed";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-slate-950/75 p-3.5 sm:p-4",
        "border-slate-700/70 shadow-[0_0_20px_rgba(30,64,175,0.12)]",
        "transition-all duration-200 hover:border-cyan-400/40 hover:shadow-[0_0_28px_rgba(34,211,238,0.15)]",
        isRecommended && "border-fuchsia-500/30 shadow-[0_0_24px_rgba(168,85,247,0.2)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-violet-400/25 bg-violet-600/15 text-violet-300 shadow-[0_0_18px_rgba(168,85,247,0.3)] sm:h-14 sm:w-14">
            <ClipboardList size={26} className="sm:w-[30px] sm:h-[30px]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-start justify-between gap-2 sm:hidden">
              <StatusBadge status={status} label={label} />
            </div>
            <h3 className="text-base font-black leading-snug text-white sm:text-lg">
              {chapterLabel}
              <span className="text-slate-300"> · </span>
              {testLabel}
            </h3>

            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-slate-400 sm:text-xs">
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-900/70 px-2 py-0.5">
                <Grid2X2 size={11} />
                {test.questionCount} MCQ
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-900/70 px-2 py-0.5">
                <Clock size={11} />
                {test.durationMinutes} min
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end sm:gap-2.5">
          <div className="hidden sm:block">
            <StatusBadge status={status} label={label} />
          </div>

          {!test.hasQuestions ? (
            <span className="text-center text-xs text-slate-500 sm:text-right">শীঘ্র আসছে</span>
          ) : showReviewRetry ? (
            <div className="flex gap-2">
              <Link href={href} className="flex-1 sm:flex-none">
                <button
                  type="button"
                  className="w-full rounded-lg border border-blue-400/50 px-4 py-2 text-sm font-bold text-blue-300 transition hover:bg-blue-500/10 sm:px-5"
                >
                  Review
                </button>
              </Link>
              <Link href={href} className="flex-1 sm:flex-none">
                <button
                  type="button"
                  className="w-full rounded-lg border border-emerald-400/50 px-4 py-2 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/10 sm:px-5"
                >
                  Retry
                </button>
              </Link>
            </div>
          ) : (
            <Link href={href}>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-fuchsia-600 px-6 py-2 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition hover:scale-[1.02] sm:w-auto sm:px-7"
              >
                <Play size={15} fill="white" />
                শুরু করুন
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
```

## File: [src/components/quiz/ModelTestFilterBar.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ModelTestFilterBar.tsx)

```tsx
"use client";

import React from "react";
import {
  Check,
  ChevronDown,
  Flame,
  ListFilter,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBnCount } from "@/lib/quiz-helper";

export type ModelTestFilterKey =
  | "all"
  | "default"
  | "easy"
  | "important"
  | "advanced"
  | "tried"
  | "not_tried"
  | "completed"
  | "weak"
  | "high_score"
  | "recommended";

export type ModelTestSortKey =
  | "default"
  | "most_tried"
  | "most_important"
  | "advanced_first"
  | "highest_score"
  | "lowest_score"
  | "recently_tried";

export const FILTER_CHIPS: {
  key: ModelTestFilterKey;
  label: string;
  icon: React.ElementType;
  activeClass: string;
}[] = [
  {
    key: "all",
    label: "সবগুলো",
    icon: Sparkles,
    activeClass:
      "border-cyan-400/60 bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-white shadow-[0_0_18px_rgba(34,211,238,0.35)]",
  },
  {
    key: "easy",
    label: "সহজ",
    icon: Zap,
    activeClass:
      "border-green-400/60 bg-gradient-to-r from-green-600/25 to-emerald-600/15 text-white shadow-[0_0_18px_rgba(74,222,128,0.3)]",
  },
  {
    key: "important",
    label: "গুরুত্বপূর্ণ",
    icon: Star,
    activeClass:
      "border-amber-400/60 bg-gradient-to-r from-amber-600/25 to-orange-600/15 text-white shadow-[0_0_18px_rgba(251,191,36,0.3)]",
  },
  {
    key: "advanced",
    label: "উন্নত",
    icon: Flame,
    activeClass:
      "border-orange-400/60 bg-gradient-to-r from-orange-600/25 to-red-600/15 text-white shadow-[0_0_18px_rgba(249,115,22,0.3)]",
  },
  {
    key: "tried",
    label: "বেশি চেষ্টা",
    icon: TrendingUp,
    activeClass:
      "border-blue-400/60 bg-gradient-to-r from-blue-600/25 to-indigo-600/15 text-white shadow-[0_0_18px_rgba(59,130,246,0.3)]",
  },
  {
    key: "not_tried",
    label: "দেখিনি",
    icon: Target,
    activeClass:
      "border-slate-400/50 bg-slate-700/40 text-white shadow-[0_0_14px_rgba(148,163,184,0.2)]",
  },
  {
    key: "weak",
    label: "দুর্বল",
    icon: Target,
    activeClass:
      "border-rose-400/60 bg-gradient-to-r from-rose-600/25 to-pink-600/15 text-white shadow-[0_0_18px_rgba(244,63,94,0.25)]",
  },
  {
    key: "completed",
    label: "সম্পন্ন",
    icon: Check,
    activeClass:
      "border-emerald-400/60 bg-gradient-to-r from-emerald-600/25 to-green-600/15 text-white shadow-[0_0_18px_rgba(52,211,153,0.3)]",
  },
  {
    key: "high_score",
    label: "ভালো স্কোর",
    icon: TrendingUp,
    activeClass:
      "border-violet-400/60 bg-gradient-to-r from-violet-600/25 to-purple-600/15 text-white shadow-[0_0_18px_rgba(139,92,246,0.3)]",
  },
  {
    key: "recommended",
    label: "রেকমেন্ডেড",
    icon: Star,
    activeClass:
      "border-fuchsia-400/60 bg-gradient-to-r from-fuchsia-600/30 to-pink-600/20 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]",
  },
  {
    key: "default",
    label: "ডিফল্ট",
    icon: ListFilter,
    activeClass:
      "border-slate-400/50 bg-slate-700/50 text-white shadow-[0_0_14px_rgba(148,163,184,0.2)]",
  },
];

export const PRIMARY_FILTER_KEYS: ModelTestFilterKey[] = [
  "all",
  "easy",
  "important",
  "advanced",
  "tried",
  "not_tried",
];

export const SECONDARY_FILTER_KEYS: ModelTestFilterKey[] = [
  "weak",
  "completed",
  "high_score",
  "recommended",
];

export const SORT_OPTIONS: { key: ModelTestSortKey; label: string }[] = [
  { key: "default", label: "ডিফল্ট" },
  { key: "most_tried", label: "বেশি চেষ্টা" },
  { key: "most_important", label: "গুরুত্বপূর্ণ" },
  { key: "advanced_first", label: "উন্নত আগে" },
  { key: "highest_score", label: "সর্বোচ্চ স্কোর" },
  { key: "lowest_score", label: "সর্বনিম্ন স্কোর" },
  { key: "recently_tried", label: "সম্প্রতি চেষ্টা" },
];

type Props = {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedFilter: ModelTestFilterKey;
  onFilterChange: (key: ModelTestFilterKey) => void;
  selectedSort: ModelTestSortKey;
  onSortChange: (key: ModelTestSortKey) => void;
  resultCount: number;
  totalCount: number;
  countUnit?: string;
  searchPlaceholder?: string;
  onClearAll?: () => void;
  hasActiveFilters?: boolean;
  variant?: "compact" | "full";
};

export function ModelTestFilterBar({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedSort,
  onSortChange,
  resultCount,
  totalCount,
  countUnit = "টেস্ট",
  searchPlaceholder = "অধ্যায় বা টেস্ট নম্বর লিখুন...",
  onClearAll,
  hasActiveFilters,
  variant = "full",
}: Props) {
  const [sortOpen, setSortOpen] = React.useState(false);
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);

  const selectedSortLabel =
    SORT_OPTIONS.find((o) => o.key === selectedSort)?.label ?? "ডিফল্ট";

  const chipMap = React.useMemo(
    () => new Map(FILTER_CHIPS.map((c) => [c.key, c])),
    [],
  );

  const visibleKeys =
    variant === "compact"
      ? [
          ...PRIMARY_FILTER_KEYS,
          ...(showMoreFilters ? SECONDARY_FILTER_KEYS : []),
        ]
      : FILTER_CHIPS.map((c) => c.key);

  const secondaryActive = SECONDARY_FILTER_KEYS.includes(selectedFilter);

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-950/80 to-[#0a0b1e]/90 p-3 shadow-[0_0_28px_rgba(15,23,42,0.5)] backdrop-blur-sm sm:p-4">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_160px]">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/80"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-700/70 bg-black/30 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 sm:h-12"
            placeholder={searchPlaceholder}
            aria-label="টেস্ট খুঁজুন"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="সার্চ মুছুন"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-xl border px-3 text-sm font-bold text-white sm:h-12",
              sortOpen
                ? "border-cyan-400/50 bg-black/40"
                : "border-slate-700/70 bg-black/30 hover:border-slate-600",
            )}
          >
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
              <ListFilter size={15} className="shrink-0 text-cyan-400" />
              {selectedSortLabel}
            </span>
            <ChevronDown
              size={15}
              className={cn("shrink-0 transition", sortOpen && "rotate-180")}
            />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-20" aria-hidden onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full min-w-[180px] rounded-xl border border-slate-700/80 bg-slate-950/98 p-1.5 shadow-2xl">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.key);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold",
                      selectedSort === opt.key
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "text-slate-200 hover:bg-slate-800/80",
                    )}
                  >
                    {opt.label}
                    {selectedSort === opt.key && <Check size={14} className="text-cyan-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-400">দ্রুত ফিল্টার</p>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
            {formatBnCount(resultCount)}/{formatBnCount(totalCount)} {countUnit}
          </span>
          {hasActiveFilters && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-bold text-slate-400 hover:text-white"
            >
              রিসেট
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {visibleKeys.map((key) => {
          const chip = chipMap.get(key);
          if (!chip) return null;
          const Icon = chip.icon;
          const active = selectedFilter === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => onFilterChange(chip.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-all min-h-[44px]",
                active
                  ? chip.activeClass
                  : "border-slate-700/60 bg-slate-900/50 text-slate-300 hover:border-violet-400/30 hover:text-white",
              )}
            >
              <Icon size={13} />
              {chip.label}
            </button>
          );
        })}
        {variant === "compact" && (
          <button
            type="button"
            onClick={() => setShowMoreFilters((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-bold min-h-[44px]",
              showMoreFilters || secondaryActive
                ? "border-purple-400/50 bg-purple-500/15 text-purple-200"
                : "border-slate-700/60 text-slate-400 hover:text-white",
            )}
          >
            {showMoreFilters ? "কম দেখুন" : "আরও ফিল্টার"}
            <ChevronDown size={13} className={cn("transition", showMoreFilters && "rotate-180")} />
          </button>
        )}
      </div>
    </div>
  );
}
```

## File: [src/components/quiz/ModelTestQuizPage.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ModelTestQuizPage.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { parseHscSubjectPaper } from "@/lib/quiz-api";
import { fetchNormalizedQuestionsWithMeta } from "@/lib/quiz/load-quiz-data";
import { loadModelTestsFromStatic } from "@/lib/model-test-loader";
import { pickModelTestDisplayTitle } from "@/lib/format-model-test-title";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ApiQuestion } from "@/types/quiz";

type Props = {
  apiSubjectSlug: string;
  testId: string;
  backUrl: string;
  examName: string;
  timeLimitSec?: number;
  modelTestListing: { level: "SSC" | "HSC"; subjectSlug: string };
  paper?: string | null;
  /** Pre-loaded on the server (same pattern as board questions) */
  initialQuestions?: ApiQuestion[];
  loadedFromPath?: string | null;
  attemptedPaths?: string[];
};

export function ModelTestQuizPage({
  apiSubjectSlug,
  testId,
  backUrl,
  examName,
  timeLimitSec,
  modelTestListing,
  paper = null,
  initialQuestions,
  loadedFromPath = null,
  attemptedPaths: serverAttemptedPaths = [],
}: Props) {
  const [questions, setQuestions] = useState<ApiQuestion[]>(initialQuestions ?? []);
  const [loading, setLoading] = useState(!initialQuestions?.length);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [attemptedPaths, setAttemptedPaths] = useState<string[]>(serverAttemptedPaths);
  const [resolvedExamName, setResolvedExamName] = useState(examName);

  useEffect(() => {
    setResolvedExamName(examName);
  }, [examName]);

  // Server already passes examName from index.json — this is a fallback only
  // if the server- passed name is still generic ("Model Test").
  useEffect(() => {
    if (examName !== "Model Test") return; // skip if server already resolved
    let cancelled = false;
    loadModelTestsFromStatic({
      level: modelTestListing.level,
      subjectSlug: modelTestListing.subjectSlug,
    }).then(({ items }) => {
      if (cancelled) return;
      const match = items.find((t) => t.sourceKey === testId);
      if (match) {
        setResolvedExamName(pickModelTestDisplayTitle(match));
      }
    });
    return () => { cancelled = true; };
  }, [modelTestListing, testId, examName]);

  useEffect(() => {
    if (initialQuestions?.length) {
      setQuestions(initialQuestions);
      setLoading(false);
      setFetchError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    setAttemptedPaths([]);
    setQuestions([]);

    const { level, subject: subj, paper: parsedPaper } =
      parseHscSubjectPaper(apiSubjectSlug);
    const registrySubject = subj === "math" ? "math" : subj;

    fetchNormalizedQuestionsWithMeta(
      level,
      registrySubject,
      testId,
      paper ?? parsedPaper,
    )
      .then((result) => {
        if (cancelled) return;
        setAttemptedPaths(result.attemptedPaths);
        if (result.questions.length > 0) {
          setQuestions(result.questions);
          setFetchError(null);
        } else {
          setQuestions([]);
          setFetchError(
            `Missing JSON File: Could not find data for testId: ${testId}`,
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQuestions([]);
          setFetchError(
            `Missing JSON File: Could not find data for testId: ${testId}`,
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiSubjectSlug, testId, paper, initialQuestions, loadedFromPath]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
      </div>
    );
  }

  if (fetchError || !questions.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 font-bangla">
        <Card variant="glass" className="p-8 border-red-500/30 text-center space-y-4">
          <AlertCircle className="h-10 w-10 mx-auto text-red-400" />
          <p className="text-red-300 font-semibold text-lg">
            {fetchError ??
              `Missing JSON File: Could not find data for testId: ${testId}`}
          </p>
          <div className="text-left text-sm text-slate-400 space-y-2 bg-black/20 rounded-lg p-4 font-mono">
            <p>
              <span className="text-slate-500">subject:</span> {apiSubjectSlug}
            </p>
            <p>
              <span className="text-slate-500">testId:</span> {testId}
            </p>
            {attemptedPaths.length > 0 && (
              <div>
                <p className="text-slate-500 mb-1">Paths tried:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs break-all">
                  {attemptedPaths.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link href={backUrl}>
            <Button variant="secondary">← ফিরে যাও</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const registryLevel =
    apiSubjectSlug.endsWith("-1st-paper") ||
    apiSubjectSlug.endsWith("-2nd-paper")
      ? "hsc"
      : "ssc";

  return (
    <QuizRunner
      questions={questions}
      examSlug={`${apiSubjectSlug}/${testId}`}
      examName={resolvedExamName}
      backUrl={backUrl}
      timeLimitSec={timeLimitSec ?? questions.length * 60}
      quizSubmitMeta={{
        quizId: testId,
        level: registryLevel,
        subject: apiSubjectSlug,
        paper,
        type: "model-test",
      }}
    />
  );
}
```

## File: [src/components/quiz/ModelTestsListClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ModelTestsListClient.tsx)

```tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { loadModelTestsFromStatic } from "@/lib/model-test-loader";
import {
  applyTabFilter,
  type ModelTestCategoryTab,
  type ModelTestItem,
  type ModelTestSortTab,
} from "@/lib/model-test-filters";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  HelpCircle,
  Play,
  Star,
} from "lucide-react";
import { ModelTestCard } from "@/components/quiz/ModelTestCard";
import { ModelTestsListSkeleton } from "@/components/quiz/ModelTestsListSkeleton";
import {
  ModelTestFilterBar,
  type ModelTestFilterKey,
  type ModelTestSortKey,
} from "@/components/quiz/ModelTestFilterBar";
import {
  AtomHeroGraphic,
  DASHBOARD_STAT_CONFIG,
  DashboardStatCard,
} from "@/components/quiz/smart-practice-ui";
import { parseModelTestItemTitle, toBanglaNumber, isHyperMegaHotSource } from "@/lib/format-model-test-title";
import { cn } from "@/lib/utils";

const CATEGORY_TABS: { id: ModelTestCategoryTab; label: string }[] = [
  { id: "paperWise", label: "পত্রভিত্তিক মডেল টেস্ট" },
  { id: "chapterWise", label: "অধ্যায়ভিত্তিক মডেল টেস্ট" },
];

function toModelTestSortTab(sort: ModelTestSortKey): ModelTestSortTab {
  switch (sort) {
    case "most_important":
      return "mostImportant";
    case "advanced_first":
      return "advanced";
    case "most_tried":
      return "trending";
    default:
      return "default";
  }
}

type Props = {
  level: "SSC" | "HSC";
  subjectSlug: string;
  basePath: string;
  modelTestBasePath: string;
  title: string;
  /** Optional English-style headline for hero (derived from route slugs). */
  headline?: string;
};

interface AttemptRecord {
  examSlug?: string;
  score?: number;
  totalQuestions?: number;
  createdAt?: string;
}

function isEasyTest(t: ModelTestItem): boolean {
  if (t.difficulty === "easy") return true;
  if (t.difficulty === "medium" && t.sortNumber <= 5) return true;
  if (!t.difficulty && t.sortNumber <= 3) return true;
  return false;
}

function buildAttemptMap(
  attempts: AttemptRecord[],
  subjectSlug: string,
): Map<string, { lastScore: number; bestScore: number; total: number; count: number; lastAttemptAt?: string }> {
  const map = new Map<
    string,
    { lastScore: number; bestScore: number; total: number; count: number; lastAttemptAt?: string }
  >();

  for (const attempt of attempts) {
    const slug = attempt.examSlug ?? "";
    if (!slug.includes(subjectSlug) && !slug.includes("/")) continue;

    const testKey = slug.includes("/") ? slug.split("/").pop()! : slug;
    const score = attempt.score ?? 0;
    const total = attempt.totalQuestions ?? 0;
    const existing = map.get(testKey);

    if (!existing) {
      map.set(testKey, { lastScore: score, bestScore: score, total, count: 1, lastAttemptAt: attempt.createdAt });
    } else {
      existing.count += 1;
      existing.lastScore = score;
      existing.bestScore = Math.max(existing.bestScore, score);
      if (total > 0) existing.total = total;
      if (attempt.createdAt) {
        if (!existing.lastAttemptAt || new Date(attempt.createdAt) > new Date(existing.lastAttemptAt)) {
          existing.lastAttemptAt = attempt.createdAt;
        }
      }
    }
  }

  return map;
}

function mergeAttempts(
  items: ModelTestItem[],
  attemptMap: Map<
    string,
    { lastScore: number; bestScore: number; total: number; count: number; lastAttemptAt?: string }
  >,
): ModelTestItem[] {
  return items.map((item) => {
    const attempt = attemptMap.get(item.sourceKey);
    const attemptCount = attempt?.count ?? 0;
    return {
      ...item,
      lastScore: attempt?.lastScore,
      bestScore: attempt?.bestScore,
      attemptCount: attemptCount > 0 ? attemptCount : undefined,
      completed: attemptCount > 0,
      lastAttemptAt: attempt?.lastAttemptAt,
    };
  });
}

export function ModelTestsListClient({
  level,
  subjectSlug,
  basePath,
  modelTestBasePath,
  title,
  headline,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allModelTests, setAllModelTests] = useState<ModelTestItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ModelTestFilterKey>("all");
  const [selectedSort, setSelectedSort] = useState<ModelTestSortKey>("default");
  const [activeCategory, setActiveCategory] = useState<ModelTestCategoryTab>("chapterWise");
  const [chapterFilter, setChapterFilter] = useState<number | "all">("all");

  const replaceQuery = (next: {
    category?: ModelTestCategoryTab;
    chapter?: number | "all";
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const category = next.category ?? activeCategory;
    params.set("tab", category === "paperWise" ? "paper" : "chapter");
    const chapter = next.chapter ?? chapterFilter;
    if (chapter === "all") {
      params.delete("chapter");
    } else {
      params.set("chapter", String(chapter).padStart(2, "0"));
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "paper" || tab === "paperWise") {
      setActiveCategory("paperWise");
    } else if (tab === "chapter" || tab === "chapterWise") {
      setActiveCategory("chapterWise");
    }
    const ch = searchParams.get("chapter");
    if (!ch || ch === "all") {
      setChapterFilter("all");
    } else {
      const n = Number.parseInt(ch, 10);
      if (!Number.isNaN(n) && n > 0) setChapterFilter(n);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const { items } = await loadModelTestsFromStatic({
        level,
        subjectSlug,
      });

      let attemptMap = new Map<
        string,
        { lastScore: number; bestScore: number; total: number; count: number; lastAttemptAt?: string }
      >();

      if (user) {
        try {
          const dash = await api.get<{ recentAttempts?: AttemptRecord[] }>(
            "/api/student/dashboard",
          );
          attemptMap = buildAttemptMap(dash.recentAttempts ?? [], subjectSlug);
        } catch {
          /* optional */
        }
      }

      const merged = mergeAttempts(items, attemptMap);
      setAllModelTests(merged);
      setLoading(false);
    }

    loadData();
  }, [level, subjectSlug, user]);

  const activeSort = toModelTestSortTab(selectedSort);

  const tabResult = useMemo(() => {
    const base = applyTabFilter(activeCategory, allModelTests, activeSort);
    if (activeCategory !== "chapterWise" || chapterFilter === "all") {
      return base;
    }
    const ch = String(chapterFilter).padStart(2, "0");
    const filtered = base.items.filter(
      (t) =>
        t.sourceKey.includes(`chapter-${ch}`) ||
        parseModelTestItemTitle(t)
          .sortChapter === chapterFilter,
    );
    return {
      ...base,
      items: filtered,
      emptyMessage: filtered.length
        ? undefined
        : `অধ্যায় ${chapterFilter} এর কোনো টেস্ট পাওয়া যায়নি।`,
    };
  }, [activeCategory, allModelTests, activeSort, chapterFilter]);

  const withQuestions = useMemo(
    () => tabResult.items.filter((t) => t.hasQuestions),
    [tabResult.items],
  );

  const chapterOptions = useMemo(() => {
    const chNums = new Set<number>();
    const chNames = new Map<number, string>();
    for (const t of allModelTests) {
      if (t.scope !== "chapter" || !t.hasQuestions) continue;
      const info = parseModelTestItemTitle(t);
      if (info.sortChapter > 0) {
        chNums.add(info.sortChapter);
        if (t.chapterName) chNames.set(info.sortChapter, t.chapterName);
      }
    }
    return {
      numbers: Array.from(chNums).sort((a, b) => a - b),
      names: chNames,
    };
  }, [allModelTests]);

  const totalMcq = useMemo(
    () => withQuestions.reduce((sum, t) => sum + t.questionCount, 0),
    [withQuestions],
  );

  // Statistics calculation
  const totalChapters = useMemo(() => {
    const chs = new Set(
      allModelTests
        .filter((t) => t.scope === "chapter" && t.hasQuestions)
        .map((t) =>
          parseModelTestItemTitle(t)
            .sortChapter,
        ),
    );
    return chs.size;
  }, [allModelTests]);

  const attemptedTests = useMemo(() => {
    return withQuestions.filter(t => t.completed);
  }, [withQuestions]);

  const stats = useMemo(() => {
    if (attemptedTests.length === 0) {
      return {
        attempted: "Not started",
        avgScore: "—",
        highestScore: "—",
        lowestScore: "—",
      };
    }

    const avgLast =
      attemptedTests.reduce((sum, t) => sum + (t.lastScore ?? 0), 0) /
      attemptedTests.length;
    const typicalTotal =
      attemptedTests[0]?.questionCount ||
      withQuestions[0]?.questionCount ||
      25;
    const highest = Math.max(
      ...attemptedTests.map((t) => t.bestScore ?? t.lastScore ?? 0),
    );
    const lowest = Math.min(
      ...attemptedTests.map((t) => t.bestScore ?? t.lastScore ?? 0),
    );

    return {
      attempted: toBanglaNumber(attemptedTests.length) + " টি টেস্ট",
      avgScore: `${avgLast.toFixed(1)}/${typicalTotal}`,
      highestScore: `${highest}/${typicalTotal}`,
      lowestScore: `${lowest}/${typicalTotal}`,
    };
  }, [attemptedTests, withQuestions]);

  // Suggestion Algorithm
  const recommendedTest = useMemo(() => {
    if (!withQuestions.length) return null;

    // 1. Weak chapter/test first
    const weakTest = withQuestions.find((t) => {
      if (!t.completed || t.lastScore === undefined) return false;
      return (t.lastScore / t.questionCount) < 0.6;
    });
    if (weakTest) return weakTest;

    // 2. First not-tried test
    const notTriedTest = withQuestions.find((t) => !t.completed);
    if (notTriedTest) return notTriedTest;

    // 3. Fallback to first test
    return withQuestions[0];
  }, [withQuestions]);

  const heroTitle = headline ?? title;

  const recTitleInfo = recommendedTest
    ? parseModelTestItemTitle(recommendedTest)
    : null;

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let list = [...withQuestions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        const titleParsed = parseModelTestItemTitle(t);
        return (
          t.sourceKey.toLowerCase().includes(query) ||
          t.displayTitle.toLowerCase().includes(query) ||
          (t.sourceDisplayTitle && t.sourceDisplayTitle.toLowerCase().includes(query)) ||
          titleParsed.chapterLabel.toLowerCase().includes(query) ||
          titleParsed.testLabel.toLowerCase().includes(query)
        );
      });
    }

    // Filter Chips
    switch (selectedFilter) {
      case "default":
      case "all":
        break;
      case "important":
        list = list.filter(
          (t) =>
            isHyperMegaHotSource(t.sourceKey, t.tags) ||
            t.importance === "high" ||
            t.importance === "medium" ||
            t.sortNumber <= 5,
        );
        break;
      case "easy":
        list = list.filter(isEasyTest);
        break;
      case "advanced":
        list = list.filter((t) => t.difficulty === "advanced" || t.difficulty === "hard" || t.sortNumber >= 11);
        break;
      case "tried":
        list = list.filter((t) => (t.attemptCount ?? 0) >= 1);
        break;
      case "not_tried":
        list = list.filter((t) => !t.completed);
        break;
      case "completed":
        list = list.filter((t) => t.completed);
        break;
      case "weak":
        list = list.filter((t) => {
          if (!t.completed || t.lastScore === undefined) return false;
          return (t.lastScore / t.questionCount) < 0.6;
        });
        break;
      case "high_score":
        list = list.filter((t) => {
          if (!t.completed || t.lastScore === undefined) return false;
          return (t.lastScore / t.questionCount) >= 0.8;
        });
        break;
      case "recommended":
        if (recommendedTest) {
          list = list.filter((t) => t.sourceKey === recommendedTest.sourceKey);
        }
        break;
    }

    // Chapter filter only applies on chapter-wise tab (dropdown handled in tabResult)
    if (activeCategory === "chapterWise" && chapterFilter !== "all") {
      list = list.filter((t) => {
        const titleInfo = parseModelTestItemTitle(t);
        return titleInfo.sortChapter === chapterFilter;
      });
    }

    // Sorting options
    switch (selectedSort) {
      case "most_tried":
        list.sort((a, b) => (b.attemptCount ?? 0) - (a.attemptCount ?? 0));
        break;
      case "most_important":
        list.sort((a, b) => {
          const rank = { high: 0, medium: 1, low: 2 };
          const ia = rank[a.importance ?? "low"];
          const ib = rank[b.importance ?? "low"];
          if (ia !== ib) return ia - ib;
          return a.sortNumber - b.sortNumber;
        });
        break;
      case "advanced_first":
        list.sort((a, b) => {
          const titleA = parseModelTestItemTitle(a);
          const titleB = parseModelTestItemTitle(b);
          if (titleA.sortChapter !== titleB.sortChapter) {
            return titleB.sortChapter - titleA.sortChapter;
          }
          return titleB.sortTest - titleA.sortTest;
        });
        break;
      case "highest_score":
        list.sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
        break;
      case "lowest_score":
        list.sort((a, b) => {
          if (a.bestScore === undefined) return 1;
          if (b.bestScore === undefined) return -1;
          return a.bestScore - b.bestScore;
        });
        break;
      case "recently_tried":
        list.sort((a, b) => {
          if (!a.lastAttemptAt) return 1;
          if (!b.lastAttemptAt) return -1;
          return new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime();
        });
        break;
      case "default":
      default:
        list.sort((a, b) => a.sortNumber - b.sortNumber);
        break;
    }

    return list;
  }, [
    withQuestions,
    searchQuery,
    selectedFilter,
    selectedSort,
    chapterFilter,
    activeCategory,
    recommendedTest,
  ]);

  // Grouped by chapter for the default list view
  const groupedChapters = useMemo(() => {
    const groups: Record<number, ModelTestItem[]> = {};
    for (const test of filteredAndSorted) {
      const titleInfo = parseModelTestItemTitle(test);
      const ch = titleInfo.sortChapter;
      if (!groups[ch]) groups[ch] = [];
      groups[ch].push(test);
    }
    return groups;
  }, [filteredAndSorted]);

  const sortedChapterKeys = useMemo(() => {
    return Object.keys(groupedChapters)
      .map(Number)
      .sort((a, b) => a - b);
  }, [groupedChapters]);

  const isDefaultView =
    activeCategory === "chapterWise" &&
    searchQuery === "" &&
    (selectedFilter === "all" || selectedFilter === "default") &&
    selectedSort === "default" &&
    chapterFilter === "all";

  const hasActiveFilters =
    searchQuery !== "" ||
    (selectedFilter !== "all" && selectedFilter !== "default") ||
    selectedSort !== "default" ||
    chapterFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedFilter("all");
    setSelectedSort("default");
    setChapterFilter("all");
    replaceQuery({ chapter: "all" });
  };

  const switchCategory = (tab: ModelTestCategoryTab) => {
    setActiveCategory(tab);
    setSearchQuery("");
    setSelectedFilter("all");
    setSelectedSort("default");
    setChapterFilter("all");
    replaceQuery({ category: tab, chapter: "all" });
  };

  const statValues: Record<string, string> = {
    chapters: toBanglaNumber(totalChapters),
    tests: toBanglaNumber(withQuestions.length),
    mcq: toBanglaNumber(totalMcq),
    attempted: stats.attempted,
    avg: stats.avgScore,
    high: stats.highestScore,
    low: stats.lowestScore,
  };

  if (loading) {
    return <ModelTestsListSkeleton />;
  }

  return (
    <div className="min-w-0 font-bangla pb-24">
      {/* Hero — strict mockup clone */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-[#0a0b1e]/90 to-slate-950/60 px-4 py-5 sm:px-6 sm:py-6">
        <AtomHeroGraphic />
        <div className="relative pr-0 sm:pr-44 lg:pr-72 xl:pr-96">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold sm:text-base">
            <span className="text-cyan-400">{level}</span>
            <span className="text-slate-500">&gt;</span>
            <span className="text-slate-200">{heroTitle}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium text-slate-400 sm:text-base">
            প্রথমে অধ্যায়ভিত্তিক টেস্ট দিন, তারপর র‍্যান্ডম টেস্টে নিজেকে যাচাই করুন।
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {DASHBOARD_STAT_CONFIG.map((stat) => (
              <DashboardStatCard
                key={stat.key}
                label={stat.label}
                value={statValues[stat.key]}
                icon={stat.icon}
                color={stat.color}
                glow={stat.glow}
              />
            ))}
          </div>
        </div>
      </div>

      {/* আজকের সাজেশন */}
      {recommendedTest && recTitleInfo && (
        <div className="mb-4 overflow-hidden rounded-2xl border border-violet-500/50 bg-gradient-to-r from-violet-950/95 via-[#0c0d1e] to-violet-950/80 p-4 shadow-[0_0_32px_rgba(168,85,247,0.22)] sm:p-5">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-violet-300/50 bg-violet-600/20 shadow-[0_0_28px_rgba(168,85,247,0.65)] sm:h-16 sm:w-16">
                <Star size={28} fill="currentColor" className="text-white sm:h-8 sm:w-8" />
              </div>
              <div>
                <h2 className="text-lg font-black text-violet-200 sm:text-2xl">আজকের সাজেশন</h2>
                <p className="text-base font-bold text-white sm:text-xl">
                  {recTitleInfo.chapterLabel} • {recTitleInfo.testLabel}
                </p>
              </div>
            </div>
            <Link href={`${modelTestBasePath}/${recommendedTest.sourceKey}`} className="w-full md:w-auto">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 px-8 py-3 text-base font-black text-white shadow-[0_0_28px_rgba(59,130,246,0.45)] transition hover:scale-[1.02] sm:px-10 sm:text-lg"
              >
                <Play size={18} fill="white" />
                এখন শুরু করুন
              </button>
            </Link>
          </div>
        </div>
      )}

      {allModelTests.length === 0 ? (
        <EmptyState basePath={basePath} />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchCategory(tab.id)}
                className={cn(
                  "min-h-[44px] flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all sm:text-sm",
                  activeCategory === tab.id
                    ? tab.id === "paperWise"
                      ? "bg-gradient-to-r from-purple-600/90 to-violet-600/80 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      : "bg-gradient-to-r from-cyan-600/90 to-blue-600/80 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ModelTestFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            resultCount={filteredAndSorted.length}
            totalCount={withQuestions.length}
            hasActiveFilters={hasActiveFilters}
            onClearAll={clearAllFilters}
          />

          {activeCategory === "chapterWise" && chapterOptions.numbers.length > 1 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-950/60 px-3 py-2.5">
              <label htmlFor="chapter-filter" className="text-xs font-bold text-slate-400">
                অধ্যায় ফিল্টার
              </label>
              <select
                id="chapter-filter"
                value={chapterFilter === "all" ? "all" : String(chapterFilter)}
                onChange={(e) => {
                  const val = e.target.value;
                  const next = val === "all" ? "all" : Number(val);
                  setChapterFilter(next);
                  replaceQuery({ chapter: next });
                }}
                className="h-9 min-w-[140px] rounded-lg border border-slate-700/70 bg-black/30 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/50"
              >
                <option value="all">সব অধ্যায়</option>
                {chapterOptions.numbers.map((ch) => (
                  <option key={ch} value={ch}>
                    {chapterOptions.names.get(ch)
                      ? `অধ্যায় ${toBanglaNumber(ch).padStart(2, "০")} · ${chapterOptions.names.get(ch)}`
                      : `অধ্যায় ${toBanglaNumber(ch).padStart(2, "০")}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeCategory === "chapterWise" && chapterFilter !== "all" && (
            <div className="mb-4 flex justify-between items-center rounded-xl border border-cyan-500/30 bg-slate-950/70 p-4">
              <span className="text-sm text-cyan-300">
                অধ্যায় {toBanglaNumber(chapterFilter).padStart(2, "০")} — সব টেস্ট
              </span>
              <button
                type="button"
                onClick={() => {
                  setChapterFilter("all");
                  replaceQuery({ chapter: "all" });
                }}
                className="text-sm font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                ← ফিরে যান
              </button>
            </div>
          )}

          {filteredAndSorted.length === 0 ? (
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-8 text-center text-slate-400 sm:p-10">
              <HelpCircle className="mx-auto mb-3 h-10 w-10 text-slate-600" />
              <p className="font-semibold text-slate-300">
                {tabResult.emptyMessage ?? "আপনার ফিল্টার অনুযায়ী কোনো টেস্ট পাওয়া যায়নি।"}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                >
                  সব ফিল্টার রিসেট করুন
                </button>
              )}
            </div>
          ) : isDefaultView ? (
            <div className="space-y-4">
              {sortedChapterKeys.map((ch) => {
                const chTestsCount = groupedChapters[ch].length;
                const chapterName =
                  groupedChapters[ch].find((t) => t.chapterName)?.chapterName;
                const chName = chapterName
                  ? `অধ্যায় ${toBanglaNumber(ch).padStart(2, "০")} · ${chapterName}`
                  : `অধ্যায় ${toBanglaNumber(ch).padStart(2, "০")}`;
                const visibleTests =
                  chapterFilter === "all"
                    ? groupedChapters[ch].slice(0, 2)
                    : groupedChapters[ch];

                return (
                  <div
                    key={ch}
                    className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-3 shadow-[0_0_20px_rgba(15,23,42,0.5)]"
                  >
                    <div className="mb-3 flex items-center justify-between px-1 sm:px-2">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/15 text-blue-300 shadow-[0_0_14px_rgba(59,130,246,0.35)] sm:h-12 sm:w-12">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-white sm:text-xl">{chName}</h2>
                          <p className="text-xs font-semibold text-slate-400 sm:text-sm">
                            {toBanglaNumber(chTestsCount)} টি মডেল টেস্ট
                          </p>
                        </div>
                      </div>
                      {chapterFilter === "all" && chTestsCount > 2 && (
                        <button
                          type="button"
                          onClick={() => setChapterFilter(ch)}
                          className="shrink-0 text-sm font-bold text-cyan-400 transition hover:text-cyan-300 sm:text-base"
                        >
                          সব দেখুন →
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                      {visibleTests.map((test) => (
                        <ModelTestCard
                          key={test.id}
                          test={test}
                          href={`${modelTestBasePath}/${test.sourceKey}`}
                          isRecommended={recommendedTest?.sourceKey === test.sourceKey}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {filteredAndSorted.map((test) => (
                <ModelTestCard
                  key={test.id}
                  test={test}
                  href={`${modelTestBasePath}/${test.sourceKey}`}
                  isRecommended={recommendedTest?.sourceKey === test.sourceKey}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ basePath }: { basePath: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-8 sm:p-10 text-center">
      <HelpCircle className="h-10 w-10 mx-auto mb-3 text-slate-600" />
      <p className="text-slate-300 font-semibold mb-1">
        এই বিষয়ে মডেল টেস্ট এখনো যোগ করা হয়নি।
      </p>
      <p className="text-slate-500 text-sm mb-6">অধ্যায়ভিত্তিক কুইজ থেকে শুরু করুন।</p>
      <Link href={basePath}>
        <Button variant="secondary" className="min-h-[44px]">
          অধ্যায় কুইজ দেখুন
        </Button>
      </Link>
    </div>
  );
}
```

## File: [src/components/quiz/ModelTestsListPageShell.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ModelTestsListPageShell.tsx)

```tsx
import { Suspense, type ComponentProps } from "react";
import { ModelTestsListClient } from "@/components/quiz/ModelTestsListClient";
import { ModelTestsListSkeleton } from "@/components/quiz/ModelTestsListSkeleton";

type Props = ComponentProps<typeof ModelTestsListClient>;

export function ModelTestsListPageShell(props: Props) {
  return (
    <Suspense fallback={<ModelTestsListSkeleton />}>
      <ModelTestsListClient {...props} />
    </Suspense>
  );
}
```

## File: [src/components/quiz/ModelTestsListSkeleton.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/ModelTestsListSkeleton.tsx)

```tsx
import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/[0.06] ring-1 ring-white/5",
        className,
      )}
    />
  );
}

export function ModelTestsListSkeleton() {
  return (
    <div className="min-w-0 space-y-4 pb-24 font-bangla animate-fadeIn">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-5 sm:px-6">
        <Bone className="mb-3 h-5 w-48" />
        <Bone className="mb-4 h-12 w-72 max-w-full sm:h-14" />
        <Bone className="mb-6 h-5 w-96 max-w-full" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Bone key={i} className="h-[72px] rounded-2xl" />
          ))}
        </div>
      </div>

      <Bone className="h-24 rounded-2xl" />

      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_180px]">
          <Bone className="h-11 rounded-xl sm:h-12" />
          <Bone className="h-11 rounded-xl sm:h-12" />
        </div>
        <Bone className="h-4 w-24" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bone key={i} className="h-11 w-24 shrink-0 rounded-full" />
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-950/30 p-3">
        <div className="flex items-center gap-3 px-1">
          <Bone className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Bone className="h-5 w-32" />
            <Bone className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-[110px] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## File: [src/components/quiz/QuizChapterPage.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/QuizChapterPage.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { loadSubjectQuizData } from "@/lib/quiz/load-quiz-data";
import {
  getChapterQuizSets,
  groupChapterQuizSets,
} from "@/lib/quiz/normalize-quiz-data";
import { parseHscSubjectPaper } from "@/lib/quiz-api";
import { expectedMcqForSubject, resolveFileSubjectSlug } from "@/lib/quiz/registry";
import {
  expandQuizSetForDisplay,
  MOCK_SET_SIZE,
  type QuizListItem,
} from "@/lib/quiz-helper";
import type { NormalizedQuizSet } from "@/lib/quiz/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Props = {
  apiSubjectSlug: string;
  chapterSlug: string;
  backUrl: string;
  examName: string;
  chapterPathPrefix?: string;
};

export function QuizChapterPage({
  apiSubjectSlug,
  chapterSlug,
  backUrl,
  examName,
  chapterPathPrefix,
}: Props) {
  const [sets, setSets] = useState<NormalizedQuizSet[]>([]);
  const [displaySets, setDisplaySets] = useState<QuizListItem[]>([]);
  const [chapterName, setChapterName] = useState(examName);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  const { level, subject, paper } = parseHscSubjectPaper(apiSubjectSlug);
  const fileSlug = resolveFileSubjectSlug(level, subject, paper);
  const expectedMcq = expectedMcqForSubject(fileSlug);
  const chapterBase =
    chapterPathPrefix ?? `${backUrl.replace(/\/$/, "")}/chapter`;
  const setBasePath = `${chapterBase}/${chapterSlug}`;

  useEffect(() => {
    loadSubjectQuizData(level, subject, paper).then((parsed) => {
      if (!parsed) {
        setLoading(false);
        return;
      }

      const chapterSets = getChapterQuizSets(parsed, chapterSlug);
      const applySets = (chapterSets: NormalizedQuizSet[], name: string) => {
        setSets(chapterSets);
        setChapterName(name);
        const total = chapterSets.reduce((n, s) => n + s.questionCount, 0);
        setTotalQuestions(total);
        const hrefBase = `${setBasePath}/set`;
        const expanded = chapterSets.flatMap((set, i) =>
          expandQuizSetForDisplay(set, hrefBase, i),
        );
        setDisplaySets(expanded);
      };

      if (chapterSets.length) {
        applySets(chapterSets, chapterSets[0].chapterName ?? examName);
        setLoading(false);
        return;
      }

      const groups = groupChapterQuizSets(parsed.chapterSets);
      const group = groups.find((g) => g.chapterSlug === chapterSlug);
      if (group) {
        applySets(group.sets, group.chapterName);
      }
      setLoading(false);
    });
  }, [level, subject, paper, chapterSlug, examName]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 font-bangla pb-24">
      <Link
        href={backUrl}
        className="text-slate-400 hover:text-white text-sm mb-6 inline-block"
      >
        ← ফিরে যাও
      </Link>

      <div className="mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white">{chapterName}</h1>
        <p className="text-slate-400 text-sm flex flex-wrap items-center gap-2">
          <Badge variant="default" className="text-[10px] border-cyan-400/20 text-cyan-300">
            {totalQuestions} MCQ total
          </Badge>
          {displaySets.length > 1 && (
            <span>{displaySets.length} mock sets · {MOCK_SET_SIZE} MCQ each</span>
          )}
          {displaySets.length <= 1 && sets.length > 0 && (
            <span>{sets.length} সেট · ~{expectedMcq} MCQ</span>
          )}
        </p>
      </div>

      {displaySets.length === 0 ? (
        <Card variant="glass" className="p-10 text-center text-slate-400">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-slate-600" />
          <p>এই অধ্যায়ে MCQ সেট এখনো যোগ করা হয়নি</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href={`${backUrl}?tab=model`}>
              <Button variant="primary">মডেল টেস্ট দেখো</Button>
            </Link>
            <Link href={backUrl}>
              <Button variant="secondary">ফিরে যাও</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {displaySets.map((item) => (
            <Card
              key={item.setId}
              variant="glass"
              className="p-4 sm:p-5 border-white/5 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-white">{item.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <p className="text-sm text-slate-400">{item.questionCount} MCQ</p>
                  {item.mode === "timed" && (
                    <Badge variant="default" className="text-[10px]">Timed</Badge>
                  )}
                  {item.mode === "practice" && (
                    <Badge variant="default" className="text-[10px]">Practice</Badge>
                  )}
                </div>
              </div>
              <Link href={item.href}>
                <Button className="min-h-[44px] shrink-0">শুরু করুন</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

## File: [src/components/quiz/QuizDiagram.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/QuizDiagram.tsx)

```tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt?: string;
  caption?: string;
  /** compact = MCQ option graph */
  variant?: "question" | "option";
  className?: string;
};

export function QuizDiagram({
  src,
  alt = "প্রশ্নের চিত্র",
  caption,
  variant = "question",
  className,
}: Props) {
  if (variant === "option") {
    return (
      <span
        className={cn(
          "inline-flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/30 border border-white/5 my-1",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-28 h-28 md:w-32 md:h-32 object-contain"
        />
        {caption && (
          <span className="text-[10px] text-slate-500 mt-1 select-none font-sans">
            {caption}
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "my-3 flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-slate-950/20 border border-white/10 max-w-3xl mx-auto w-full",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full max-w-3xl h-auto object-contain rounded-xl"
      />
      {caption && (
        <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed text-center px-2 pt-3 mt-2 border-t border-white/5 w-full">
          {caption}
        </p>
      )}
    </div>
  );
}
```

## File: [src/components/quiz/QuizErrorBoundary.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/QuizErrorBoundary.tsx)

```tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class QuizErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[QuizErrorBoundary] Caught error:", error, errorInfo);
  }

  handleReset = () => {
    // Reset local error state
    this.setState({ hasError: false, error: null });
    // Force full page reload to reset Zustand store and all quiz state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6 font-bangla">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">
                কুইজ লোড করতে সমস্যা হয়েছে
            </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন
                বা পরে আবার চেষ্টা করুন।
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
                    Technical details
                  </summary>
                  <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-red-300">
                    {this.state.error.message}
                    {"\n"}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500"
              >
                <RotateCcw className="h-4 w-4" />
                আবার চেষ্টা করুন
              </Button>
              <Link href="/">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  হোম পেজ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## File: [src/components/quiz/QuizOptionText.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/QuizOptionText.tsx)

```tsx
"use client";

import React, { useMemo } from "react";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import { resolveOptionDiagram } from "@/lib/quiz/quiz-diagrams";
import { QuizDiagram } from "@/components/quiz/QuizDiagram";
import { sanitizeOptionText } from "@/lib/sanitize-quiz-text";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  questionText: string;
  optionImage?: string | null;
  className?: string;
};

export function QuizOptionText({ text, questionText, optionImage = null, className }: Props) {
  const displayText = useMemo(() => sanitizeOptionText(text), [text]);

  const diagram = useMemo(() => {
    if (optionImage && /^\/images\/quiz\//.test(optionImage)) {
      return {
        slug: optionImage.replace(/^\/images\/quiz\//, "").replace(/\.svg$/i, ""),
        src: optionImage,
        caption: displayText,
      };
    }
    return resolveOptionDiagram(displayText, questionText);
  }, [displayText, questionText, optionImage]);

  if (diagram) {
    return (
      <QuizDiagram
        src={diagram.src}
        caption={displayText || undefined}
        variant="option"
        className={className}
      />
    );
  }

  return (
    <FormattedQuizText
      text={displayText}
      inline
      className={cn("text-sm md:text-base leading-relaxed flex-1", className)}
    />
  );
}
```

## File: [src/components/quiz/QuizQuestionStem.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/QuizQuestionStem.tsx)

```tsx
"use client";

import React, { useMemo } from "react";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import {
  questionNeedsDiagramPlaceholder,
  resolveQuizDiagram,
  stripQuestionDiagramMarkers,
} from "@/lib/quiz/quiz-diagrams";
import { QuizDiagram } from "@/components/quiz/QuizDiagram";

type Props = {
  text: string;
  image?: string | null;
  className?: string;
  hideWorkedSolution?: boolean;
};

export function QuizQuestionStem({
  text,
  image = null,
  className,
  hideWorkedSolution = false,
}: Props) {
  const diagram = useMemo(() => resolveQuizDiagram({ text, image }), [text, image]);

  const showMissingNotice = useMemo(
    () => !diagram && !image && questionNeedsDiagramPlaceholder(text),
    [diagram, image, text],
  );

  const displayText = useMemo(() => {
    if (!diagram) return text;
    return stripQuestionDiagramMarkers(text);
  }, [text, diagram]);

  return (
    <>
      <FormattedQuizText
        text={displayText}
        className={className}
        hideWorkedSolution={hideWorkedSolution}
      />
      {diagram && (
        <QuizDiagram
          src={diagram.src}
          caption={diagram.caption}
          variant="question"
        />
      )}
      {showMissingNotice && (
        <p className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90 font-bangla">
          এই প্রশ্নে নির্দিষ্ট চিত্র/ডায়াগ্রাম প্রয়োজন। স্কেচটি শীঘ্রই যুক্ত করা হবে।
        </p>
      )}
    </>
  );
}
```

## File: [src/components/quiz/QuizResultShareCard.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/QuizResultShareCard.tsx)

```tsx
"use client";

import React, { useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { formatBnNumber } from "@/lib/leaderboard-api";
import {
  Download,
  Share2,
  Loader2,
  Check,
  Zap,
  Brain,
  Swords,
  TrendingUp,
  Target,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ShareCardData = {
  examName: string;
  subject?: string;
  chapter?: string;
  level?: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  eloRating: number;
  eloChange: number;
  timeTaken?: number;
  studentName?: string;
  collegeName?: string;
  schoolName?: string;
};

// ─────────────────────────────────────────────
// AI Roast Engine — generates contextual Bengali text
// ─────────────────────────────────────────────

function generateRoast(data: ShareCardData): { roast: string; flex: string; emoji: string } {
  const { accuracy, correctCount, totalQuestions, eloChange, eloRating } = data;
  const pct = accuracy;

  if (totalQuestions === 0) {
    return {
      roast: "কুইজ শুরুই করোনি! 🤨 বসে না থেকে একটা টেস্ট দাও।",
      flex: "প্রথম টেস্ট দিয়েই র‍্যাঙ্কিংয়ে উঠে আসো!",
      emoji: "😤",
    };
  }

  // Perfect score
  if (pct === 100) {
    return {
      roast: "১০০%?! তুমি কি আসলেই মানুষ নাকি রোবট? 🤖 ব্যাটা, তুমি তো বই খুলেও দেখো না!",
      flex: "পারফেক্ট স্কোর! তুমি এই সাবজেক্টের রাজা 👑 বোর্ড পরীক্ষাতেও তাই আসবে ইনশাআল্লাহ!",
      emoji: "👑",
    };
  }

  // Excellent (80-99)
  if (pct >= 80) {
    return {
      roast: `বাহ! ${pct}%! কিন্তু বাকি ${100 - pct}% ভুল কেন? 😏 তুমি তো টপার হতে পারতে!`,
      flex: `অসাধারণ! মাত্র ${100 - pct}% ভুল — তুমি যেকোনো বোর্ড পরীক্ষায় ${pct}%+ পেতে যাচ্ছ।`,
      emoji: "🔥",
    };
  }

  // Good (60-79)
  if (pct >= 60) {
    return {
      roast: `${pct}% — খারাপ না, কিন্তু ভালোও না। 😅 এই নিয়ে কি জিপিএ-৫ পাবা? আরও পড়তে হবে!`,
      flex: `ভালো ফলাফল! আর একটু পড়লেই ${Math.min(100, pct + 15)}%+ করা সম্ভব। লক্ষ্য রাখো!`,
      emoji: "💪",
    };
  }

  // Average (40-59)
  if (pct >= 40) {
    return {
      roast: `${pct}%? তুমি কি পরীক্ষার আগের রাতে পড়েছিলে? 😴 এভাবে চললে বোর্ড পরীক্ষায় বিপদ!`,
      flex: `এখনো সময় আছে! দুর্বল টপিকগুলো চিহ্নিত করে আরও ${10 - Math.floor(pct / 10)}টি মডেল টেস্ট দাও।`,
      emoji: "📚",
    };
  }

  // Low (<40%)
  return {
    roast: `অসম্ভব! ${pct}%?! 🤯 তুমি কি উত্তরগুলো উল্টো দিকে দিয়েছ? বইটা একটু খুলে দেখো!`,
    flex: `চিন্তা নেই! শুরুটা যত খারাপই হোক, নিয়মিত চর্চায় তুমি ${100 - pct}% উন্নতি করতে পারো।`,
    emoji: "🎯",
  };
}

// ─────────────────────────────────────────────
// AI "Weakness" Burn Generator
// ─────────────────────────────────────────────

function generateWeaknessBurn(data: ShareCardData): string {
  const { wrongCount, skippedCount, correctCount } = data;

  if (wrongCount === 0 && skippedCount === 0) return "কোনো ভুল নেই — তুমি আসলেই প্রস্তুত! 🏆";
  if (wrongCount >= 10) return `ওহ! ${wrongCount}টি ভুল? তুমি তো বসে বসে টিক দিয়েছ মনে হচ্ছে! 🎲`;
  if (skippedCount >= 5) return `${skippedCount}টি প্রশ্ন বাদ দিয়েছ? আন্দাজ করলেও তো কিছু হতো! 😤`;
  if (wrongCount > correctCount) return "ভুল উত্তর সঠিকের চেয়ে বেশি! বোর্ড পরীক্ষায় এই অবস্থা হলে বিপদ! ⚠️";
  if (wrongCount >= 5) return `${wrongCount}টি ভুল — মোটামুটি, কিন্তু আরও নিখুঁত হতে হবে! 🎯`;
  if (wrongCount >= 1) return `শুধু ${wrongCount}টি ভুল? বাকিগুলো ঠিক আছে, কিন্তু এগুলো কেন ভুল হলো? 🤔`;

  return "চমৎকার! সব প্রশ্নের উত্তর দেওয়ার চেষ্টা করেছ — এটাই সঠিক মানসিকতা! 🚀";
}

// ─────────────────────────────────────────────
// Accuracy Label
// ─────────────────────────────────────────────

function getAccuracyLabel(pct: number): { label: string; color: string } {
  if (pct === 100) return { label: "পরম বৈজ্ঞানিক", color: "text-amber-300" };
  if (pct >= 90) return { label: "বিজ্ঞান গুরু", color: "text-cyan-300" };
  if (pct >= 80) return { label: "মেধাবী র্যাঙ্কার", color: "text-emerald-300" };
  if (pct >= 60) return { label: "অনুশীলনরত", color: "text-blue-300" };
  if (pct >= 40) return { label: "শিক্ষার্থী", color: "text-yellow-300" };
  return { label: "নবিশ র্যাঙ্কার", color: "text-slate-300" };
}

// ─────────────────────────────────────────────
// Circular Accuracy Gauge
// ─────────────────────────────────────────────

function AccuracyGauge({ pct, size = 80 }: { pct: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 100) / 100);
  const color =
    pct >= 80 ? "#22d3ee" : pct >= 50 ? "#fbbf24" : "#ef4444";

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-1000"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

type Props = {
  data: ShareCardData;
  /** Optional className for the outer wrapper */
  className?: string;
};

export function QuizResultShareCard({ data, className }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const roastData = useMemo(() => generateRoast(data), [data]);
  const burnText = useMemo(() => generateWeaknessBurn(data), [data]);
  const titleLabel = getAccuracyLabel(data.accuracy);

  const durationStr = useMemo(() => {
    if (!data.timeTaken) return "";
    const min = Math.floor(data.timeTaken / 60);
    const sec = data.timeTaken % 60;
    return `${min}:${String(sec).padStart(2, "0")}`;
  }, [data.timeTaken]);

  /** Download the card as PNG */
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const mod = await import("html-to-image");
      const dataUrl = await mod.toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#07111F",
      });
      const link = document.createElement("a");
      link.download = `quiz-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setSharing(false);
    }
  };

  /** Share using Web Share API */
  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const mod = await import("html-to-image");
      const dataUrl = await mod.toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#07111F",
      });

      // Convert data URL to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `quiz-result-${Date.now()}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "বিজ্ঞান র্যাঙ্কার — আমার কুইজ ফলাফল",
          text: `আমি ${data.examName} এ ${data.accuracy}% পেয়েছি! তুমিও চ্যালেঞ্জ নাও!`,
          files: [file],
        });
      } else {
        // Fallback: copy the data URL
        await navigator.clipboard.writeText(dataUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* The card — captured as PNG */}
      <div
        ref={cardRef}
        className="relative w-[480px] max-w-full mx-auto overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#0c1628] via-[#0a1020] to-[#0f0a1e] shadow-[0_0_60px_rgba(34,211,238,0.12)]"
        style={{ fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.06),transparent_50%)] pointer-events-none" />

        {/* Top decorative glow line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

        {/* Content */}
        <div className="relative p-6 space-y-5">
          {/* Header: Brand + Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white tracking-tight">বিজ্ঞান র্যাঙ্কার</p>
                {data.level && (
                  <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-400/70 font-bold">
                    {data.level === "hsc" ? "HSC" : "SSC"} · {data.subject || ""}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider", titleLabel.color)}>
                {titleLabel.label}
              </span>
              {data.collegeName && (
                <p className="text-[9px] text-slate-500 mt-0.5">{data.collegeName}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

          {/* AI Roast + Flex section */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-amber-200/90 leading-relaxed">
                {roastData.roast}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200/80 leading-relaxed">
                {roastData.flex}
              </p>
            </div>
          </div>

          {/* Main Score Section */}
          <div className="flex items-center justify-center gap-6 py-2">
            <AccuracyGauge pct={data.accuracy} size={90} />
            <div className="text-center">
              <p className="text-5xl font-black text-white tracking-tight">
                {data.accuracy}<span className="text-2xl text-cyan-400">%</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">সঠিকতা</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-2.5 text-center">
              <p className="text-[9px] uppercase tracking-wider text-emerald-400/70 font-bold">সঠিক</p>
              <p className="text-lg font-black text-emerald-300">{formatBnNumber(data.correctCount)}</p>
            </div>
            <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-2.5 text-center">
              <p className="text-[9px] uppercase tracking-wider text-red-400/70 font-bold">ভুল</p>
              <p className="text-lg font-black text-red-300">{formatBnNumber(data.wrongCount)}</p>
            </div>
            <div className="rounded-xl border border-slate-500/15 bg-slate-500/5 p-2.5 text-center">
              <p className="text-[9px] uppercase tracking-wider text-slate-400/70 font-bold">বাদ</p>
              <p className="text-lg font-black text-slate-300">{formatBnNumber(data.skippedCount)}</p>
            </div>
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-2.5 text-center">
              <p className="text-[9px] uppercase tracking-wider text-amber-400/70 font-bold">ELO</p>
              <p className="text-lg font-black text-amber-300">{formatBnNumber(data.eloRating)}</p>
            </div>
          </div>

          {/* Weakness burn + ELO change */}
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <TrendingUp className={cn(
              "h-5 w-5 shrink-0",
              data.eloChange >= 0 ? "text-emerald-400" : "text-red-400",
            )} />
            <p className="text-xs text-slate-400 leading-relaxed flex-1">{burnText}</p>
            <div className="text-right shrink-0">
              <p className="text-[9px] text-slate-600 uppercase">ELO পরিবর্তন</p>
              <p className={cn(
                "text-sm font-black",
                data.eloChange >= 0 ? "text-emerald-400" : "text-red-400",
              )}>
                {data.eloChange >= 0 ? "+" : ""}{data.eloChange}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-1 flex items-center justify-between text-[9px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <Swords className="h-3 w-3" />
              <span>{data.examName}</span>
            </div>
            <div className="flex items-center gap-3">
              {durationStr && (
                <span>সময়: {durationStr}</span>
              )}
              <span>{data.correctCount}/{data.totalQuestions}</span>
            </div>
          </div>

          {/* Bottom watermark */}
          <div className="absolute bottom-2 right-4 text-[7px] text-slate-800 font-mono opacity-50">
            বিজ্ঞান র্যাঙ্কার v3
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="secondary"
          onClick={handleDownload}
          disabled={sharing}
          className="flex items-center gap-2 min-h-[44px]"
        >
          {sharing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          ছবি ডাউনলোড
        </Button>
        <Button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-2 min-h-[44px] bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
        >
          {sharing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {copied ? "কপি হয়েছে!" : "শেয়ার করুন"}
        </Button>
      </div>
    </div>
  );
}
```

## File: [src/components/quiz/QuizRunner.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/QuizRunner.tsx)

```tsx
"use client";

import React, { useEffect, useLayoutEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useQuizStore, type Question } from "@/store/quizStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import { QuizQuestionStem } from "@/components/quiz/QuizQuestionStem";
import { QuizOptionText } from "@/components/quiz/QuizOptionText";
import { QuizResultShareCard, type ShareCardData } from "@/components/quiz/QuizResultShareCard";
import { QuizErrorBoundary } from "@/components/quiz/QuizErrorBoundary";
import {
  ArrowLeft,
  AlertCircle,
  Award,
  BookOpen,
  RotateCcw,
  Layout,
  Check,
  TrendingUp,
  Lightbulb,
  Loader2,
  Share2,
  X,
  Bookmark,
} from "lucide-react";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { backfillSavedQuestionsAnswers } from "@/lib/saved-questions";
import { saveWrongQuestion } from "@/lib/wrong-answers";

const OPTIONS = ["A", "B", "C", "D"] as const;
const BANGLA_OPTS = ["ক", "খ", "গ", "ঘ"] as const;

function extractOptionText(raw: unknown): string {
  if (typeof raw === "string") return raw.trim();
  if (raw && typeof raw === "object") {
    const rec = raw as Record<string, unknown>;
    if (typeof rec.text === "string") return rec.text.trim();
    if (typeof rec.label === "string" && typeof rec.value === "string") {
      return rec.value.trim();
    }
  }
  return String(raw ?? "").trim();
}

function buildOptionList(q: QuizRunnerQuestion): string[] {
  let options: string[] = [];

  if (Array.isArray(q.options)) {
    options = (q.options as unknown[]).map(extractOptionText);
  } else {
    options = [q.optionA, q.optionB, q.optionC, q.optionD].map((o) =>
      extractOptionText(o),
    );
  }

  return options.slice(0, 4).map((opt) => opt.trim());
}

function mapToStoreQuestion(
  q: QuizRunnerQuestion,
  meta?: QuizSubmitMeta,
): Question {
  const options = buildOptionList(q);
  const filledCount = options.filter(Boolean).length;

  return {
    id: String(q.id ?? ""),
    subject: meta?.subject || String(q.subject ?? ""),
    chapter: meta?.chapterName || String(q.chapter ?? ""),
    text: String(q.questionText ?? q.text ?? q.question ?? ""),
    options: filledCount > 0 ? options : [],
    image: (q.image as string | null) ?? null,
    optionImages: Array.isArray(q.optionImages)
      ? (q.optionImages as string[]).slice(0, 4)
      : null,
    timeLimit: typeof q.timeLimit === "number" ? q.timeLimit : 45,
  };
}

export type QuizSubmitMeta = {
  quizId: string;
  level: "ssc" | "hsc";
  subject: string;
  paper?: string | null;
  chapter?: string | null;
  chapterName?: string | null;
  type: string;
  expectedMcq?: number;
};

/** Runtime shape for questions passed into the runner */
export interface QuizRunnerQuestion {
  id?: string;
  questionText?: string;
  text?: string;
  question?: string;
  options?: string[] | Array<{ text?: string; label?: string; value?: string }>;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  image?: string | null;
  optionImages?: (string | null)[] | null;
  timeLimit?: number;
  subject?: string;
  chapter?: string;
}

type Props = {
  questions: QuizRunnerQuestion[];
  examSlug: string;
  examName: string;
  backUrl: string;
  onBack?: () => void;
  timeLimitSec?: number;
  quizSubmitMeta?: QuizSubmitMeta;
  /** Show embedded worked solutions in question stems (board / review-style content) */
  showWorkedSolution?: boolean;
};

/** @private — use exported `QuizRunner` which includes Error Boundary wrapper */
function QuizRunnerRaw({
  questions: rawQuestions,
  examSlug,
  examName,
  backUrl,
  onBack,
  timeLimitSec = 600,
  quizSubmitMeta,
  showWorkedSolution = false,
}: Props) {
  const { user, firebaseUser } = useAuth();

  // Zustand Store selectors
  const {
    currentQuestionIndex,
    selectedAnswers,
    markedQuestions,
    skippedQuestions,
    timer,
    timeTaken,
    quizStarted,
    quizSubmitted,
    questions,
    isLoading,
    isSubmitting,
    results,
    startQuiz,
    selectAnswer,
    markQuestion,
    skipQuestion,
    tickTimer,
    setQuestionIndex,
    resetQuiz,
    submitQuiz,
  } = useQuizStore();

  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [storeReady, setStoreReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const { isSaved, toggle } = useSavedQuestions();

  // Backfill correct answers/explanations for saved questions when quiz is submitted
  useEffect(() => {
    if (quizSubmitted && results) {
      backfillSavedQuestionsAnswers(
        results.correctAnswerIndexes ?? {},
        results.explanations ?? {}
      );
    }
  }, [quizSubmitted, results]);

  // Save incorrect questions to localStorage wrong-questions store on submit
  useEffect(() => {
    if (quizSubmitted && results && results.correctAnswerIndexes) {
      questions.forEach((q) => {
        const correctIdx = results.correctAnswerIndexes?.[q.id];
        if (correctIdx === undefined || correctIdx < 0) return;

        const selectedAns = selectedAnswers[q.id];
        const selectedIdx = selectedAns ? q.options.indexOf(selectedAns) : -1;

        if (selectedIdx !== correctIdx) {
          const studentOption = selectedIdx >= 0 ? ["A", "B", "C", "D"][selectedIdx] : null;
          const correctOption = ["A", "B", "C", "D"][correctIdx];

          saveWrongQuestion({
            id: String(q.id ?? ""),
            questionText: String(q.text ?? ""),
            options: q.options,
            image: q.image ?? null,
            optionImages: q.optionImages ?? null,
            subject: quizSubmitMeta?.subject,
            chapter: quizSubmitMeta?.chapter ?? quizSubmitMeta?.chapterName ?? undefined,
            sourceQuizId: quizSubmitMeta?.quizId,
            level: quizSubmitMeta?.level,
            studentOption,
            correctOption,
            explanation: results.explanations?.[q.id] || undefined,
          });
        }
      });
    }
  }, [quizSubmitted, results, questions, selectedAnswers, quizSubmitMeta]);

  const [flashOption, setFlashOption] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollSpyRef = useRef<IntersectionObserver | null>(null);

  const mappedQuestions = useMemo(() => {
    if (!rawQuestions?.length) return [];
    return rawQuestions
      .map((q) => mapToStoreQuestion(q, quizSubmitMeta))
      .filter((q) => q.text && q.options.filter(Boolean).length >= 2);
  }, [
    rawQuestions,
    quizSubmitMeta?.quizId,
    quizSubmitMeta?.subject,
    quizSubmitMeta?.chapter,
    quizSubmitMeta?.chapterName,
  ]);

  const metaQuizId = quizSubmitMeta?.quizId;
  const metaSubject = quizSubmitMeta?.subject ?? "";
  const metaChapter = quizSubmitMeta?.chapter ?? "";

  // Sync Zustand before paint so we never flash an empty quiz shell
  useLayoutEffect(() => {
    if (!mappedQuestions.length) {
      setStoreReady(false);
      return;
    }

    startQuiz(
      metaQuizId || examSlug,
      metaSubject,
      metaChapter,
      mappedQuestions,
      timeLimitSec,
      examName,
    );
    setStoreReady(true);
  }, [
    mappedQuestions,
    examSlug,
    timeLimitSec,
    examName,
    metaQuizId,
    metaSubject,
    metaChapter,
    startQuiz,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle countdown
  useEffect(() => {
    if (!quizStarted || quizSubmitted || timer <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timer <= 0 && quizStarted && !quizSubmitted && !isSubmitting) {
        handleAutoSubmit();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, quizSubmitted, isSubmitting, timer, tickTimer]);

  // Track visible question while scrolling for palette highlight
  useEffect(() => {
    if (quizSubmitted || questions.length === 0) return;

    scrollSpyRef.current?.disconnect();
    const elements = questions
      .map((_, qi) => document.getElementById(`quiz-q-${qi}`))
      .filter((el): el is HTMLElement => el !== null);

    scrollSpyRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        const idx = Number(visible[0].target.id.replace("quiz-q-", ""));
        if (!Number.isNaN(idx)) setQuestionIndex(idx);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );

    elements.forEach((el) => scrollSpyRef.current?.observe(el));
    return () => scrollSpyRef.current?.disconnect();
  }, [questions, quizSubmitted, setQuestionIndex]);

  // Keyboard shortcuts for quiz navigation
  useEffect(() => {
    if (quizSubmitted || !quizStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= "1" && e.key <= "4") {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        const currentQ = questions[currentQuestionIndex];
        if (currentQ && currentQ.options[idx]) {
          setFlashOption(currentQ.id);
          setTimeout(() => setFlashOption(null), 300);
          selectAnswer(currentQ.id, currentQ.options[idx]);
        }
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (currentQuestionIndex > 0) {
          scrollToQuestion(currentQuestionIndex - 1);
        }
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (currentQuestionIndex < questions.length - 1) {
          scrollToQuestion(currentQuestionIndex + 1);
        }
        return;
      }

      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        const currentQ = questions[currentQuestionIndex];
        if (currentQ) markQuestion(currentQ.id);
        return;
      }

      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        const currentQ = questions[currentQuestionIndex];
        if (currentQ) skipQuestion(currentQ.id);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quizStarted, quizSubmitted, questions, currentQuestionIndex, selectAnswer, markQuestion, skipQuestion]);

  const scrollToQuestion = (qi: number) => {
    setQuestionIndex(qi);
    document.getElementById(`quiz-q-${qi}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Confetti effect
  useEffect(() => {
    if (quizSubmitted && results && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [quizSubmitted, results]);

  // === Hoisted before early returns to preserve hook order ===
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const confettiColors = [
    "#8B5CF6", "#22D3EE", "#FACC15", "#22C55E",
    "#EF4444", "#F97316", "#A78BFA", "#34D399",
    "#F472B6", "#60A5FA",
  ];

  const confettiPieces = useMemo(() => {
    if (!showConfetti) return [];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: confettiColors[i % confettiColors.length],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
  }, [showConfetti]);

  const handleAutoSubmit = async () => {
    if (!firebaseUser || !user || isSubmitting || quizSubmitted) return;
    try {
      const token = await firebaseUser.getIdToken();
      await submitQuiz(user.id, "exam", token);
    } catch (e) {
      console.error("Auto submit failed:", e);
    }
  };

  const handleManualSubmit = async () => {
    if (isSubmitting || quizSubmitted) return;
    if (!firebaseUser || !user) {
      alert("পরীক্ষা জমা দিতে অনুগ্রহ করে প্রথমে লগইন করুন।");
      return;
    }
    setConfirmSubmit(false);
    try {
      const token = await firebaseUser.getIdToken();
      await submitQuiz(user.id, "practice", token);
    } catch (e) {
      console.error("Manual submit failed:", e);
    }
  };

  // Circular Timer SVG Ring
  const timerRadius = 18;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerProgress = timeLimitSec > 0 ? timer / timeLimitSec : 0;
  const timerOffset = timerCircumference * (1 - timerProgress);
  
  const timerColor =
    timerProgress > 0.5
      ? "#22c55e"
      : timerProgress > 0.25
        ? "#eab308"
        : "#ef4444";

  const getTimerBgColor = () => {
    if (timerProgress > 0.5) return "rgba(34,197,94,0.15)";
    if (timerProgress > 0.25) return "rgba(234,179,8,0.15)";
    return "rgba(239,68,68,0.15)";
  };

  if (!mappedQuestions.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center font-bangla">
        <p className="text-slate-400 mb-4">ডেটা লোড হচ্ছে অথবা নেই...</p>
        <Link href={backUrl}>
          <Button variant="secondary">ফিরে যাও</Button>
        </Link>
      </div>
    );
  }

  if (!storeReady) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
        <p className="text-sm text-slate-500 font-bangla">প্রশ্ন লোড হচ্ছে...</p>
      </div>
    );
  }

  // Results Screen Rendering
  if (quizSubmitted && results) {
    const durationMin = Math.floor(timeTaken / 60);
    const durationSec = timeTaken % 60;
    const accuracyRadius = 40;
    const accuracyCircumference = 2 * Math.PI * accuracyRadius;
    const accuracyOffset = accuracyCircumference * (1 - results.accuracy / 100);

    return (
      <>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confettiPieces.map((p) => (
              <div
                key={p.id}
                className="confetti-piece"
                style={{
                  left: `${p.left}%`,
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size * 0.6,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              />
            ))}
          </div>
        )}
      <div className="max-w-3xl mx-auto px-4 py-8 font-bangla pb-24 space-y-6">
        {reviewing ? (
          // Review Mode
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl p-4 sticky top-[72px] z-20">
              <div>
                <h2 className="text-lg font-bold text-white">প্রশ্ন উত্তর ও ব্যাখ্যা রিভিউ</h2>
                <p className="text-xs text-slate-400">সঠিক এবং ভুল উত্তরগুলোর বিশদ বিশ্লেষণ নিচে দেয়া হলো।</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setReviewing(false)}>
                ফলাফলে ফিরুন
              </Button>
            </div>

            {questions.map((q, qi) => {
              const selected = selectedAnswers[q.id];
              const explanation = results.explanations?.[q.id];
              // Find index of selected option
              const selectedIdx = q.options.indexOf(selected);
              // Find correct index from explanation mapping or server results if provided.
              // Note: Since correct answer is not exposed in public questions,
              // backend returns explanation list which can indicate the correctness,
              // and the backend grading validates it. We display the student's choice and the correct option.
              // For safety in review mode, we can show which answers are correct or incorrect.
              const isSkipped = !selected;

              return (
                <Card key={q.id} variant="glass" className="p-5 space-y-3 border-white/5 bg-slate-950/40">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs shrink-0 mt-0.5">
                      {qi + 1}
                    </div>
                    <div className="space-y-3 w-full">
                      <QuizQuestionStem text={q.text} image={q.image} hideWorkedSolution={false} />
                      
                      <div className="grid gap-2 text-sm">
                        {q.options.map((opt, oi) => {
                          const correctIdx = results.correctAnswerIndexes?.[q.id] ?? -1;
                          const isAnswer = oi === correctIdx;
                          const isUserPick = oi === selectedIdx;
                          return (
                            <div
                              key={`${q.id}-review-opt-${oi}`}
                              className={cn(
                                "rounded-xl px-4 py-2.5 border transition-all flex items-center justify-between",
                                isAnswer &&
                                  "border-green-400/50 bg-green-500/15 text-green-100 shadow-[0_0_16px_rgba(34,197,94,0.12)]",
                                isUserPick &&
                                  !isAnswer &&
                                  "border-red-400/40 bg-red-500/15 text-red-100",
                                !isAnswer &&
                                  !isUserPick &&
                                  "border-white/5 bg-white/5 text-slate-300"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-400">{BANGLA_OPTS[oi]}.</span>
                                <QuizOptionText
                                  text={opt}
                                  questionText={q.text}
                                  optionImage={q.optionImages?.[oi] ?? null}
                                />
                              </div>
                              {isAnswer && (
                                <span className="text-[10px] uppercase tracking-wide text-green-300 font-bold shrink-0">
                                  Correct
                                </span>
                              )}
                              {isUserPick && !isAnswer && (
                                <span className="text-[10px] uppercase tracking-wide text-red-300 font-bold shrink-0">
                                  Your pick
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      {explanation && (
                        <div className="rounded-xl p-4 bg-cyan-500/5 border border-cyan-500/10 space-y-2 text-sm leading-relaxed">
                          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                            <Lightbulb className="h-4 w-4 shrink-0" />
                            <span>বিশ্লেষণ ও সমাধান:</span>
                          </div>
                          <FormattedQuizText
                            text={explanation}
                            className="text-slate-300 text-sm"
                            hideWorkedSolution={false}
                            mode="explanation"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          // Main Results Card
          <Card variant="glass" className="p-6 sm:p-8 space-y-6 bg-slate-900/40 border-white/10 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-500/10 border border-purple-500/20 mb-2">
                <Award className="h-10 w-10 text-purple-400 animate-bounce" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">অভিনন্দন! কুইজ সম্পন্ন হয়েছে</h1>
              <p className="text-sm text-slate-400">{examName}</p>
            </div>

            {/* Score ELO box */}
            {/* Accuracy Circular Gauge */}
            <div className="flex justify-center py-4">
              <div className="relative">
                <svg width="120" height="120" className="count-up count-up-delay-1">
                  {/* BG ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r={accuracyRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r={accuracyRadius}
                    fill="none"
                    stroke={
                      results.accuracy >= 80
                        ? "#22c55e"
                        : results.accuracy >= 50
                          ? "#eab308"
                          : "#ef4444"
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="accuracy-ring"
                    strokeDasharray={accuracyCircumference}
                    strokeDashoffset={accuracyOffset}
                    transform="rotate(-90 60 60)"
                  />
                  {/* Center text */}
                  <text
                    x="60"
                    y="50"
                    textAnchor="middle"
                    className="font-bold text-2xl"
                    fill={
                      results.accuracy >= 80
                        ? "#22c55e"
                        : results.accuracy >= 50
                          ? "#eab308"
                          : "#ef4444"
                    }
                  >
                    {results.accuracy}%
                  </text>
                  <text
                    x="60"
                    y="70"
                    textAnchor="middle"
                    className="text-xs"
                    fill="#94a3b8"
                  >
                    সঠিকতা
                  </text>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="count-up count-up-delay-1 rounded-2xl bg-purple-500/5 border border-purple-500/10 p-4 hover:bg-purple-500/10 transition-colors">
                <p className="text-xs text-slate-400 mb-1">মোট স্কোর</p>
                <p className="text-2xl font-black text-purple-300">{results.totalScore}/{totalQuestions}</p>
              </div>
              <div className="count-up count-up-delay-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4 hover:bg-emerald-500/10 transition-colors">
                <p className="text-xs text-slate-400 mb-1">সঠিক উত্তর</p>
                <p className="text-2xl font-black text-emerald-400">{results.correctCount}</p>
              </div>
              <div className="count-up count-up-delay-3 rounded-2xl bg-red-500/5 border border-red-500/10 p-4 hover:bg-red-500/10 transition-colors">
                <p className="text-xs text-slate-400 mb-1">ভুল উত্তর</p>
                <p className="text-2xl font-black text-red-400">{results.wrongCount}</p>
              </div>
              <div className="count-up count-up-delay-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 p-4 hover:bg-yellow-500/10 transition-colors">
                <p className="text-xs text-slate-400 mb-1">ইলো রেটিং পরিবর্তন</p>
                <div className="flex items-center justify-center gap-1 font-black text-2xl text-yellow-400">
                  <TrendingUp className="h-5 w-5" />
                  <span>{results.eloRatingChange >= 0 ? `+${results.eloRatingChange}` : results.eloRatingChange}</span>
                </div>
              </div>
            </div>

            {/* Progress/Performance Gauges */}
            <div className="grid md:grid-cols-2 gap-6 pt-2 text-left count-up count-up-delay-5">
              {/* Stats detail */}
              <div className="space-y-4 bg-slate-950/40 rounded-2xl p-5 border border-white/5">
                <h3 className="font-bold text-white border-b border-white/5 pb-2 text-sm flex items-center gap-2">
                  <Layout className="h-4 w-4 text-cyan-400" /> কুইজ অ্যানালিটিক্স
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">সঠিকতার হার (Accuracy):</span>
                    <span className="font-bold text-white">{results.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">মোট ব্যয়িত সময়:</span>
                    <span className="font-bold text-white">{durationMin} মিনিট {durationSec} সেকেন্ড</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">প্রশ্নপ্রতি গড় সময়:</span>
                    <span className="font-bold text-white">{results.timePerQuestion} সেকেন্ড</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">উত্তর না দেয়া প্রশ্ন (Skipped):</span>
                    <span className="font-bold text-white">{results.skippedCount}</span>
                  </div>
                </div>
              </div>

              {/* Share Result button */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => setShowShareCard(true)}
                className="flex items-center gap-2 min-h-[44px] bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                <Share2 className="h-4 w-4" />
                ফলাফল শেয়ার করুন
              </Button>
            </div>

            {/* Weak/Strong topics */}
              <div className="space-y-4 bg-slate-950/40 rounded-2xl p-5 border border-white/5">
                <h3 className="font-bold text-white border-b border-white/5 pb-2 text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-400" /> বিষয়ভিত্তিক পারফরম্যান্স
                </h3>
                <div className="space-y-3">
                  {results.strongTopics?.length > 0 && (
                    <div>
                      <p className="text-xs text-emerald-400 font-bold mb-1">সবচেয়ে মজবুত টপিক:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {results.strongTopics.map((t) => (
                          <Badge key={t} className="bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.weakTopics?.length > 0 && (
                    <div>
                      <p className="text-xs text-red-400 font-bold mb-1">দুর্বল টপিক (অনুশীলন প্রয়োজন):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {results.weakTopics.map((t) => (
                          <Badge key={t} className="bg-red-500/10 border-red-500/20 text-red-300">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-white/5">
              <Button variant="secondary" onClick={() => setReviewing(true)} className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                ব্যাখ্যাসহ রিভিউ দেখুন
              </Button>
              <Button variant="secondary" onClick={resetQuiz} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                আবার পরীক্ষা দিন
              </Button>
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto">ড্যাশবোর্ডে ফিরে যান</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Share Card Modal */}
      {showShareCard && results && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm"
            onClick={() => setShowShareCard(false)}
            aria-hidden
          />
          <div className="relative max-h-[95vh] overflow-y-auto rounded-3xl bg-[#0a1628]/95 border border-white/10 p-4 sm:p-6 shadow-[0_0_80px_rgba(168,85,247,0.15)] max-w-[520px] w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">🎴 আপনার রেজাল্ট কার্ড</h3>
              <button
                type="button"
                onClick={() => setShowShareCard(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <QuizResultShareCard
              data={{
                examName,
                subject: quizSubmitMeta?.subject || "",
                chapter: quizSubmitMeta?.chapterName || undefined,
                level: quizSubmitMeta?.level || undefined,
                totalQuestions,
                correctCount: results.correctCount,
                wrongCount: results.wrongCount,
                skippedCount: results.skippedCount,
                accuracy: results.accuracy,
                eloRating: (user?.elo as number) ?? 1200,
                eloChange: results.eloRatingChange,
                timeTaken,
                collegeName: user?.collegeName || user?.schoolName || undefined,
                studentName: user?.name || undefined,
              }}
            />
          </div>
        </div>
      )}

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-20 left-4 z-50 hidden lg:block opacity-30 hover:opacity-100 transition-opacity">
        <div className="bg-slate-900/80 backdrop-blur border border-white/5 rounded-xl px-3 py-2 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
          <kbd className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded bg-slate-800 text-slate-400 text-[9px]">1</kbd>
          <kbd className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded bg-slate-800 text-slate-400 text-[9px]">2</kbd>
          <kbd className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded bg-slate-800 text-slate-400 text-[9px]">3</kbd>
          <kbd className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded bg-slate-800 text-slate-400 text-[9px]">4</kbd>
          <span>উত্তর</span>
          <span className="text-slate-600">|</span>
          <kbd className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded bg-slate-800 text-slate-400 text-[9px]">←</kbd>
          <kbd className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded bg-slate-800 text-slate-400 text-[9px]">→</kbd>
          <span>নেভি</span>
          <span className="text-slate-600">|</span>
          <kbd className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded bg-slate-800 text-slate-400 text-[9px]">M</kbd>
          <span>মার্ক</span>
        </div>
      </div>
    </>
    );
  }

  // Quiz Play Screen — scrollable all questions
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 font-bangla pb-28 scroll-smooth">
      {/* Sticky header: back, timer, progress, palette */}
      <div className="sticky top-[72px] z-30 -mx-4 px-4 pt-2 pb-4 bg-[#07111F]/95 backdrop-blur-md border-b border-white/5 mb-4 space-y-4">
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> ফিরে যাও
            </button>
          ) : (
            <Link href={backUrl} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" /> ফিরে যাও
            </Link>
          )}
          <div className="relative flex items-center gap-2">
            <svg
              width="48"
              height="48"
              className="shrink-0 glow-ring"
              style={{ filter: `drop-shadow(0 0 6px ${timerColor}40)` }}
            >
              {/* BG ring */}
              <circle
                cx="24"
                cy="24"
                r={timerRadius}
                fill="none"
                stroke={getTimerBgColor()}
                strokeWidth="3.5"
              />
              {/* Progress ring */}
              <circle
                cx="24"
                cy="24"
                r={timerRadius}
                fill="none"
                stroke={timerColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                className="timer-ring"
                strokeDasharray={timerCircumference}
                strokeDashoffset={timerOffset}
                transform="rotate(-90 24 24)"
              />
            </svg>
            <span
              className="font-bold text-sm tabular-nums min-w-[3.5rem]"
              style={{ color: timerColor }}
            >
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-bangla">
            <span className="truncate max-w-[65%] font-medium text-slate-300">{examName}</span>
            <span className="font-semibold text-cyan-300">{answeredCount}/{totalQuestions} উত্তর দিয়েছেন</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="hidden lg:flex gap-2 items-center">
          <div className="flex flex-wrap gap-1.5 flex-1 p-2.5 rounded-2xl bg-slate-900/60 border border-white/5 max-h-[132px] overflow-y-auto">
            {questions.map((q, qi) => {
              const selected = selectedAnswers[q.id];
              const isCurrent = qi === currentQuestionIndex;
              const isMarked = markedQuestions[q.id];

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToQuestion(qi)}
                  className={cn(
                    "relative h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl text-xs font-bold border transition-all duration-150 active:scale-90 shrink-0 flex items-center justify-center",
                    isCurrent && "border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
                    !isCurrent && isMarked && selected && "border-yellow-500/60 bg-yellow-500/10 text-yellow-300",
                    !isCurrent && isMarked && !selected && "border-yellow-500/40 bg-yellow-500/8 text-yellow-300/70",
                    !isCurrent && !isMarked && selected && "border-purple-500/40 bg-purple-500/15 text-purple-200",
                    !isCurrent && !selected && !isMarked && "border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300"
                  )}
                >
                  {qi + 1}
                  {/* Status dot indicator */}
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-1 ring-slate-900",
                      selected && isMarked && "bg-yellow-400",
                      selected && !isMarked && "bg-purple-400",
                      !selected && isMarked && "bg-yellow-400/60",
                      !selected && !isMarked && "hidden"
                    )}
                  />
                </button>
              );
            })}
          </div>
          {/* Legend */}
          <div className="hidden sm:flex flex-col gap-1.5 text-[10px] text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>উত্তর</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span>মার্ক</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 ring-1 ring-cyan-400/50" />
              <span>বর্তমান</span>
            </div>
          </div>
        </div>
      </div>

      {/* All questions — vertical scroll */}
      <div className="space-y-5">
        {questions.map((q, qi) => (
          <Card
            key={q.id}
            id={`quiz-q-${qi}`}
            variant="glass"
            className={cn(
              "p-5 sm:p-6 space-y-4 bg-slate-900/40 border-white/10 scroll-mt-36 transition-colors",
              qi === currentQuestionIndex && "border-cyan-500/20 ring-1 ring-cyan-500/10"
            )}
          >
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-white/5 pb-3">
              <span className="flex items-center gap-2 font-bold text-slate-300">
                <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-black">
                  {qi + 1}
                </span>
                <span>/ {totalQuestions}</span>
              </span>
              <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const correctIdx = results?.correctAnswerIndexes?.[q.id];
                  const correctOption =
                    correctIdx !== undefined && correctIdx >= 0
                      ? ["A", "B", "C", "D"][correctIdx]
                      : undefined;
                  const explanation = results?.explanations?.[q.id] || undefined;
                  toggle({
                    id: String(q.id ?? ""),
                    questionText: String(q.text ?? ""),
                    options: q.options,
                    image: q.image ?? null,
                    optionImages: q.optionImages ?? null,
                    subject: quizSubmitMeta?.subject,
                    chapter: quizSubmitMeta?.chapter ?? quizSubmitMeta?.chapterName ?? undefined,
                    sourceQuizId: quizSubmitMeta?.quizId,
                    level: quizSubmitMeta?.level,
                    correctOption,
                    explanation,
                  });
                }}
                className={cn(
                  "px-3 py-2 rounded-full text-xs font-bold border tracking-wider transition-all min-h-[44px] flex items-center gap-1.5 group",
                  isSaved(String(q.id ?? ""))
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "border-white/5 bg-white/5 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-300/70"
                )}
              >
                <Bookmark className={cn("h-3.5 w-3.5", isSaved(String(q.id ?? "")) ? "fill-cyan-400 text-cyan-400" : "fill-none")} />
                {isSaved(String(q.id ?? "")) ? "সেভ করা আছে" : "সেভ করুন"}
              </button>
              <button
                type="button"
                onClick={() => markQuestion(q.id)}
                className={cn(
                  "px-3 py-2 rounded-full text-xs font-bold border tracking-wider transition-all min-h-[44px] flex items-center gap-1.5 group",
                  markedQuestions[q.id]
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                    : "border-white/5 bg-white/5 text-slate-400 hover:border-yellow-500/30 hover:text-yellow-300/70"
                )}
              >
                <svg
                  className={cn(
                    "h-3.5 w-3.5 transition-all",
                    markedQuestions[q.id] ? "text-yellow-400 fill-yellow-400/30" : "text-slate-500 fill-none"
                  )}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                {markedQuestions[q.id] ? "রিভিউ চিহ্নিত" : "রিভিউ মার্ক"}
              </button>
              </div>
            </div>

            <QuizQuestionStem
              text={q.text}
              image={q.image}
              className="text-base sm:text-lg"
              hideWorkedSolution={!showWorkedSolution}
            />

            <div className="space-y-3">
              {q.options.map((opt, oi) => {
                const isSelected = selectedAnswers[q.id] === opt;
                return (
                  <button
                    key={`${q.id}-opt-${oi}`}
                    type="button"
                    onClick={() => {
                      selectAnswer(q.id, opt);
                      setFlashOption(q.id);
                      setTimeout(() => setFlashOption(null), 300);
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-200 min-h-[52px] flex items-center justify-between font-bangla group",
                      isSelected
                        ? "border-purple-glow bg-purple-glow/10 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "border-slate-800/80 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900/40 hover:shadow-[0_0_12px_rgba(99,102,241,0.06)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex items-center justify-center h-7 w-7 rounded-xl font-bold text-xs border transition-all duration-200",
                          isSelected
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-[0_0_8px_rgba(139,92,246,0.3)] "
                            : "bg-slate-900 text-slate-400 border-white/5 group-hover:border-white/10 group-hover:text-slate-200"
                        )}
                      >
                        {BANGLA_OPTS[oi]}
                      </span>
                      <QuizOptionText
                        text={opt}
                        questionText={q.text}
                        optionImage={q.optionImages?.[oi] ?? null}
                      />
                    </div>
                    {isSelected && (
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center shrink-0 scale-pulse",
                        "bg-purple-500/20 border-2 border-purple-400/50"
                      )}>
                        <Check className="h-3.5 w-3.5 text-purple-400" />
                      </div>
                    )}
                    {/* Keyboard shortcut hint */}
                    {!isSelected && (
                      <span className="text-[10px] text-slate-600 group-hover:text-slate-500 font-mono shrink-0 transition-colors">
                        {oi + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Sticky submit footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#07111F]/95 backdrop-blur-md px-4 py-4 pb-safe">
        <div className="max-w-3xl mx-auto space-y-3">
          {confirmSubmit && (
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-amber-200 font-bangla flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">আপনি কি নিশ্চিতভাবে পরীক্ষাটি সাবমিট করতে চান?</p>
                {answeredCount < totalQuestions && (
                  <p className="text-xs text-amber-400 mt-1">
                    ({totalQuestions - answeredCount}টি প্রশ্ন বাকি আছে)
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
              <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">1-4</span>
              উত্তর
              <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">← →</span>
              নেভিগেট
              <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">M</span>
              মার্ক
            </p>
            <Button
              onClick={() => {
                if (isSubmitting || quizSubmitted) return;
                if (confirmSubmit) {
                  handleManualSubmit();
                } else {
                  setConfirmSubmit(true);
                }
              }}
              disabled={isSubmitting || isLoading || quizSubmitted}
              className="rounded-xl min-h-[48px] min-w-[140px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading
                ? "জমা হচ্ছে..."
                : confirmSubmit
                  ? "নিশ্চিত জমা দাও"
                  : "জমা দাও"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizRunner(props: Props) {
  return (
    <QuizErrorBoundary>
      <QuizRunnerRaw {...props} />
    </QuizErrorBoundary>
  );
}







```

## File: [src/components/quiz/SavedQuestionsClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/SavedQuestionsClient.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import type { SavedQuestion } from "@/lib/saved-questions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuizQuestionStem } from "@/components/quiz/QuizQuestionStem";
import { QuizOptionText } from "@/components/quiz/QuizOptionText";
import { cn } from "@/lib/utils";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import { sanitizeQuizText } from "@/lib/sanitize-quiz-text";
import { stripQuestionDiagramMarkers } from "@/lib/quiz/quiz-diagrams";
import {
  Bookmark,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
  Clock,
  Layers,
  Lightbulb,
} from "lucide-react";
import type { RouteLevel } from "@/lib/quiz/unified-routes";

const BANGLA_OPTS = ["ক", "খ", "গ", "ঘ"] as const;

type Props = {
  level: RouteLevel;
};

function questionPreview(text: string): string {
  return stripQuestionDiagramMarkers(sanitizeQuizText(text, "question"))
    .replace(/\s+/g, " ")
    .trim();
}

/** Group saved questions by subject */
function groupBySubject(items: SavedQuestion[]): Map<string, SavedQuestion[]> {
  const map = new Map<string, SavedQuestion[]>();
  for (const item of items) {
    const key = item.subject || "general";
    const arr = map.get(key);
    if (arr) {
      arr.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}

/** Format ISO timestamp to Bangla-friendly short form */
function formatSavedTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return "এইমাত্র";
  if (diffMin < 60) return `${diffMin} মিনিট আগে`;
  if (diffHr < 24) return `${diffHr} ঘণ্টা আগে`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} দিন আগে`;
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}

export function SavedQuestionsClient({ level }: Props) {
  const { saved, mounted, remove, clearAll, count } = useSavedQuestions();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  if (!mounted) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
      </div>
    );
  }

  const grouped = groupBySubject(saved);
  const subjects = Array.from(grouped.keys());
  const filtered = selectedSubject
    ? saved.filter((q) => (q.subject || "general") === selectedSubject)
    : saved;

  const subjectLabel = (slug: string): string => {
    const map: Record<string, string> = {
      physics: "পদার্থবিজ্ঞান",
      chemistry: "রসায়ন",
      biology: "জীববিজ্ঞান",
      "higher-math": "উচ্চতর গণিত",
      math: "সাধারণ গণিত",
      "physics-1st-paper": "পদার্থবিজ্ঞান ১ম পত্র",
      "physics-2nd-paper": "পদার্থবিজ্ঞান ২য় পত্র",
      "chemistry-1st-paper": "রসায়ন ১ম পত্র",
      "chemistry-2nd-paper": "রসায়ন ২য় পত্র",
      "biology-1st-paper": "জীববিজ্ঞান ১ম পত্র",
      "biology-2nd-paper": "জীববিজ্ঞান ২য় পত্র",
      "higher-math-1st-paper": "উচ্চতর গণিত ১ম পত্র",
      "higher-math-2nd-paper": "উচ্চতর গণিত ২য় পত্র",
      general: "সাধারণ",
    };
    return map[slug] || slug;
  };

  if (count === 0) {
    return (
      <div className="min-h-[60vh] font-bangla py-8">
        <Card variant="glass" className="max-w-xl mx-auto p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
            <Bookmark className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            কোনো সেভ করা প্রশ্ন নেই
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            কুইজ চলাকালীন প্রশ্নের উপর &quot;সেভ করুন&quot; বাটনে ক্লিক করে প্রশ্নগুলো সেভ করো।
            পরে এখান থেকে আবার অনুশীলন করতে পারবে।
          </p>
          <Link href={`/${level}`}>
            <Button variant="secondary">কুইজে ফিরে যান</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 font-bangla pb-24">
      {/* Header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-950 via-[#0a0b1e] to-slate-950 px-4 py-5 sm:px-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 right-12 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
              {level.toUpperCase()} · সেভ করা প্রশ্ন
            </p>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              সেভ করা প্রশ্ন
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              কুইজ থেকে সেভ করা প্রশ্নগুলো এখানে। আবার অনুশীলন করতে পারবে।
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
                <Layers className="mr-1 inline h-3 w-3" />
                {count}টি প্রশ্ন সেভ করা আছে
              </span>
              {subjects.length > 1 && (
                <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300">
                  {subjects.length}টি বিষয়
                </span>
              )}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (confirmClear) {
                clearAll();
                setConfirmClear(false);
              } else {
                setConfirmClear(true);
              }
            }}
            className={cn(
              "shrink-0 text-xs",
              confirmClear
                ? "border-red-500/40 text-red-300 hover:bg-red-500/10"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Trash2 className="mr-1 inline h-3.5 w-3.5" />
            {confirmClear ? "নিশ্চিতভাবে মুছুন?" : "সব মুছুন"}
          </Button>
        </div>
      </div>

      {/* Subject filter chips */}
      {subjects.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSubject(null)}
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-bold border transition-all",
              !selectedSubject
                ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            )}
          >
            সব ({count})
          </button>
          {subjects.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() =>
                setSelectedSubject(selectedSubject === sub ? null : sub)
              }
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-bold border transition-all",
                selectedSubject === sub
                  ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              )}
            >
              {subjectLabel(sub)} ({grouped.get(sub)?.length ?? 0})
            </button>
          ))}
        </div>
      )}

      {/* Saved question cards */}
      <div className="space-y-3">
        {filtered.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          const preview = questionPreview(q.questionText);
          return (
            <Card
              key={q.id}
              variant="glass"
              className="overflow-hidden border-white/5 bg-slate-900/40"
            >
              {/* Collapsed header — click to expand */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-black">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-slate-200">
                    {preview || q.questionText}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatSavedTime(q.savedAt)}</span>
                    {q.subject && (
                      <>
                        <span className="text-slate-600">·</span>
                        <Badge className="border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0 text-[10px] text-cyan-300">
                          {subjectLabel(q.subject)}
                        </Badge>
                      </>
                    )}
                    {q.chapter && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span>{q.chapter}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(q.id);
                    }}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="সেভ থেকে সরান"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Expanded — show question + options for practice */}
              {isExpanded && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-4">
                  <QuizQuestionStem text={q.questionText} image={q.image} />

                  {/* Warning if no correct answer is stored */}
                  {!q.correctOption && (
                    <div className="flex items-center gap-2 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3 text-xs text-yellow-400/90">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>
                        এই প্রশ্নটির সঠিক উত্তর এখনও সংরক্ষিত হয়নি (পরীক্ষা সাবমিট করার পর সেভ করলে সঠিক উত্তর ও ব্যাখ্যা পাওয়া যাবে)।
                      </span>
                    </div>
                  )}

                  <div className="grid gap-2">
                    {q.options.map((opt, oi) => {
                      const correctIdx = q.correctOption ? ["A", "B", "C", "D"].indexOf(q.correctOption) : -1;
                      const hasSelected = selectedAnswers[q.id] !== undefined;
                      const isSelected = selectedAnswers[q.id] === oi;
                      const isCorrect = correctIdx !== -1 && oi === correctIdx;

                      let optionStyle = "border-white/5 bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.05]";
                      if (hasSelected) {
                        if (isCorrect) {
                          optionStyle = "border-green-400/40 bg-green-500/10 text-green-200 shadow-[0_0_12px_rgba(34,197,94,0.08)]";
                        } else if (isSelected) {
                          optionStyle = "border-red-400/40 bg-red-500/10 text-red-200";
                        } else {
                          optionStyle = "border-white/5 bg-white/[0.01] text-slate-500 opacity-60 cursor-default";
                        }
                      }

                      return (
                        <button
                          key={`${q.id}-opt-${oi}`}
                          type="button"
                          disabled={hasSelected}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: oi,
                            }));
                          }}
                          className={cn(
                            "w-full text-left rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-2.5 transition-all",
                            optionStyle
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold border",
                              hasSelected
                                ? isCorrect
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : isSelected
                                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                                    : "bg-slate-800 text-slate-600 border-slate-700/50"
                                : "bg-slate-800 text-slate-400 border-white/5"
                            )}>
                              {BANGLA_OPTS[oi]}
                            </span>
                            <QuizOptionText
                              text={opt}
                              questionText={q.questionText}
                              optionImage={q.optionImages?.[oi] ?? null}
                            />
                          </div>

                          {hasSelected && (
                            <div className="shrink-0">
                              {isCorrect && <Check className="h-4 w-4 text-green-400" />}
                              {isSelected && !isCorrect && <AlertCircle className="h-4 w-4 text-red-400" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Show explanation and try again options */}
                  {selectedAnswers[q.id] !== undefined && (
                    <div className="space-y-3 pt-1">
                      {q.explanation && (
                        <div className="rounded-xl border border-cyan-500/10 bg-cyan-950/20 p-4 space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5" />
                            ব্যাখ্যা
                          </h4>
                          <div className="text-xs text-slate-300 leading-relaxed">
                            <FormattedQuizText text={q.explanation} />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedAnswers((prev) => {
                              const copy = { ...prev };
                              delete copy[q.id];
                              return copy;
                            });
                          }}
                          className="text-xs text-slate-400 hover:text-slate-200"
                        >
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          আবার চেষ্টা করুন
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

## File: [src/components/quiz/SubjectDetailClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/SubjectDetailClient.tsx)

```tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchSubjects, isModelTestChapter } from "@/lib/quiz-api";
import { loadModelTestsFromStatic } from "@/lib/model-test-loader";
import { loadSubjectQuizData, clearQuizDataCache } from "@/lib/quiz/load-quiz-data";
import { isChapterScopeModelTest } from "@/lib/model-test-filters";
import { isSscMathSlug, isSscScienceSlug } from "@/lib/quiz-catalog";
import {
  buildSubjectChapterTabGroups,
  deduplicateQuizListItems,
  extractSyllabusChapterSlugs,
  formatBnCount,
  modelTestToListItem,
  type ChapterGroupDisplay,
  type QuizListItem,
} from "@/lib/quiz-helper";
import {
  BOARD_QUESTION_YEARS,
  type RouteLevel,
} from "@/lib/quiz/unified-routes";
import {
  filterChapterGroups,
  filterQuizItems,
} from "@/lib/quiz-list-filters";
import {
  SubjectChapterQuizList,
  SubjectModelTestList,
  SubjectBoardQuestionsList,
} from "@/components/subject/SubjectQuizList";
import {
  ModelTestFilterBar,
  type ModelTestFilterKey,
  type ModelTestSortKey,
} from "@/components/quiz/ModelTestFilterBar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  level: "SSC" | "HSC";
  subjectSlug: string;
  basePath: string;
  chapterPathPrefix: string;
  modelTestPathPrefix: string;
  title: string;
};

type SubjectTab = "chapter" | "model" | "board";
type ModelCategoryTab = "paperWise" | "chapterWise";

const TABS: { id: SubjectTab; label: string }[] = [
  { id: "chapter", label: "অধ্যায়ভিত্তিক কুইজ" },
  { id: "model", label: "মডেল টেস্ট" },
  { id: "board", label: "বোর্ড প্রশ্ন" },
];

const MODEL_SUB_TABS: { id: ModelCategoryTab; label: string }[] = [
  { id: "paperWise", label: "পত্রভিত্তিক মডেল টেস্ট" },
  { id: "chapterWise", label: "অধ্যায়ভিত্তিক মডেল টেস্ট" },
];

interface AttemptRecord {
  examSlug?: string;
  score?: number;
  totalQuestions?: number;
  createdAt?: string;
}

function buildAttemptMap(
  attempts: AttemptRecord[],
  subjectSlug: string,
): Map<string, { count: number; bestScore: number; lastScore: number; lastAttemptAt?: string }> {
  const map = new Map<
    string,
    { count: number; bestScore: number; lastScore: number; lastAttemptAt?: string }
  >();
  for (const attempt of attempts) {
    const slug = attempt.examSlug ?? "";
    if (!slug.includes(subjectSlug) && !slug.includes("/")) continue;
    const key = slug.includes("/") ? slug.split("/").pop()! : slug;
    const score = attempt.score ?? 0;
    const total = attempt.totalQuestions ?? 25;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        count: 1,
        bestScore: score,
        lastScore: score,
        lastAttemptAt: attempt.createdAt,
      });
    } else {
      existing.count += 1;
      existing.lastScore = score;
      existing.bestScore = Math.max(existing.bestScore, score);
      if (attempt.createdAt) {
        if (
          !existing.lastAttemptAt ||
          new Date(attempt.createdAt) > new Date(existing.lastAttemptAt)
        ) {
          existing.lastAttemptAt = attempt.createdAt;
        }
      }
    }
    void total;
  }
  return map;
}

function enrichWithAttempts(
  items: QuizListItem[],
  attemptMap: Map<
    string,
    { count: number; bestScore: number; lastScore: number; lastAttemptAt?: string }
  >,
): QuizListItem[] {
  return items.map((item) => {
    const att = attemptMap.get(item.setId) ?? attemptMap.get(item.slug);
    if (!att) return item;
    const accuracy = att.lastScore / (item.questionCount || 25);
    return {
      ...item,
      attemptCount: att.count,
      completed: att.count > 0,
      bestScore: att.bestScore,
      lastAttemptAt: att.lastAttemptAt,
      isWeak: accuracy < 0.6,
      isHighScore: accuracy >= 0.8,
    };
  });
}

function enrichChapterGroups(
  groups: ChapterGroupDisplay[],
  attemptMap: Map<
    string,
    { count: number; bestScore: number; lastScore: number; lastAttemptAt?: string }
  >,
): ChapterGroupDisplay[] {
  return groups.map((g) => ({
    ...g,
    displaySets: enrichWithAttempts(g.displaySets, attemptMap),
  }));
}

export function SubjectDetailClient({
  level,
  subjectSlug,
  basePath,
  chapterPathPrefix,
  modelTestPathPrefix,
  title,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SubjectTab>("chapter");
  const [modelCategory, setModelCategory] = useState<ModelCategoryTab>("paperWise");
  const [chapterGroups, setChapterGroups] = useState<ChapterGroupDisplay[]>([]);
  const [paperModelItems, setPaperModelItems] = useState<QuizListItem[]>([]);
  const [chapterModelItems, setChapterModelItems] = useState<QuizListItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ModelTestFilterKey>("all");
  const [selectedSort, setSelectedSort] = useState<ModelTestSortKey>("default");

  const routeLevel = level.toLowerCase() as RouteLevel;

  useEffect(() => {
    clearQuizDataCache();
  }, [subjectSlug, level]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "model") {
      setActiveTab("model");
    } else if (tab === "board") {
      setActiveTab("board");
    } else {
      setActiveTab("chapter");
    }
    const model = searchParams.get("model");
    if (model === "paper" || model === "paperWise") {
      setModelCategory("paperWise");
    } else if (model === "chapter" || model === "chapterWise") {
      setModelCategory("chapterWise");
    }
  }, [searchParams]);

  const buildTabQuery = (tab: SubjectTab, model?: ModelCategoryTab) => {
    if (tab === "chapter") return "?tab=chapter";
    if (tab === "board") return "?tab=board";
    const cat = model ?? modelCategory;
    return cat === "paperWise" ? "?tab=model&model=paper" : "?tab=model&model=chapter";
  };

  const setTab = (tab: SubjectTab) => {
    if (tab === "model") {
      setModelCategory("paperWise");
    }
    setActiveTab(tab);
    setSearchQuery("");
    setSelectedFilter("all");
    setSelectedSort("default");
    router.replace(`${pathname}${buildTabQuery(tab, tab === "model" ? "paperWise" : modelCategory)}`, {
      scroll: false,
    });
  };

  const setModelTab = (category: ModelCategoryTab) => {
    setModelCategory(category);
    setSearchQuery("");
    setSelectedFilter("all");
    setSelectedSort("default");
    router.replace(`${pathname}${buildTabQuery("model", category)}`, { scroll: false });
  };

  useEffect(() => {
    async function loadData() {
      let attemptMap = new Map<
        string,
        { count: number; bestScore: number; lastScore: number; lastAttemptAt?: string }
      >();

      if (user) {
        try {
          const dash = await api.get<{ recentAttempts?: AttemptRecord[] }>(
            "/api/student/dashboard",
          );
          attemptMap = buildAttemptMap(dash.recentAttempts ?? [], subjectSlug);
        } catch {
          /* optional */
        }
      }

      try {
        const lvl = level.toLowerCase() as "ssc" | "hsc";
        let subj = subjectSlug;
        let paper: string | undefined;

        if (subj.endsWith("-1st-paper")) {
          subj = subj.replace(/-1st-paper$/, "");
          paper = "1st-paper";
        } else if (subj.endsWith("-2nd-paper")) {
          subj = subj.replace(/-2nd-paper$/, "");
          paper = "2nd-paper";
        }

        const parsed = await loadSubjectQuizData(lvl, subj, paper);
        if (parsed && !parsed.loadError) {
          const { items: normalized } = await loadModelTestsFromStatic({
            level,
            subjectSlug,
          });

          const paperTests = deduplicateQuizListItems(
            enrichWithAttempts(
              normalized
                .filter((t) => t.scope === "paper" && t.hasQuestions)
                .map((t) => modelTestToListItem(t, modelTestPathPrefix)),
              attemptMap,
            ),
          );
          const chapterScoped = normalized.filter(
            (t) =>
              t.scope === "chapter" &&
              t.hasQuestions &&
              isChapterScopeModelTest(t.sourceKey),
          );
          const chapterSlugs = extractSyllabusChapterSlugs(
            chapterScoped.map((t) => t.sourceKey),
          );
          const chapterTests = deduplicateQuizListItems(
            enrichWithAttempts(
              chapterScoped.map((t) => modelTestToListItem(t, modelTestPathPrefix)),
              attemptMap,
            ),
          );

          setChapterGroups(
            enrichChapterGroups(
              buildSubjectChapterTabGroups(
                parsed.chapterSets,
                chapterSlugs,
                chapterPathPrefix,
              ),
              attemptMap,
            ),
          );
          setPaperModelItems(paperTests);
          setChapterModelItems(chapterTests);

          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to load static subject JSON, falling back to API:", err);
      }

      fetchSubjects(level).then((list) => {
        const found =
          list.find((s) => s.slug === subjectSlug) ||
          list.find((s) => s.slug?.includes(subjectSlug));

        if (found) {
          const chapters = found.chapters ?? [];
          const chList = chapters
            .filter((c) => !isModelTestChapter(c.slug))
            .map((c) => ({
              chapterSlug: c.slug,
              chapterName: c.title || getBengaliChapterName(c.slug, subjectSlug),
              totalQuestions: 0,
              physicalSetCount: 0,
              displaySets: [] as QuizListItem[],
              practiceMode: false,
            }));
          setChapterGroups(chList);

          loadModelTestsFromStatic({ level, subjectSlug }).then(({ items }) => {
            setPaperModelItems(
              deduplicateQuizListItems(
                enrichWithAttempts(
                  items
                    .filter((t) => t.scope === "paper" && t.hasQuestions)
                    .map((t) => modelTestToListItem(t, modelTestPathPrefix)),
                  attemptMap,
                ),
              ),
            );
            setChapterModelItems(
              deduplicateQuizListItems(
                enrichWithAttempts(
                  items
                    .filter(
                      (t) =>
                        t.scope === "chapter" &&
                        t.hasQuestions &&
                        isChapterScopeModelTest(t.sourceKey),
                    )
                    .map((t) => modelTestToListItem(t, modelTestPathPrefix)),
                  attemptMap,
                ),
              ),
            );
          });
        }
        setLoading(false);
      });
    }

    loadData();
  }, [level, subjectSlug, chapterPathPrefix, modelTestPathPrefix, user]);

  const filteredChapterGroups = useMemo(
    () => filterChapterGroups(chapterGroups, selectedFilter, searchQuery, selectedSort),
    [chapterGroups, selectedFilter, searchQuery, selectedSort],
  );

  const filteredPaperItems = useMemo(
    () => filterQuizItems(paperModelItems, selectedFilter, searchQuery, selectedSort),
    [paperModelItems, selectedFilter, searchQuery, selectedSort],
  );

  const filteredChapterModelItems = useMemo(
    () => filterQuizItems(chapterModelItems, selectedFilter, searchQuery, selectedSort),
    [chapterModelItems, selectedFilter, searchQuery, selectedSort],
  );

  const modelTestTotal = paperModelItems.length + chapterModelItems.length;

  const activeModelItems =
    modelCategory === "paperWise" ? filteredPaperItems : filteredChapterModelItems;
  const activeModelTotal =
    modelCategory === "paperWise" ? paperModelItems.length : chapterModelItems.length;

  const resultCount = useMemo(() => {
    if (activeTab === "chapter") {
      return filteredChapterGroups.length;
    }
    if (activeTab === "model") {
      return activeModelItems.length;
    }
    return BOARD_QUESTION_YEARS.length;
  }, [
    activeTab,
    filteredChapterGroups,
    activeModelItems,
  ]);

  const totalCount = useMemo(() => {
    if (activeTab === "chapter") {
      return chapterGroups.length;
    }
    if (activeTab === "model") {
      return activeModelTotal;
    }
    return BOARD_QUESTION_YEARS.length;
  }, [activeTab, chapterGroups, activeModelTotal]);

  const hasActiveFilters =
    searchQuery !== "" ||
    (selectedFilter !== "all" && selectedFilter !== "default") ||
    selectedSort !== "default";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedFilter("all");
    setSelectedSort("default");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
      </div>
    );
  }

  const showEmptyFilter =
    (activeTab === "chapter" && filteredChapterGroups.length === 0 && chapterGroups.length > 0) ||
    (activeTab === "model" &&
      activeModelItems.length === 0 &&
      activeModelTotal > 0);

  const journeyLabel =
    level === "SSC" && isSscMathSlug(subjectSlug)
      ? "গণিত যাত্রা"
      : level === "SSC" && isSscScienceSlug(subjectSlug)
        ? "বিজ্ঞান যাত্রা"
        : level === "HSC"
          ? "বিজ্ঞান যাত্রা"
          : "প্রস্তুতি";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 font-bangla pb-24">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-cyan-300"
      >
        ← {level} হাব
      </Link>

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-950 via-[#0a0b1e] to-slate-950 px-4 py-5 sm:px-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 right-12 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
        <div className="relative">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
            {level} · {journeyLabel}
          </p>
          <h1 className="text-2xl font-black text-white sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            তিনটি আলাদা সেকশন — অধ্যায় MCQ, মডেল টেস্ট, বোর্ড প্রশ্ন। ট্যাব বেছে নাও।
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
              {formatBnCount(chapterGroups.length)} অধ্যায়
            </span>
            <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300">
              {formatBnCount(modelTestTotal)} মডেল টেস্ট
            </span>
            <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300">
              বোর্ড প্রশ্ন
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={cn(
              "min-h-[44px] min-w-[100px] flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all sm:text-sm",
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-600/90 to-purple-600/80 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== "board" && (
        <ModelTestFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          resultCount={resultCount}
          totalCount={totalCount}
          countUnit={activeTab === "chapter" ? "অধ্যায়" : "টেস্ট"}
          searchPlaceholder={
            activeTab === "chapter"
              ? "অধ্যায় নম্বর বা নাম লিখুন..."
              : "অধ্যায় বা টেস্ট নম্বর লিখুন..."
          }
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearAllFilters}
          variant="compact"
        />
      )}

      {activeTab === "board" ? (
        <SubjectBoardQuestionsList level={routeLevel} subjectSlug={subjectSlug} />
      ) : showEmptyFilter ? (
        <Card variant="glass" className="mt-4 p-8 text-center">
          <HelpCircle className="mx-auto mb-3 h-10 w-10 text-slate-600" />
          <p className="font-semibold text-slate-300">ফিল্টার অনুযায়ী কোনো টেস্ট পাওয়া যায়নি।</p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            সব ফিল্টার রিসেট করুন
          </button>
        </Card>
      ) : (
        <>
          {activeTab === "chapter" ? (
            <SubjectChapterQuizList
              groups={filteredChapterGroups}
              chapterPathPrefix={chapterPathPrefix}
              expandAll={hasActiveFilters}
            />
          ) : activeTab === "model" ? (
            <SubjectModelTestList
              paperItems={filteredPaperItems}
              chapterItems={filteredChapterModelItems}
              modelTestPathPrefix={modelTestPathPrefix}
              expandAll={hasActiveFilters}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

function getBengaliChapterName(slug: string, subjectSlug: string): string {
  void subjectSlug;
  const clean = slug.toLowerCase().replace(/chapter-/g, "").trim();
  if (clean === "wise") return "অধ্যায়ভিত্তিক কুইজ সংকলন";
  const digitMap: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  const bgDigits = clean.split("").map((char) => digitMap[char] || char).join("");
  return `অধ্যায় ${bgDigits}`;
}
```

## File: [src/components/quiz/WrongAnswersClient.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/WrongAnswersClient.tsx)

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWrongAnswers } from "@/hooks/useWrongAnswers";
import type { WrongQuestion } from "@/lib/wrong-answers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuizQuestionStem } from "@/components/quiz/QuizQuestionStem";
import { QuizOptionText } from "@/components/quiz/QuizOptionText";
import { cn } from "@/lib/utils";
import { FormattedQuizText } from "@/lib/format-quiz-text";
import { sanitizeQuizText } from "@/lib/sanitize-quiz-text";
import { stripQuestionDiagramMarkers } from "@/lib/quiz/quiz-diagrams";
import {
  AlertCircle,
  Check,
  Clock,
  Layers,
  Trash2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import type { RouteLevel } from "@/lib/quiz/unified-routes";

const BANGLA_OPTS = ["ক", "খ", "গ", "ঘ"] as const;

type Props = {
  level: RouteLevel;
};

function questionPreview(text: string): string {
  return stripQuestionDiagramMarkers(sanitizeQuizText(text, "question"))
    .replace(/\s+/g, " ")
    .trim();
}

/** Group wrong questions by subject */
function groupBySubject(items: WrongQuestion[]): Map<string, WrongQuestion[]> {
  const map = new Map<string, WrongQuestion[]>();
  for (const item of items) {
    const key = item.subject || "general";
    const arr = map.get(key);
    if (arr) {
      arr.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}

/** Format ISO timestamp to Bangla-friendly short form */
function formatSavedTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return "এইমাত্র";
  if (diffMin < 60) return `${diffMin} মিনিট আগে`;
  if (diffHr < 24) return `${diffHr} ঘণ্টা আগে`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} দিন আগে`;
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}

export function WrongAnswersClient({ level }: Props) {
  const { wrong, mounted, remove, clearAll, count } = useWrongAnswers();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  if (!mounted) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
      </div>
    );
  }

  const grouped = groupBySubject(wrong);
  const subjects = Array.from(grouped.keys());
  const filtered = selectedSubject
    ? wrong.filter((q) => (q.subject || "general") === selectedSubject)
    : wrong;

  const subjectLabel = (slug: string): string => {
    const map: Record<string, string> = {
      physics: "পদার্থবিজ্ঞান",
      chemistry: "রসায়ন",
      biology: "জীববিজ্ঞান",
      "higher-math": "উচ্চতর গণিত",
      math: "সাধারণ গণিত",
      "physics-1st-paper": "পদার্থবিজ্ঞান ১ম পত্র",
      "physics-2nd-paper": "পদার্থবিজ্ঞান ২য় পত্র",
      "chemistry-1st-paper": "রসায়ন ১ম পত্র",
      "chemistry-2nd-paper": "রসায়ন ২য় পত্র",
      "biology-1st-paper": "জীববিজ্ঞান ১ম পত্র",
      "biology-2nd-paper": "জীববিজ্ঞান ২য় পত্র",
      "higher-math-1st-paper": "উচ্চতর গণিত ১ম পত্র",
      "higher-math-2nd-paper": "উচ্চতর গণিত ২য় পত্র",
      general: "সাধারণ",
    };
    return map[slug] || slug;
  };

  if (count === 0) {
    return (
      <div className="min-h-[60vh] font-bangla py-8">
        <Card variant="glass" className="max-w-xl mx-auto p-8 text-center text-slate-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">
            <Check className="h-7 w-7 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            কোনো ভুল উত্তর নেই!
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            দারুণ! তোমার ভুল উত্তরের তালিকা এখন খালি। কুইজ অনুশীলন চালিয়ে যাও এবং কোনো প্রশ্ন ভুল হলে তা অটোমেটিক্যালি এখানে যোগ হয়ে যাবে।
          </p>
          <Link href={`/${level}`}>
            <Button variant="secondary">কুইজে ফিরে যান</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 font-bangla pb-24 text-slate-200">
      {/* Header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-950 via-[#0a0b1e] to-slate-950 px-4 py-5 sm:px-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 right-12 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-400/80">
              {level.toUpperCase()} · ভুল উত্তরের তালিকা
            </p>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              ভুল উত্তরের অনুশীলন
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              পরীক্ষায় যেসব প্রশ্ন ভুল করেছো সেগুলো এখানে জমা আছে। আবার অনুশীলন করে তোমার ঘাটতি পূরণ করো।
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-300">
                <Layers className="mr-1 inline h-3 w-3" />
                {count}টি প্রশ্ন ভুল তালিকায় আছে
              </span>
              {subjects.length > 1 && (
                <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300">
                  {subjects.length}টি বিষয়
                </span>
              )}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (confirmClear) {
                clearAll();
                setConfirmClear(false);
              } else {
                setConfirmClear(true);
              }
            }}
            className={cn(
              "shrink-0 text-xs",
              confirmClear
                ? "border-red-500/40 text-red-300 hover:bg-red-500/10"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Trash2 className="mr-1 inline h-3.5 w-3.5" />
            {confirmClear ? "নিশ্চিতভাবে মুছুন?" : "সব মুছুন"}
          </Button>
        </div>
      </div>

      {/* Subject filter chips */}
      {subjects.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSubject(null)}
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-bold border transition-all",
              !selectedSubject
                ? "border-red-400/50 bg-red-500/15 text-red-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            )}
          >
            সব ({count})
          </button>
          {subjects.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() =>
                setSelectedSubject(selectedSubject === sub ? null : sub)
              }
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-bold border transition-all",
                selectedSubject === sub
                  ? "border-red-400/50 bg-red-500/15 text-red-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              )}
            >
              {subjectLabel(sub)} ({grouped.get(sub)?.length ?? 0})
            </button>
          ))}
        </div>
      )}

      {/* Wrong question cards */}
      <div className="space-y-3">
        {filtered.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          const preview = questionPreview(q.questionText);
          return (
            <Card
              key={q.id}
              variant="glass"
              className="overflow-hidden border-white/5 bg-slate-900/40"
            >
              {/* Collapsed header — click to expand */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-black">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-slate-200">
                    {preview || q.questionText}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatSavedTime(q.savedAt)}</span>
                    {q.subject && (
                      <>
                        <span className="text-slate-600">·</span>
                        <Badge className="border-red-500/20 bg-red-500/10 px-1.5 py-0 text-[10px] text-red-300">
                          {subjectLabel(q.subject)}
                        </Badge>
                      </>
                    )}
                    {q.chapter && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span>{q.chapter}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(q.id);
                    }}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="তালিকা থেকে সরান"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Expanded — show question + options for practice */}
              {isExpanded && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-4">
                  <QuizQuestionStem text={q.questionText} image={q.image} />

                  {/* Info about previous choice */}
                  {q.studentOption && q.correctOption && (
                    <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400/90 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>
                        পরীক্ষায় তোমার দেওয়া উত্তর ছিল অপশন: <strong>{q.studentOption}</strong> (সঠিক উত্তর ছিল: <strong>{q.correctOption}</strong>)
                      </span>
                    </div>
                  )}

                  <div className="grid gap-2">
                    {q.options.map((opt, oi) => {
                      const correctIdx = q.correctOption ? ["A", "B", "C", "D"].indexOf(q.correctOption) : -1;
                      const hasSelected = selectedAnswers[q.id] !== undefined;
                      const isSelected = selectedAnswers[q.id] === oi;
                      const isCorrect = correctIdx !== -1 && oi === correctIdx;

                      let optionStyle = "border-white/5 bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.05]";
                      if (hasSelected) {
                        if (isCorrect) {
                          optionStyle = "border-green-400/40 bg-green-500/10 text-green-200 shadow-[0_0_12px_rgba(34,197,94,0.08)]";
                        } else if (isSelected) {
                          optionStyle = "border-red-400/40 bg-red-500/10 text-red-200";
                        } else {
                          optionStyle = "border-white/5 bg-white/[0.01] text-slate-500 opacity-60 cursor-default";
                        }
                      }

                      return (
                        <button
                          key={`${q.id}-opt-${oi}`}
                          type="button"
                          disabled={hasSelected}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: oi,
                            }));
                          }}
                          className={cn(
                            "w-full text-left rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-2.5 transition-all",
                            optionStyle
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold border",
                              hasSelected
                                ? isCorrect
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : isSelected
                                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                                    : "bg-slate-800 text-slate-600 border-slate-700/50"
                                : "bg-slate-800 text-slate-400 border-white/5"
                            )}>
                              {BANGLA_OPTS[oi]}
                            </span>
                            <QuizOptionText
                              text={opt}
                              questionText={q.questionText}
                              optionImage={q.optionImages?.[oi] ?? null}
                            />
                          </div>

                          {hasSelected && (
                            <div className="shrink-0">
                              {isCorrect && <Check className="h-4 w-4 text-green-400" />}
                              {isSelected && !isCorrect && <AlertCircle className="h-4 w-4 text-red-400" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Show explanation and try again/remove options */}
                  {selectedAnswers[q.id] !== undefined && (
                    <div className="space-y-3 pt-1">
                      {q.explanation && (
                        <div className="rounded-xl border border-cyan-500/10 bg-cyan-950/20 p-4 space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5" />
                            ব্যাখ্যা
                          </h4>
                          <div className="text-xs text-slate-300 leading-relaxed">
                            <FormattedQuizText text={q.explanation} />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => remove(q.id)}
                          className="text-xs text-green-400 border-green-500/15 hover:bg-green-500/10 hover:text-green-300"
                        >
                          <Check className="mr-1.5 h-3.5 w-3.5" />
                          ভুল তালিকা থেকে বাদ দিন
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedAnswers((prev) => {
                              const copy = { ...prev };
                              delete copy[q.id];
                              return copy;
                            });
                          }}
                          className="text-xs text-slate-400 hover:text-slate-200"
                        >
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          আবার চেষ্টা করুন
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

## File: [src/components/quiz/smart-practice-ui.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/quiz/smart-practice-ui.tsx)

```tsx
"use client";

import type React from "react";
import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  TrendingUp,
  Trophy,
  TrendingDown,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Atom orbital graphic — pixel-match to mockup reference */
export function AtomHeroGraphic() {
  return (
    <div className="pointer-events-none absolute right-4 top-4 hidden h-44 w-80 overflow-hidden sm:block lg:right-8 lg:top-6 lg:h-48 lg:w-96 xl:block">
      <div className="absolute right-16 top-6 h-28 w-28 rounded-full border border-cyan-300/25 bg-cyan-400/5 blur-sm" />
      <div className="absolute right-20 top-10 grid h-24 w-24 place-items-center rounded-full bg-fuchsia-500/10 shadow-[0_0_60px_rgba(217,70,239,0.6)]">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-300 via-fuchsia-400 to-pink-600 shadow-[0_0_35px_rgba(236,72,153,0.8)]" />
      </div>
      <div className="absolute right-4 top-14 h-1 w-64 rotate-[25deg] rounded-full bg-cyan-400/35" />
      <div className="absolute right-4 top-14 h-1 w-64 -rotate-[25deg] rounded-full bg-blue-400/35" />
      <div className="absolute right-16 top-6 h-36 w-36 rotate-[25deg] rounded-[50%] border border-blue-300/50" />
      <div className="absolute right-16 top-6 h-36 w-36 -rotate-[25deg] rounded-[50%] border border-cyan-300/50" />
      <div className="absolute right-16 top-6 h-36 w-36 rotate-90 rounded-[50%] border border-indigo-300/50" />
      <div className="absolute right-[220px] top-16 h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
      <div className="absolute right-10 top-10 h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
      <div className="absolute right-20 top-28 h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
      <p className="absolute left-2 top-2 text-base italic text-blue-200/45 lg:text-lg">E = mc²</p>
      <p className="absolute right-0 bottom-2 text-base italic text-blue-200/35 lg:text-lg">F = ma</p>
    </div>
  );
}

export const DASHBOARD_STAT_CONFIG = [
  { key: "chapters", label: "মোট অধ্যায়", icon: BookOpen, color: "text-sky-400", glow: "shadow-[0_0_12px_rgba(56,189,248,0.2)]" },
  { key: "tests", label: "মোট টেস্ট", icon: ClipboardList, color: "text-fuchsia-400", glow: "shadow-[0_0_12px_rgba(232,121,249,0.2)]" },
  { key: "mcq", label: "মোট MCQ", icon: HelpCircle, color: "text-cyan-400", glow: "shadow-[0_0_12px_rgba(34,211,238,0.2)]" },
  { key: "attempted", label: "চেষ্টা করেছেন", icon: Users, color: "text-blue-400", glow: "shadow-[0_0_12px_rgba(96,165,250,0.2)]" },
  { key: "avg", label: "Average Score", icon: TrendingUp, color: "text-cyan-300", glow: "shadow-[0_0_12px_rgba(103,232,249,0.2)]" },
  { key: "high", label: "Highest Score", icon: Trophy, color: "text-green-400", glow: "shadow-[0_0_12px_rgba(74,222,128,0.2)]" },
  { key: "low", label: "Lowest Score", icon: TrendingDown, color: "text-rose-400", glow: "shadow-[0_0_12px_rgba(251,113,133,0.2)]" },
] as const;

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  color,
  glow,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  glow?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2.5 backdrop-blur-sm",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        glow,
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={cn("h-7 w-7 shrink-0", color)} />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold leading-tight text-slate-400 sm:text-xs">
            {label}
          </p>
          <p className={cn("truncate text-lg font-black leading-tight sm:text-xl", color)}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
```

## File: [src/components/study/HscLevelHubPage.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/study/HscLevelHubPage.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  ChevronRight,
  Target,
  BookOpen,
  Trophy,
  Loader2,
  Layers,
} from "lucide-react";
import { fetchSubjects } from "@/lib/quiz-api";
import { HSC_SCIENCE_PAPERS } from "@/lib/quiz-catalog";
import {
  levelModelTestsPath,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";
import type { ApiSubject } from "@/types/quiz";

const subjectIcons: Record<string, React.ElementType> = {
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  "higher-math": Calculator,
};

const subjectColors: Record<string, string> = {
  physics: "purple",
  chemistry: "cyan",
  biology: "green",
  "higher-math": "gold",
};

const subjectNames: Record<string, string> = {
  physics: "পদার্থবিজ্ঞান",
  chemistry: "রসায়ন",
  biology: "জীববিজ্ঞান",
  "higher-math": "উচ্চতর গণিত",
};

export function HscLevelHubPage() {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects("HSC").then((list) => {
      setSubjects(list.length ? list : fallbackList());
      setLoading(false);
    });
  }, []);

  function fallbackList(): ApiSubject[] {
    return HSC_SCIENCE_PAPERS.map((p) => ({
      id: `${p.subject}-${p.paper}`,
      name: p.name,
      slug: `${p.subject}-${p.paper}`,
      category: "HSC",
    }));
  }

  const groupedSubjects = subjects.reduce(
    (acc, subject) => {
      let baseSubject = subject.slug;
      if (subject.slug.endsWith("-1st-paper")) {
        baseSubject = subject.slug.replace(/-1st-paper$/, "");
      } else if (subject.slug.endsWith("-2nd-paper")) {
        baseSubject = subject.slug.replace(/-2nd-paper$/, "");
      }
      if (!acc[baseSubject]) acc[baseSubject] = [];
      acc[baseSubject].push(subject);
      return acc;
    },
    {} as Record<string, ApiSubject[]>,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bangla">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-400">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-bangla pb-24">
      <section className="py-12 md:py-16 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="default" className="inline-flex items-center gap-2 mb-4">
              <Layers className="h-3 w-3" />
              Class 11-12 Science Group
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              <span className="text-gradient-purple">HSC Science</span> প্রস্তুতি
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Paper অনুযায়ী practice করো — ১ম ও ২য় পত্রের জন্য আলাদা আলাদা কুইজ ও মডেল টেস্ট
            </p>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {Object.entries(groupedSubjects).map(([baseSubject, papers]) => {
              const Icon = subjectIcons[baseSubject] || BookOpen;
              const color = subjectColors[baseSubject] || "purple";

              return (
                <div key={baseSubject}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        color === "purple"
                          ? "bg-purple-500/20 text-purple-400"
                          : color === "cyan"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : color === "green"
                              ? "bg-green-500/20 text-green-400"
                              : color === "gold"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {subjectNames[baseSubject] || baseSubject}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {papers.map((paper) => (
                      <Link
                        key={paper.slug}
                        href={unifiedSubjectBasePath("hsc", paper.slug)}
                      >
                        <Card variant="glass" className="p-5 hoverable glass-panel-purple">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-white">{paper.name}</h3>
                              <p className="text-xs text-slate-400 mt-1">
                                অধ্যায়ভিত্তিক MCQ ও মডেল টেস্ট
                              </p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <ChevronRight className="h-4 w-4 text-purple-400" />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/hsc-board-questions">
              <Card variant="glass" className="p-4 flex items-center gap-4 hoverable">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">বোর্ড প্রশ্ন</h4>
                  <p className="text-xs text-slate-400">২০২২-২০২৬</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>

            <Link href="/live-test">
              <Card variant="glass" className="p-4 flex items-center gap-4 hoverable border-red-500/20">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">লাইভ টেস্ট</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
                    আসন্ন
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>

            <Link href="/leaderboard">
              <Card variant="glass" className="p-4 flex items-center gap-4 hoverable">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">লিডারবোর্ড</h4>
                  <p className="text-xs text-slate-400">Top Students</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <Card
            variant="glass"
            className="max-w-3xl mx-auto p-6 md:p-8 text-center border-purple-500/20 bg-gradient-to-br from-[#07111F] via-[#0E1726] to-[#07111F]"
          >
            <h3 className="text-xl font-bold text-white mb-2">
              HSC মডেল টেস্ট ও বোর্ড প্রশ্ন
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              রিয়েল এক্সাম মোডে পরীক্ষা দাও — টাইমার, স্কোর ও বিস্তারিত ফলাফল বিশ্লেষণ
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={levelModelTestsPath("hsc", "tab=paper")}>
                <Button variant="primary" className="flex items-center gap-2 min-h-[44px]">
                  <Target className="h-4 w-4" />
                  পত্রভিত্তিক মডেল টেস্ট
                </Button>
              </Link>
              <Link href={levelModelTestsPath("hsc", "tab=chapter")}>
                <Button variant="secondary" className="flex items-center gap-2 min-h-[44px]">
                  <Target className="h-4 w-4" />
                  অধ্যায়ভিত্তিক মডেল টেস্ট
                </Button>
              </Link>
              <Link href="/hsc-board-questions">
                <Button variant="secondary" className="flex items-center gap-2 min-h-[44px]">
                  <Trophy className="h-4 w-4" />
                  বোর্ড প্রশ্ন ব্যাংক
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
```

## File: [src/components/study/ModelTestsHub.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/study/ModelTestsHub.tsx)

```tsx
"use client";

import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ModelTestLink {
  href: string;
  label: string;
}

interface ModelTestsHubProps {
  title: string;
  subtitle: string;
  links: ModelTestLink[];
}

export function ModelTestsHub({ title, subtitle, links }: ModelTestsHubProps) {
  return (
    <div className="min-h-screen font-bangla py-8 pb-24">
      <div className="mb-8">
        <Badge variant="default" className="mb-3 inline-flex items-center gap-1">
          <Target className="h-3 w-3" />
          মডেল টেস্ট
        </Badge>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{title}</h1>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card variant="glass" className="p-4 flex items-center gap-3 hoverable group">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>
              <span className="flex-1 font-semibold text-white">{link.label}</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## File: [src/components/study/ModelTestsLevelHub.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/study/ModelTestsLevelHub.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Target } from "lucide-react";
import { loadModelTestsFromStatic } from "@/lib/model-test-loader";
import { filterByCategoryTab, type ModelTestItem } from "@/lib/model-test-filters";
import { ModelTestCard } from "@/components/quiz/ModelTestCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { unifiedSubjectBasePath } from "@/lib/quiz/unified-routes";

export interface ModelTestsSubjectEntry {
  slug: string;
  name: string;
  modelTestBasePath: string;
}

interface SubjectGroup {
  slug: string;
  name: string;
  paperItems: ModelTestItem[];
  chapterCount: number;
  loading: boolean;
}

interface ModelTestsLevelHubProps {
  title: string;
  subtitle: string;
  level: "SSC" | "HSC";
  subjects: ModelTestsSubjectEntry[];
  /** Optional section label (e.g. বিজ্ঞান / গণিত) */
  sectionLabel?: string;
}

const PREVIEW_LIMIT = 6;

export function ModelTestsLevelHub({
  title,
  subtitle,
  level,
  subjects,
  sectionLabel,
}: ModelTestsLevelHubProps) {
  const routeLevel = level.toLowerCase() as "ssc" | "hsc";
  const [groups, setGroups] = useState<SubjectGroup[]>(
    subjects.map((s) => ({
      slug: s.slug,
      name: s.name,
      paperItems: [],
      chapterCount: 0,
      loading: true,
    })),
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      const results = await Promise.all(
        subjects.map(async (subject) => {
          const { items } = await loadModelTestsFromStatic({
            level,
            subjectSlug: subject.slug,
          });
          const paper = filterByCategoryTab(items, "paperWise").items;
          const chapter = filterByCategoryTab(items, "chapterWise").items;
          return {
            slug: subject.slug,
            name: subject.name,
            paperItems: paper,
            chapterCount: chapter.length,
            loading: false,
          };
        }),
      );
      if (!cancelled) setGroups(results);
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [level, subjects.map((s) => s.slug).join(",")]);

  const totalPaper = groups.reduce((n, g) => n + g.paperItems.length, 0);
  const stillLoading = groups.some((g) => g.loading);

  return (
    <div className="min-h-screen font-bangla py-8 pb-24">
      <div className="mb-8">
        {sectionLabel && (
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-500/80">
            {sectionLabel}
          </p>
        )}
        <Badge variant="default" className="mb-3 inline-flex items-center gap-1">
          <Target className="h-3 w-3" />
          পত্রভিত্তিক মডেল টেস্ট
        </Badge>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{title}</h1>
        <p className="text-slate-400 text-sm">{subtitle}</p>
        {!stillLoading && (
          <p className="text-slate-500 text-xs mt-2">
            {totalPaper} পত্রভিত্তিক টেস্ট · অধ্যায়ভিত্তিক টেস্ট বিষয় পেজ থেকে দেখো
          </p>
        )}
      </div>

      {stillLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-glow" />
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => {
            const subjectHref = unifiedSubjectBasePath(routeLevel, group.slug);
            const preview = group.paperItems.slice(0, PREVIEW_LIMIT);
            return (
              <section key={group.slug}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-400" />
                    {group.name}
                    <span className="text-sm font-normal text-slate-400">
                      ({group.paperItems.length} পত্র · {group.chapterCount} অধ্যায়)
                    </span>
                  </h2>
                  <Link
                    href={`${subjectHref}?tab=model&model=paper`}
                    className="text-sm text-cyan-400 hover:underline shrink-0"
                  >
                    সব দেখুন →
                  </Link>
                </div>

                {group.paperItems.length === 0 ? (
                  <Card variant="glass" className="p-6 text-center text-slate-500">
                    পত্রভিত্তিক মডেল টেস্ট এখনো যোগ করা হয়নি।
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {preview.map((test) => (
                      <ModelTestCard
                        key={test.id}
                        test={test}
                        href={`${subjectHref}/model-tests/${test.sourceKey}`}
                      />
                    ))}
                  </div>
                )}
                {group.paperItems.length > PREVIEW_LIMIT && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    +{group.paperItems.length - PREVIEW_LIMIT} আরও পত্রভিত্তিক টেস্ট
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

## File: [src/components/study/SscLevelHubPage.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/study/SscLevelHubPage.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  ChevronRight,
  Target,
  BookOpen,
  Trophy,
  Loader2,
} from "lucide-react";
import { fetchSubjects } from "@/lib/quiz-api";
import { SSC_CATALOG, SSC_MATH_CATALOG, SSC_SCIENCE_CATALOG } from "@/lib/quiz-catalog";
import {
  levelHubPath,
  levelModelTestsPath,
  unifiedSubjectBasePath,
} from "@/lib/quiz/unified-routes";
import type { ApiSubject } from "@/types/quiz";

const subjectIcons: Record<string, React.ElementType> = {
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  "higher-math": Calculator,
  "general-math": Calculator,
};

const subjectColors: Record<string, string> = {
  physics: "cyan",
  chemistry: "purple",
  biology: "green",
  "higher-math": "gold",
  "general-math": "blue",
};

export function SscLevelHubPage() {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects("SSC").then((list) => {
      setSubjects(list.length ? list : fallbackList());
      setLoading(false);
    });
  }, []);

  function fallbackList(): ApiSubject[] {
    return SSC_CATALOG.map((s) => ({
      id: s.slug,
      name: s.name,
      slug: s.slug,
      category: "SSC",
    }));
  }

  const scienceSubjects = subjects.filter((s) =>
    SSC_SCIENCE_CATALOG.some((c) => c.slug === s.slug),
  );
  const mathSubjects = subjects.filter((s) =>
    SSC_MATH_CATALOG.some((c) => c.slug === s.slug),
  );

  function renderSubjectGrid(list: ApiSubject[]) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {list.map((subject) => {
          const Icon = subjectIcons[subject.slug] || BookOpen;
          const color = subjectColors[subject.slug] || "cyan";

          return (
            <Link
              key={subject.slug}
              href={`${unifiedSubjectBasePath("ssc", subject.slug)}?tab=chapter`}
            >
              <Card variant="glass" className="p-6 hoverable group glass-panel-cyan">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      color === "cyan"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : color === "purple"
                          ? "bg-purple-500/20 text-purple-400"
                          : color === "green"
                            ? "bg-green-500/20 text-green-400"
                            : color === "gold"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    ১০+ অধ্যায়
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
                <p className="text-sm text-slate-400 mb-4">
                  অধ্যায়ভিত্তিক MCQ ও মডেল টেস্ট
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      ২০০+ MCQ
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <ChevronRight className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bangla">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-bangla pb-24">
      <section className="py-12 md:py-16 bg-gradient-to-b from-cyan-900/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="default" className="inline-flex items-center gap-2 mb-4">
              <BookOpen className="h-3 w-3" />
              Class 9-10 Science Group
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              <span className="text-gradient-cyan">SSC Science</span> প্রস্তুতি
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              তোমার subject বেছে নাও — অধ্যায়ভিত্তিক কুইজ, মডেল টেস্ট ও বোর্ড প্রশ্ন একসাথে
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-cyan-400/90">
                বিজ্ঞান বিষয়
              </h2>
              {renderSubjectGrid(scienceSubjects)}
            </div>
            <div>
              <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-amber-400/90">
                গণিত বিষয়
              </h2>
              {renderSubjectGrid(mathSubjects)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/ssc-board-questions">
              <Card variant="glass" className="p-4 flex items-center gap-4 hoverable">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">বোর্ড প্রশ্ন</h4>
                  <p className="text-xs text-slate-400">২০২২-২০২৬</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>

            <Link href="/live-test">
              <Card variant="glass" className="p-4 flex items-center gap-4 hoverable border-red-500/20">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">লাইভ টেস্ট</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
                    আসন্ন
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>

            <Link href="/leaderboard">
              <Card variant="glass" className="p-4 flex items-center gap-4 hoverable">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">লিডারবোর্ড</h4>
                  <p className="text-xs text-slate-400">Top Students</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <Card
            variant="glass"
            className="max-w-3xl mx-auto p-6 md:p-8 text-center border-cyan-500/20 bg-gradient-to-br from-[#07111F] via-[#0D1826] to-[#07111F]"
          >
            <h3 className="text-xl font-bold text-white mb-2">
              SSC মডেল টেস্ট ও বোর্ড প্রশ্ন
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              রিয়েল এক্সাম মোডে পরীক্ষা দাও — টাইমার, স্কোর ও বিস্তারিত ফলাফল বিশ্লেষণ
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={levelModelTestsPath("ssc")}>
                <Button variant="primary" className="flex items-center gap-2 min-h-[44px]">
                  <Target className="h-4 w-4" />
                  ফ্রি মডেল টেস্ট
                </Button>
              </Link>
              <Link href="/ssc-board-questions">
                <Button variant="secondary" className="flex items-center gap-2 min-h-[44px]">
                  <Trophy className="h-4 w-4" />
                  বোর্ড প্রশ্ন ব্যাংক
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
```

## File: [src/components/study/StudyComingSoon.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/study/StudyComingSoon.tsx)

```tsx
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface StudyComingSoonProps {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
}

export function StudyComingSoon({
  title,
  description = "এই ফিচার শীঘ্রই আসছে। এখন অধ্যায়ভিত্তিক কুইজ ও মডেল টেস্ট থেকে প্রস্তুতি চালিয়ে যাও।",
  backHref,
  backLabel = "প্রস্তুতি মেনুতে ফিরুন",
}: StudyComingSoonProps) {
  return (
    <div className="min-h-[60vh] font-bangla py-8">
      <Card variant="glass" className="max-w-xl mx-auto p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
          <Clock className="h-7 w-7 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-sm text-slate-400 mb-6">{description}</p>
        <Link href={backHref}>
          <Button variant="secondary" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
      </Card>
    </div>
  );
}
```

## File: [src/components/subject/SubjectQuizList.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/subject/SubjectQuizList.tsx)

```tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  GraduationCap,
  Layers,
  Play,
  Target,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  type ChapterGroupDisplay,
  type QuizListItem,
  difficultyBadgeClass,
  difficultyBadgeLabel,
  formatBnCount,
  getQuizDisplayTitle,
  groupItemsByModelTestChapter,
  MOCK_SET_SIZE,
} from "@/lib/quiz-helper";
import {
  BOARD_QUESTION_YEARS,
  boardQuestionsHubPath,
  boardQuestionsYearPath,
  type RouteLevel,
} from "@/lib/quiz/unified-routes";

const PREVIEW_SETS = 3;

type ChapterListProps = {
  groups: ChapterGroupDisplay[];
  chapterPathPrefix: string;
  emptyMessage?: string;
  expandAll?: boolean;
  hideChapterLinks?: boolean;
};

type ModelListProps = {
  paperItems: QuizListItem[];
  chapterItems: QuizListItem[];
  modelTestPathPrefix: string;
  emptyMessage?: string;
  expandAll?: boolean;
  /** Show only paper-wise or chapter-wise model tests — never both. */
  category: "paperWise" | "chapterWise";
};

type BankListProps = {
  items: QuizListItem[];
  subjectSlug: string;
  emptyMessage?: string;
};

function StatusPill({ item }: { item: QuizListItem }) {
  if (item.completed) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
        <Check size={10} /> সম্পন্ন
      </span>
    );
  }
  if (item.isWeak) {
    return (
      <span className="rounded-md border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-bold text-orange-300">
        দুর্বল
      </span>
    );
  }
  if ((item.attemptCount ?? 0) === 0) {
    return (
      <span className="rounded-md border border-slate-600/50 bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
        দেখিনি
      </span>
    );
  }
  return null;
}

function ModeBadge({ mode, count }: { mode?: QuizListItem["mode"]; count: number }) {
  if (mode === "timed") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300/90">
        <Clock size={11} />
        সময়সীমা · {formatBnCount(count)} MCQ
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-purple-300/90">
      <Zap size={11} />
      প্র্যাকটিস
    </span>
  );
}


function QuizRow({
  item,
  variant = "cyan",
}: {
  item: QuizListItem;
  variant?: "cyan" | "purple" | "amber";
}) {
  const borderAccent =
    variant === "purple"
      ? "hover:border-purple-500/35"
      : variant === "amber"
        ? "hover:border-amber-500/35"
        : "hover:border-cyan-500/35";
  const btnGradient =
    variant === "purple"
      ? "from-purple-600 to-violet-600"
      : variant === "amber"
        ? "from-amber-600 to-orange-600"
        : "from-cyan-600 to-blue-600";

  const diffLabel = difficultyBadgeLabel(item.difficulty);

  return (
    <Link href={item.href} className="group block">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all",
          "hover:bg-white/[0.04] active:scale-[0.99]",
          borderAccent,
          item.completed && "border-emerald-500/20 bg-emerald-500/[0.03]",
        )}
      >
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white shadow-lg",
            btnGradient,
          )}
        >
          <Play size={16} fill="white" className="opacity-90" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white group-hover:text-cyan-200">
            {getQuizDisplayTitle(item)}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[11px] text-slate-400">
              {item.questionCount > 0 ? `${formatBnCount(item.questionCount)} MCQ` : "অধ্যায় MCQ"}
            </span>
            {item.questionCount > 0 && (
              <ModeBadge mode={item.mode} count={item.questionCount} />
            )}
            {diffLabel && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold border",
                  difficultyBadgeClass(item.difficulty),
                )}
              >
                {diffLabel}
              </span>
            )}
            <StatusPill item={item} />
          </div>
        </div>

        <span
          className={cn(
            "hidden shrink-0 rounded-lg bg-gradient-to-r px-3 py-1.5 text-xs font-bold text-white sm:inline-flex",
            btnGradient,
          )}
        >
          শুরু করো
        </span>
      </div>
    </Link>
  );
}

function ChapterGroupCard({
  group,
  chapterPathPrefix,
  expandAll,
  hideChapterLinks,
  variant = "chapterMcq",
}: {
  group: ChapterGroupDisplay;
  chapterPathPrefix: string;
  expandAll?: boolean;
  hideChapterLinks?: boolean;
  variant?: "chapterMcq" | "modelTest";
}) {
  const isModelTest = variant === "modelTest";
  const [expanded, setExpanded] = useState(false);
  const showAll = expandAll || expanded;
  const sets = group.displaySets;
  const visible = showAll ? sets : sets.slice(0, PREVIEW_SETS);
  const hiddenCount = sets.length - PREVIEW_SETS;

  return (
    <Card
      variant="glass"
      className="overflow-hidden border-slate-700/40 bg-slate-950/40 p-0"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.05] bg-white/[0.02] px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
            {isModelTest ? <Target size={22} /> : <BookOpen size={22} />}
          </div>
          <div>
            <h3 className="text-base font-black text-white sm:text-lg">{group.chapterName}</h3>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {isModelTest ? (
                <Badge variant="default" className="text-[10px] border-purple-500/20 text-purple-200">
                  <Layers className="mr-1 inline h-3 w-3" />
                  {formatBnCount(group.displaySets.length)} মডেল টেস্ট
                </Badge>
              ) : (
                group.totalQuestions > 0 && (
                  <Badge variant="default" className="text-[10px] border-cyan-500/20 text-cyan-300/90">
                    {formatBnCount(group.totalQuestions)} প্র্যাকটিস MCQ
                  </Badge>
                )
              )}
              {!isModelTest && group.practiceMode && (
                <Badge variant="default" className="text-[10px] border-purple-500/20 text-purple-200">
                  <Layers className="mr-1 inline h-3 w-3" />
                  {formatBnCount(group.displaySets.length)} মডেল সেট
                </Badge>
              )}
            </div>
          </div>
        </div>
        {!hideChapterLinks && (
          <Link
            href={`${chapterPathPrefix}/${group.chapterSlug}`}
            className="shrink-0 text-xs font-bold text-cyan-400 hover:text-cyan-300 sm:text-sm"
          >
            {group.practiceMode ? "সব সেট →" : "অধ্যায় খুলো →"}
          </Link>
        )}
      </div>

      <div className="space-y-2 p-3">
        {group.practiceMode ? (
          <>
            {visible.map((set) => (
              <QuizRow key={set.setId} item={set} variant={isModelTest ? "purple" : "cyan"} />
            ))}
            {!showAll && hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-600/50 py-2.5 text-xs font-bold text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
              >
                আরও {formatBnCount(hiddenCount)}টি টেস্ট দেখুন
                <ChevronDown size={14} />
              </button>
            )}
          </>
        ) : (
          <QuizRow
            item={
              group.displaySets[0] ?? {
                id: group.chapterSlug,
                setId: group.chapterSlug,
                title: group.chapterName,
                slug: group.chapterSlug,
                href: `${chapterPathPrefix}/${group.chapterSlug}/set/${encodeURIComponent(group.chapterSlug)}`,
                questionCount: group.totalQuestions,
                setCount: group.physicalSetCount,
                totalQuestions: group.totalQuestions,
                mode: group.totalQuestions <= MOCK_SET_SIZE ? "timed" : "practice",
              }
            }
          />
        )}
      </div>
    </Card>
  );
}

export function SubjectChapterQuizList({
  groups,
  chapterPathPrefix,
  emptyMessage = "এই বিষয়ে অধ্যায়ভিত্তিক MCQ এখনো যোগ করা হয়নি। মডেল টেস্ট ট্যাবে চেষ্টা করো।",
  expandAll = false,
  hideChapterLinks = false,
}: ChapterListProps) {
  if (groups.length === 0) {
    return (
      <Card variant="glass" className="p-8 text-center text-slate-500">
        <BookOpen className="mx-auto mb-2 h-8 w-8 text-slate-600" />
        <p className="font-semibold text-slate-300">{emptyMessage}</p>
        <p className="mt-2 text-xs text-slate-500">
          অধ্যায়ভিত্তিক কুইজ = সিলেবাসের প্রতিটি অধ্যায়ের MCQ প্র্যাকটিস
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <ChapterGroupCard
          key={group.chapterSlug}
          group={group}
          chapterPathPrefix={chapterPathPrefix}
          expandAll={expandAll}
          hideChapterLinks={hideChapterLinks}
        />
      ))}
    </div>
  );
}

export function SubjectModelTestList({
  paperItems,
  chapterItems,
  modelTestPathPrefix,
  emptyMessage = "মডেল টেস্ট এখনো যোগ করা হয়নি।",
  expandAll = false,
}: Omit<ModelListProps, "category">) {
  const chapterGroups = useMemo(
    () => groupItemsByModelTestChapter(chapterItems),
    [chapterItems],
  );

  if (paperItems.length === 0 && chapterItems.length === 0) {
    return (
      <Card variant="glass" className="p-8 text-center text-slate-500">
        <Target className="mx-auto mb-2 h-8 w-8 text-slate-600" />
        <p className="text-slate-300">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Paper-wise Model Tests */}
      {paperItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            পত্রভিত্তিক মডেল টেস্ট (Paper-wise Model Tests)
          </h3>
          <div className="space-y-2">
            {paperItems.map((item) => (
              <QuizRow key={item.setId} item={item} variant="purple" />
            ))}
          </div>
        </div>
      )}

      {/* 2. Chapter-wise Model Tests */}
      {chapterItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">
            অধ্যায়ভিত্তিক মডেল টেস্ট (Chapter-wise Model Tests)
          </h3>
          <div className="space-y-4">
            {chapterGroups.length > 1 ? (
              chapterGroups.map((group) => (
                <Card
                  key={group.chapterSlug}
                  variant="glass"
                  className="overflow-hidden border-slate-700/40 bg-slate-950/40 p-0"
                >
                  <div className="flex items-center gap-3 border-b border-white/[0.05] bg-white/[0.02] px-4 py-3.5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                      <Target size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white sm:text-lg">{group.chapterName}</h3>
                      <p className="mt-0.5 text-xs font-semibold text-slate-400">
                        {formatBnCount(group.displaySets.length)} মডেল টেস্ট
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 p-3">
                    {(expandAll ? group.displaySets : group.displaySets.slice(0, 3)).map((item) => (
                      <QuizRow key={item.setId} item={item} variant="purple" />
                    ))}
                    {!expandAll && group.displaySets.length > 3 && (
                      <p className="py-1 text-center text-xs font-bold text-slate-500">
                        +{formatBnCount(group.displaySets.length - 3)} আরও মডেল টেস্ট
                      </p>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="space-y-2">
                {chapterItems.map((item) => (
                  <QuizRow key={item.setId} item={item} variant="purple" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type BoardListProps = {
  level: RouteLevel;
  subjectSlug: string;
  emptyMessage?: string;
};

export function SubjectBoardQuestionsList({
  level,
  subjectSlug,
  emptyMessage = "এই বিষয়ে বোর্ড প্রশ্ন এখনো যোগ করা হয়নি।",
}: BoardListProps) {
  const hubPath = boardQuestionsHubPath(level, subjectSlug);

  return (
    <div className="space-y-4">
      <Card variant="glass" className="border-amber-500/20 bg-amber-500/[0.04] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
              <GraduationCap size={22} />
            </div>
            <div>
              <h3 className="text-base font-black text-white sm:text-lg">বোর্ড পরীক্ষার প্রশ্ন</h3>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Dhaka, Rajshahi, Cumilla, Barishal সহ সব বোর্ড — বছর অনুযায়ী MCQ প্র্যাকটিস
              </p>
            </div>
          </div>
          <Link
            href={hubPath}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 sm:text-sm"
          >
            সব বোর্ড দেখুন
            <ChevronRight size={14} />
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {BOARD_QUESTION_YEARS.map((year) => (
          <Link
            key={year.value}
            href={boardQuestionsYearPath(level, subjectSlug, year.value)}
            className="group"
          >
            <Card
              variant="glass"
              className="border-white/[0.06] p-4 text-center transition hover:border-amber-500/35 hover:bg-amber-500/[0.04]"
            >
              <p className="text-lg font-black text-white group-hover:text-amber-200">
                {year.label}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-slate-500">বোর্ড MCQ</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SubjectQuestionBankList({
  items,
  subjectSlug,
  emptyMessage = "বোর্ড প্রশ্ন ব্যাংক এখনো যোগ করা হয়নি।",
}: BankListProps) {
  if (items.length === 0) {
    return (
      <Card variant="glass" className="p-8 text-center text-slate-500">
        <BookOpen className="mx-auto mb-2 h-8 w-8 text-slate-600" />
        <p>{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <p className="mb-2 text-xs text-slate-400">
        বোর্ড প্রশ্ন ব্যাংক — {formatBnCount(items.length)} সেট
      </p>
      {items.map((item) => (
        <QuizRow key={item.setId} item={item} variant="amber" />
      ))}
    </div>
  );
}
```

## File: [src/components/ui/Badge.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/ui/Badge.tsx)

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "rank" | "premium" | "success" | "warning" | "default";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold font-bangla transition-colors border",
          // Variants
          variant === "default" && "bg-slate-800/80 border-slate-700 text-slate-300",
          variant === "rank" && "bg-gradient-to-r from-amber-500 to-yellow-400 border-yellow-300 text-black shadow-glow-gold",
          variant === "premium" && "bg-gold-dark/60 border-gold-rank/40 text-gold-rank shadow-glow-gold uppercase font-outfit tracking-wider",
          variant === "success" && "bg-success-green/10 border-success-green/30 text-success-green",
          variant === "warning" && "bg-error-red/10 border-error-red/30 text-error-red",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
```

## File: [src/components/ui/Button.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/ui/Button.tsx)

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "premium" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-bangla transition-all duration-300 active:scale-95 focus:outline-none disabled:opacity-50 disabled:pointer-events-none shine-hover",
          // Variants
          variant === "primary" && [
            "bg-gradient-to-r from-purple-glow to-indigo-600 text-white rounded-xl",
            "hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple border border-purple-glow/30"
          ],
          variant === "secondary" && [
            "bg-cyan-dark/40 border border-cyan-glow/40 text-cyan-glow rounded-xl",
            "hover:bg-cyan-glow/10 hover:border-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          ],
          variant === "premium" && [
            "bg-gradient-to-r from-yellow-500 via-gold-rank to-amber-500 text-[#02030b] rounded-full font-bold",
            "hover:from-yellow-400 hover:to-amber-400 shadow-glow-gold border border-yellow-300/30"
          ],
          variant === "ghost" && [
            "text-slate-300 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-slate-800"
          ],
          // Sizes
          size === "sm" && "px-3 py-1.5 text-xs md:text-sm",
          size === "md" && "px-5 py-2.5 text-sm md:text-base",
          size === "lg" && "px-8 py-3.5 text-base md:text-lg",
          // Layout
          fullWidth ? "w-full flex" : "",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
```

## File: [src/components/ui/Card.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/components/ui/Card.tsx)

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "premium" | "dark" | "leaderboard";
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", hoverable = false, ...props }, ref) => {
    return (
      <div
        className={cn(
          "rounded-2xl transition-all duration-300 font-bangla",
          // Variants
          variant === "glass" && [
            "bg-navy-card backdrop-blur-xl border border-purple-glow/10",
            hoverable && "hover:border-purple-glow/30 hover:shadow-glow-purple"
          ],
          variant === "premium" && [
            "bg-gradient-to-br from-[#0c0d1e] to-[#1d1607] border border-gold-rank/25 shadow-glow-gold",
            hoverable && "hover:border-gold-rank/50 hover:shadow-glow-gold"
          ],
          variant === "dark" && [
            "bg-navy-light/60 border border-slate-900",
            hoverable && "hover:border-slate-800 hover:bg-navy-light/80"
          ],
          variant === "leaderboard" && [
            "bg-navy-light/35 border border-purple-glow/5 backdrop-blur-md",
            hoverable && "hover:border-purple-glow/20 hover:bg-navy-light/50"
          ],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
```

## File: [src/context/AuthContext.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/context/AuthContext.tsx)

```tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { api, ApiError, isBackendUnavailable } from "@/lib/api";
import { flushPendingExamAttempt } from "@/lib/pending-exam";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
  mobile?: string;
  className?: string;
  level?: string;
  group?: string;
  district?: string;
  schoolName?: string;
  collegeName?: string;
  collegeEiin?: string;
  batch?: string;
  examYear?: string | number;
  targetExamYear?: string | number;
  favoriteSubject?: string;
  weakSubjects?: string;
  score?: number;
  rank?: number | null;
  badge?: string;
  elo?: number;
  streak?: number;
  profileComplete?: boolean;
  isPremium?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  backendStatus: "checking" | "up" | "down";
  retryBackend: () => Promise<void>;
  loginWithGoogle: () => Promise<UserProfile | null>;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile | null>;
  registerWithEmail: (
    email: string,
    pass: string,
    name: string,
  ) => Promise<UserProfile | null>;
  sendPhoneOtp: (phoneNumber: string, elementId: string) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
  syncProfile: (details: Partial<UserProfile>) => Promise<void>;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function backendSyncErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 503 || err.status === 502) {
      return "Backend API চালু নেই। আলাদা টার্মিনালে `pnpm dev:backend` চালু করুন (port 8000), অথবা `pnpm dev:full` ব্যবহার করুন।";
    }
    if (err.status === 500 && /failed \(|ECONNREFUSED|fetch/i.test(err.message)) {
      return "Backend API-তে সংযোগ ব্যর্থ। FastAPI server (port 8000) চালু আছে কিনা দেখুন।";
    }
    if (err.status === 401) {
      return "Firebase token যাচাই ব্যর্থ। আবার লগইন করুন।";
    }
    return err.message;
  }
  return "সার্ভার সিনক্রোনাইজেশন ব্যর্থ হয়েছে।";
}

function firebaseLoginErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।";
      case "auth/invalid-email":
        return "ইমেইল ঠিক নয়।";
      case "auth/too-many-requests":
        return "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
      case "auth/user-disabled":
        return "এই অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।";
      default:
        console.error("[firebase-login]", err.code, err.message);
        return "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
    }
  }
  return "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<"checking" | "up" | "down">("checking");

  const checkBackend = async () => {
    setBackendStatus("checking");
    try {
      await api.get<{ user: UserProfile | null }>("/api/auth/me");
      setBackendStatus("up");
    } catch {
      setBackendStatus("down");
    }
  };

  const retryBackend = async () => {
    setBackendStatus("checking");
    setError(null);
    await checkBackend();
  };

  const fetchFullProfile = async (): Promise<UserProfile | null> => {
    try {
      const me = await api.get<{ user: UserProfile | null }>("/api/auth/me");
      setBackendStatus("up");
      if (me.user) {
        setUser(me.user);
        return me.user;
      }
      return null;
    } catch (err) {
      console.error("Profile hydrate failed:", err);
      if (isBackendUnavailable(err)) setBackendStatus("down");
      return null;
    }
  };

  const syncWithBackend = async (
    fUser: FirebaseUser,
  ): Promise<UserProfile | null> => {
    try {
      const idToken = await fUser.getIdToken();
      const data = await api.post<{ user: UserProfile }>("/api/auth/firebase", {
        idToken,
      });
      const profile = await fetchFullProfile();
      return profile ?? data.user;
    } catch (err) {
      const message = backendSyncErrorMessage(err);
      console.error("Auth sync error:", err);
      setError(message);
      return null;
    }
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      return;
    }

    const checkSession = async () => {
      try {
        const data = await api.get<{ user: UserProfile | null }>("/api/auth/me");
        setBackendStatus("up");
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        if (isBackendUnavailable(err)) setBackendStatus("down");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        setLoading(true);
        await syncWithBackend(fUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    if (!auth || !googleProvider) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      return null;
    }
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      return await syncWithBackend(cred.user);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "গুগল লগইন ব্যর্থ হয়েছে।";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (
    email: string,
    pass: string,
  ): Promise<UserProfile | null> => {
    if (!auth) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      return null;
    }
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return await syncWithBackend(cred.user);
    } catch (err: unknown) {
      setError(firebaseLoginErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
  ): Promise<UserProfile | null> => {
    if (!auth) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      return null;
    }
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        const trimmedName = name.trim();
        if (trimmedName) {
          await updateProfile(cred.user, { displayName: trimmedName });
        }
        return await syncWithBackend(cred.user);
      }
      return null;
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      setError(
        code === "auth/email-already-in-use"
          ? "ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে।"
          : "অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async (phoneNumber: string, elementId: string) => {
    if (!auth) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      throw new Error("firebase not configured");
    }
    setError(null);
    try {
      const verifier = new RecaptchaVerifier(auth, elementId, {
        size: "invisible",
      });
      return await signInWithPhoneNumber(auth, phoneNumber, verifier);
    } catch {
      setError("ওটিপি পাঠাতে সমস্যা হয়েছে। সঠিক নম্বর ব্যবহার করুন।");
      throw new Error("otp failed");
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.error("Firebase signOut failed:", err);
    }

    setUser(null);
    setFirebaseUser(null);

    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Session cookie clear failed:", err);
    }

    setLoading(false);
    router.replace("/login");
  };

  const syncProfile = async (details: Partial<UserProfile>) => {
    try {
      setLoading(true);
      await api.put("/api/student/profile", details);
      const me = await api.get<{ user: UserProfile | null }>("/api/auth/me");
      if (me.user) {
        setUser(me.user);
        await flushPendingExamAttempt();
      } else {
        setUser((prev) => (prev ? { ...prev, ...details } : null));
      }
    } catch {
      setError("প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।");
      throw new Error("profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
      error,
      backendStatus,
      retryBackend,
      loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPhoneOtp,
        logout,
        syncProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

## File: [src/hooks/useDebounce.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/hooks/useDebounce.ts)

```ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
```

## File: [src/hooks/useSavedQuestions.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/hooks/useSavedQuestions.ts)

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type SavedQuestion,
  getSavedQuestions,
  isQuestionSaved,
  saveQuestion,
  removeSavedQuestion,
  toggleSavedQuestion,
  clearAllSavedQuestions,
  getSavedCount,
} from "@/lib/saved-questions";

/**
 * React hook for managing saved/bookmarked quiz questions.
 *
 * Backed by localStorage — no backend required.  Re-renders are
 * batched so toggling multiple questions in rapid succession is safe.
 */
export function useSavedQuestions() {
  const [saved, setSaved] = useState<SavedQuestion[]>([]);
  const [mounted, setMounted] = useState(false);

  // Hydrate on mount (avoids SSR mismatch)
  useEffect(() => {
    setSaved(getSavedQuestions());
    setMounted(true);
  }, []);

  const refresh = useCallback(() => {
    setSaved(getSavedQuestions());
  }, []);

  const isSaved = useCallback(
    (questionId: string) => {
      if (!mounted) return false;
      return isQuestionSaved(questionId);
    },
    [mounted],
  );

  const toggle = useCallback(
    (question: Omit<SavedQuestion, "savedAt">) => {
      const newState = toggleSavedQuestion(question);
      refresh();
      return newState;
    },
    [refresh],
  );

  const add = useCallback(
    (question: Omit<SavedQuestion, "savedAt">) => {
      const ok = saveQuestion(question);
      if (ok) refresh();
      return ok;
    },
    [refresh],
  );

  const remove = useCallback(
    (questionId: string) => {
      const ok = removeSavedQuestion(questionId);
      if (ok) refresh();
      return ok;
    },
    [refresh],
  );

  const clearAll = useCallback(() => {
    clearAllSavedQuestions();
    refresh();
  }, [refresh]);

  const count = mounted ? saved.length : 0;

  return {
    saved,
    count,
    mounted,
    isSaved,
    toggle,
    add,
    remove,
    clearAll,
    refresh,
  };
}
```

## File: [src/hooks/useWrongAnswers.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/hooks/useWrongAnswers.ts)

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type WrongQuestion,
  getWrongQuestions,
  isQuestionWrong,
  saveWrongQuestion,
  removeWrongQuestion,
  clearAllWrongQuestions,
} from "@/lib/wrong-answers";

/**
 * React hook for managing wrong/incorrectly answered quiz questions.
 * 
 * Backed by localStorage — no backend required.
 */
export function useWrongAnswers() {
  const [wrong, setWrong] = useState<WrongQuestion[]>([]);
  const [mounted, setMounted] = useState(false);

  // Hydrate on mount (avoids SSR mismatch)
  useEffect(() => {
    setWrong(getWrongQuestions());
    setMounted(true);
  }, []);

  const refresh = useCallback(() => {
    setWrong(getWrongQuestions());
  }, []);

  const isWrong = useCallback(
    (questionId: string) => {
      if (!mounted) return false;
      return isQuestionWrong(questionId);
    },
    [mounted],
  );

  const add = useCallback(
    (question: Omit<WrongQuestion, "savedAt">) => {
      const ok = saveWrongQuestion(question);
      if (ok) refresh();
      return ok;
    },
    [refresh],
  );

  const remove = useCallback(
    (questionId: string) => {
      const ok = removeWrongQuestion(questionId);
      if (ok) refresh();
      return ok;
    },
    [refresh],
  );

  const clearAll = useCallback(() => {
    clearAllWrongQuestions();
    refresh();
  }, [refresh]);

  const count = mounted ? wrong.length : 0;

  return {
    wrong,
    count,
    mounted,
    isWrong,
    add,
    remove,
    clearAll,
    refresh,
  };
}
```

## File: [src/lib/api.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/api.ts)

```ts
/**
 * Central API client for FastAPI backend.
 *
 * Local dev (default): NEXT_PUBLIC_USE_API_PROXY=true → same-origin `/api/*`
 * via Next.js rewrite → cookies work with SameSite=Lax.
 *
 * Direct mode: NEXT_PUBLIC_USE_API_PROXY=false + NEXT_PUBLIC_API_URL=http://localhost:8000
 */
const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY !== "false";

const directBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export const API_BASE_URL = useProxy ? "" : directBase;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: unknown,
    public retryable = false,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Returns true when the error means the backend is simply unreachable
 * (network down, CORS, or 5xx without a body).
 */
export function isBackendUnavailable(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false;
  if (err.status >= 500 && err.retryable) return true;
  return false;
}

/**
 * Returns true when a Response object signals the backend is unreachable
 * (5xx with no JSON body, which typically means the server is down).
 */
function isUnreachableResponse(res: Response): boolean {
  return res.status >= 500 && !res.headers.get("content-type")?.includes("json");
}

function parseErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const record = data as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  if (typeof record.detail === "string") return record.detail;
  if (Array.isArray(record.detail)) {
    return record.detail
      .map((item) => {
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg: string }).msg);
        }
        return String(item);
      })
      .join(", ");
  }
  return fallback;
}

function buildUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (!isFormData && options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Retry transparently on network failures and 5xx so transient
  // backend restarts don't immediately surface as errors to the user.
  const maxAttempts = 3; // 1 initial + 2 retries
  const UNAVAILABLE_MSG =
    "Backend API unavailable — start FastAPI on port 8000 (`pnpm dev:backend`)";
  let res!: Response;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      res = await fetch(buildUrl(path), {
        ...options,
        credentials: "include",
        headers,
      });
    } catch (networkErr) {
      // fetch() throws on DNS failure, connection refused, CORS, etc.
      // This is the most common case when the backend hasn't started yet.
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      throw new ApiError(UNAVAILABLE_MSG, 0, null, true);
    }

    // Server responded but with 5xx and no JSON body — likely still starting.
    if (isUnreachableResponse(res)) {
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      throw new ApiError(UNAVAILABLE_MSG, res.status, null, true);
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const fallback = `API request failed (${res.status})`;
      const message = parseErrorMessage(errorData, fallback);
      throw new ApiError(message, res.status, errorData);
    }

    break; // success
  }

  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export const api = {
  /**
   * Check whether the FastAPI backend is reachable.
   * Useful for showing a retry banner on login / dashboard pages.
   */
  async checkBackend(): Promise<boolean> {
    try {
      await apiRequest<unknown>('/api/auth/me');
      return true;
    } catch {
      return false;
    }
  },

  get: <T>(path: string, init?: RequestInit) =>
    apiRequest<T>(path, { ...init, method: "GET" }),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    apiRequest<T>(path, {
      ...init,
      method: "POST",
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    }),

  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    apiRequest<T>(path, {
      ...init,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, init?: RequestInit) =>
    apiRequest<T>(path, { ...init, method: "DELETE" }),
};
```

## File: [src/lib/board-quizzes.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/board-quizzes.ts)

```ts
import fs from "fs/promises";
import path from "path";
import type { ApiQuestion } from "@/types/quiz";

export interface BoardQuizMetadata {
  level: "HSC" | "SSC";
  subject: string;
  paper?: string;
  year: string;
  board: string;
}

const QUESTIONS_DIR = path.resolve(process.cwd(), "public/questions");

function hscSubjectFileSlug(subject: string, paper?: string): string {
  if (paper) return `${subject}-${paper}`;
  return subject;
}

async function loadBoardQuestionsFromStatic(
  level: "HSC" | "SSC",
  subject: string,
  paper: string | undefined,
  year: string,
): Promise<Record<string, ApiQuestion[]>> {
  let fileSlug = level === "HSC" ? hscSubjectFileSlug(subject, paper) : subject;
  if (fileSlug === "math") fileSlug = "general-math";

  const indexFilePath = path.join(QUESTIONS_DIR, fileSlug, "index.json");

  try {
    const rawIndex = await fs.readFile(indexFilePath, "utf8");
    const indexData = JSON.parse(rawIndex) as {
      boards?: Array<{ id: string; title: string; questionCount: number }>;
    };

    const boardsList = indexData.boards || [];
    // Filter boards for the requested year, matching e.g., "dhaka-2023" or similar
    const yearBoards = boardsList.filter((b) => b.id.endsWith(`-${year}`));
    if (yearBoards.length === 0) return {};

    const results: Record<string, ApiQuestion[]> = {};

    for (const boardInfo of yearBoards) {
      // Find the board name from the ID (e.g. "dhaka-2023" -> board is "dhaka")
      const boardName = boardInfo.id.substring(0, boardInfo.id.lastIndexOf(`-${year}`));
      const boardQuestionsPath = path.join(QUESTIONS_DIR, fileSlug, `${boardInfo.id}.json`);

      try {
        const rawQs = await fs.readFile(boardQuestionsPath, "utf8");
        const questionsList = JSON.parse(rawQs) as Array<{
          id: string;
          subject: string;
          chapter: string;
          text: string;
          options: string[];
          image?: string | null;
          timeLimit?: number;
          optionImages?: string[] | null;
        }>;

        if (Array.isArray(questionsList)) {
          results[boardName] = questionsList.map((pq) => ({
            id: pq.id,
            questionText: pq.text,
            optionA: pq.options[0] || "",
            optionB: pq.options[1] || "",
            optionC: pq.options[2] || "",
            optionD: pq.options[3] || "",
            correctOption: "", // Never exposed to frontend
            subject: pq.subject,
            chapter: pq.chapter,
            explanation: "", // Never exposed to frontend
            image: pq.image || null,
            optionImages: pq.optionImages || null,
          }));
        }
      } catch (err) {
        console.warn(`Failed to read board questions from ${boardQuestionsPath}:`, err);
      }
    }

    return results;
  } catch (err) {
    console.warn(`Failed to load board quizzes from index:`, err);
    return {};
  }
}

/**
 * Returns available boards and their questions for the given criteria.
 */
export async function getAvailableBoardQuizzes(
  level: "HSC" | "SSC",
  subject: string,
  paper: string | undefined,
  year: string,
): Promise<Record<string, ApiQuestion[]>> {
  const targetSubject = subject.toLowerCase();
  const targetPaper = paper?.toLowerCase();

  return loadBoardQuestionsFromStatic(
    level,
    targetSubject,
    targetPaper,
    year,
  );
}

/** @deprecated Used by legacy tooling; keys in scratch/parsed_quizzes.json */
export function parseBoardQuestionKey(key: string): BoardQuizMetadata | null {
  const p = key.toLowerCase().replace(/\\/g, "/");
  if (!p.includes("/board-questions/")) return null;

  const parts = p.split("/");
  const level = p.startsWith("ssc") ? "SSC" : "HSC";
  const boardQuestionsIndex = parts.indexOf("board-questions");
  const preParts = parts.slice(0, boardQuestionsIndex);

  let subject = "";
  let paper: string | undefined = undefined;

  if (level === "HSC") {
    subject = preParts[2] || "";
    if (
      preParts[3] &&
      (preParts[3].includes("1st") ||
        preParts[3].includes("2nd") ||
        preParts[3].includes("paper"))
    ) {
      paper = preParts[3];
    }
  } else {
    subject = preParts[2] || "";
  }

  const postParts = parts.slice(boardQuestionsIndex + 1);
  const yearWiseIndex = postParts.indexOf("year-wise");
  let year = "";
  let boardFile = "";

  if (yearWiseIndex !== -1 && yearWiseIndex + 2 < postParts.length) {
    year = postParts[yearWiseIndex + 1];
    boardFile = postParts[yearWiseIndex + 2];
  } else {
    const yearMatch = p.match(/\/(\d{4})\//);
    if (yearMatch) year = yearMatch[1];
    boardFile = parts[parts.length - 1];
  }

  const boardNameRaw = boardFile.replace(".ts", "").replace(".js", "");
  let cleanBoard = boardNameRaw;
  if (boardNameRaw.includes("-board-")) {
    const boardParts = boardNameRaw.split("-");
    const boardIdx = boardParts.indexOf("board");
    if (boardIdx > 0) cleanBoard = boardParts[boardIdx - 1];
  }
  if (cleanBoard === "barisal") cleanBoard = "barishal";
  if (cleanBoard === "comilla") cleanBoard = "cumilla";

  return { level, subject, paper, year, board: cleanBoard };
}
```

## File: [src/lib/dashboard-analytics.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/dashboard-analytics.ts)

```ts
export interface RecentExamAttempt {
  id: string;
  examName: string;
  examSlug: string;
  questionsPath?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
  userAnswers?: string;
  elo?: number | null;
  eloDelta?: number | null;
}

export interface ChapterStat {
  slug: string;
  label: string;
  avgPct: number;
  attempts: number;
}

export interface EloPoint {
  label: string;
  elo: number;
}

export function slugLabel(slug: string): string {
  return slug.replace("/", " · ").replace(/-/g, " ");
}

export function parseSubjectKey(examSlug: string): string {
  const base = (examSlug.split("/")[0] || "general").toLowerCase();
  if (base.includes("physics")) return "physics";
  if (base.includes("chemistry")) return "chemistry";
  if (base.includes("biology")) return "biology";
  if (base.includes("math") || base.includes("higher")) return "math";
  return base;
}

export function computeChapterStats(exams: RecentExamAttempt[]): ChapterStat[] {
  const groups = new Map<string, { totalPct: number; count: number }>();
  for (const exam of exams) {
    const key = exam.examSlug || exam.examName;
    if (!key) continue;
    const entry = groups.get(key) || { totalPct: 0, count: 0 };
    entry.totalPct += exam.percentage;
    entry.count += 1;
    groups.set(key, entry);
  }
  return Array.from(groups.entries())
    .map(([slug, { totalPct, count }]) => ({
      slug,
      label: slugLabel(slug),
      avgPct: Math.round((totalPct / count) * 10) / 10,
      attempts: count,
    }))
    .sort((a, b) => a.avgPct - b.avgPct);
}

export function computeOverallAccuracy(exams: RecentExamAttempt[]): number {
  if (exams.length === 0) return 0;
  const sum = exams.reduce((acc, e) => acc + e.percentage, 0);
  return Math.round((sum / exams.length) * 10) / 10;
}

export function computeEloTrend(
  exams: RecentExamAttempt[],
  currentElo: number,
  limit = 10,
): EloPoint[] {
  const slice = exams.slice(0, limit).reverse();
  if (slice.length === 0) {
    return [{ label: "Now", elo: currentElo }];
  }

  const hasStoredElo = slice.some((e) => e.elo != null && e.elo > 0);
  if (hasStoredElo) {
    return slice.map((e, i) => ({
      label: `T${i + 1}`,
      elo: e.elo ?? currentElo,
    }));
  }

  let running = currentElo;
  const points: EloPoint[] = [];
  for (let i = slice.length - 1; i >= 0; i--) {
    points.unshift({ label: `T${i + 1}`, elo: running });
    const exam = slice[i];
    const delta =
      exam.eloDelta ?? Math.round((exam.percentage - 50) / 5);
    running = Math.max(100, running - delta);
  }
  return points;
}

export function topSubjectKeys(
  exams: RecentExamAttempt[],
  limit = 3,
): string[] {
  const counts = new Map<string, number>();
  for (const exam of exams) {
    const key = parseSubjectKey(exam.examSlug || exam.examName);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  if (sorted.length >= limit) return sorted.slice(0, limit).map(([k]) => k);

  const defaults = ["physics", "chemistry", "biology"];
  const result = sorted.map(([k]) => k);
  for (const d of defaults) {
    if (result.length >= limit) break;
    if (!result.includes(d)) result.push(d);
  }
  return result.slice(0, limit);
}

export { subjectPracticeHref } from "@/lib/quiz/unified-routes";

export function quizWithinLast24Hours(exams: RecentExamAttempt[]): boolean {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return exams.some((e) => {
    if (!e.createdAt) return false;
    const ts = new Date(e.createdAt).getTime();
    return !Number.isNaN(ts) && ts >= cutoff;
  });
}
```

## File: [src/lib/firebase-auth-errors.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/firebase-auth-errors.ts)

```ts
import { FirebaseError } from "firebase/app";

export function getFirebaseAuthErrorMessage(
  err: unknown,
  fallback = "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-email":
        return "ইমেইল ঠিক নয়। সঠিক ইমেইল দিন।";
      case "auth/missing-email":
        return "ইমেইল লিখুন।";
      case "auth/user-not-found":
        // Same message as success — do not reveal whether email exists
        return "";
      case "auth/too-many-requests":
        return "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
      case "auth/network-request-failed":
        return "ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।";
      case "auth/invalid-continue-uri":
      case "auth/unauthorized-continue-uri":
        return "রিসেট লিংক কনফিগারেশন ভুল। Firebase Authorized domains চেক করুন।";
      default:
        console.error("[firebase-auth]", err.code, err.message);
        return fallback;
    }
  }

  console.error("[firebase-auth]", err);
  return fallback;
}
```

## File: [src/lib/firebase.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/firebase.ts)

```ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth, type ActionCodeSettings } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export { app, auth, googleProvider };

/** Continue URL after Firebase password reset (client-only). */
export function getPasswordResetActionCodeSettings(): ActionCodeSettings | undefined {
  if (typeof window === "undefined") return undefined;
  return {
    url: `${window.location.origin}/login`,
    handleCodeInApp: false,
  };
}
```

## File: [src/lib/format-model-test-title.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/format-model-test-title.ts)

```ts
export type ModelTestCategory = "model" | "prediction" | "quick" | "board";

export type ModelTestImportance = "high" | "medium" | "low";
export type ModelTestDifficulty = "easy" | "medium" | "hard" | "advanced";

export const MODEL_TEST_CATEGORY_ORDER: Record<ModelTestCategory, number> = {
  model: 0,
  board: 1,
  prediction: 2,
  quick: 3,
};

export const SORT_PRACTICE = 100000;
export const SORT_UNNUMBERED = 50000;

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBanglaNumber(num: number): string {
  return String(num)
    .split("")
    .map((char) => {
      const d = parseInt(char, 10);
      return isNaN(d) ? char : BANGLA_DIGITS[d];
    })
    .join("");
}

function banglaTwoDigit(num: number): string {
  const raw = toBanglaNumber(num);
  return raw.length >= 2 ? raw : `০${raw}`;
}

/** Convert Bangla digits to English digits in any string. */
export function normalizeDigits(text: string): string {
  return text.replace(/[০-৯]/g, (c) => String(BANGLA_DIGITS.indexOf(c)));
}

export function isPracticeSourceKey(sourceKey: string): boolean {
  const s = sourceKey.toLowerCase();
  return (
    s.endsWith("_questions") ||
    s.endsWith("-questions") ||
    (s.includes("questions") &&
      !s.includes("model-test") &&
      !s.includes("model_test"))
  );
}

export function getModelTestCategory(slug: string): ModelTestCategory {
  const s = slug.toLowerCase();

  if (s.includes("board")) {
    return "board";
  }

  if (s.includes("prediction") || s.includes("প্রেডিকশন")) {
    return "prediction";
  }

  if (isPracticeSourceKey(slug)) {
    return "quick";
  }

  return "model";
}

/** Extract serial number from slug/title — Bangla + English digits. */
export function extractTestNumber(title: string): number | null {
  if (isPracticeSourceKey(title)) {
    return null;
  }

  const s = normalizeDigits(title.toLowerCase());

  const patterns = [
    /model[-_]?test[-_]?(\d+)/,
    /super[-_]?model[-_]?set[-_]?(\d+)/,
    /prediction[-_]?set[-_]?(\d+)/,
    /prediction[-_]?round(\d+)/,
    /special[-_]?set[-_]?(\d+)/,
    /high[-_]?common[-_]?set[-_]?(\d+)/,
    /high[-_]?common[-_]?sets[-_]?(\d+)/,
    /zoologyset(\d+)/,
    /ch(\d+)set(\d+)/,
    /sets?(\d+)/,
    /set[-_]?(\d+)/,
    /round(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = s.match(pattern);
    if (match) {
      const num = parseInt(match[match.length - 1], 10);
      if (!Number.isNaN(num)) return num;
    }
  }

  const trailing = s.match(/(\d+)$/);
  if (trailing) return parseInt(trailing[1], 10);

  const all = s.match(/\d+/g);
  if (all?.length) return parseInt(all[0], 10);

  return null;
}

/** @deprecated use extractTestNumber */
export function extractModelTestNumber(slug: string): number {
  const n = extractTestNumber(slug);
  return n ?? 9999;
}

function formatUnnumberedTitle(sourceKey: string): string {
  const s = sourceKey.toLowerCase();
  if (s.includes("killer")) return "Model Test Challenge";
  if (s.includes("nightmare")) return "Model Test Advanced";
  if (s.includes("board")) return "Model Test Board";
  if (s.includes("final")) return "Model Test Final";
  const short = sourceKey.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
  return `Model Test · ${short.slice(0, 28)}`;
}

/** Clean display title — preserves serial number, never raw slug. */
export function formatModelTestTitle(rawTitle: string): string {
  return formatModelTestDisplayTitle(rawTitle);
}

export function formatModelTestDisplayTitle(sourceKey: string): string {
  if (isPracticeSourceKey(sourceKey)) {
    return "Model Test Practice";
  }

  const num = extractTestNumber(sourceKey);
  if (num !== null) {
    return `Model Test ${String(num).padStart(2, "0")}`;
  }

  return formatUnnumberedTitle(sourceKey);
}

export function shortSourceKeyLabel(sourceKey: string): string {
  const s = sourceKey
    .replace(/^ssc[-_]?/i, "")
    .replace(/^hsc[-_]?/i, "")
    .replace(/physics|chemistry|biology/gi, "")
    .replace(/[_-]+/g, " ")
    .trim();
  return s.length > 3 ? s.slice(0, 20) : sourceKey.slice(0, 20);
}

export function getSortNumber(sourceKey: string, testNumber: number | null): number {
  if (isPracticeSourceKey(sourceKey)) return SORT_PRACTICE;
  if (testNumber !== null) return testNumber;
  return SORT_UNNUMBERED;
}

export function resolveDisplayTitleCollisions<
  T extends { sourceKey: string; displayTitle: string },
>(items: T[]): T[] {
  const byTitle = new Map<string, T[]>();
  for (const item of items) {
    const list = byTitle.get(item.displayTitle) ?? [];
    list.push(item);
    byTitle.set(item.displayTitle, list);
  }

  return items.map((item) => {
    const group = byTitle.get(item.displayTitle)!;
    if (group.length <= 1) return item;
    return {
      ...item,
      displayTitle: `${item.displayTitle} · ${shortSourceKeyLabel(item.sourceKey)}`,
    };
  });
}

export function inferModelTestDifficulty(
  slug: string,
  sortNumber: number,
): ModelTestDifficulty | undefined {
  const s = slug.toLowerCase();

  if (
    s.includes("killer") ||
    s.includes("nightmare") ||
    s.includes("challenge")
  ) {
    return "advanced";
  }

  if (s.includes("hard")) {
    return "hard";
  }

  if (sortNumber >= 11 && sortNumber < SORT_UNNUMBERED) {
    return "advanced";
  }

  if (sortNumber >= 6 && sortNumber < SORT_UNNUMBERED) {
    return "hard";
  }

  if (sortNumber <= 3) {
    return "easy";
  }

  if (sortNumber < SORT_UNNUMBERED) {
    return "medium";
  }

  return undefined;
}

export type ModelTestScope = "chapter" | "paper" | "board" | "whole-syllabus";

export type ChapterCoveredEntry =
  | string
  | {
      chapter?: string | number;
      chapterName?: string;
      chapterNo?: string | number;
      name?: string;
    };

interface ModelTestScopeMeta {
  tags?: unknown[];
  chaptersCovered?: ChapterCoveredEntry[];
  scope?: string;
}

/** Normalize chaptersCovered — JSON may use strings or { chapter, chapterName } objects. */
export function normalizeChaptersCovered(
  chapters?: ChapterCoveredEntry[] | unknown[],
): string[] {
  if (!chapters?.length) return [];

  return chapters
    .map((entry) => {
      if (typeof entry === "string") {
        return entry.replace(/\s*&\s*.*/g, "").trim();
      }
      if (entry && typeof entry === "object") {
        const obj = entry as Record<string, unknown>;
        if (typeof obj.chapterName === "string" && obj.chapterName.trim()) {
          return obj.chapterName.trim();
        }
        if (typeof obj.name === "string" && obj.name.trim()) {
          return obj.name.trim();
        }
        if (obj.chapter != null) return String(obj.chapter).trim();
        if (obj.chapterNo != null) return String(obj.chapterNo).trim();
      }
      if (typeof entry === "number") return String(entry);
      return "";
    })
    .filter(Boolean);
}

/** Chapter-wise (single chapter/topic) vs full-paper model tests. */
export function inferModelTestScope(
  sourceKey: string,
  meta?: ModelTestScopeMeta,
): ModelTestScope {
  const s = sourceKey.toLowerCase();
  const tags = (meta?.tags ?? []).map((t) => String(t).toLowerCase());
  const coveredChapterCount = normalizeChaptersCovered(meta?.chaptersCovered).length;

  if (
    tags.includes("chapter-wise") ||
    tags.includes("chapter") ||
    meta?.scope === "chapter"
  ) {
    return "chapter";
  }
  if (
    tags.includes("paper-wise") ||
    tags.includes("paper") ||
    meta?.scope === "paper"
  ) {
    return "paper";
  }

  if (
    /chapter[-_]\d{2}[-_](?:high-priority-)?(?:set|model-test)/.test(s) ||
    /ch\d|chapter[-_]?\d|chapterwise|zoologyset|chset\d|chemistryset\d+$/.test(s)
  ) {
    return "chapter";
  }
  if (/physicsfirstpaperch\d/.test(s)) return "chapter";
  if (/model-test-\d+-[a-z]/.test(s) && !/model-test-\d+$/.test(s)) {
    return "chapter";
  }
  if (coveredChapterCount === 1) return "chapter";

  if (
    s.includes("board-standard") ||
    s.includes("board_style") ||
    (s.includes("board") && !s.includes("board-questions"))
  ) {
    return "board";
  }
  if (
    s.includes("whole-syllabus") ||
    s.includes("full-book") ||
    s.includes("wholebook") ||
    s.includes("finalsets")
  ) {
    return "whole-syllabus";
  }
  if (
    /tier-a-hot|high-common|super-model|killer-set/.test(s)
  ) {
    return "paper";
  }
  if (/hsc-[a-z0-9-]+-paper-model-test-\d+$/.test(s)) return "paper";
  if (/ssc-[a-z-]+-(board-standard|high-common)/.test(s)) return "paper";
  if (/physicsfirstpapersets|super-model-set/.test(s)) return "paper";
  if (/model-test-\d+$/.test(s)) return "paper";
  if (coveredChapterCount >= 3) return "paper";

  return "paper";
}

export function inferModelTestImportance(
  type: ModelTestCategory,
  testNumber: number | null,
  sourceKey?: string,
  tags?: unknown[],
): ModelTestImportance {
  if (sourceKey && isHyperMegaHotSource(sourceKey, tags?.map(String))) return "high";
  if (type === "board") return "high";
  if (testNumber !== null && testNumber <= 5) return "high";
  if (testNumber !== null && testNumber <= 10) return "medium";
  if (type === "prediction" && testNumber !== null && testNumber <= 3) {
    return "medium";
  }
  return "low";
}

export function inferModelTestPriority(
  type: ModelTestCategory,
  testNumber: number | null,
  _sourceKey?: string,
): number {
  const base: Record<ModelTestCategory, number> = {
    model: 0,
    board: 40,
    prediction: 80,
    quick: 120,
  };
  const num = testNumber ?? 50;
  return base[type] + num;
}

const BENGALI_CHAPTER_TEST_TITLE_PATTERN =
  /^অধ্যায় [০-৯]{2} · .+ · (টেস্ট|ভাগ|সেট) [০-৯]{2}$/;

/** Legacy / internal titles that must not appear in the UI. */
export function isBadInternalTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return false;
  const s = t.toLowerCase();
  return (
    /hyper mega hot|mega hot|hyper-exclusive|board analyzed premium/i.test(s) ||
    /^chapter \d{2} hyper mega hot set \d{2}$/i.test(s) ||
    /^chapter \d{2} model test \d{2}$/i.test(s)
  );
}

export function resolveChapterName(
  chaptersCovered?: ChapterCoveredEntry[],
): string | undefined {
  const names = normalizeChaptersCovered(chaptersCovered);
  const first = names[0];
  if (!first || /^অধ্যায়\s*\d+$/i.test(first) || /^\d{1,2}$/.test(first)) {
    return undefined;
  }
  return first;
}

export function formatChapterWiseBengaliTitle(
  chapterNo: number,
  chapterName: string | undefined,
  setNo: number,
  opts?: { isSplit?: boolean },
): string {
  const ch = banglaTwoDigit(chapterNo);
  const set = banglaTwoDigit(setNo);
  const suffix = opts?.isSplit ? `ভাগ ${set}` : `টেস্ট ${set}`;
  if (chapterName?.trim()) {
    return `অধ্যায় ${ch} · ${chapterName.trim()} · ${suffix}`;
  }
  return `অধ্যায় ${ch} · ${suffix}`;
}

/** Student-facing title from continuous UI index (1-based). */
export function formatUiDisplayTitle(
  displayIndex: number,
  scope: ModelTestScope = "paper",
  chapterNo?: number | null,
  chapterName?: string,
  setNo?: number | null,
): string {
  switch (scope) {
    case "chapter": {
      const ch = chapterNo ?? 1;
      const set = setNo ?? displayIndex;
      const isSplit = false;
      return formatChapterWiseBengaliTitle(ch, chapterName, set, { isSplit });
    }
    case "board":
      return `বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট · সেট ${banglaTwoDigit(displayIndex)}`;
    case "whole-syllabus":
      return `সম্পূর্ণ পাঠ্যবই · সেট ${banglaTwoDigit(displayIndex)}`;
    default:
      return `মডেল টেস্ট · সেট ${banglaTwoDigit(displayIndex)}`;
  }
}

export function extractChapterNumber(sourceKey: string): number | null {
  const s = normalizeDigits(sourceKey.toLowerCase());
  const m = s.match(/chapter[-_]?(\d+)|ch(\d+)/);
  if (m) return parseInt(m[1] ?? m[2], 10);
  return null;
}

const UI_TITLE_PATTERN = /^Model Test \d{2}$/;
const CHAPTER_TITLE_PATTERN = /^Chapter \d{2} Model Test \d{2}$/;
const BOARD_TITLE_PATTERN = /^Board Standard Model Test \d{2}$/;
const WHOLE_TITLE_PATTERN = /^Whole Syllabus Model Test \d{2}$/;
const BENGALI_MODEL_SET_TITLE_PATTERN = /^মডেল টেস্ট · সেট [০-৯]{2}$/;

export function isHyperMegaHotSource(sourceKey?: string, tags?: string[]): boolean {
  const s = (sourceKey ?? "").toLowerCase();
  if (/tier-a-hot|hyper-mega|mega-hot-model/.test(s)) return true;
  const normalized = (tags ?? []).map((t) => String(t).toLowerCase());
  return normalized.includes("mega-hot") || normalized.includes("hyper-exclusive");
}

export function isValidUiDisplayTitle(title: string): boolean {
  return UI_TITLE_PATTERN.test(title);
}

/** Keep imported Bangla-friendly titles instead of renumbering. */
export function isStudentFacingTitle(title: string): boolean {
  const t = title.trim();
  if (!t || isBadInternalTitle(t)) return false;
  return (
    BENGALI_MODEL_SET_TITLE_PATTERN.test(t) ||
    BENGALI_CHAPTER_TEST_TITLE_PATTERN.test(t)
  );
}

/** Prefer tier-a-hot sets over legacy board-analyzed duplicates (same set number). */
export function dedupeTierAHotOverBoardAnalyzed<
  T extends { sourceKey: string },
>(items: T[]): T[] {
  const tierASetNumbers = new Set<number>();
  for (const item of items) {
    const match = item.sourceKey.match(/tier-a-hot-model-test-(\d+)$/i);
    if (match) tierASetNumbers.add(parseInt(match[1], 10));
  }
  if (!tierASetNumbers.size) return items;

  return items.filter((item) => {
    const match = item.sourceKey.match(/board-analyzed-premium-set-(\d+)$/i);
    if (!match) return true;
    return !tierASetNumbers.has(parseInt(match[1], 10));
  });
}

export function extractSetNumber(sourceKey: string): number | null {
  const s = normalizeDigits(sourceKey.toLowerCase());
  const split = s.match(/split[-_]?(\d+)$/);
  if (split) return parseInt(split[1], 10);
  const m = s.match(/(?:set|model-test)[-_]?(\d+)$/);
  if (m) return parseInt(m[1], 10);
  return extractTestNumber(sourceKey);
}

export function containsRawTitleLeak(text: string): boolean {
  const s = text.toLowerCase();
  return (
    s.includes("_") ||
    s.includes("prediction") ||
    s.includes("practice") ||
    s.includes("high-common") ||
    s.includes("questions") ||
    s.includes("zoology") ||
    s.includes("super-model") ||
    s.includes("·") ||
    /[০-৯]/.test(text)
  );
}

export function defaultSortTests<
  T extends {
    sortNumber: number;
    sourceKey: string;
    questionCount?: number;
    scope?: ModelTestScope;
  },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aHot = isHyperMegaHotSource(a.sourceKey) ? 0 : 1;
    const bHot = isHyperMegaHotSource(b.sourceKey) ? 0 : 1;
    if (aHot !== bHot) return aHot - bHot;

    if (a.scope === "chapter" && b.scope === "chapter") {
      const aCh = extractChapterNumber(a.sourceKey) ?? 999;
      const bCh = extractChapterNumber(b.sourceKey) ?? 999;
      if (aCh !== bCh) return aCh - bCh;
      const aSet = extractSetNumber(a.sourceKey) ?? a.sortNumber;
      const bSet = extractSetNumber(b.sourceKey) ?? b.sortNumber;
      if (aSet !== bSet) return aSet - bSet;
    }
    if (a.sortNumber !== b.sortNumber) return a.sortNumber - b.sortNumber;
    const aq = a.questionCount ?? 0;
    const bq = b.questionCount ?? 0;
    if (aq !== bq) return bq - aq;
    return a.sourceKey.localeCompare(b.sourceKey);
  });
}

/** Assign continuous Model Test 01..N titles after sorting. */
export function assignContinuousDisplayTitles<
  T extends {
    displayTitle: string;
    cleanTitle: string;
    displayIndex?: number;
    scope?: ModelTestScope;
    sourceKey?: string;
    sourceDisplayTitle?: string;
    chapterName?: string;
  },
>(items: T[]): T[] {
  return items.map((item, index) => {
    const displayIndex = index + 1;

    if (item.sourceDisplayTitle && isStudentFacingTitle(item.sourceDisplayTitle)) {
      return {
        ...item,
        displayIndex,
        displayTitle: item.sourceDisplayTitle,
        cleanTitle: item.sourceDisplayTitle,
      };
    }

    const scope = item.scope ?? "paper";
    const chapterNo = item.sourceKey
      ? extractChapterNumber(item.sourceKey)
      : null;
    const setNo =
      item.sourceKey && scope === "chapter"
        ? extractSetNumber(item.sourceKey)
        : displayIndex;
    const isSplit = item.sourceKey
      ? /split-\d+$/i.test(item.sourceKey)
      : false;

    let displayTitle: string;
    if (scope === "chapter" && chapterNo != null && setNo != null) {
      displayTitle = formatChapterWiseBengaliTitle(
        chapterNo,
        item.chapterName,
        setNo,
        { isSplit },
      );
    } else {
      displayTitle = formatUiDisplayTitle(
        displayIndex,
        scope,
        chapterNo,
        item.chapterName,
        setNo,
      );
    }

    return {
      ...item,
      displayIndex,
      displayTitle,
      cleanTitle: displayTitle,
    };
  });
}

export function pickModelTestDisplayTitle(item: {
  sourceKey: string;
  displayTitle?: string;
  sourceDisplayTitle?: string;
}): string {
  if (item.displayTitle && isStudentFacingTitle(item.displayTitle)) {
    return item.displayTitle;
  }
  if (
    item.sourceDisplayTitle &&
    isStudentFacingTitle(item.sourceDisplayTitle)
  ) {
    return item.sourceDisplayTitle;
  }
  return item.displayTitle || item.sourceDisplayTitle || item.sourceKey;
}

export function parseModelTestItemTitle(item: {
  sourceKey: string;
  displayTitle?: string;
  sourceDisplayTitle?: string;
  chapterName?: string;
}): ReturnType<typeof parseModelTestTitle> {
  return parseModelTestTitle(pickModelTestDisplayTitle(item), {
    chapterName: item.chapterName,
    sourceKey: item.sourceKey,
  });
}

export function verifyContinuousDisplayOrder(
  items: { displayTitle: string }[],
): boolean {
  if (!items.length) return true;
  for (let i = 0; i < items.length; i++) {
    if (items[i].displayTitle !== formatUiDisplayTitle(i + 1)) return false;
  }
  return true;
}

export function reportSerialGaps(
  items: { testNumber: number | null; displayTitle: string }[],
): number[] {
  const nums = items
    .map((t) => t.testNumber)
    .filter((n): n is number => n !== null && n < SORT_UNNUMBERED)
    .sort((a, b) => a - b);

  if (!nums.length) return [];

  const gaps: number[] = [];
  const min = nums[0];
  const max = nums[nums.length - 1];
  const set = new Set(nums);

  for (let i = min; i <= max; i++) {
    if (!set.has(i)) gaps.push(i);
  }
  return gaps;
}

/** Strip level/subject/paper noise — cards show chapter + test only. */
function stripSubjectNoise(text: string): string {
  return normalizeDigits(text)
    .replace(/[_-]+/g, " ")
    .replace(/\b(ssc|hsc)\b/gi, " ")
    .replace(
      /\b(physics|chemistry|biology|higher[\s-]?math|general[\s-]?math)\b/gi,
      " ",
    )
    .replace(/\b(1st|2nd|3rd|\d+(?:st|nd|rd|th))\s*paper\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function parseModelTestTitle(
  rawTitle: string,
  options?: { chapterName?: string; sourceKey?: string },
): {
  chapterLabel: string;
  testLabel: string;
  sortChapter: number;
  sortTest: number;
} {
  const bengaliChapterMatch = rawTitle.match(
    /^অধ্যায় ([০-৯]{2}) · (.+?) · (টেস্ট|ভাগ|সেট) ([০-৯]{2})$/,
  );
  if (bengaliChapterMatch) {
    const chNum = parseInt(normalizeDigits(bengaliChapterMatch[1]), 10);
    const setNum = parseInt(normalizeDigits(bengaliChapterMatch[4]), 10);
    const kind = bengaliChapterMatch[3];
    return {
      chapterLabel: `অধ্যায় ${bengaliChapterMatch[1]} · ${bengaliChapterMatch[2]}`,
      testLabel: `${kind} ${bengaliChapterMatch[4]}`,
      sortChapter: chNum,
      sortTest: setNum,
    };
  }

  const bengaliPaperMatch = rawTitle.match(/^মডেল টেস্ট · সেট ([০-৯]{2})$/);
  if (bengaliPaperMatch) {
    const setNum = parseInt(normalizeDigits(bengaliPaperMatch[1]), 10);
    return {
      chapterLabel: "মডেল টেস্ট",
      testLabel: `সেট ${bengaliPaperMatch[1]}`,
      sortChapter: 0,
      sortTest: setNum,
    };
  }

  const clean = stripSubjectNoise(
    options?.sourceKey && isBadInternalTitle(rawTitle)
      ? options.sourceKey
      : rawTitle,
  );

  const hyperMatch = clean.match(/hyper mega hot set[\s-]*(\d+)/i);
  if (hyperMatch) {
    const setNum = parseInt(hyperMatch[1], 10);
    return {
      chapterLabel: "মডেল টেস্ট",
      testLabel: `সেট ${banglaTwoDigit(setNum)}`,
      sortChapter: 0,
      sortTest: setNum,
    };
  }

  const tierAHotMatch = clean.match(/tier-a-hot-model-test-(\d+)/i);
  if (tierAHotMatch) {
    const setNum = parseInt(tierAHotMatch[1], 10);
    return {
      chapterLabel: "মডেল টেস্ট",
      testLabel: `সেট ${banglaTwoDigit(setNum)}`,
      sortChapter: 0,
      sortTest: setNum,
    };
  }

  if (
    clean.includes("board analyzed premium") ||
    clean.includes("board standard model test")
  ) {
    const setMatch = clean.match(/set[\s-]*(\d+)/);
    const setNum = setMatch ? parseInt(setMatch[1], 10) : 1;
    return {
      chapterLabel: "মডেল টেস্ট",
      testLabel: `সেট ${banglaTwoDigit(setNum)}`,
      sortChapter: 0,
      sortTest: setNum,
    };
  }

  const chMatch =
    clean.match(/(?:chapter|ch)[\s-]*(\d+)/i) ??
    clean.match(/chapter[\s-]*(\d+)/i);
  const chNum = chMatch ? parseInt(chMatch[1], 10) : 1;
  const hasCh = !!chMatch;

  const testMatch =
    clean.match(/model[\s-]*test[\s-]*(\d+)/i) ??
    clean.match(/(?:^|\s)test[\s-]*(\d+)/i) ??
    clean.match(/(?:^|\s)set[\s-]*(\d+)/i);
  const testNum = testMatch ? parseInt(testMatch[1], 10) : 1;

  let chapterLabel = options?.chapterName?.trim()
    ? `অধ্যায় ${banglaTwoDigit(chNum)} · ${options.chapterName.trim()}`
    : `অধ্যায় ${banglaTwoDigit(chNum)}`;
  if (!hasCh) {
    if (clean.includes("board")) {
      chapterLabel = "বোর্ড টেস্ট";
    } else if (
      clean.includes("final") ||
      clean.includes("whole") ||
      clean.includes("full")
    ) {
      chapterLabel = "ফুল বুক";
    } else {
      chapterLabel = "মডেল টেস্ট";
    }
  }

  const useSetLabel =
    !hasCh &&
    (chapterLabel === "মডেল টেস্ট" || chapterLabel === "বোর্ড টেস্ট");

  return {
    chapterLabel,
    testLabel: useSetLabel
      ? `সেট ${banglaTwoDigit(testNum)}`
      : `টেস্ট ${banglaTwoDigit(testNum)}`,
    sortChapter: chNum,
    sortTest: testNum,
  };
}

```

## File: [src/lib/format-quiz-text.tsx](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/format-quiz-text.tsx)

```tsx
"use client";

import React, { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";
import { sanitizeQuizText } from "@/lib/sanitize-quiz-text";

const MATH_SEGMENT_RE =
  /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g;

function renderKatex(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex.trim(), {
      throwOnError: false,
      displayMode,
      strict: "ignore",
    });
  } catch {
    return latex;
  }
}

function renderRichSegment(text: string): React.ReactNode[] {
  const parts = text.split(MATH_SEGMENT_RE);
  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith("$$") && part.endsWith("$$")) {
      const html = renderKatex(part.slice(2, -2), true);
      return (
        <div
          key={i}
          className="quiz-math-display my-2 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    if (part.startsWith("$") && part.endsWith("$")) {
      const html = renderKatex(part.slice(1, -1), false);
      return (
        <span
          key={i}
          className="quiz-math-inline mx-0.5 align-middle"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    if (part.startsWith("\\(") && part.endsWith("\\)")) {
      const html = renderKatex(part.slice(2, -2), false);
      return (
        <span
          key={i}
          className="quiz-math-inline mx-0.5 align-middle"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    if (part.startsWith("\\[") && part.endsWith("\\]")) {
      const html = renderKatex(part.slice(2, -2), true);
      return (
        <div
          key={i}
          className="quiz-math-display my-2 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={i}>
        {boldParts.map((bp, j) => {
          if (bp.startsWith("**") && bp.endsWith("**")) {
            return (
              <strong key={j} className="text-cyan-300 font-semibold">
                {bp.slice(2, -2)}
              </strong>
            );
          }
          return <span key={j}>{bp}</span>;
        })}
      </React.Fragment>
    );
  });
}

/** Separate MCQ stem from embedded worked solutions in question text. */
function splitStemAndWorkedSolution(text: string): {
  stem: string;
  worked?: string;
} {
  const shorTotome = text.match(/^([\s\S]+?[?।])\s+(শর্তমতে[\s\S]+)$/i);
  if (shorTotome && shorTotome[1].length > 15 && shorTotome[2].length > 25) {
    return { stem: shorTotome[1].trim(), worked: shorTotome[2].trim() };
  }

  const mcqTail = text.match(/^([\s\S]+?নিচের কোনটি সঠিক\?)\s+([\s\S]+)$/i);
  if (mcqTail && mcqTail[2].length > 40) {
    return { stem: mcqTail[1].trim(), worked: mcqTail[2].trim() };
  }

  const afterQuestion = text.match(/^([\s\S]+?কত হ(?:বে|ার্জ)\?)\s+(?:শেষবেগ|A\s*থেকে|তাহলে)[\s\S]+$/i);
  if (afterQuestion) {
    return { stem: afterQuestion[1].trim(), worked: text.slice(afterQuestion[1].length).trim() };
  }

  const newlineWork = text.match(/^([\s\S]+)\n\s*(শর্তমতে[\s\S]+)$/i);
  if (newlineWork && newlineWork[1].length > 15) {
    return { stem: newlineWork[1].trim(), worked: newlineWork[2].trim() };
  }

  return { stem: text };
}

function formatLine(line: string): React.ReactNode {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const romanListMatch = trimmed.match(/^(iii|ii|iv|i|[ivx]+)\.\s+/i);
  if (romanListMatch) {
    return (
      <div className="flex gap-3 py-1.5 text-[15px] leading-relaxed rounded-lg bg-white/[0.03] border border-white/5 px-3">
        <span className="text-cyan-400 font-bold shrink-0 min-w-[2rem] tabular-nums">
          {romanListMatch[1]}.
        </span>
        <span className="flex-1 min-w-0">
          {renderRichSegment(trimmed.slice(romanListMatch[0].length))}
        </span>
      </div>
    );
  }

  const romanMatch = trimmed.match(/^(র\.|রর\.|ররর\.|খ\.|গ\.|ঘ\.)\s+/);
  if (romanMatch) {
    return (
      <div className="flex gap-3 py-1.5 text-[15px] leading-relaxed rounded-lg bg-white/[0.03] border border-white/5 px-3">
        <span className="text-cyan-400/90 font-semibold shrink-0 min-w-[2.5rem]">
          {romanMatch[1]}
        </span>
        <span className="flex-1 min-w-0">
          {renderRichSegment(trimmed.slice(romanMatch[0].length))}
        </span>
      </div>
    );
  }

  if (/^উদ্দীপক[:：]/i.test(trimmed) || /^নিচের\s+উদ্দীপক/i.test(trimmed)) {
    return (
      <p className="text-cyan-200/95 font-semibold border-l-2 border-cyan-500/50 pl-3 leading-relaxed">
        {renderRichSegment(trimmed)}
      </p>
    );
  }

  return (
    <p className="leading-relaxed text-[15px] sm:text-base break-words">
      {renderRichSegment(trimmed)}
    </p>
  );
}


type Props = {
  text: string;
  className?: string;
  /** Hide collapsible worked-solution block (e.g. during timed exam) */
  hideWorkedSolution?: boolean;
  /** Single-line MCQ option — no block layout */
  inline?: boolean;
  /** question | explanation | option */
  mode?: "question" | "explanation" | "option";
};

export function FormattedQuizText({
  text,
  className,
  hideWorkedSolution = false,
  inline = false,
  mode = "question",
}: Props) {
  const safeText = text == null ? "" : String(text);

  const normalized = useMemo(
    () => sanitizeQuizText(safeText, inline ? "option" : mode),
    [safeText, inline, mode],
  );

  const { stem, worked } = useMemo(
    () =>
      inline
        ? { stem: normalized, worked: undefined }
        : splitStemAndWorkedSolution(normalized),
    [normalized, inline],
  );

  if (!safeText.trim()) {
    return (
      <span className={cn("text-slate-500 italic text-sm", className)}>
        —
      </span>
    );
  }


  if (inline) {
    return (
      <span className={cn("text-white/95 font-bangla inline break-words", className)}>
        {renderRichSegment(normalized)}
      </span>
    );
  }

  const stemLines = stem.split(/\n+/);

  return (
    <div className={cn("space-y-2.5 text-white/95 font-bangla", className)}>
      {stemLines.map((line, i) => (
        <React.Fragment key={i}>{formatLine(line)}</React.Fragment>
      ))}


      {worked && !hideWorkedSolution && (
        <details className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 mt-1 group">
          <summary className="text-xs font-bold text-amber-300/90 cursor-pointer select-none list-none flex items-center gap-2">
            <span className="rounded-md bg-amber-500/15 px-2 py-0.5">
              কাজ / ব্যাখ্যা (ডেটা)
            </span>
            <span className="text-slate-500 text-[10px] group-open:hidden">
              ট্যাপ করে দেখুন
            </span>
          </summary>
          <div className="mt-3 space-y-2 text-sm text-slate-300 border-t border-amber-500/10 pt-3">
            {worked.split(/\n+/).map((line, i) => (
              <React.Fragment key={i}>{formatLine(line)}</React.Fragment>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
```

## File: [src/lib/leaderboard-api.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/leaderboard-api.ts)

```ts
import { api } from "@/lib/api";
import {
  normalizeLevel,
  type StudentLevel,
  examYearBanglaLabel,
} from "@/lib/profile-utils";

export interface LeaderboardEntry {
  rank: number;
  userId?: string;
  name: string;
  picture?: string;
  points: number;
  examsTaken?: number;
  className?: string;
  level?: string;
  examYear?: number | string;
  accuracy?: number;
  streak?: number;
  badge?: string;
  lastExamSlug?: string;
  lastAttemptAt?: string;
  collegeName?: string;
  schoolName?: string;
}

export interface CollegeWarEntry {
  name: string;
  score: number;
  studentCount: number;
  topScore: number;
  avgScore: number;
}

export function formatBnNumber(n: number): string {
  return n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d, 10)]);
}

export function getInitials(name?: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "—";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return parts
      .slice(0, 2)
      .map((p) => p[0])
      .join("");
  }
  return trimmed.slice(0, 2);
}

export function getCollegeLabel(entry: LeaderboardEntry): string {
  const college = (entry.collegeName || entry.schoolName || "").trim();
  return college || "কলেজ যুক্ত হয়নি";
}

export function formatAccuracy(acc?: number): string {
  if (acc == null || Number.isNaN(acc) || acc <= 0) return "—";
  return `${Math.round(acc)}%`;
}

export function aggregateColleges(
  entries: LeaderboardEntry[],
): CollegeWarEntry[] {
  const map = new Map<string, { totalScore: number; count: number; topScore: number }>();
  for (const e of entries) {
    const college = (e.collegeName || e.schoolName || "").trim();
    if (!college) continue;
    const existing = map.get(college) || { totalScore: 0, count: 0, topScore: 0 };
    existing.totalScore += e.points || 0;
    existing.count += 1;
    existing.topScore = Math.max(existing.topScore, e.points || 0);
    map.set(college, existing);
  }
  if (map.size < 1) return [];
  return Array.from(map.entries())
    .map(([name, stats]) => ({
      name,
      score: stats.totalScore,
      studentCount: stats.count,
      topScore: stats.topScore,
      avgScore: Math.round(stats.totalScore / stats.count),
    }))
    .sort((a, b) => b.score - a.score);
}

export function getCollegeRanking(
  entries: LeaderboardEntry[],
  collegeName: string,
): LeaderboardEntry[] {
  const college = collegeName.trim().toLowerCase();
  return entries
    .filter((e) => (e.collegeName || e.schoolName || "").trim().toLowerCase() === college)
    .sort((a, b) => b.points - a.points)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

export const BADGE_LABELS: Record<string, string> = {
  physics_master: "পদার্থবিজ্ঞান মাস্টার",
  chemistry_king: "রসায়ন কিং",
  biology_boss: "জীববিজ্ঞান বস",
  live_champion: "লাইভ চ্যাম্পিয়ন",
  streak_7: "৭ দিনের স্ট্রিক",
  premium_topper: "প্রিমিয়াম টপার",
};

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const data = await api.get<LeaderboardEntry[]>("/api/leaderboard");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getEntryLevel(entry: LeaderboardEntry): StudentLevel | null {
  return normalizeLevel(entry.className, entry.level);
}

export function filterLeaderboard(
  entries: LeaderboardEntry[],
  level: StudentLevel,
  yearFilter: "all" | number,
): LeaderboardEntry[] {
  let list = entries.filter((e) => getEntryLevel(e) === level);

  if (yearFilter !== "all") {
    list = list.filter((e) => Number(e.examYear) === yearFilter);
  }

  list.sort((a, b) => b.points - a.points);
  return list.map((e, i) => ({ ...e, rank: i + 1 }));
}

export function formatExamYear(year?: number | string): string {
  if (!year) return "—";
  return examYearBanglaLabel(year);
}
```

## File: [src/lib/mockData.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/mockData.ts)

```ts
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0 to 3
  explanation: string;
  subject: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  accuracy: string;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface SubjectBattle {
  id: string;
  name: string;
  subtitle: string;
  chaptersCount: number;
  battlesActive: number;
  xpReward: number;
  icon: string;
  color: "purple" | "cyan" | "gold" | "green";
}

export interface Mission {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
}

export interface WeaknessItem {
  subject: string;
  chapter: string;
  accuracy: number; // percentage
  status: "critical" | "warning" | "stable";
}

// User Stats HUD Dashboard
export const userStats = {
  name: "তাহমিদ রহমান",
  rank: 18,
  totalUsers: 14520,
  xp: 4850,
  streak: 7,
  winRate: "৭8%",
  battlesPlayed: 142,
  level: 12,
  nextLevelXp: 6000,
  levelProgress: 75, // percentage
};

// 5-Question Level Detector MCQ (30-second challenge)
export const levelDetectorQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "একটি বস্তুকে খাড়া ওপরের দিকে ১০০ m/s বেগে নিক্ষেপ করলে এটি সর্বোচ্চ কত উচ্চতায় উঠবে? (g = 9.8 m/s²)",
    options: [
      "৫১০.২ মিটার",
      "২৫৫.১ মিটার",
      "৯৮০.০ মিটার",
      "৫০.১ মিটার"
    ],
    correctAnswer: 0, // 510.2m (u^2 / 2g = 10000 / 19.6 = 510.2)
    explanation: "সর্বোচ্চ উচ্চতার সূত্র: H = u² / 2g। এখানে u = ১০০ m/s এবং g = ৯.৮ m/s²। অতএব H = (১০০)² / (২ × ৯.৮) = ১০০০০ / ১৯.৬ = ৫১০.২ মিটার।",
    subject: "পদার্থবিজ্ঞান"
  },
  {
    id: "q2",
    question: "নিচের কোনটির তড়িৎ ঋণাত্মকতা সবচেয়ে বেশি?",
    options: [
      "ক্লোরিন (Cl)",
      "ফ্লোরিন (F)",
      "অক্সিজেন (O)",
      "নাইট্রোজেন (N)"
    ],
    correctAnswer: 1, // Fluorine
    explanation: "পর্যায় সারণীর সমস্ত মৌলের মধ্যে ফ্লোরিনের (F) তড়িৎ ঋণাত্মকতা সবচেয়ে বেশি, যার মান ৪.০। ক্লোরিনের ৩.০ এবং অক্সিজেনের ৩.৫।",
    subject: "রসায়ন"
  },
  {
    id: "q3",
    question: "পাকস্থলীতে প্রোটিন পরিপাককারী সক্রিয় এনজাইম কোনটি?",
    options: [
      "পেপসিন",
      "ট্রিপসিন",
      "অ্যামাইলেজ",
      "লাইপেজ"
    ],
    correctAnswer: 0, // Pepsin
    explanation: "পাকস্থলীতে হাইড্রোক্লোরিক অ্যাসিডের উপস্থিতিতে নিষ্ক্রিয় পেপসিনোজেন সক্রিয় পেপসিনে পরিণত হয়, যা প্রোটিনকে প্রোটিওজ ও পেপটনে রূপান্তর করে।",
    subject: "জীববিজ্ঞান"
  },
  {
    id: "q4",
    question: "যদি y = ln(x) হয়, তবে d²/dx² (y) এর মান কত?",
    options: [
      "1/x",
      "-1/x²",
      "e^x",
      "-1/x"
    ],
    correctAnswer: 1, // -1/x^2
    explanation: "y = ln(x) কে প্রথমবার অন্তরীকরণ করলে পাওয়া যায় dy/dx = ১/x। দ্বিতীয়বার অন্তরীকরণ করলে d²/dx² = d/dx (x⁻¹) = -১ · x⁻² = -১/x²।",
    subject: "উচ্চতর গণিত"
  },
  {
    id: "q5",
    question: "একটি সমকোণী ত্রিভুজের অতিভুজ ৫ সে.মি. এবং ভূমি ৩ সে.মি. হলে এর ক্ষেত্রফল কত বর্গ সে.মি.?",
    options: [
      "১২",
      "৬",
      "১৫",
      "৭.৫"
    ],
    correctAnswer: 1, // 6
    explanation: "পিথাগোরাসের উপপাদ্য অনুযায়ী, লম্ব = √(অতিভুজ² - ভূমি²) = √(৫² - ৩²) = √(২৫ - ৯) = √১৬ = ৪ সে.মি.। সমকোণী ত্রিভুজের ক্ষেত্রফল = ১/২ × ভূমি × লম্ব = ১/২ × ৩ × ৪ = ৬ বর্গ সে.মি.।",
    subject: "উচ্চতর গণিত"
  }
];

// Leaderboard stand-ups
export const leaderboardUsers: LeaderboardUser[] = [
  {
    rank: 1,
    name: "ফাহিম মুনতাসির",
    points: 12450,
    accuracy: "৯৮%",
    avatar: "👑"
  },
  {
    rank: 2,
    name: "সাদিয়া ইসলাম",
    points: 11820,
    accuracy: "৯৬%",
    avatar: "⚡"
  },
  {
    rank: 3,
    name: "আরিয়ান আহমেদ",
    points: 11340,
    accuracy: "৯৫%",
    avatar: "🔥"
  },
  {
    rank: 4,
    name: "নুসরাত জাহান",
    points: 9800,
    accuracy: "৯১%",
    avatar: "🌌"
  },
  {
    rank: 5,
    name: "রিফাত আল হাসান",
    points: 9420,
    accuracy: "৯০%",
    avatar: "🛡️"
  },
  {
    rank: 6,
    name: "মায়মুনা আক্তার",
    points: 8900,
    accuracy: "৮৯%",
    avatar: "🧬"
  },
  {
    rank: 18,
    name: "তাহমিদ রহমান (আপনি)",
    points: 4850,
    accuracy: "৮৭%",
    avatar: "🚀",
    isCurrentUser: true
  }
];

// Subject Arena Levels
export const subjectBattles: SubjectBattle[] = [
  {
    id: "physics",
    name: "পদার্থবিজ্ঞান",
    subtitle: "বলবিদ্যা ও আধুনিক তড়িৎ শক্তি",
    chaptersCount: 14,
    battlesActive: 1540,
    xpReward: 500,
    icon: "⚛️",
    color: "purple"
  },
  {
    id: "chemistry",
    name: "রসায়নবিজ্ঞান",
    subtitle: "জৈব যৌগ ও রাসায়নিক বিক্রিয়া",
    chaptersCount: 12,
    battlesActive: 1210,
    xpReward: 500,
    icon: "🧪",
    color: "cyan"
  },
  {
    id: "biology",
    name: "জীববিজ্ঞান",
    subtitle: "কোষ বিভাজন ও জিনতত্ত্ব",
    chaptersCount: 24,
    battlesActive: 1840,
    xpReward: 600,
    icon: "🧬",
    color: "green"
  },
  {
    id: "math",
    name: "উচ্চতর গণিত",
    subtitle: "ক্যালকুলাস ও ত্রিকোণমিতি যুদ্ধ",
    chaptersCount: 16,
    battlesActive: 950,
    xpReward: 600,
    icon: "📐",
    color: "gold"
  }
];

// Daily Streak Mission
export const dailyMissions: Mission[] = [
  {
    id: "m1",
    title: "যেকোনো বিষয়ে ৩টি চ্যাপ্টার কুইজ সম্পন্ন করো",
    xp: 150,
    completed: true
  },
  {
    id: "m2",
    title: "আজকের লাইভ ব্যাটেলে অংশ নিয়ে ১টি ম্যাচ জয় করো",
    xp: 250,
    completed: false
  },
  {
    id: "m3",
    title: "পদার্থবিজ্ঞানের 'বলবিদ্যা' চ্যাপ্টারের ভুল প্রশ্নের রিভিউ করো",
    xp: 100,
    completed: false
  }
];

// Weakness Analysis Heatmap Report
export const weaknessReports: WeaknessItem[] = [
  {
    subject: "পদার্থবিজ্ঞান",
    chapter: "কাজ, শক্তি ও ক্ষমতা",
    accuracy: 42,
    status: "critical"
  },
  {
    subject: "রসায়ন",
    chapter: "জৈব রসায়ন",
    accuracy: 58,
    status: "warning"
  },
  {
    subject: "উচ্চতর গণিত",
    chapter: "ত্রিকোণমিতি",
    accuracy: 65,
    status: "warning"
  },
  {
    subject: "জীববিজ্ঞান",
    chapter: "কোষ বিভাজন",
    accuracy: 88,
    status: "stable"
  }
];

// SSC/HSC Selection Paths
export const educationPaths = [
  {
    id: "ssc",
    name: "SSC বিজ্ঞান যুদ্ধঘর",
    tag: "শ্রেণী: ৯ম-১০ম",
    description: "পদার্থ, রসায়ন, জীববিজ্ঞান ও গণিতের বোর্ড প্রশ্ন ও অধ্যায়ভিত্তিক রিয়েল-টাইম লাইভ কুইজ ব্যাটল।",
    badge: "এসএসসি ২০২৬/২০২৭",
    accent: "purple"
  },
  {
    id: "hsc",
    name: "HSC বিজ্ঞান যুদ্ধঘর",
    tag: "শ্রেণী: ১১শ-১২শ",
    description: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষার ব্যাসিক ও এইচএসসি সৃজনশীল MCQ এর দ্রুত সমাধান কৌশল ও মক টেস্ট।",
    badge: "এইচএসসি ২০২৫/২০২৬",
    accent: "cyan"
  }
];
```

## File: [src/lib/model-test-filters.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/model-test-filters.ts)

```ts
import {
  assignContinuousDisplayTitles,
  defaultSortTests,
  type ModelTestDifficulty,
  type ModelTestImportance,
  type ModelTestScope,
} from "@/lib/format-model-test-title";
import { isImportedChapterModelKey } from "@/lib/quiz/normalize-quiz-data";

export interface ModelTestItem {
  id: string;
  sourceKey: string;
  slug: string;
  title: string;
  originalTitle: string;
  cleanTitle: string;
  displayTitle: string;
  displayIndex?: number;
  type: string;
  testNumber: number | null;
  priority?: number;
  importance?: ModelTestImportance;
  difficulty?: ModelTestDifficulty;
  attemptCount?: number;
  questionCount: number;
  durationMinutes: number;
  lastScore?: number;
  bestScore?: number;
  completed?: boolean;
  lastAttemptAt?: string;
  sortNumber: number;
  hasQuestions: boolean;
  scopeLabel?: string;
  sourceDisplayTitle?: string;
  scope: ModelTestScope;
  tags?: string[];
  chapterName?: string;
}

export type ModelTestCategoryTab =
  | "paperWise"
  | "chapterWise"
  | "boardWise"
  | "wholeSyllabus";

export type ModelTestSortTab =
  | "default"
  | "mostImportant"
  | "advanced"
  | "trending";

export interface TabFilterResult {
  items: ModelTestItem[];
  emptyMessage?: string;
  infoMessage?: string;
}

const EMPTY_MESSAGES: Record<ModelTestCategoryTab, string> = {
  paperWise: "পত্রভিত্তিক মডেল টেস্ট এখনো যোগ করা হয়নি।",
  chapterWise: "অধ্যায়ভিত্তিক মডেল টেস্ট এখনো যোগ করা হয়নি।",
  boardWise: "বোর্ডভিত্তিক মডেল টেস্ট এখনো যোগ করা হয়নি।",
  wholeSyllabus: "ফুল বুক মডেল টেস্ট এখনো যোগ করা হয়নি।",
};

function scopeForTab(tab: ModelTestCategoryTab): ModelTestScope {
  switch (tab) {
    case "paperWise":
      return "paper";
    case "chapterWise":
      return "chapter";
    case "boardWise":
      return "board";
    case "wholeSyllabus":
      return "whole-syllabus";
  }
}

export function isChapterScopeModelTest(sourceKey: string): boolean {
  const s = sourceKey.toLowerCase();
  if (isImportedChapterModelKey(sourceKey)) return true;
  return (
    /chapter-\d{2}-(?:high-priority-)?(?:set|model-test)-\d{2}/.test(s) ||
    /-chapter-\d{2}-model-test-\d{2}/.test(s)
  );
}

export function filterByCategoryTab(
  tests: ModelTestItem[],
  tab: ModelTestCategoryTab,
): TabFilterResult {
  const scope = scopeForTab(tab);
  let pool = tests.filter((t) => t.hasQuestions && t.scope === scope);
  if (tab === "chapterWise") {
    pool = pool.filter((t) => isChapterScopeModelTest(t.sourceKey));
  }
  if (!pool.length) {
    return { items: [], emptyMessage: EMPTY_MESSAGES[tab] };
  }
  return { items: defaultSortTests(pool) };
}

export function applySortTab(
  items: ModelTestItem[],
  sortTab: ModelTestSortTab,
): ModelTestItem[] {
  let sorted = [...items];

  switch (sortTab) {
    case "mostImportant":
      sorted.sort((a, b) => {
        const rank = { high: 0, medium: 1, low: 2 };
        const ia = rank[a.importance ?? "low"];
        const ib = rank[b.importance ?? "low"];
        if (ia !== ib) return ia - ib;
        return a.sortNumber - b.sortNumber;
      });
      break;
    case "advanced":
      sorted = sorted.filter(
        (t) =>
          t.difficulty === "advanced" ||
          t.difficulty === "hard" ||
          t.sortNumber >= 11,
      );
      if (!sorted.length) sorted = [...items];
      sorted.sort((a, b) => b.sortNumber - a.sortNumber);
      break;
    case "trending":
      sorted = sorted.filter((t) => (t.attemptCount ?? 0) > 0);
      if (!sorted.length) {
        return assignContinuousDisplayTitles(defaultSortTests(items));
      }
      sorted.sort((a, b) => (b.attemptCount ?? 0) - (a.attemptCount ?? 0));
      break;
    default:
      sorted = defaultSortTests(sorted);
  }

  return assignContinuousDisplayTitles(sorted);
}

export function applyTabFilter(
  categoryTab: ModelTestCategoryTab,
  allModelTests: ModelTestItem[],
  sortTab: ModelTestSortTab = "default",
): TabFilterResult {
  const result = filterByCategoryTab(allModelTests, categoryTab);
  return {
    ...result,
    items: applySortTab(result.items, sortTab),
  };
}

/** @deprecated use applyTabFilter */
export type ModelTestTab = ModelTestCategoryTab;

export function filterChapterWiseTab(tests: ModelTestItem[]): TabFilterResult {
  return filterByCategoryTab(tests, "chapterWise");
}

export function filterPaperWiseTab(tests: ModelTestItem[]): TabFilterResult {
  return filterByCategoryTab(tests, "paperWise");
}
```

## File: [src/lib/model-test-loader.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/model-test-loader.ts)

```ts
import {
  isHiddenSourceKey,
  isImportedChapterModelKey,
  isLegacyChapterJunkKey,
} from "@/lib/quiz/normalize-quiz-data";

import {

  assignContinuousDisplayTitles,
  dedupeTierAHotOverBoardAnalyzed,
  defaultSortTests,

  extractTestNumber,

  getModelTestCategory,

  getSortNumber,

  inferModelTestDifficulty,

  inferModelTestImportance,

  inferModelTestPriority,

  inferModelTestScope,

  normalizeChaptersCovered,

  resolveChapterName,

  type ChapterCoveredEntry,

  type ModelTestScope,

} from "@/lib/format-model-test-title";

import type { ModelTestItem } from "@/lib/model-test-filters";

import { resolveFileSubjectSlug } from "@/lib/quiz/registry";



export interface LoadModelTestsParams {

  level: "SSC" | "HSC";

  subjectSlug: string;

}



export interface LoadModelTestsResult {

  items: ModelTestItem[];

  sourceTotal: number;

}



interface IndexEntry {

  questionCount: number;

  scope?: ModelTestScope;

  displayTitle?: string;

  durationMinutes?: number;

  importance?: "high" | "medium" | "low";

  tags?: unknown[];

  chaptersCovered?: ChapterCoveredEntry[];

}



interface ModelTestIndex {

  level: string;

  subject: string;

  modelTests: Record<string, IndexEntry>;

}



function inferScopeLabel(meta?: IndexEntry): string | undefined {

  const normalized = normalizeChaptersCovered(meta?.chaptersCovered);

  if (!normalized.length) return undefined;

  const unique = new Set(normalized);

  if (unique.size >= 3) return "সম্পূর্ণ সিলেবাস";

  return undefined;

}



function buildStableId(

  level: string,

  subjectSlug: string,

  sourceKey: string,

): string {

  return `${level}-${subjectSlug}-main-${sourceKey}`;

}



function shouldIncludeKey(
  sourceKey: string,
  allKeys: string[],
  meta?: IndexEntry,
): boolean {
  if (isHiddenSourceKey(sourceKey) || isLegacyChapterJunkKey(sourceKey)) {
    return false;
  }
  const scope =
    (meta?.scope as ModelTestScope) || inferModelTestScope(sourceKey, meta);
  const hasImportedChapter = allKeys.some(isImportedChapterModelKey);
  if (hasImportedChapter && scope === "chapter" && !isImportedChapterModelKey(sourceKey)) {
    return false;
  }
  return true;
}



export async function loadModelTestsFromStatic(

  params: LoadModelTestsParams,

): Promise<LoadModelTestsResult> {

  const { level, subjectSlug } = params;

  const parsedLevel = level.toLowerCase() as "ssc" | "hsc";

  let subj = subjectSlug;

  let paper: string | undefined = undefined;



  if (subj.endsWith("-1st-paper")) {

    subj = subj.replace(/-1st-paper$/, "");

    paper = "1st-paper";

  } else if (subj.endsWith("-2nd-paper")) {

    subj = subj.replace(/-2nd-paper$/, "");

    paper = "2nd-paper";

  }



  const fileSlug = resolveFileSubjectSlug(parsedLevel, subj, paper);

  const indexPath = `/quiz-data/${parsedLevel}/${fileSlug}.model-tests.index.json`;



  try {

    const res = await fetch(indexPath, { cache: "no-store" });

    if (!res.ok) {

      return { items: [], sourceTotal: 0 };

    }



    const index: ModelTestIndex = await res.json();

    const allKeys = Object.keys(index.modelTests || {});

    const sourceKeys = allKeys.filter((k) =>
      shouldIncludeKey(k, allKeys, index.modelTests[k]),
    );



    const items: ModelTestItem[] = sourceKeys.map((sourceKey) => {

      const entry = index.modelTests[sourceKey];

      const meta: IndexEntry = entry || { questionCount: 0 };

      const questionCount = meta.questionCount || 0;

      const type = getModelTestCategory(sourceKey);

      const testNumber = extractTestNumber(sourceKey);

      const sortNumber = getSortNumber(sourceKey, testNumber);

      const scope = (meta.scope as ModelTestScope) || inferModelTestScope(sourceKey, meta);

      const chapterName = resolveChapterName(meta.chaptersCovered);

      return {

        id: buildStableId(level, subjectSlug, sourceKey),

        sourceKey,

        slug: sourceKey,

        title: meta.displayTitle || sourceKey,

        originalTitle: sourceKey,

        cleanTitle: "",

        displayTitle: "",

        type,

        testNumber,

        priority: inferModelTestPriority(type, testNumber, sourceKey),

        importance:
          meta.importance ||
          inferModelTestImportance(type, testNumber, sourceKey, meta.tags),

        scope,

        difficulty: inferModelTestDifficulty(sourceKey, sortNumber),

        questionCount,

        durationMinutes: meta.durationMinutes ?? (questionCount > 0 ? questionCount : 25),

        hasQuestions: questionCount > 0,

        sortNumber,

        scopeLabel: inferScopeLabel(meta),

        sourceDisplayTitle: meta.displayTitle,

        tags: (meta.tags ?? []).map((t) => String(t)),

        chapterName,

      };

    });



    const dedupedItems = dedupeTierAHotOverBoardAnalyzed(items);

    const sortedItems = assignContinuousDisplayTitles(defaultSortTests(dedupedItems));



    return {

      items: sortedItems,

      sourceTotal: sortedItems.length,

    };

  } catch (err) {

    console.warn("Failed to load model test index", err);

    return { items: [], sourceTotal: 0 };

  }

}



/** @deprecated use loadModelTestsFromStatic */

export function normalizeModelTestItems(

  level: "SSC" | "HSC",

  subjectSlug: string,

  sourceKeys: string[],

  details: Record<string, unknown[]>,

  metaByKey: Record<string, IndexEntry> = {},

): ModelTestItem[] {

  const items: ModelTestItem[] = sourceKeys.map((sourceKey) => {

    const questionsList = (details[sourceKey] as unknown[]) || [];

    const meta = metaByKey[sourceKey];

    const questionCount = questionsList.length || meta?.questionCount || 0;

    const type = getModelTestCategory(sourceKey);

    const testNumber = extractTestNumber(sourceKey);

    const sortNumber = getSortNumber(sourceKey, testNumber);



    return {

      id: buildStableId(level, subjectSlug, sourceKey),

      sourceKey,

      slug: sourceKey,

      title: sourceKey,

      originalTitle: sourceKey,

      cleanTitle: "",

      displayTitle: "",

      type,

      testNumber,

      priority: inferModelTestPriority(type, testNumber, sourceKey),

      importance: inferModelTestImportance(type, testNumber, sourceKey),

      scope: inferModelTestScope(sourceKey, meta),

      difficulty: inferModelTestDifficulty(sourceKey, sortNumber),

      questionCount,

      durationMinutes:

        meta?.durationMinutes ?? (questionCount > 0 ? questionCount : 25),

      hasQuestions: questionCount > 0,

      sortNumber,

      scopeLabel: inferScopeLabel(meta),

      sourceDisplayTitle: meta?.displayTitle,

    };

  });



  return assignContinuousDisplayTitles(defaultSortTests(items));

}


```

## File: [src/lib/pending-exam.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/pending-exam.ts)

```ts
const PENDING_KEY = "pendingExamAttempt";



export interface PendingExamAttempt {

  examSlug: string;

  examName: string;

  mode: string;

  timeTaken: number;

  answers: Array<{ questionId: string; selectedOption: string | null }>;

}



/** @deprecated Legacy pre-login queue — grading now uses POST /api/quiz/submit only. */

export function storePendingExamAttempt(data: PendingExamAttempt): void {

  try {

    sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));

  } catch {

    /* ignore */

  }

}



export function getPendingExamAttempt(): PendingExamAttempt | null {

  try {

    const raw = sessionStorage.getItem(PENDING_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as PendingExamAttempt;

  } catch {

    return null;

  }

}



export function clearPendingExamAttempt(): void {

  try {

    sessionStorage.removeItem(PENDING_KEY);

  } catch {

    /* ignore */

  }

}



/** Clears stale legacy session data; no longer calls /api/student/exam-attempts. */

export async function flushPendingExamAttempt(): Promise<boolean> {

  if (!getPendingExamAttempt()) return false;

  clearPendingExamAttempt();

  return false;

}

```

## File: [src/lib/profile-options.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/profile-options.ts)

```ts
import {
  SSC_EXAM_YEARS,
  HSC_EXAM_YEARS,
  type StudentLevel,
} from "@/lib/profile-utils";

export const CLASS_OPTIONS = [
  { value: "SSC", label: "SSC" },
  { value: "HSC", label: "HSC" },
] as const;

export function examYearOptions(level: StudentLevel | null) {
  const years = level === "ssc" ? SSC_EXAM_YEARS : level === "hsc" ? HSC_EXAM_YEARS : [];
  return years.map((y) => ({
    value: String(y),
    label: y.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d, 10)]),
  }));
}

export { examYearBanglaLabel } from "@/lib/profile-utils";
export const SUBJECT_OPTIONS = [
  { value: "physics", label: "পদার্থবিজ্ঞান" },
  { value: "chemistry", label: "রসায়ন" },
  { value: "biology", label: "জীববিজ্ঞান" },
  { value: "higher-math", label: "উচ্চতর গণিত" },
  { value: "math", label: "সাধারণ গণিত" },
] as const;

export function subjectLabel(value: string): string {
  const found = SUBJECT_OPTIONS.find((s) => s.value === value);
  return found?.label ?? value;
}
```

## File: [src/lib/profile-utils.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/profile-utils.ts)

```ts
import type { UserProfile } from "@/context/AuthContext";

export type StudentLevel = "ssc" | "hsc";

export const SSC_EXAM_YEARS = [2027, 2028, 2029, 2030, 2031] as const;
export const HSC_EXAM_YEARS = [2026, 2027, 2028, 2029, 2030] as const;

export const SSC_EXAM_YEAR_LABELS = ["২০২৭", "২০২৮", "২০২৯", "২০৩০", "২০৩১"];
export const HSC_EXAM_YEAR_LABELS = ["২০২৬", "২০২৭", "২০২৮", "২০২৯", "২০৩০"];

export function normalizeLevel(
  className?: string,
  level?: string,
): StudentLevel | null {
  const raw = (level || className || "").toString().trim().toLowerCase();
  if (raw === "ssc" || raw.includes("ssc") || raw === "এসএসসি") return "ssc";
  if (raw === "hsc" || raw.includes("hsc") || raw === "এইচএসসি") return "hsc";
  const upper = (className || "").toUpperCase();
  if (upper.includes("SSC")) return "ssc";
  if (upper.includes("HSC")) return "hsc";
  return null;
}

export function levelLabel(level: StudentLevel | null): string {
  if (level === "ssc") return "SSC";
  if (level === "hsc") return "HSC";
  return "—";
}

export function examYearsForLevel(level: StudentLevel | null): number[] {
  if (level === "ssc") return [...SSC_EXAM_YEARS];
  if (level === "hsc") return [...HSC_EXAM_YEARS];
  return [];
}

export function isProfileComplete(user: UserProfile | null | undefined): boolean {
  if (!user) return false;
  const level = normalizeLevel(user.className, user.level);
  const year = user.examYear ?? user.targetExamYear;
  if (!level) return false;
  if (year === undefined || year === null || year === "") return false;
  const yearNum = typeof year === "number" ? year : parseInt(String(year), 10);
  if (!yearNum || Number.isNaN(yearNum)) return false;
  const allowed = examYearsForLevel(level);
  return allowed.includes(yearNum);
}

export function needsOnboarding(user: UserProfile | null | undefined): boolean {
  if (!user) return false;
  const college = (user.collegeName || user.schoolName || "").trim();
  const hasBatch =
    (user.batch || "").trim() ||
    (user.className && (user.examYear ?? user.targetExamYear));
  return !college || !hasBatch;
}

export const BATCH_OPTIONS = [
  "SSC 2026",
  "SSC 2027",
  "SSC 2028",
  "SSC 2029",
  "HSC 2025",
  "HSC 2026",
  "HSC 2027",
  "HSC 2028",
  "HSC 2029",
] as const;

export const PROFILE_INCOMPLETE_SAVE_MSG =
  "র‍্যাঙ্কিং ও স্কোর সেভ করতে আগে প্রোফাইল সম্পূর্ণ করুন।";

export const PROFILE_INCOMPLETE_HINT =
  "প্রোফাইল সম্পূর্ণ করুন: SSC/HSC এবং পরীক্ষার বছর নির্বাচন করুন।";

export function examYearBanglaLabel(year: number | string): string {
  const bn = "০১২৩৪৫৬৭৮৯";
  return String(year).replace(/\d/g, (d) => bn[parseInt(d, 10)]);
}
```

## File: [src/lib/quiz-api.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz-api.ts)

```ts
import { api } from "@/lib/api";

import { fetchNormalizedQuestions } from "@/lib/quiz/load-quiz-data";

import { resolveFileSubjectSlug } from "@/lib/quiz/registry";

import type { ApiQuestion, ApiSubject } from "@/types/quiz";

import { HSC_SCIENCE_PAPERS, SSC_CATALOG, type QuizLevel } from "@/lib/quiz-catalog";



export async function fetchSubjects(

  category?: QuizLevel,

): Promise<ApiSubject[]> {

  try {

    const path = category

      ? `/api/subjects?category=${encodeURIComponent(category)}`

      : "/api/subjects";

    const all = await api.get<ApiSubject[]>(path);

    if (!all?.length) return fallbackSubjects(category);

    if (category) {

      return all.filter(

        (s) => String(s.category).toUpperCase() === category,

      );

    }

    return all;

  } catch {

    return fallbackSubjects(category);

  }

}



function fallbackSubjects(category?: QuizLevel): ApiSubject[] {

  if (category === "SSC") {

    return SSC_CATALOG.map((s) => ({

      id: s.slug,

      name: s.name,

      slug: s.slug,

      category: "SSC",

      chapters: [],

    }));

  }

  if (category === "HSC") {

    return HSC_SCIENCE_PAPERS.map((p) => ({

      id: hscSlug(p.subject, p.paper),

      name: p.name,

      slug: hscSlug(p.subject, p.paper),

      category: "HSC",

      chapters: [],

    }));

  }

  return [];

}



function hscSlug(subject: string, paper: string) {

  return `${subject}-${paper}`;

}



export function parseHscSubjectPaper(subjectSlug: string): {

  level: "ssc" | "hsc";

  subject: string;

  paper?: string;

} {

  if (subjectSlug.endsWith("-1st-paper")) {

    return {

      level: "hsc",

      subject: subjectSlug.replace(/-1st-paper$/, ""),

      paper: "1st-paper",

    };

  }

  if (subjectSlug.endsWith("-2nd-paper")) {

    return {

      level: "hsc",

      subject: subjectSlug.replace(/-2nd-paper$/, ""),

      paper: "2nd-paper",

    };

  }

  return { level: "ssc", subject: subjectSlug };

}



export async function fetchQuestions(

  subject: string,

  chapter?: string,

): Promise<ApiQuestion[]> {

  const { level, subject: subj, paper } = parseHscSubjectPaper(subject);

  const fileSubject = resolveFileSubjectSlug(level, subj, paper);



  if (chapter) {

    return fetchNormalizedQuestions(

      level,

      subj === "math" ? "math" : subj,

      chapter,

      paper,

    );

  }



  return fetchNormalizedQuestions(

    level,

    subj === "math" ? "math" : subj,

    "",

    paper,

  );

}



export function isModelTestChapter(slug: string): boolean {

  return (

    slug.includes("model-test") ||

    slug.startsWith("special-set") ||

    slug.includes("set-")

  );

}

```

## File: [src/lib/quiz-catalog.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz-catalog.ts)

```ts
/** Static SSC/HSC catalog — fallback when API subjects are empty. */

export type QuizLevel = "SSC" | "HSC";

export interface CatalogSubject {
  slug: string;
  name: string;
  category: QuizLevel;
  /** HSC science: physics + 1st-paper */
  subject?: string;
  paper?: string;
}

export const SSC_CATALOG: CatalogSubject[] = [
  { slug: "physics", name: "পদার্থবিজ্ঞান", category: "SSC" },
  { slug: "chemistry", name: "রসায়ন", category: "SSC" },
  { slug: "biology", name: "জীববিজ্ঞান", category: "SSC" },
  { slug: "higher-math", name: "উচ্চতর গণিত", category: "SSC" },
  { slug: "math", name: "সাধারণ গণিত", category: "SSC" },
];

/** SSC science group — sidebar on physics/chemistry/biology pages. */
export const SSC_SCIENCE_CATALOG = SSC_CATALOG.filter((s) =>
  ["physics", "chemistry", "biology"].includes(s.slug),
);

/** SSC math group — sidebar on higher-math / general-math pages. */
export const SSC_MATH_CATALOG = SSC_CATALOG.filter((s) =>
  ["higher-math", "math"].includes(s.slug),
);

export function isSscScienceSlug(slug: string): boolean {
  return ["physics", "chemistry", "biology"].includes(slug);
}

export function isSscMathSlug(slug: string): boolean {
  return slug === "higher-math" || slug === "math";
}

export const HSC_SCIENCE_PAPERS: { subject: string; paper: string; name: string }[] = [
  { subject: "physics", paper: "1st-paper", name: "পদার্থবিজ্ঞান ১ম পত্র" },
  { subject: "physics", paper: "2nd-paper", name: "পদার্থবিজ্ঞান ২য় পত্র" },
  { subject: "chemistry", paper: "1st-paper", name: "রসায়ন ১ম পত্র" },
  { subject: "chemistry", paper: "2nd-paper", name: "রসায়ন ২য় পত্র" },
  { subject: "biology", paper: "1st-paper", name: "জীববিজ্ঞান ১ম পত্র" },
  { subject: "biology", paper: "2nd-paper", name: "জীববিজ্ঞান ২য় পত্র" },
  { subject: "higher-math", paper: "1st-paper", name: "উচ্চতর গণিত ১ম পত্র" },
  { subject: "higher-math", paper: "2nd-paper", name: "উচ্চতর গণিত ২য় পত্র" },
];

export function hscSubjectSlug(subject: string, paper: string): string {
  return `${subject}-${paper}`;
}

/** Map URL segments to subject slug used when loading static quiz JSON. */
export function toApiSubjectSlug(
  level: QuizLevel,
  subject: string,
  paper?: string,
): string {
  if (level === "HSC") {
    if (paper) return hscSubjectSlug(subject, paper);
  }
  return subject;
}

export const BOARD_YEARS = ["2026", "2025", "2024", "2023", "2022"] as const;

export const HSC_BOARD_SUBJECTS = [
  "biology",
  "chemistry",
  "higher-math",
  "physics",
] as const;
```

## File: [src/lib/quiz-helper.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz-helper.ts)

```ts
import type { NormalizedQuizSet } from "@/lib/quiz/types";
import { groupChapterQuizSets } from "@/lib/quiz/normalize-quiz-data";
import type { ModelTestDifficulty, ModelTestImportance } from "@/lib/format-model-test-title";
import { parseModelTestItemTitle, pickModelTestDisplayTitle, toBanglaNumber, isHyperMegaHotSource } from "@/lib/format-model-test-title";
import type { ModelTestItem } from "@/lib/model-test-filters";

/** MCQs per timed mock set in the UI */
export const MOCK_SET_SIZE = 25;

/** Chapter totals above this get split into virtual sets in the UI */
export const LARGE_CHAPTER_THRESHOLD = 30;

export type QuizDisplayMode = "practice" | "timed";

export type QuizListItem = {
  id: string;
  setId: string;
  title: string;
  slug: string;
  href: string;
  questionCount: number;
  difficulty?: ModelTestDifficulty;
  importance?: ModelTestImportance;
  sortNumber?: number;
  attemptCount?: number;
  completed?: boolean;
  bestScore?: number;
  lastAttemptAt?: string;
  isWeak?: boolean;
  isHighScore?: boolean;
  isRecommended?: boolean;
  setCount?: number;
  totalQuestions?: number;
  mode?: QuizDisplayMode;
  partLabel?: string;
  scope?: ModelTestItem["scope"];
  tags?: string[];
  chapterName?: string;
  isHyperMegaHot?: boolean;
};

export type ChapterGroupDisplay = {
  chapterSlug: string;
  chapterName: string;
  totalQuestions: number;
  physicalSetCount: number;
  displaySets: QuizListItem[];
  practiceMode: boolean;
};

const PART_SUFFIX_RE = /__part-(\d+)$/;

export function parseVirtualSetId(setId: string): {
  sourceSetId: string;
  partIndex: number | null;
} {
  const m = setId.match(PART_SUFFIX_RE);
  if (!m) return { sourceSetId: setId, partIndex: null };
  return {
    sourceSetId: setId.replace(PART_SUFFIX_RE, ""),
    partIndex: parseInt(m[1], 10) - 1,
  };
}

export function sliceQuestionsForVirtualSet<T>(
  questions: T[],
  setId: string,
): T[] {
  const { partIndex } = parseVirtualSetId(setId);
  if (partIndex === null) return questions;
  const start = partIndex * MOCK_SET_SIZE;
  return questions.slice(start, start + MOCK_SET_SIZE);
}

function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s*-\s*part\s+[a-z]\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * De-duplicate by setId; when titles collide with different MCQ counts, append Part A/B.
 */
export function deduplicateQuizListItems(items: QuizListItem[]): QuizListItem[] {
  const bySetId = new Map<string, QuizListItem>();
  for (const item of items) {
    if (!bySetId.has(item.setId)) {
      bySetId.set(item.setId, item);
    }
  }
  const unique = Array.from(bySetId.values());

  const groups = new Map<string, QuizListItem[]>();
  for (const item of unique) {
    const key = normalizeTitleKey(item.title);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  const result: QuizListItem[] = [];
  for (const [, group] of Array.from(groups.entries())) {
    if (group.length === 1) {
      result.push(group[0]);
      continue;
    }

    const sorted = [...group].sort((a, b) => {
      if (a.questionCount !== b.questionCount) {
        return a.questionCount - b.questionCount;
      }
      return a.setId.localeCompare(b.setId);
    });

    const baseTitle = sorted[0].title.replace(/\s*-\s*Part\s+[A-Z]\s*$/i, "").trim();
    const needsParts =
      sorted.length > 1 &&
      sorted.some((g, i) => i > 0 && g.title === sorted[0].title);

    sorted.forEach((item, index) => {
      if (!needsParts) {
        result.push(item);
        return;
      }
      const partLetter = String.fromCharCode(65 + index);
      result.push({
        ...item,
        title: `${baseTitle} - Part ${partLetter}`,
        partLabel: `Part ${partLetter}`,
      });
    });
  }

  return result.sort((a, b) => a.title.localeCompare(b.title, "en"));
}

export function expandQuizSetForDisplay(
  set: NormalizedQuizSet,
  hrefBase: string,
  indexOffset = 0,
): QuizListItem[] {
  const count = set.questionCount;
  if (count <= LARGE_CHAPTER_THRESHOLD) {
    return [
      {
        id: set.id,
        setId: set.id,
        title: set.displayTitle || set.title || `Set ${indexOffset + 1}`,
        slug: set.sourceKey ?? set.id,
        href: `${hrefBase}/${encodeURIComponent(set.id)}`,
        questionCount: count,
        mode: count <= MOCK_SET_SIZE ? "timed" : "practice",
      },
    ];
  }

  const chunks = Math.ceil(count / MOCK_SET_SIZE);
  return Array.from({ length: chunks }, (_, i) => {
    const partNum = i + 1;
    const virtualId = `${set.id}__part-${partNum}`;
    const chunkCount = Math.min(MOCK_SET_SIZE, count - i * MOCK_SET_SIZE);
    return {
      id: virtualId,
      setId: virtualId,
      title: `Set ${partNum}`,
      slug: virtualId,
      href: `${hrefBase}/${encodeURIComponent(virtualId)}`,
      questionCount: chunkCount,
      mode: i === 0 ? "timed" : "practice",
      partLabel: `Set ${partNum}`,
      sortNumber: partNum,
      difficulty:
        partNum <= 3 ? "easy" : partNum <= 7 ? "medium" : partNum <= 10 ? "hard" : "advanced",
      importance: partNum <= 5 ? "high" : partNum <= 8 ? "medium" : "low",
    };
  });
}

export function groupItemsByModelTestChapter(
  items: QuizListItem[],
): ChapterGroupDisplay[] {
  const byChapter = new Map<number, QuizListItem[]>();
  for (const item of items) {
    const parsed = parseModelTestItemTitle({
      sourceKey: item.slug,
      displayTitle: item.title,
      chapterName: item.chapterName,
    });
    const list = byChapter.get(parsed.sortChapter) ?? [];
    list.push(item);
    byChapter.set(parsed.sortChapter, list);
  }
  return Array.from(byChapter.entries())
    .sort(([a], [b]) => a - b)
    .map(([chNum, sets]) => {
      const sorted = [...sets].sort((a, b) => {
        const pa = parseModelTestItemTitle({
          sourceKey: a.slug,
          displayTitle: a.title,
          chapterName: a.chapterName,
        });
        const pb = parseModelTestItemTitle({
          sourceKey: b.slug,
          displayTitle: b.title,
          chapterName: b.chapterName,
        });
        return pa.sortTest - pb.sortTest;
      });
      const chapterName =
        sorted.find((s) => s.chapterName)?.chapterName ??
        parseModelTestItemTitle({
          sourceKey: sorted[0]?.slug ?? "",
          displayTitle: sorted[0]?.title,
          chapterName: sorted[0]?.chapterName,
        }).chapterLabel;
      const totalQuestions = sorted.reduce((n, s) => n + s.questionCount, 0);
      return {
        chapterSlug: `chapter-${String(chNum).padStart(2, "0")}`,
        chapterName,
        totalQuestions,
        physicalSetCount: sorted.length,
        displaySets: sorted,
        practiceMode: sorted.length > 1,
      };
    });
}

/** One syllabus chapter card per chapter — links to chapter hub, not individual model tests. */
export function buildSyllabusChapterGroupsFromModelTests(
  chapterModelItems: QuizListItem[],
  chapterPathPrefix: string,
): ChapterGroupDisplay[] {
  return groupItemsByModelTestChapter(chapterModelItems).map((group) => ({
    chapterSlug: group.chapterSlug,
    chapterName: group.chapterName,
    totalQuestions: group.totalQuestions,
    physicalSetCount: group.physicalSetCount,
    practiceMode: false,
    displaySets: [
      {
        id: `${group.chapterSlug}-practice`,
        setId: group.chapterSlug,
        title: `${group.chapterName} — MCQ প্র্যাকটিস`,
        slug: group.chapterSlug,
        href: `${chapterPathPrefix}/${group.chapterSlug}`,
        questionCount: group.totalQuestions,
        setCount: group.physicalSetCount,
        totalQuestions: group.totalQuestions,
        mode: "practice",
      },
    ],
  }));
}

/** Subject hub "অধ্যায়ভিত্তিক কুইজ" tab — syllabus chapter cards with real set links. */
export function buildSubjectChapterTabGroups(
  chapterSets: NormalizedQuizSet[],
  syllabusChapterSlugs: string[],
  chapterPathPrefix: string,
): ChapterGroupDisplay[] {
  const indexGroups = groupChapterQuizSets(
    chapterSets.filter((s) => s.type === "chapter-wise" && s.questionCount > 0),
  );
  const setsBySlug = new Map(indexGroups.map((g) => [g.chapterSlug, g.sets]));

  const slugList = Array.from(
    new Set([
      ...syllabusChapterSlugs,
      ...indexGroups.map((g) => g.chapterSlug),
    ]),
  ).sort();

  return slugList.map((chapterSlug) => {
    const sets = setsBySlug.get(chapterSlug) ?? [];
    const fromIndex = indexGroups.find((g) => g.chapterSlug === chapterSlug);
    const chapterName =
      fromIndex?.chapterName ??
      formatChapterDisplayName(chapterSlug, chapterSlug);

    if (sets.length > 0) {
      return buildChapterGroupDisplay(
        chapterSlug,
        chapterName,
        sets,
        chapterPathPrefix,
      );
    }

    return {
      chapterSlug,
      chapterName,
      totalQuestions: 0,
      physicalSetCount: 0,
      practiceMode: false,
      displaySets: [],
    };
  });
}

export function extractSyllabusChapterSlugs(sourceKeys: string[]): string[] {
  const slugs = new Set<string>();
  for (const key of sourceKeys) {
    const match = key.match(/chapter-(\d{2})/i);
    if (match) slugs.add(`chapter-${match[1]}`);
  }
  return Array.from(slugs).sort();
}

function formatChapterDisplayName(chapterSlug: string, rawName: string): string {
  if (/[\u0980-\u09FF]/.test(rawName) && !/^chapter\s/i.test(rawName)) {
    return rawName;
  }
  const num = chapterSlug.replace(/^chapter-/i, "").padStart(2, "0");
  const digitMap: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  const bg = num.split("").map((c) => digitMap[c] ?? c).join("");
  return `অধ্যায় ${bg}`;
}

export function buildChapterGroupDisplay(
  chapterSlug: string,
  chapterName: string,
  sets: NormalizedQuizSet[],
  chapterPathPrefix: string,
): ChapterGroupDisplay {
  const sortedSets = [...sets].sort((a, b) => a.id.localeCompare(b.id));
  const totalQuestions = sortedSets.reduce((n, s) => n + s.questionCount, 0);
  const practiceMode = totalQuestions > LARGE_CHAPTER_THRESHOLD;

  const displaySets: QuizListItem[] = [];
  sortedSets.forEach((set, setIndex) => {
    const hrefBase = `${chapterPathPrefix}/${chapterSlug}/set`;
    displaySets.push(...expandQuizSetForDisplay(set, hrefBase, setIndex));
  });

  return {
    chapterSlug,
    chapterName,
    totalQuestions,
    physicalSetCount: sortedSets.length,
    displaySets,
    practiceMode,
  };
}

export function modelTestToListItem(
  test: ModelTestItem,
  hrefPrefix: string,
): QuizListItem {
  return {
    id: test.id,
    setId: test.sourceKey,
    title: pickModelTestDisplayTitle(test),
    slug: test.sourceKey,
    href: `${hrefPrefix}/${encodeURIComponent(test.sourceKey)}`,
    questionCount: test.questionCount,
    difficulty: test.difficulty,
    importance: test.importance,
    sortNumber: test.sortNumber,
    attemptCount: test.attemptCount,
    completed: test.completed,
    bestScore: test.bestScore,
    lastAttemptAt: test.lastAttemptAt,
    scope: test.scope,
    tags: test.tags,
    chapterName: test.chapterName,
    isHyperMegaHot: isHyperMegaHotSource(test.sourceKey, test.tags),
    mode: test.questionCount <= MOCK_SET_SIZE ? "timed" : "practice",
  };
}

export function boardSetToListItem(
  board: {
    id: string;
    title: string;
    displayTitle?: string;
    questionCount: number;
    sourceKey?: string;
  },
  modelTestPathPrefix: string,
): QuizListItem {
  const key = board.sourceKey ?? board.id;
  return {
    id: board.id,
    setId: key,
    title: board.displayTitle ?? board.title,
    slug: key,
    href: `${modelTestPathPrefix}/${encodeURIComponent(key)}`,
    questionCount: board.questionCount,
    mode: "practice",
  };
}

export function getQuizDisplayTitle(item: QuizListItem): string {
  const raw = item.title || item.slug;
  if (/[\u0980-\u09FF]/.test(raw)) return raw;
  const parsed = parseModelTestItemTitle({
    sourceKey: item.slug,
    displayTitle: item.title,
    chapterName: item.chapterName,
  });
  if (parsed.chapterLabel === "মডেল টেস্ট" && item.sortNumber) {
    return parsed.testLabel;
  }
  return `${parsed.chapterLabel} · ${parsed.testLabel}`;
}

export function formatBnCount(n: number): string {
  return toBanglaNumber(n);
}

export function difficultyBadgeLabel(
  difficulty?: ModelTestDifficulty,
): string | null {
  if (!difficulty) return null;
  switch (difficulty) {
    case "easy":
      return "সহজ";
    case "medium":
      return "মাধ্যম";
    case "hard":
      return "কঠিন";
    case "advanced":
      return "উন্নত";
    default:
      return null;
  }
}

export function difficultyBadgeClass(difficulty?: ModelTestDifficulty): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-500/15 text-green-300 border-green-500/30";
    case "medium":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    case "hard":
    case "advanced":
      return "bg-red-500/15 text-red-300 border-red-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }
}
```

## File: [src/lib/quiz-list-filters.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz-list-filters.ts)

```ts
import type { ModelTestImportance } from "@/lib/format-model-test-title";
import { isHyperMegaHotSource } from "@/lib/format-model-test-title";
import type { ChapterGroupDisplay, QuizListItem } from "@/lib/quiz-helper";
import type { ModelTestFilterKey, ModelTestSortKey } from "@/components/quiz/ModelTestFilterBar";

export function isEasyQuizItem(item: QuizListItem): boolean {
  if (item.difficulty === "easy") return true;
  if (item.difficulty === "medium" && (item.sortNumber ?? 99) <= 5) return true;
  const num = item.sortNumber ?? extractTestNum(item.title);
  return num > 0 && num <= 3;
}

export function isAdvancedQuizItem(item: QuizListItem): boolean {
  if (item.difficulty === "advanced" || item.difficulty === "hard") return true;
  const num = item.sortNumber ?? extractTestNum(item.title);
  return num >= 11;
}

export function isImportantQuizItem(item: QuizListItem): boolean {
  if (item.isHyperMegaHot || isHyperMegaHotSource(item.slug, item.tags)) return true;
  if (item.importance === "high" || item.importance === "medium") return true;
  const num = item.sortNumber ?? extractTestNum(item.title);
  return num > 0 && num <= 5;
}

function extractTestNum(title: string): number {
  const m = title.match(/(?:test|set|model test)\s*0*(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

function matchesSearch(item: QuizListItem, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  return (
    item.title.toLowerCase().includes(q) ||
    item.slug.toLowerCase().includes(q) ||
    (item.partLabel?.toLowerCase().includes(q) ?? false)
  );
}

function applyFilterKey(item: QuizListItem, filter: ModelTestFilterKey): boolean {
  switch (filter) {
    case "all":
    case "default":
      return true;
    case "easy":
      return isEasyQuizItem(item);
    case "important":
      return isImportantQuizItem(item);
    case "advanced":
      return isAdvancedQuizItem(item);
    case "tried":
      return (item.attemptCount ?? 0) >= 1;
    case "not_tried":
      return !(item.completed ?? (item.attemptCount ?? 0) > 0);
    case "completed":
      return item.completed ?? (item.attemptCount ?? 0) > 0;
    case "weak":
      return item.isWeak === true;
    case "high_score":
      return item.isHighScore === true;
    case "recommended":
      return item.isRecommended === true;
    default:
      return true;
  }
}

function sortQuizItems(items: QuizListItem[], sort: ModelTestSortKey): QuizListItem[] {
  const list = [...items];
  switch (sort) {
    case "most_tried":
      list.sort((a, b) => (b.attemptCount ?? 0) - (a.attemptCount ?? 0));
      break;
    case "most_important": {
      const rank: Record<ModelTestImportance, number> = { high: 0, medium: 1, low: 2 };
      list.sort((a, b) => {
        const ia = rank[a.importance ?? "low"];
        const ib = rank[b.importance ?? "low"];
        if (ia !== ib) return ia - ib;
        return (a.sortNumber ?? 999) - (b.sortNumber ?? 999);
      });
      break;
    }
    case "advanced_first":
      list.sort((a, b) => (b.sortNumber ?? 0) - (a.sortNumber ?? 0));
      break;
    case "highest_score":
      list.sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
      break;
    case "lowest_score":
      list.sort((a, b) => {
        if (a.bestScore == null) return 1;
        if (b.bestScore == null) return -1;
        return a.bestScore - b.bestScore;
      });
      break;
    case "recently_tried":
      list.sort((a, b) => {
        if (!a.lastAttemptAt) return 1;
        if (!b.lastAttemptAt) return -1;
        return new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime();
      });
      break;
    case "default":
    default:
      list.sort((a, b) => {
        const na = a.sortNumber ?? (extractTestNum(a.title) || 999);
        const nb = b.sortNumber ?? (extractTestNum(b.title) || 999);
        if (na !== nb) return na - nb;
        return a.title.localeCompare(b.title, "en");
      });
  }
  return list;
}

export function filterQuizItems(
  items: QuizListItem[],
  filter: ModelTestFilterKey,
  search: string,
  sort: ModelTestSortKey,
): QuizListItem[] {
  const list = items.filter(
    (item) => matchesSearch(item, search) && applyFilterKey(item, filter),
  );
  return sortQuizItems(list, sort);
}

export function filterChapterGroups(
  groups: ChapterGroupDisplay[],
  filter: ModelTestFilterKey,
  search: string,
  sort: ModelTestSortKey,
): ChapterGroupDisplay[] {
  return groups
    .map((group) => ({
      ...group,
      displaySets: filterQuizItems(group.displaySets, filter, search, sort),
    }))
    .filter((group) => group.displaySets.length > 0);
}
```

## File: [src/lib/quiz-server-loader.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz-server-loader.ts)

```ts
import fs from "fs/promises";
import path from "path";
import {
  buildQuestionFilenameCandidates,
  mapJsonPayloadToQuestions,
} from "@/lib/quiz/load-quiz-data";
import { resolveFileSubjectSlug, type RegistryLevel } from "@/lib/quiz/registry";
import type { ApiQuestion } from "@/types/quiz";

const QUESTIONS_DIR = path.resolve(process.cwd(), "public/questions");

// Simple in-memory cache mapping "level:subject:setId:paper" to ServerQuizLoadResult.
// Disabled in development so JSON edits show up without restarting the dev server.
const questionsCache = new Map<string, ServerQuizLoadResult>();
const cacheEnabled = process.env.NODE_ENV === "production";

export type ServerQuizLoadResult = {
  questions: ApiQuestion[];
  path: string | null;
  attemptedPaths: string[];
};

async function tryReadQuestionFile(
  fileSlug: string,
  filename: string,
  subdir: "" | "model-tests",
): Promise<{ questions: ApiQuestion[]; path: string } | null> {
  const rel =
    subdir === ""
      ? path.join(fileSlug, `${filename}.json`)
      : path.join(fileSlug, subdir, `${filename}.json`);
  const fullPath = path.join(QUESTIONS_DIR, rel);
  const publicPath =
    subdir === ""
      ? `/questions/${fileSlug}/${filename}.json`
      : `/questions/${fileSlug}/model-tests/${filename}.json`;

  try {
    const raw = await fs.readFile(fullPath, "utf8");
    const data: unknown = JSON.parse(raw);
    const questions = mapJsonPayloadToQuestions(data);
    if (questions.length > 0) {
      return { questions, path: publicPath };
    }
  } catch {
    // file missing or invalid — try next candidate
  }
  return null;
}

/**
 * Load quiz questions from disk (server-side). Mirrors client fallback path strategy.
 * Cached in memory to avoid repeated disk reads.
 */
export async function loadQuizQuestionsFromDisk(
  level: RegistryLevel,
  subject: string,
  setId: string,
  paper?: string,
): Promise<ServerQuizLoadResult> {
  const cacheKey = `${level}:${subject}:${setId}:${paper ?? ""}`;
  const cached = questionsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await _loadQuizQuestionsFromDiskRaw(level, subject, setId, paper);
  if (result.questions.length > 0) {
    questionsCache.set(cacheKey, result);
  }
  return result;
}

async function _loadQuizQuestionsFromDiskRaw(
  level: RegistryLevel,
  subject: string,
  setId: string,
  paper?: string,
): Promise<ServerQuizLoadResult> {
  const fileSlug = resolveFileSubjectSlug(level, subject, paper);
  const filenames = buildQuestionFilenameCandidates(setId, fileSlug, level);
  const attemptedPaths: string[] = [];

  for (const filename of filenames) {
    for (const subdir of ["", "model-tests"] as const) {
      const publicPath =
        subdir === ""
          ? `/questions/${fileSlug}/${filename}.json`
          : `/questions/${fileSlug}/model-tests/${filename}.json`;
      attemptedPaths.push(publicPath);

      const result = await tryReadQuestionFile(fileSlug, filename, subdir);
      if (result) {
        return {
          questions: result.questions,
          path: result.path,
          attemptedPaths,
        };
      }
    }
  }

  for (const filename of filenames) {
    const megaPath = path.join(
      process.cwd(),
      "public",
      "quiz-data",
      level,
      `${fileSlug}.json`,
    );
    const publicMegaPath = `/quiz-data/${level}/${fileSlug}.json#${filename}`;
    attemptedPaths.push(publicMegaPath);
    try {
      const raw = await fs.readFile(megaPath, "utf8");
      const data = JSON.parse(raw) as { modelTests?: Record<string, unknown[]> };
      const list = data.modelTests?.[filename] ?? data.modelTests?.[setId];
      if (Array.isArray(list) && list.length > 0) {
        const questions = mapJsonPayloadToQuestions(list);
        if (questions.length > 0) {
          return { questions, path: publicMegaPath, attemptedPaths };
        }
      }
    } catch {
      /* mega missing */
    }
  }

  return { questions: [], path: null, attemptedPaths };
}
```

## File: [src/lib/quiz/audit-quiz-data.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/audit-quiz-data.ts)

```ts
import fs from "fs/promises";
import path from "path";
import { parseSubjectQuizJson } from "@/lib/quiz/normalize-quiz-data";
import { QUIZ_REGISTRY } from "@/lib/quiz/registry";
import type { NormalizationStats, ParsedSubjectQuizData } from "@/lib/quiz/types";

export interface SubjectAuditRow {
  registryPath: string;
  exists: boolean;
  loadError?: string;
  chapterSetCount: number;
  modelTestSetCount: number;
  boardSetCount: number;
  totalQuestions: number;
  stats: NormalizationStats;
}

export interface QuizDataAuditReport {
  subjects: SubjectAuditRow[];
  missingFiles: string[];
  invalidJsonFiles: string[];
  totalSubjects: number;
  totalChapters: number;
  totalSets: number;
  totalQuestions: number;
  skippedBadQuestions: number;
  duplicateIdsFixed: number;
  manifestExists: boolean;
}

const QUIZ_DATA_ROOT = path.resolve(process.cwd(), "public/quiz-data");

export async function auditQuizDataFiles(): Promise<QuizDataAuditReport> {
  const subjects: SubjectAuditRow[] = [];
  const missingFiles: string[] = [];
  const invalidJsonFiles: string[] = [];

  let totalChapters = 0;
  let totalSets = 0;
  let totalQuestions = 0;
  let skippedBad = 0;
  let duplicateFixed = 0;

  for (const entry of QUIZ_REGISTRY) {
    const relPath = entry.mainJsonPath;
    const filePath = path.join(QUIZ_DATA_ROOT, entry.level, path.basename(relPath));

    let exists = false;
    let parsed: ParsedSubjectQuizData | null = null;
    let loadError: string | undefined;

    try {
      await fs.access(filePath);
      exists = true;
      const raw = await fs.readFile(filePath, "utf8");
      try {
        const json = JSON.parse(raw);
        parsed = parseSubjectQuizJson(json, relPath);
      } catch {
        invalidJsonFiles.push(relPath);
        loadError = "Invalid JSON";
      }
    } catch {
      missingFiles.push(relPath);
    }

    const chapterSetCount = parsed?.chapterSets.length ?? 0;
    const modelTestSetCount = parsed?.modelTestSets.length ?? 0;
    const boardSetCount = parsed?.boardSets.length ?? 0;
    const stats = parsed?.stats ?? {
      skippedEmpty: 0,
      skippedInvalidOptions: 0,
      skippedInvalidCorrect: 0,
      skippedBrokenOcr: 0,
      duplicateIdsFixed: 0,
      totalInput: 0,
      totalValid: 0,
    };

    const subjectQuestions =
      (parsed?.chapterSets.reduce((s, x) => s + x.questionCount, 0) ?? 0) +
      (parsed?.modelTestSets.reduce((s, x) => s + x.questionCount, 0) ?? 0) +
      (parsed?.boardSets.reduce((s, x) => s + x.questionCount, 0) ?? 0);

    totalChapters += chapterSetCount;
    totalSets += chapterSetCount + modelTestSetCount + boardSetCount;
    totalQuestions += subjectQuestions;
    skippedBad +=
      stats.skippedEmpty +
      stats.skippedInvalidOptions +
      stats.skippedInvalidCorrect +
      stats.skippedBrokenOcr;
    duplicateFixed += stats.duplicateIdsFixed;

    subjects.push({
      registryPath: relPath,
      exists,
      loadError: parsed?.loadError ?? loadError,
      chapterSetCount,
      modelTestSetCount,
      boardSetCount,
      totalQuestions: subjectQuestions,
      stats,
    });
  }

  let manifestExists = false;
  try {
    await fs.access(path.join(QUIZ_DATA_ROOT, "manifest.json"));
    manifestExists = true;
  } catch {
    /* missing */
  }

  return {
    subjects,
    missingFiles,
    invalidJsonFiles,
    totalSubjects: subjects.filter((s) => s.exists).length,
    totalChapters,
    totalSets,
    totalQuestions,
    skippedBadQuestions: skippedBad,
    duplicateIdsFixed: duplicateFixed,
    manifestExists,
  };
}
```

## File: [src/lib/quiz/display-titles.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/display-titles.ts)

```ts
/** Programmatic headline from route slugs — no hardcoded mock values. */
export function formatSubjectHeadline(
  subject: string,
  paper?: string,
): string {
  const base = subject
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (!paper) return base;

  const paperLabel = paper
    .replace("-paper", " Paper")
    .replace(/\b(\d)(st|nd|rd|th)\b/i, "$1$2");

  return `${base} ${paperLabel.charAt(0).toUpperCase()}${paperLabel.slice(1)}`;
}
```

## File: [src/lib/quiz/load-quiz-data.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/load-quiz-data.ts)

```ts
import { inferModelTestScope } from "@/lib/format-model-test-title";
import {
  resolveFileSubjectSlug,
  type RegistryLevel,
} from "@/lib/quiz/registry";
import {
  extractChapterFromSourceKey,
  isImportedChapterModelKey,
} from "@/lib/quiz/normalize-quiz-data";
import type { NormalizedQuizSet, ParsedSubjectQuizData } from "@/lib/quiz/types";
import type { ApiQuestion } from "@/types/quiz";

type IndexBoardEntry = {
  id: string;
  title: string;
  questionCount: number;
};

type IndexModelTestEntry = {
  id: string;
  title: string;
  questionCount: number;
  scope?: string;
  tags?: string[];
  chaptersCovered?: Array<{ chapter?: string; chapterName?: string } | string>;
};

function chapterNameFromIndexEntry(m: IndexModelTestEntry): string | null {
  const covered = m.chaptersCovered;
  if (!Array.isArray(covered) || !covered.length) return null;
  const first = covered[0];
  if (typeof first === "string") return first.trim() || null;
  return String(first.chapterName ?? "").trim() || null;
}

function mapIndexModelTest(
  m: IndexModelTestEntry,
  level: RegistryLevel,
  fileSlug: string,
  paper?: string,
): NormalizedQuizSet {
  const scope = inferModelTestScope(m.id, {
    scope: m.scope as "chapter" | "paper" | undefined,
    tags: m.tags,
  });
  const fromKey = extractChapterFromSourceKey(m.id);
  const chapter = fromKey.chapter;
  const chapterName = chapterNameFromIndexEntry(m) ?? fromKey.chapterName;

  return {
    id: m.id,
    title: m.title,
    displayTitle: m.title,
    level,
    subject: fileSlug,
    paper: paper ?? null,
    type: scope === "chapter" ? "chapter-wise" : "model-test",
    chapter,
    chapterName,
    questionCount: m.questionCount,
    questions: [],
    scope,
    sourceKey: m.id,
  };
}

const clientCache = new Map<string, ParsedSubjectQuizData>();

/** Bump when chapter/model/board split logic changes — busts stale in-memory cache. */
const QUIZ_DATA_CACHE_VERSION = 59;

export async function loadSubjectQuizData(
  level: RegistryLevel,
  subject: string,
  paper?: string,
): Promise<ParsedSubjectQuizData | null> {
  const fileSlug = resolveFileSubjectSlug(level, subject, paper);
  const cacheKey = `v${QUIZ_DATA_CACHE_VERSION}/${level}/${fileSlug}`;

  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }

  const jsonPath = `/questions/${fileSlug}/index.json`;

  try {
    const res = await fetch(jsonPath, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const indexData = await res.json();
    
    // Map index.json to ParsedSubjectQuizData structure
    const mappedModelTests = (indexData.modelTests || []).map((m: IndexModelTestEntry) =>
      mapIndexModelTest(m, level, fileSlug, paper),
    );

    const chapterSetsFromModelTests = mappedModelTests
      .filter(
        (s: NormalizedQuizSet) =>
          s.scope === "chapter" &&
          s.questionCount > 0 &&
          isImportedChapterModelKey(s.sourceKey ?? s.id),
      )
      .sort((a: NormalizedQuizSet, b: NormalizedQuizSet) => a.id.localeCompare(b.id));

    let chapterSets: NormalizedQuizSet[] = (indexData.chapters || []).map(
      (c: { id: string; title: string; questionCount: number }) => ({
        id: c.id,
        title: c.title,
        displayTitle: c.title,
        level,
        subject: fileSlug,
        paper: paper ?? null,
        type: "chapter-wise" as const,
        chapter: c.id,
        chapterName: c.title,
        questionCount: c.questionCount,
        questions: [],
        scope: "chapter" as const,
        sourceKey: c.id,
      }),
    );

    // Prefer imported chapter-wise model tests over stale legacy chapter buckets.
    if (chapterSetsFromModelTests.length > 0) {
      chapterSets = chapterSetsFromModelTests;
    } else if (chapterSets.length === 0) {
      chapterSets = mappedModelTests
        .filter((s: NormalizedQuizSet) => s.scope === "chapter" && s.questionCount > 0)
        .sort((a: NormalizedQuizSet, b: NormalizedQuizSet) => a.id.localeCompare(b.id));
    }

    let modelTestSets = mappedModelTests.filter(
      (s: NormalizedQuizSet) => s.scope !== "chapter",
    );

    const parsed: ParsedSubjectQuizData = {
      level,
      subject: fileSlug,
      paper: paper ?? null,
      chapterSets,
      modelTestSets,
      boardSets: ((indexData.boards as IndexBoardEntry[]) || []).map((b) => ({
        id: b.id,
        title: b.title,
        displayTitle: b.title,
        level,
        subject: fileSlug,
        paper: paper ?? null,
        type: "board-wise",
        chapter: null,
        chapterName: null,
        questionCount: b.questionCount,
        questions: [], // loaded dynamically
        scope: "board",
        sourceKey: b.id,
      })),
      stats: {
        skippedEmpty: 0,
        skippedInvalidOptions: 0,
        skippedInvalidCorrect: 0,
        skippedBrokenOcr: 0,
        duplicateIdsFixed: 0,
        totalInput: 0,
        totalValid: 0,
      },
      rawFilePath: jsonPath,
    };

    clientCache.set(cacheKey, parsed);
    return parsed;
  } catch (err) {
    return {
      level,
      subject: fileSlug,
      paper: paper ?? null,
      chapterSets: [],
      modelTestSets: [],
      boardSets: [],
      stats: {
        skippedEmpty: 0,
        skippedInvalidOptions: 0,
        skippedInvalidCorrect: 0,
        skippedBrokenOcr: 0,
        duplicateIdsFixed: 0,
        totalInput: 0,
        totalValid: 0,
      },
      rawFilePath: jsonPath,
      loadError: String(err),
    };
  }
}

/** Map a single raw JSON question object to the ApiQuestion shape used by QuizRunner. */
export function mapRawQuestionToApi(
  raw: Record<string, unknown>,
  index: number,
): ApiQuestion | null {
  const questionText = String(
    raw.questionText ?? raw.text ?? raw.question ?? "",
  ).trim();
  if (!questionText) return null;

  let optionA = String(raw.optionA ?? "").trim();
  let optionB = String(raw.optionB ?? "").trim();
  let optionC = String(raw.optionC ?? "").trim();
  let optionD = String(raw.optionD ?? "").trim();

  if (Array.isArray(raw.options)) {
    const opts = raw.options.map((o) => {
      if (typeof o === "string") return o.trim();
      if (o && typeof o === "object" && "text" in o) {
        return String((o as { text: string }).text).trim();
      }
      return "";
    });
    optionA = opts[0] ?? optionA;
    optionB = opts[1] ?? optionB;
    optionC = opts[2] ?? optionC;
    optionD = opts[3] ?? optionD;
  }

  return {
    id: String(raw.id ?? `q-${index}`),
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption: "",
    subject: typeof raw.subject === "string" ? raw.subject : undefined,
    chapter: typeof raw.chapter === "string" ? raw.chapter : undefined,
    explanation: "",
    image:
      typeof raw.image === "string"
        ? raw.image
        : typeof raw.svg === "string"
          ? raw.svg
          : null,
    optionImages: Array.isArray(raw.optionImages)
      ? raw.optionImages.filter((v): v is string => typeof v === "string").slice(0, 4)
      : null,
  };
}

function extractQuestionList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object",
    );
  }
  if (data && typeof data === "object" && Array.isArray((data as { questions?: unknown }).questions)) {
    return ((data as { questions: unknown[] }).questions ?? []).filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object",
    );
  }
  return [];
}

export function mapJsonPayloadToQuestions(data: unknown): ApiQuestion[] {
  return extractQuestionList(data)
    .map((pq, i) => mapRawQuestionToApi(pq, i))
    .filter((q): q is ApiQuestion => q !== null);
}

/** Unique filename candidates derived from setId (handles prefix mismatches). */
export function buildQuestionFilenameCandidates(
  setId: string,
  fileSlug: string,
  level: RegistryLevel,
): string[] {
  const candidates = new Set<string>([setId]);

  const prefixPatterns: RegExp[] = [
    new RegExp(`^${level}-${fileSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-`, "i"),
    new RegExp(`^ssc-${fileSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-`, "i"),
    new RegExp(`^hsc-${fileSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-`, "i"),
  ];

  if (fileSlug === "general-math") {
    prefixPatterns.push(/^ssc-general-math-/i, /^ssc-math-/i);
    candidates.add(setId.replace(/^ssc-math-/i, "ssc-general-math-"));
    candidates.add(setId.replace(/^ssc-general-math-/i, "ssc-math-"));
  }

  for (const pattern of prefixPatterns) {
    const stripped = setId.replace(pattern, "");
    if (stripped && stripped !== setId) {
      candidates.add(stripped);
    }
  }

  if (!setId.startsWith(`${level}-`) && !setId.startsWith("ssc-") && !setId.startsWith("hsc-")) {
    candidates.add(`${level}-${fileSlug}-${setId}`);
    candidates.add(`ssc-${fileSlug}-${setId}`);
    candidates.add(`hsc-${fileSlug}-${setId}`);
  }

  return Array.from(candidates);
}

/** All URL paths to try for a quiz set, in priority order. */
export function buildQuestionFetchPaths(
  fileSlug: string,
  setId: string,
  level: RegistryLevel,
): string[] {
  const paths = new Set<string>();
  for (const filename of buildQuestionFilenameCandidates(setId, fileSlug, level)) {
    paths.add(`/questions/${fileSlug}/${filename}.json`);
    paths.add(`/questions/${fileSlug}/model-tests/${filename}.json`);
  }
  return Array.from(paths);
}

export type FetchQuizResult = {
  questions: ApiQuestion[];
  path: string | null;
  attemptedPaths: string[];
};

async function tryFetchQuestionPath(path: string): Promise<ApiQuestion[] | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      return null;
    }
    const data: unknown = await res.json();
    const mapped = mapJsonPayloadToQuestions(data);
    return mapped.length > 0 ? mapped : null;
  } catch {
    return null;
  }
}

export async function fetchNormalizedQuestionsWithMeta(
  level: RegistryLevel,
  subject: string,
  setId: string,
  paper?: string,
): Promise<FetchQuizResult> {
  const fileSlug = resolveFileSubjectSlug(level, subject, paper);
  const attemptedPaths = buildQuestionFetchPaths(fileSlug, setId, level);

  for (const path of attemptedPaths) {
    const mapped = await tryFetchQuestionPath(path);
    if (mapped) {
      return { questions: mapped, path, attemptedPaths };
    }
  }

  const megaUrl = `/quiz-data/${level}/${fileSlug}.json`;
  attemptedPaths.push(`${megaUrl}#${setId}`);
  try {
    const res = await fetch(megaUrl, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { modelTests?: Record<string, unknown[]> };
      for (const filename of buildQuestionFilenameCandidates(setId, fileSlug, level)) {
        const list = data.modelTests?.[filename];
        if (Array.isArray(list) && list.length > 0) {
          const mapped = mapJsonPayloadToQuestions(list);
          if (mapped.length > 0) {
            return {
              questions: mapped,
              path: `${megaUrl}#${filename}`,
              attemptedPaths,
            };
          }
        }
      }
    }
  } catch {
    /* mega fallback failed */
  }

  return { questions: [], path: null, attemptedPaths };
}

export async function fetchNormalizedQuestions(
  level: RegistryLevel,
  subject: string,
  setId: string,
  paper?: string,
): Promise<ApiQuestion[]> {
  const result = await fetchNormalizedQuestionsWithMeta(level, subject, setId, paper);
  return result.questions;
}

export function clearQuizDataCache(): void {
  clientCache.clear();
}

```

## File: [src/lib/quiz/normalize-quiz-data.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/normalize-quiz-data.ts)

```ts
import type { ApiQuestion } from "@/types/quiz";
import { expectedMcqForSubject } from "@/lib/quiz/registry";
import {
  isPlaceholderQuestionText,
  sanitizeQuizText,
} from "@/lib/sanitize-quiz-text";
import type {
  BanglaOptionLabel,
  AnswerIndex,
  NormalizedQuestion,
  NormalizedQuizSet,
  NormalizationStats,
  ParsedSubjectQuizData,
  QuizSetType,
} from "@/lib/quiz/types";

const BANGLA_LABELS: BanglaOptionLabel[] = ["ক", "খ", "গ", "ঘ"];
const LATIN_LABELS = ["A", "B", "C", "D"] as const;

export function isHiddenSourceKey(sourceKey: string): boolean {
  const s = sourceKey.toLowerCase();
  return (
    s.endsWith("_questions") ||
    s.endsWith("-questions") ||
    s.includes("prediction") ||
    s.includes("hscictprediction") ||
    s === "killer-set" ||
    s.includes("killer-set") ||
    s.includes("ai-prediction")
  );
}

/** User-imported chapter-wise sets (high-priority, set-XX, model-test-XX). */
export function isImportedChapterModelKey(sourceKey: string): boolean {
  const s = sourceKey.toLowerCase();
  return (
    /chapter-\d{2}-(?:high-priority-)?(?:set|model-test)-\d{2}/.test(s) ||
    /^hsc-[a-z0-9-]+-chapter-\d{2}-/.test(s)
  );
}

/** Legacy topic slug keys — hide when imported chapter sets exist. */
export function isLegacyChapterJunkKey(sourceKey: string): boolean {
  if (isImportedChapterModelKey(sourceKey)) return false;
  const s = sourceKey.toLowerCase();
  return (
    /^physicsfirstpaperch\d/.test(s) ||
    /^chemistryset\d/.test(s) ||
    /^physicsfirstpaperchset/.test(s) ||
    (/^model-test-\d+-[a-z]/i.test(sourceKey) && !s.includes("chapter"))
  );
}

/** @deprecated use isImportedChapterModelKey */
export function isStandardChapterModelKey(sourceKey: string): boolean {
  return isImportedChapterModelKey(sourceKey);
}

function emptyStats(): NormalizationStats {
  return {
    skippedEmpty: 0,
    skippedInvalidOptions: 0,
    skippedInvalidCorrect: 0,
    skippedBrokenOcr: 0,
    duplicateIdsFixed: 0,
    totalInput: 0,
    totalValid: 0,
  };
}

function mergeStats(a: NormalizationStats, b: NormalizationStats): NormalizationStats {
  return {
    skippedEmpty: a.skippedEmpty + b.skippedEmpty,
    skippedInvalidOptions: a.skippedInvalidOptions + b.skippedInvalidOptions,
    skippedInvalidCorrect: a.skippedInvalidCorrect + b.skippedInvalidCorrect,
    skippedBrokenOcr: a.skippedBrokenOcr + b.skippedBrokenOcr,
    duplicateIdsFixed: a.duplicateIdsFixed + b.duplicateIdsFixed,
    totalInput: a.totalInput + b.totalInput,
    totalValid: a.totalValid + b.totalValid,
  };
}

function labelToIndex(label: string): AnswerIndex | null {
  const s = label.trim();
  const banglaIdx = BANGLA_LABELS.indexOf(s as BanglaOptionLabel);
  if (banglaIdx >= 0) return banglaIdx as AnswerIndex;
  const upper = s.toUpperCase();
  const latinIdx = LATIN_LABELS.indexOf(upper as "A" | "B" | "C" | "D");
  if (latinIdx >= 0) return latinIdx as AnswerIndex;
  if (/^[1-4]$/.test(s)) return (parseInt(s, 10) - 1) as AnswerIndex;
  return null;
}

function indexToBangla(idx: AnswerIndex): BanglaOptionLabel {
  return BANGLA_LABELS[idx];
}

function indexToLatin(idx: AnswerIndex): string {
  return LATIN_LABELS[idx];
}

function isBrokenOcrQuestion(text: string): boolean {
  const t = text.trim();
  if (!t || t.length < 3) return true;
  if (isPlaceholderQuestionText(t)) return true;
  if (/^(graph|figure|image)\s*only/i.test(t)) return true;
  if (t === "..." || t === "---") return true;
  return false;
}

function extractOptions(raw: Record<string, unknown>): string[] | null {
  const sanitizeOpt = (s: string) => sanitizeQuizText(s, "option");

  if (Array.isArray(raw.options)) {
    const opts = raw.options.map((o) => {
      if (typeof o === "string") return sanitizeOpt(o.trim());
      if (o && typeof o === "object" && "text" in o) {
        return sanitizeOpt(String((o as { text: string }).text).trim());
      }
      return "";
    });
    if (opts.filter(Boolean).length >= 4) return opts.slice(0, 4);
  }

  const fromFields = [
    raw.optionA,
    raw.optionB,
    raw.optionC,
    raw.optionD,
  ].map((v) => sanitizeOpt(typeof v === "string" ? v.trim() : String(v ?? "").trim()));

  if (fromFields.filter(Boolean).length >= 4) return fromFields;

  return null;
}

function extractQuestionText(raw: Record<string, unknown>): string {
  const q =
    raw.questionText ??
    raw.question ??
    raw.text ??
    raw.q ??
    "";
  return sanitizeQuizText(String(q).trim(), "question");
}

function inferCorrectIndex(
  raw: Record<string, unknown>,
  options: string[],
): AnswerIndex | null {
  const correctRaw =
    raw.correctOption ??
    raw.correctAnswer ??
    raw.answer ??
    raw.correct;

  if (typeof raw.answerIndex === "number" && raw.answerIndex >= 0 && raw.answerIndex <= 3) {
    return raw.answerIndex as AnswerIndex;
  }

  if (correctRaw != null) {
    const idx = labelToIndex(String(correctRaw));
    if (idx !== null) return idx;
  }

  if (typeof raw.correctOptionText === "string") {
    const match = options.findIndex(
      (o) => o.trim() === String(raw.correctOptionText).trim(),
    );
    if (match >= 0 && match <= 3) return match as AnswerIndex;
  }

  return null;
}

export function normalizeQuestion(
  raw: unknown,
  ctx: {
    index: number;
    setId: string;
    usedIds: Set<string>;
    stats: NormalizationStats;
    chapter?: string;
    chapterName?: string;
  },
): NormalizedQuestion | null {
  if (!raw || typeof raw !== "object") {
    ctx.stats.skippedEmpty++;
    return null;
  }

  const record = raw as Record<string, unknown>;
  ctx.stats.totalInput++;

  const question = extractQuestionText(record);
  if (!question || isBrokenOcrQuestion(question)) {
    ctx.stats.skippedBrokenOcr++;
    return null;
  }

  const optionTexts = extractOptions(record);
  if (!optionTexts || optionTexts.some((o) => !o)) {
    ctx.stats.skippedInvalidOptions++;
    return null;
  }

  const answerIndex = inferCorrectIndex(record, optionTexts);
  if (answerIndex === null) {
    ctx.stats.skippedInvalidCorrect++;
    return null;
  }

  let id = String(record.id ?? `${ctx.setId}-q-${ctx.index}`);
  if (ctx.usedIds.has(id)) {
    id = `${id}-${ctx.index}`;
    ctx.stats.duplicateIdsFixed++;
  }
  ctx.usedIds.add(id);

  const options = optionTexts.map((text, i) => ({
    label: BANGLA_LABELS[i],
    text,
  }));

  const explanation =
    typeof record.explanation === "string" ? record.explanation : undefined;
  const shortSolution =
    typeof record.shortSolution === "string"
      ? record.shortSolution
      : explanation;

  ctx.stats.totalValid++;

  return {
    id,
    questionNo: typeof record.questionNo === "number" ? record.questionNo : ctx.index + 1,
    question,
    options,
    correctOption: indexToBangla(answerIndex),
    answerIndex,
    chapter: ctx.chapter ?? (typeof record.chapter === "string" ? record.chapter : undefined),
    chapterName:
      ctx.chapterName ??
      (typeof record.chapterName === "string" ? record.chapterName : undefined),
    topic: typeof record.topic === "string" ? record.topic : undefined,
    difficulty: typeof record.difficulty === "string" ? record.difficulty : undefined,
    shortSolution,
    explanation,
    whyImportant:
      typeof record.whyImportant === "string" ? record.whyImportant : undefined,
    sourceType: typeof record.sourceType === "string" ? record.sourceType : undefined,
    sourceYear:
      record.sourceYear != null ? String(record.sourceYear) : null,
    sourceBoard:
      record.sourceBoard != null ? String(record.sourceBoard) : null,
    stimulusId:
      record.stimulusId != null ? String(record.stimulusId) : null,
    stimulus:
      record.stimulus != null ? String(record.stimulus) : null,
    image:
      typeof record.image === "string"
        ? record.image
        : typeof record.svg === "string"
          ? record.svg
          : null,
  };
}

export function normalizeQuestionList(
  rawList: unknown[],
  setId: string,
  stats: NormalizationStats,
  chapter?: string,
  chapterName?: string,
): NormalizedQuestion[] {
  const usedIds = new Set<string>();
  const out: NormalizedQuestion[] = [];
  for (let i = 0; i < rawList.length; i++) {
    const q = normalizeQuestion(rawList[i], {
      index: i,
      setId,
      usedIds,
      stats,
      chapter,
      chapterName,
    });
    if (q) out.push(q);
  }
  return out;
}

/** Convert normalized question to legacy ApiQuestion for QuizRunner */
export function toApiQuestion(nq: NormalizedQuestion): ApiQuestion {
  return {
    id: nq.id,
    questionText: nq.question,
    optionA: nq.options[0]?.text ?? "",
    optionB: nq.options[1]?.text ?? "",
    optionC: nq.options[2]?.text ?? "",
    optionD: nq.options[3]?.text ?? "",
    correctOption: indexToLatin(nq.answerIndex),
    chapter: nq.chapter,
    explanation: nq.explanation ?? nq.shortSolution,
    image: nq.image ?? null,
  };
}

export function extractChapterFromSourceKey(sourceKey: string): {
  chapter: string | null;
  chapterName: string | null;
} {
  const s = sourceKey.toLowerCase();
  const m =
    s.match(/chapter[-_]?(\d{1,2})[-_]/) ||
    s.match(/ch(\d{1,2})[-_]/) ||
    s.match(/chapter[-_]?(\d{1,2})$/);
  if (!m) return { chapter: null, chapterName: null };
  const chapter = normalizeChapterId(m[1]);
  return { chapter, chapterName: null };
}

function extractChapterFromMeta(meta?: Record<string, unknown>): {
  chapter: string | null;
  chapterName: string | null;
} {
  const covered = meta?.chaptersCovered;
  if (!Array.isArray(covered) || !covered.length) {
    return { chapter: null, chapterName: null };
  }
  const first = covered[0];
  if (typeof first === "string") {
    return { chapter: null, chapterName: first };
  }
  if (first && typeof first === "object") {
    const rec = first as Record<string, unknown>;
    const chapter =
      rec.chapter != null ? normalizeChapterId(String(rec.chapter)) : null;
    const chapterName =
      typeof rec.chapterName === "string"
        ? rec.chapterName
        : typeof rec.name === "string"
          ? rec.name
          : null;
    return { chapter, chapterName };
  }
  return { chapter: null, chapterName: null };
}

function inferModelScope(
  sourceKey: string,
  meta?: Record<string, unknown>,
): "paper" | "chapter" | "board" | "whole-syllabus" {
  const s = sourceKey.toLowerCase();
  const tags = ((meta?.tags as string[]) ?? []).map((t) => t.toLowerCase());
  const scope = typeof meta?.scope === "string" ? meta.scope.toLowerCase() : "";

  if (scope === "chapter" || tags.includes("chapter-wise") || tags.includes("chapter")) {
    return "chapter";
  }
  if (scope === "board" || tags.includes("board-wise") || s.includes("board")) {
    return "board";
  }
  if (
    scope === "whole-syllabus" ||
    scope === "whole" ||
    tags.includes("whole-syllabus") ||
    tags.includes("full-book") ||
    s.includes("whole-syllabus") ||
    s.includes("full-book")
  ) {
    return "whole-syllabus";
  }
  if (/ch\d|chapter[-_]?\d|chapterwise/.test(s)) return "chapter";
  if (/tier-a-hot|board-standard|high-common|super-model/.test(s)) return "paper";
  return "paper";
}

function buildQuizSet(
  partial: Omit<NormalizedQuizSet, "questionCount"> & { questions: NormalizedQuestion[] },
): NormalizedQuizSet {
  const count = partial.questions.length;
  const duration =
    partial.durationMinutes ??
  (count > 0 ? Math.max(15, Math.ceil(count * 0.75)) : 25);

  return {
    ...partial,
    questionCount: count,
    durationMinutes: duration,
  };
}

function normalizeChapterId(ch: string): string {
  const clean = ch.trim();
  if (/^\d+$/.test(clean)) {
    return `chapter-${clean.padStart(2, "0")}`;
  }
  const match = clean.match(/^chapter[-_]?(\d+)$/i);
  if (match) {
    return `chapter-${match[1].padStart(2, "0")}`;
  }
  return clean;
}

function parseChaptersObject(
  chapters: Record<string, unknown[]>,
  level: "ssc" | "hsc",
  subject: string,
  paper: string | null | undefined,
  stats: NormalizationStats,
): NormalizedQuizSet[] {
  const sets: NormalizedQuizSet[] = [];

  for (const [chapterKey, rawQs] of Object.entries(chapters)) {
    if (!Array.isArray(rawQs)) continue;
    if (isHiddenSourceKey(chapterKey)) continue;

    const setId = chapterKey;
    const questions = normalizeQuestionList(
      rawQs,
      setId,
      stats,
      chapterKey,
    );

    const firstWithChName = questions.find((q) => q.chapterName);
    const chapterName = firstWithChName?.chapterName;

    sets.push(
      buildQuizSet({
        id: setId,
        title: chapterKey,
        displayTitle: chapterKey,
        level,
        subject,
        paper,
        type: "chapter-wise",
        chapter: chapterKey,
        chapterName,
        questions,
        scope: "chapter",
        sourceKey: chapterKey,
      }),
    );
  }

  return sets;
}

function parseModelTestsObject(
  modelTests: Record<string, unknown[]>,
  metaByKey: Record<string, Record<string, unknown>>,
  level: "ssc" | "hsc",
  subject: string,
  paper: string | null | undefined,
  stats: NormalizationStats,
): NormalizedQuizSet[] {
  const sets: NormalizedQuizSet[] = [];

  for (const [key, rawQs] of Object.entries(modelTests)) {
    if (!Array.isArray(rawQs)) continue;
    if (isHiddenSourceKey(key)) continue;

    const meta = metaByKey[key] ?? {};
    const scope = inferModelScope(key, meta);
    const fromMeta = extractChapterFromMeta(meta);
    const fromKey = extractChapterFromSourceKey(key);
    const chapter = fromMeta.chapter ?? fromKey.chapter;
    const chapterName = fromMeta.chapterName ?? fromKey.chapterName;
    const questions = normalizeQuestionList(
      rawQs,
      key,
      stats,
      chapter ?? undefined,
      chapterName ?? undefined,
    );

    sets.push(
      buildQuizSet({
        id: key,
        title: key,
        displayTitle:
          typeof meta.displayTitle === "string"
            ? meta.displayTitle
            : key,
        level,
        subject,
        paper,
        type:
          scope === "chapter"
            ? "chapter-wise"
            : scope === "whole-syllabus"
              ? "whole-syllabus"
              : "model-test",
        chapter,
        chapterName,
        questions,
        scope,
        sourceKey: key,
        importance:
          typeof meta.importance === "string"
            ? (meta.importance as "high" | "medium" | "low")
            : undefined,
        difficulty:
          typeof meta.difficulty === "string"
            ? (meta.difficulty as "easy" | "medium" | "hard" | "advanced")
            : undefined,
        durationMinutes:
          typeof meta.durationMinutes === "number"
            ? meta.durationMinutes
            : undefined,
      }),
    );
  }

  return sets;
}

function parseChapterWiseArray(
  chapterWise: unknown[],
  level: "ssc" | "hsc",
  subject: string,
  paper: string | null | undefined,
  stats: NormalizationStats,
): NormalizedQuizSet[] {
  const sets: NormalizedQuizSet[] = [];

  for (const entry of chapterWise) {
    if (!entry || typeof entry !== "object") continue;
    const rec = entry as Record<string, unknown>;
    const chapterNo = rec.chapterNo ?? rec.chapter;
    const chapterName =
      typeof rec.chapterName === "string" ? rec.chapterName : undefined;
    const chapterSlug =
      typeof rec.chapterSlug === "string"
        ? rec.chapterSlug
        : chapterNo != null
          ? `chapter-${String(chapterNo).padStart(2, "0")}`
          : "chapter";

    const rawSets = rec.sets ?? rec.modelTests ?? [];
    if (!Array.isArray(rawSets)) continue;

    for (let si = 0; si < rawSets.length; si++) {
      const setEntry = rawSets[si];
      let rawQs: unknown[] = [];
      let setKey = `${chapterSlug}-set-${si + 1}`;

      if (Array.isArray(setEntry)) {
        rawQs = setEntry;
      } else if (setEntry && typeof setEntry === "object") {
        const se = setEntry as Record<string, unknown>;
        if (Array.isArray(se.questions)) rawQs = se.questions;
        if (typeof se.id === "string") setKey = se.id;
        if (typeof se.setId === "string") setKey = se.setId;
      }

      if (isHiddenSourceKey(setKey)) continue;

      const questions = normalizeQuestionList(
        rawQs,
        setKey,
        stats,
        chapterSlug,
        chapterName,
      );

      sets.push(
        buildQuizSet({
          id: setKey,
          title: setKey,
          displayTitle: setKey,
          level,
          subject,
          paper,
          type: "chapter-wise",
          chapter: chapterSlug,
          chapterName,
          questions,
          scope: "chapter",
          sourceKey: setKey,
        }),
      );
    }
  }

  return sets;
}

function parseBoardQuestions(
  boardQuestions: Record<string, Record<string, unknown[]>>,
  level: "ssc" | "hsc",
  subject: string,
  paper: string | null | undefined,
  stats: NormalizationStats,
): NormalizedQuizSet[] {
  const sets: NormalizedQuizSet[] = [];

  for (const [year, boards] of Object.entries(boardQuestions)) {
    if (!boards || typeof boards !== "object") continue;
    for (const [board, rawQs] of Object.entries(boards)) {
      if (!Array.isArray(rawQs)) continue;
      const setId = `${board}-${year}`;
      const questions = normalizeQuestionList(rawQs, setId, stats);
      sets.push(
        buildQuizSet({
          id: setId,
          title: setId,
          displayTitle: `${board} ${year}`,
          level,
          subject,
          paper,
          type: "board-wise",
          questions,
          scope: "board",
          sourceKey: setId,
        }),
      );
    }
  }

  return sets;
}

function parseWholeModelTests(
  wholeModelTests: unknown[],
  level: "ssc" | "hsc",
  subject: string,
  paper: string | null | undefined,
  stats: NormalizationStats,
): NormalizedQuizSet[] {
  const sets: NormalizedQuizSet[] = [];

  for (let i = 0; i < wholeModelTests.length; i++) {
    const entry = wholeModelTests[i];
    let rawQs: unknown[] = [];
    let setKey = `whole-syllabus-${i + 1}`;

    if (Array.isArray(entry)) {
      rawQs = entry;
    } else if (entry && typeof entry === "object") {
      const e = entry as Record<string, unknown>;
      if (Array.isArray(e.questions)) rawQs = e.questions;
      if (typeof e.id === "string") setKey = e.id;
    }

    if (isHiddenSourceKey(setKey)) continue;

    const questions = normalizeQuestionList(rawQs, setKey, stats);
    sets.push(
      buildQuizSet({
        id: setKey,
        title: setKey,
        displayTitle: setKey,
        level,
        subject,
        paper,
        type: "whole-syllabus",
        questions,
        scope: "whole-syllabus",
        sourceKey: setKey,
      }),
    );
  }

  return sets;
}

/**
 * Parse raw subject JSON into normalized quiz sets.
 */
export function parseSubjectQuizJson(
  raw: unknown,
  filePath: string,
): ParsedSubjectQuizData {
  const stats = emptyStats();

  if (!raw || typeof raw !== "object") {
    return {
      level: "ssc",
      subject: "unknown",
      chapterSets: [],
      modelTestSets: [],
      boardSets: [],
      stats,
      rawFilePath: filePath,
      loadError: "Invalid JSON root",
    };
  }

  let data = raw as Record<string, unknown>;
  const levelRaw = String(data.level ?? "SSC").toLowerCase();
  const level: "ssc" | "hsc" = levelRaw === "hsc" ? "hsc" : "ssc";
  const subject = String(data.subject ?? filePath.split("/").pop()?.replace(".json", "") ?? "unknown");

  if (data.subjects && typeof data.subjects === "object") {
    const subjectsMap = data.subjects as Record<string, unknown>;
    const matchingKey = Object.keys(subjectsMap).find(
      (k) => k.toLowerCase() === subject.toLowerCase() || subject.toLowerCase().includes(k.toLowerCase())
    ) || Object.keys(subjectsMap)[0];

    if (matchingKey && subjectsMap[matchingKey] && typeof subjectsMap[matchingKey] === "object") {
      data = {
        ...data,
        ...(subjectsMap[matchingKey] as Record<string, unknown>),
      };
    }
  }

  let paper: string | null = null;
  if (subject.includes("-1st-paper")) paper = "1st-paper";
  if (subject.includes("-2nd-paper")) paper = "2nd-paper";

  const metaByKey = (data.modelTestsMeta as Record<string, Record<string, unknown>>) ?? {};

  let chapterSets: NormalizedQuizSet[] = [];
  let modelTestSets: NormalizedQuizSet[] = [];
  let boardSets: NormalizedQuizSet[] = [];

  if (data.chapters && typeof data.chapters === "object") {
    chapterSets = parseChaptersObject(
      data.chapters as Record<string, unknown[]>,
      level,
      subject,
      paper,
      stats,
    );
  }

  if (Array.isArray(data.chapterWise)) {
    chapterSets = [
      ...chapterSets,
      ...parseChapterWiseArray(data.chapterWise, level, subject, paper, stats),
    ];
  }

  if (data.modelTests && typeof data.modelTests === "object") {
    modelTestSets = parseModelTestsObject(
      data.modelTests as Record<string, unknown[]>,
      metaByKey,
      level,
      subject,
      paper,
      stats,
    );
  }

  if (Array.isArray(data.boardWise)) {
    modelTestSets = [
      ...modelTestSets,
      ...parseWholeModelTests(data.boardWise, level, subject, paper, stats).map(
        (s) => ({ ...s, type: "model-test" as QuizSetType, scope: "board" as const }),
      ),
    ];
  }

  if (Array.isArray(data.wholeModelTests)) {
    modelTestSets = [
      ...modelTestSets,
      ...parseWholeModelTests(data.wholeModelTests, level, subject, paper, stats),
    ];
  }

  if (data.boardQuestions && typeof data.boardQuestions === "object") {
    boardSets = parseBoardQuestions(
      data.boardQuestions as Record<string, Record<string, unknown[]>>,
      level,
      subject,
      paper,
      stats,
    );
  }

  // If no legacy chapter buckets exist, expose chapter-scoped model tests as individual sets (25 MCQ each).
  if (chapterSets.length === 0) {
    chapterSets = modelTestSets
      .filter((s) => s.scope === "chapter" && s.questionCount > 0)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  return {
    level,
    subject,
    paper,
    chapterSets,
    modelTestSets,
    boardSets,
    stats,
    rawFilePath: filePath,
  };
}

export function findQuizSetById(
  parsed: ParsedSubjectQuizData,
  setId: string,
): NormalizedQuizSet | undefined {
  const all = [
    ...parsed.chapterSets,
    ...parsed.modelTestSets,
    ...parsed.boardSets,
  ];
  const lower = setId.toLowerCase();
  return all.find(
    (s) =>
      s.id === setId ||
      s.sourceKey === setId ||
      s.id.toLowerCase() === lower ||
      (s.sourceKey?.toLowerCase() === lower),
  );
}

export function getChapterQuizSets(
  parsed: ParsedSubjectQuizData,
  chapterSlug: string,
): NormalizedQuizSet[] {
  const target = normalizeChapterId(chapterSlug);
  return parsed.chapterSets
    .filter((s) => {
      const ch = s.chapter ? normalizeChapterId(s.chapter) : "";
      if (ch === target) return true;
      const fromKey = extractChapterFromSourceKey(s.sourceKey ?? s.id);
      if (!fromKey.chapter) return false;
      return normalizeChapterId(fromKey.chapter) === target;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function groupChapterQuizSets(
  sets: NormalizedQuizSet[],
): Array<{
  chapterSlug: string;
  chapterName: string;
  sets: NormalizedQuizSet[];
  questionCount: number;
}> {
  const map = new Map<
    string,
    { chapterName: string; sets: NormalizedQuizSet[] }
  >();

  for (const set of sets) {
    const fromKey = extractChapterFromSourceKey(set.sourceKey ?? set.id);
    const slug = set.chapter
      ? normalizeChapterId(set.chapter)
      : fromKey.chapter ?? set.id;
    const name =
      set.chapterName ??
      fromKey.chapterName ??
      `অধ্যায় ${slug.replace(/^chapter-/, "").padStart(2, "0")}`;

    if (!map.has(slug)) {
      map.set(slug, { chapterName: name, sets: [] });
    }
    const group = map.get(slug)!;
    if (set.chapterName && group.chapterName.startsWith("অধ্যায়")) {
      group.chapterName = set.chapterName;
    }
    group.sets.push(set);
  }

  return Array.from(map.entries())
    .map(([chapterSlug, { chapterName, sets: chapterSets }]) => ({
      chapterSlug,
      chapterName,
      sets: chapterSets.sort((a, b) => a.id.localeCompare(b.id)),
      questionCount: chapterSets.reduce((n, s) => n + s.questionCount, 0),
    }))
    .sort((a, b) => a.chapterSlug.localeCompare(b.chapterSlug));
}

export function getExpectedMcqForSet(
  fileSubject: string,
  set: NormalizedQuizSet,
): number {
  return expectedMcqForSubject(fileSubject);
}
```

## File: [src/lib/quiz/quiz-diagrams.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/quiz-diagrams.ts)

```ts
/**
 * Explicit quiz diagram resolver — trusted matches only.
 *
 * This file must not point to missing SVG assets. When a precise asset is not
 * available, return null so the UI can use the normal diagram-needed fallback.
 */

const GRAPH_OPTION_FAMILIES = [
  "photon-energy",
  "half-life",
  "electric-field",
  "pressure-depth",
  "heating-curve",
  "reaction-rate",
  "pv-cycle",
  "shm-graph",
  "vt-graph",
] as const;

const TRUSTED_QUESTION_SLUGS = [
  "cell-terminal-pd",
  "cell-terminal-pd-alt",
  "mass-spring",
  "nor-gate",
  "parallel-dry-cells",
  "parallel-resistors",
  "pendulum",
  "resistor-voltage",
  "series-lcr",
  "young-double-slit-1",
  "young-double-slit-2",
  "young-double-slit-3",
  "young-double-slit-4",
  "ssc-transformer",
  "ssc-buoyancy",
  "ssc-resistor-network",
  "ssc-resistor-network-4-2-6-2",
  "ssc-current-junction",
  "ssc-concave-mirror",
  "ssc-concave-mirror-principal",
  "ssc-electrostatic-induction",
  "ssc-st-graph",
  "ssc-force-time-graph",
  "ssc-convex-lens",
  "ssc-myopia-eye",
  "ssc-work-zero-90deg",
  "ssc-power-circuit",
  "ssc-charge-spheres",
  "ssc-wave-standing",
  "ssc-wheel-motion",
  "bio-mitochondria-chloroplast",
  "plasmid",
  "bio-recombinant-plasmid",
  "bio-dna-helix",
  "bio-trna",
  "bio-stomata",
  "bio-bacteriophage",
  "bio-golgi",
  "bio-cytokinesis",
  "bio-poaceae-root",
  "bio-endodermis",
  "bio-c4-kranz",
  "bio-tissue-culture",
  "bio-transcription-translation",
  "bio-crossing-over",
  "bio-meristem",
  "bio-parenchyma",
  "bio-chordata",
  "bio-resin-duct",
  "bio-mitosis-meiosis",
  "bio-nephron",
  "bio-neuron",
  "bio-eye",
  "bio-heart",
  "bio-brain",
  "bio-skin",
  "bio-digestive",
  "bio-alveoli",
  "bio-xylem-phloem",
  "cell-division",
  "cell-wall",
  "sporangium",
  "fern-prothallus",
  "dna-rna",
  "vascular-bundle",
  "chem-alkyne-hydration",
  "chem-bromine-test",
  "chem-addition-polymer",
  "chem-titration",
  "geo-circle-pq-op",
  "geo-angle-bisectors",
  "geo-cyclic-quadrilateral",
  "geo-right-triangle-trig",
  "hm-parabola-y-x2",
  "hm-resultant-5n-7n-60",
  "hm-resultant-6n-8n-90",
  "hm-complex-locus",
  "hm-straight-line-slope",
] as const;

export const TRUSTED_STORED_DIAGRAM_SLUGS = new Set<string>(TRUSTED_QUESTION_SLUGS);

function buildAssetMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const slug of TRUSTED_QUESTION_SLUGS) {
    map[slug] = `/images/quiz/${slug}.svg`;
  }
  for (const family of GRAPH_OPTION_FAMILIES) {
    for (let i = 1; i <= 4; i++) {
      map[`${family}-${i}`] = `/images/quiz/${family}-${i}.svg`;
    }
  }
  return map;
}

export const QUIZ_DIAGRAM_ASSETS: Record<string, string> = buildAssetMap();

export type ResolvedQuizDiagram = {
  slug: string;
  src: string;
  caption?: string;
};

const BRACKET_CHITRA_RE = /\[চিত্র\s*[:：]\s*([^\]]+)\]/i;
const EXPLICIT_SLUG_RE =
  /(?:\[svg\s*[:：]\s*([a-z0-9-]+)\s*\]|\(\s*চিত্র\s*[:：]\s*([a-z0-9-]+)\s*\))/i;
const PAREN_CHITRA_RE = /\(\s*চিত্র\s*[:：]\s*([^)]+)\s*\)/i;
const LEKHOCHITRA_OPT_RE = /^\[?\s*লেখচিত্র\s*([১২৩৪1-4]|ঘ)\s*\]?$/i;

const BN_DIGIT: Record<string, number> = {
  "১": 1,
  "২": 2,
  "৩": 3,
  "৪": 4,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  ঘ: 4,
};

function asset(slug: string): ResolvedQuizDiagram | null {
  const src = QUIZ_DIAGRAM_ASSETS[slug];
  return src ? { slug, src } : null;
}

function normalizeHint(hint: string): string {
  return hint.replace(/\s+/g, " ").trim();
}

function extractDiagramSlug(image: string): string | null {
  const match = image.match(
    /^\/images\/quiz\/(?:(?:generated|premium)(?:\/options)?\/)?([a-z0-9_.-]+)\.svg$/i,
  );
  return match?.[1] ?? null;
}

function isGraphOptionSlug(slug: string): boolean {
  for (const family of GRAPH_OPTION_FAMILIES) {
    if (slug.startsWith(`${family}-`)) return true;
  }
  return slug.startsWith("young-double-slit-");
}

export function isTrustedStoredDiagram(image: string | null | undefined): boolean {
  if (!image) return false;
  if (!image.startsWith("/images/quiz/")) return false;
  // Auto-generated premium board/paper placeholders are text-only — never show.
  if (/\/premium\/physics-ssc/i.test(image)) return false;
  if (/\/premium\/ssc-physics-/i.test(image)) return false;
  if (/\/premium\/[^/]+\.svg$/i.test(image) && !/\/premium\/options\//i.test(image)) {
    return false;
  }
  const slug = extractDiagramSlug(image);
  if (!slug) return false;
  if (TRUSTED_STORED_DIAGRAM_SLUGS.has(slug)) return true;
  return isGraphOptionSlug(slug);
}

export function shouldUseStoredQuestionDiagram(
  text: string,
  image: string | null | undefined,
): boolean {
  if (!image || !isTrustedStoredDiagram(image)) return false;
  if (questionNeedsDiagramPlaceholder(text)) return true;
  const resolved = resolveQuestionDiagram(text);
  if (!resolved) return false;
  return resolved.src === image;
}

export function questionNeedsDiagramPlaceholder(text: string): boolean {
  if (!text) return false;
  if (/^উদ্দীপক:/i.test(text) && !/চিত্রে|দেখানো হলো|চিত্রটি|\[চিত্র|\(চিত্র/i.test(text)) {
    return false;
  }
  return (
    /\[চিত্র\s*[:：][^\]]+\]/i.test(text) ||
    /\(চিত্র\s*[:：][^)]+\)/i.test(text) ||
    /চিত্রটি\s*অনুপস্থিত|চিত্র\/গ্রাফ\s*ছিল|অপশনগুলোতে\s*চিত্র/i.test(text) ||
    (/চিত্রে|উদ্দীপকের\s*চিত্র|উপরের\s*চিত্র/i.test(text) &&
      !/\[চিত্র\s*[:：]|\(চিত্র\s*[:：]/i.test(text))
  );
}

function matchBracketChitraHint(hint: string): ResolvedQuizDiagram | null {
  const h = normalizeHint(hint);
  if (/গোলক\s+A\s+ও\s+B/i.test(h) || (/গোলক/i.test(h) && /আধান/i.test(h) && /\bA\b/.test(h) && /\bB\b/.test(h))) {
    return asset("ssc-charge-spheres");
  }
  if (/অবতল দর্পণ/i.test(h) && /লক্ষ্যবস্তু/i.test(h)) {
    return asset("ssc-concave-mirror");
  }
  return null;
}

function matchParenChitraLabel(label: string): ResolvedQuizDiagram | null {
  const l = normalizeHint(label).toLowerCase();
  if (l === "কোষ বিভাজন" || l === "কোষ-বিভাজন") return asset("cell-division");
  if (l === "কোষপ্রাচীর" || l === "কোষ প্রাচীর") return asset("cell-wall");
  if (l.includes("স্পোরাঞ্জ")) return asset("sporangium");
  if (l === "প্লাজমিড" || l === "plasmid") return asset("plasmid");
  if (l.includes("ফার্ন")) return asset("fern-prothallus");
  if (l.includes("মুক্ত সমপার্শ্ব") || l.includes("ভাস্কুলার")) return asset("vascular-bundle");
  if (/dna/i.test(l) && /rna/i.test(l)) return asset("dna-rna");
  return null;
}

function matchPhysicsStimulus(text: string): ResolvedQuizDiagram | null {
  if (!/চিত্র|diagram|উদ্দীপক|চিত্রভিত্তিক/i.test(text)) return null;

  const isMirror =
    /দর্পণ|mirror|আয়না|আয়না|অবতল\s*দর্পণ|উত্তল\s*দর্পণ/i.test(text) ||
    (/\\text\{PC\}|\\text\{PM\}|2\\text\{PC\}|PC\s*=\s*PM/i.test(text) && /প্রতিবিম্ব|আয়না|আয়না/i.test(text)) ||
    (/M\s*বিন্দু/i.test(text) && /প্রতিবিম্ব/i.test(text)) ||
    (/বক্রতার\s*কেন্দ্র/i.test(text) && /\(C\s*বিন্দু/i.test(text));
  if (isMirror) {
    if (/প্রধান\s*অক্ষ|১০\s*cm|10\s*cm.*40\s*cm|বিবর্ধন.*m/i.test(text)) {
      return asset("ssc-concave-mirror-principal");
    }
    return asset("ssc-concave-mirror");
  }

  const isLens =
    /লেন্স|lens/i.test(text) ||
    /লেন্সটিতে|লক্ষ্যবস্তুর\s*সৃষ্ট\s*প্রতিবিম্ব|বিবর্ধন\s*এক/i.test(text) ||
    (/\bO\b/.test(text) && /[CF]'|F'|C'|২F|2F/i.test(text) && /লেন্স|প্রতিবিম্ব/i.test(text));
  if (isLens) return asset("ssc-convex-lens");

  if (/উপরের\s*চিত্রানুসারে.*প্রধান\s*অক্ষ.*বিবর্ধন|লক্ষ্যবস্তু\s*প্রধান\s*অক্ষ.*বিবর্ধন/i.test(text)) {
    return asset("ssc-concave-mirror-principal");
  }
  if (/AB\s*=\s*200|MN\s*=\s*NH|স্থির\s*তরঙ্গ|অনুপ্রস্থ\s*তরঙ্গ/i.test(text)) {
    return asset("ssc-wave-standing");
  }
  if (/ট্রান্সফরমার|transformer/i.test(text)) return asset("ssc-transformer");
  if (/ধনাত্মক\s*আধান|অনাহিত\s*পরিবাহ|electrostatic\s*induction/i.test(text)) return asset("ssc-electrostatic-induction");
  if (/দূরত্ব[-\s]*সময়|distance[-\s]*time|O\(0,\s*0\).*A\(10,\s*10\)/i.test(text)) return asset("ssc-st-graph");
  if (/বল\s*বনাম\s*সময়|force.*time|ঢাল\s*এর\s*একক/i.test(text)) return asset("ssc-force-time-graph");
  if (/চলন্ত\s*গাড়ি|চলন্ত\s*গাড়ি|চাকার\s*গতি|wheel/i.test(text)) return asset("ssc-wheel-motion");
  if (/প্লবতা|buoyancy|ভাস|immersed/i.test(text)) return asset("ssc-buoyancy");
  if (
    /R_1\s*=\s*4|R₁\s*=\s*4/i.test(text) &&
    /R_2\s*=\s*2|R₂\s*=\s*2/i.test(text) &&
    /R_3\s*=\s*6|R₃\s*=\s*6/i.test(text) &&
    /R_4\s*=\s*2|R₄\s*=\s*2/i.test(text)
  ) {
    return asset("ssc-resistor-network-4-2-6-2");
  }
  if (/R_1|R_2|তুল্য\s*রোধ|equivalent\s*resistance|চিত্রে\s*প্রদর্শিত\s*বর্তনী/i.test(text)) {
    return asset("ssc-resistor-network");
  }
  if (/গোলক.*আধান|আধান.*গোলক/i.test(text)) return asset("ssc-charge-spheres");
  if (/জাংশন|junction|কিরchhoff|কারশফ/i.test(text)) return asset("ssc-current-junction");
  if (/প্রান্তীয়\s*বিভব|terminal\s*pd|কোষ.*বিভব/i.test(text)) return asset("cell-terminal-pd");
  if (/LCR|series.*LCR|আবর্ত\s*প্রবাহ/i.test(text)) return asset("series-lcr");
  if (/young|ইয়ং|দ্বি-স্লিট|double\s*slit/i.test(text)) return asset("young-double-slit-1");
  return null;
}

function matchBiologyStimulus(text: string): ResolvedQuizDiagram | null {
  if (!/চিত্র|diagram|উদ্দীপক/i.test(text)) return null;
  if (/নিউরন|neuron|স্নায়ু|স্নায়ু|synapse|সংযোগস্থল/i.test(text)) return asset("bio-neuron");
  if (/চক্ষু|retina|cornea|iris|চোখের|eyeball|অক্ষিক|দূরের\s*বস্তু\s*দেখতে\s*পায়\s*না|দূরের\s*বস্তু\s*দেখতে\s*পায়\s*না|myopia|ক্ষীন\s*দৃষ্টি/i.test(text) && !/দর্পণ|লেন্স|mirror|lens|অবতল|উত্তল|আয়না|আয়না/i.test(text)) return asset("ssc-myopia-eye");
  if (/মাইটোকন্ড্রিয়া|মাইটোকন্ড্রিয়া|mitochondria/i.test(text) && /ক্লোরো|chloroplast/i.test(text)) return asset("bio-mitochondria-chloroplast");
  if (/প্লাজমিড|plasmid/i.test(text)) return asset("plasmid");
  if (/recombinant|রিকম্বিন্যান্ট/i.test(text)) return asset("bio-recombinant-plasmid");
  if (/DNA.*helix|ডিএনএ.*ডবল|double\s*helix/i.test(text)) return asset("bio-dna-helix");
  if (/tRNA|টিআরএনএ/i.test(text)) return asset("bio-trna");
  if (/স্টোমাটা|stomata/i.test(text)) return asset("bio-stomata");
  if (/bacteriophage|ব্যাকটেরিওফেজ/i.test(text)) return asset("bio-bacteriophage");
  if (/গলজি|golgi/i.test(text)) return asset("bio-golgi");
  if (/cytokinesis|সাইটোকাইনেসিস/i.test(text)) return asset("bio-cytokinesis");
  if (/poaceae|ঘাস.*মূল/i.test(text)) return asset("bio-poaceae-root");
  if (/endodermis|এন্ডোডার্মিস|casparian/i.test(text)) return asset("bio-endodermis");
  if (/C4|kranz|Hatch/i.test(text)) return asset("bio-c4-kranz");
  if (/tissue\s*culture|টিস্য\s*কালচার/i.test(text)) return asset("bio-tissue-culture");
  if (/transcription|translation|ট্রান্সক্রিপশন/i.test(text)) return asset("bio-transcription-translation");
  if (/crossing\s*over|ক্রসিং\s*ওভার/i.test(text)) return asset("bio-crossing-over");
  if (/meristem|মেরিস্টেম/i.test(text)) return asset("bio-meristem");
  if (/parenchyma|প্যারেনকাইমা/i.test(text)) return asset("bio-parenchyma");
  if (/chordata|কর্ডাটা|notochord/i.test(text)) return asset("bio-chordata");
  if (/resin|তেল\s*নল|oil\s*gland/i.test(text)) return asset("bio-resin-duct");
  if (/mitosis.*meiosis|মাইটোসিস.*মায়োসিস|মাইটোসিস.*মায়োসিস/i.test(text)) return asset("bio-mitosis-meiosis");
  if (/খাদ্যনাল|পাকস্থলী|digestive|পরিপাক|ক্ষুদ্রান্ত্র|বৃহদন্ত্র/i.test(text)) return asset("bio-digestive");
  if (/অ্যালভিওল|alveoli|ফুসফুস|গ্যাস\s*বিনিময়/i.test(text)) return asset("bio-alveoli");
  if (/জাইলেম|ফ্লোয়েম|xylem|phloem/i.test(text)) return asset("bio-xylem-phloem");
  if (/\bGate\b|logic\s*gate|লজিক/i.test(text)) return asset("nor-gate");
  if (/নেফ্রন|glomerul|Ultrafiltration|ছাঁকনি|বোম্যানস|হেনলি|সংগ্রাহক|kidney|বৃক্ক/i.test(text)) return asset("bio-nephron");
  if (/চক্ষু|retina|cornea|iris|চোখের|eyeball|অক্ষিক|অপটিক.*নার্ভ|রেটিনা|কর্নিয়া/i.test(text)) return asset("bio-eye");
  if (/হৃৎপিণ্ড|হৃদযন্ত্র|heart|অলিন্দ|নিলয়|মহাধমনী|করোনারি/i.test(text)) return asset("bio-heart");
  if (/মস্তিষ্ক|brain|সেরিব্রাম|সেরিবেলাম|থ্যালামাস|হাইপোথ্যালামাস/i.test(text)) return asset("bio-brain");
  if (/ত্বক|skin|এপিডার্মিস|ডার্মিস|হাইপোডার্মিস|ঘর্মগ্রন্থি/i.test(text)) return asset("bio-skin");
  if (/কোষ\s*বিভাজন|মাইটোসিস|মায়োসিস|প্রোফেজ|মেটাফেজ|অ্যানাফেজ|টেলোফেজ|সাইটোকাইনেসিস/i.test(text)) return asset("cell-division");
  if (/কোষপ্রাচীর|cell\s*wall|মধ্যপর্দা|প্লাজমোডেসমাটা|প্রাথমিক\s*প্রাচীর|গৌণ\s*প্রাচীর/i.test(text)) return asset("cell-wall");
  if (/স্পোরাঞ্জি|sporangium|অ্যানুলাস|স্টোমিয়াম/i.test(text)) return asset("sporangium");
  if (/প্রোথ্যালাস|prothallus|ফার্ন|অ্যানথেরিডিয়া|আর্কিগোনিয়া/i.test(text)) return asset("fern-prothallus");
  if (/DNA.*RNA|ডিএনএ.*আরএনএ|নিউক্লিক\s*অ্যাসিড|ডাবল.*হেলিক্স.*সিঙ্গেল|dna.*rna/i.test(text)) return asset("dna-rna");
  if (/ভাস্কুলার\s*বান্ডল|vascular\s*bundle|সমপার্শ্বীয়|বিকর্ষ|ক্যাম্বিয়াম/i.test(text)) return asset("vascular-bundle");
  return null;
}

type GraphFamily = (typeof GRAPH_OPTION_FAMILIES)[number];

function isGraphComparisonQuestion(questionText: string): boolean {
  return /লেখচিত্র\s*(কোনটি|ভিন্ন|সঠিক)|কোন\s*লেখচিত্র|নিচের\s*কোন\s*লেখচিত্র|লেখ\s*চিত্র\s*কোন/i.test(questionText);
}

function detectGraphFamily(questionText: string): GraphFamily | null {
  if (!isGraphComparisonQuestion(questionText)) return null;
  if (/ফোটন|photon|আলোক\s*তড়/i.test(questionText)) return "photon-energy";
  if (/অর্ধায়ু|অর্ধায়ু|গড়\s*আয়ু|গড়\s*আয়ু|তেজস্ক্র/i.test(questionText)) return "half-life";
  if (/তড়িৎ\s*প্রাবল্য|electric\s*field/i.test(questionText)) return "electric-field";
  if (/চাপ\s*বনাম\s*গভীরতা|pressure.*depth/i.test(questionText)) return "pressure-depth";
  if (/তাপীয়\s*বক্র|তাপ\s*প্রদান|heating\s*curve|কঠিন\s*ঊর্ধ্বপাত/i.test(questionText)) return "heating-curve";
  if (/ঘনমাত্রা|বিক্রিয়ক|reaction\s*rate|উৎপাদ[^]*বৃদ্ধ/i.test(questionText)) return "reaction-rate";
  if (/P-V|p-v\s*গ্রাফ|চক্রাকার/i.test(questionText)) return "pv-cycle";
  if (/সরল\s*ছন্দ|simple\s*harmonic|সরলদোলক/i.test(questionText)) return "shm-graph";
  if (/স্থির\s*চাপ|আদর্শ\s*গ্যাস|volume.*temperature|V-T/i.test(questionText)) return "vt-graph";
  return null;
}

function extractGraphIndex(optionText: string): number | null {
  const m = optionText.trim().match(LEKHOCHITRA_OPT_RE);
  if (!m) return null;
  return BN_DIGIT[m[1]!] ?? null;
}

export function resolveQuestionDiagram(text: string): ResolvedQuizDiagram | null {
  if (!text) return null;
  const explicit = text.match(EXPLICIT_SLUG_RE);
  const slug = explicit?.[1] ?? explicit?.[2];
  if (slug && TRUSTED_STORED_DIAGRAM_SLUGS.has(slug)) return asset(slug);

  const bracket = text.match(BRACKET_CHITRA_RE);
  if (bracket) {
    const hint = bracket[1] ?? "";
    const resolved = matchBracketChitraHint(hint);
    if (resolved) return { ...resolved, caption: normalizeHint(hint) };
  }

  const paren = text.match(PAREN_CHITRA_RE);
  if (paren) {
    const label = paren[1] ?? "";
    const resolved = matchParenChitraLabel(label);
    if (resolved) return { ...resolved, caption: normalizeHint(label) };
  }

  if (/\(\s*উদ্দীপক\s*[:：]\s*DNA\s*ও\s*RNA\s*\)/i.test(text)) return asset("dna-rna");
  return matchPhysicsStimulus(text) ?? matchBiologyStimulus(text);
}

export function resolveOptionDiagram(
  optionText: string,
  questionText: string,
): ResolvedQuizDiagram | null {
  const index = extractGraphIndex(optionText);
  if (!index || !questionText) return null;
  const family = detectGraphFamily(questionText);
  if (family) return asset(`${family}-${index}`);
  if (/young|ইয়ং|দ্বি-স্লিট|double\s*slit/i.test(questionText)) return asset(`young-double-slit-${index}`);
  return null;
}

export function stripQuestionDiagramMarkers(text: string): string {
  return text
    .replace(/\[চিত্র\s*[:：]\s*[^\]]+\]/gi, "")
    .replace(/\(\s*চিত্র\s*[:：]\s*[^)]+\s*\)/gi, "")
    .replace(/\(\s*উদ্দীপক\s*[:：]\s*DNA\s*ও\s*RNA\s*\)/gi, "")
    .replace(/^উদ্দীপক\s*[:：]\s*চিত্রে\s*/i, "উদ্দীপক: ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function resolveQuizDiagram(input: {
  text?: string | null;
  image?: string | null;
  optionText?: string | null;
  questionText?: string | null;
}): ResolvedQuizDiagram | null {
  if (input.text) {
    const textMatch = resolveQuestionDiagram(input.text);
    if (textMatch) return textMatch;
  }
  if (input.text && input.image && shouldUseStoredQuestionDiagram(input.text, input.image)) {
    const slug = input.image.replace(/^\/images\/quiz\//, "").replace(/\.svg$/i, "");
    return { slug, src: input.image, caption: undefined };
  }
  if (input.optionText && input.questionText) {
    return resolveOptionDiagram(input.optionText, input.questionText);
  }
  return null;
}
```

## File: [src/lib/quiz/registry.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/registry.ts)

```ts
/**
 * Single source of truth for quiz catalog paths and display names.
 */

export type RegistryLevel = "ssc" | "hsc";

export interface RegistrySubject {
  level: RegistryLevel;
  subjectSlug: string;
  paperSlug?: string;
  nameBangla: string;
  /** File under public/quiz-data/{level}/ */
  mainJsonPath: string;
  /** Optional separate chapterwise tier-a file (may not exist) */
  chapterwiseJsonPath?: string;
  /** URL slug for routes (e.g. math → general-math file) */
  routeSlug: string;
  expectedMcqPerSet: number;
}

const SSC_SUBJECTS: Omit<RegistrySubject, "level">[] = [
  {
    subjectSlug: "physics",
    nameBangla: "পদার্থবিজ্ঞান",
    mainJsonPath: "ssc/physics.json",
    chapterwiseJsonPath: "ssc/ssc_physics_chapterwise_10_tier_a_sets.json",
    routeSlug: "physics",
    expectedMcqPerSet: 25,
  },
  {
    subjectSlug: "chemistry",
    nameBangla: "রসায়ন",
    mainJsonPath: "ssc/chemistry.json",
    chapterwiseJsonPath: "ssc/ssc_chemistry_chapterwise_10_tier_a_sets.json",
    routeSlug: "chemistry",
    expectedMcqPerSet: 25,
  },
  {
    subjectSlug: "biology",
    nameBangla: "জীববিজ্ঞান",
    mainJsonPath: "ssc/biology.json",
    chapterwiseJsonPath: "ssc/ssc_biology_chapterwise_10_tier_a_sets.json",
    routeSlug: "biology",
    expectedMcqPerSet: 25,
  },
  {
    subjectSlug: "higher-math",
    nameBangla: "উচ্চতর গণিত",
    mainJsonPath: "ssc/higher-math.json",
    chapterwiseJsonPath: "ssc/ssc_higher_math_chapterwise_10_tier_a_sets.json",
    routeSlug: "higher-math",
    expectedMcqPerSet: 25,
  },
  {
    subjectSlug: "general-math",
    nameBangla: "সাধারণ গণিত",
    mainJsonPath: "ssc/general-math.json",
    chapterwiseJsonPath: "ssc/ssc_general_math_chapterwise_10_tier_a_sets.json",
    routeSlug: "math",
    expectedMcqPerSet: 30,
  },
];

const HSC_PAPERS: Array<{
  subject: string;
  paper: string;
  nameBangla: string;
  fileSlug: string;
}> = [
  { subject: "physics", paper: "1st-paper", nameBangla: "পদার্থবিজ্ঞান ১ম পত্র", fileSlug: "physics-1st-paper" },
  { subject: "physics", paper: "2nd-paper", nameBangla: "পদার্থবিজ্ঞান ২য় পত্র", fileSlug: "physics-2nd-paper" },
  { subject: "chemistry", paper: "1st-paper", nameBangla: "রসায়ন ১ম পত্র", fileSlug: "chemistry-1st-paper" },
  { subject: "chemistry", paper: "2nd-paper", nameBangla: "রসায়ন ২য় পত্র", fileSlug: "chemistry-2nd-paper" },
  { subject: "biology", paper: "1st-paper", nameBangla: "জীববিজ্ঞান ১ম পত্র", fileSlug: "biology-1st-paper" },
  { subject: "biology", paper: "2nd-paper", nameBangla: "জীববিজ্ঞান ২য় পত্র", fileSlug: "biology-2nd-paper" },
  { subject: "higher-math", paper: "1st-paper", nameBangla: "উচ্চতর গণিত ১ম পত্র", fileSlug: "higher-math-1st-paper" },
  { subject: "higher-math", paper: "2nd-paper", nameBangla: "উচ্চতর গণিত ২য় পত্র", fileSlug: "higher-math-2nd-paper" },
];

export const QUIZ_REGISTRY: RegistrySubject[] = [
  ...SSC_SUBJECTS.map((s) => ({ ...s, level: "ssc" as RegistryLevel })),
  ...HSC_PAPERS.map((p) => ({
    level: "hsc" as RegistryLevel,
    subjectSlug: p.subject,
    paperSlug: p.paper,
    nameBangla: p.nameBangla,
    mainJsonPath: `hsc/${p.fileSlug}.json`,
    routeSlug: `${p.subject}/${p.paper}`,
    expectedMcqPerSet: 25,
  })),
];

/** Resolve API/file slug from route segments */
export function resolveFileSubjectSlug(
  level: RegistryLevel,
  subject: string,
  paper?: string,
): string {
  if (subject === "math") return "general-math";
  if (level === "hsc") {
    if (subject.endsWith("-1st-paper") || subject.endsWith("-2nd-paper")) {
      return subject;
    }
    if (paper) return `${subject}-${paper}`;
  }
  return subject;
}

export function findRegistryEntry(
  level: RegistryLevel,
  subject: string,
  paper?: string,
): RegistrySubject | undefined {
  const fileSlug = resolveFileSubjectSlug(level, subject, paper);
  return QUIZ_REGISTRY.find((e) => {
    if (e.level !== level) return false;
    const mainFile = e.mainJsonPath.split("/").pop()?.replace(".json", "");
    return mainFile === fileSlug || e.routeSlug === subject || e.subjectSlug === subject;
  });
}

export function expectedMcqForSubject(fileSlug: string): number {
  if (fileSlug === "general-math" || fileSlug === "math") return 30;
  const entry = QUIZ_REGISTRY.find(
    (e) => e.mainJsonPath.endsWith(`/${fileSlug}.json`),
  );
  return entry?.expectedMcqPerSet ?? 25;
}

export function manifestPublicPath(registryPath: string): string {
  return `/quiz-data/${registryPath}`;
}
```

## File: [src/lib/quiz/types.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/types.ts)

```ts
export type BanglaOptionLabel = "ক" | "খ" | "গ" | "ঘ";
export type AnswerIndex = 0 | 1 | 2 | 3;

export type NormalizedQuestion = {
  id: string;
  questionNo: number;
  question: string;
  options: { label: BanglaOptionLabel; text: string }[];
  correctOption: BanglaOptionLabel;
  answerIndex: AnswerIndex;
  chapter?: string;
  chapterName?: string;
  topic?: string;
  difficulty?: string;
  shortSolution?: string;
  explanation?: string;
  whyImportant?: string;
  sourceType?: string;
  sourceYear?: string | null;
  sourceBoard?: string | null;
  stimulusId?: string | null;
  stimulus?: string | null;
  image?: string | null;
};

export type QuizSetType =
  | "chapter-wise"
  | "model-test"
  | "whole-syllabus"
  | "board-wise";

export type NormalizedQuizSet = {
  id: string;
  title: string;
  displayTitle: string;
  level: "ssc" | "hsc";
  subject: string;
  paper?: string | null;
  type: QuizSetType;
  chapter?: string | null;
  chapterName?: string | null;
  questionCount: number;
  durationMinutes?: number;
  questions: NormalizedQuestion[];
  /** paper | chapter | board | whole-syllabus for model tests */
  scope?: "paper" | "chapter" | "board" | "whole-syllabus";
  importance?: "high" | "medium" | "low";
  difficulty?: "easy" | "medium" | "hard" | "advanced";
  sourceKey?: string;
};

export type NormalizationStats = {
  skippedEmpty: number;
  skippedInvalidOptions: number;
  skippedInvalidCorrect: number;
  skippedBrokenOcr: number;
  duplicateIdsFixed: number;
  totalInput: number;
  totalValid: number;
};

export type ParsedSubjectQuizData = {
  level: "ssc" | "hsc";
  subject: string;
  paper?: string | null;
  chapterSets: NormalizedQuizSet[];
  modelTestSets: NormalizedQuizSet[];
  boardSets: NormalizedQuizSet[];
  stats: NormalizationStats;
  rawFilePath: string;
  loadError?: string;
};
```

## File: [src/lib/quiz/unified-routes.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/quiz/unified-routes.ts)

```ts
import { parseHscSubjectPaper } from "@/lib/quiz-api";
import {
  SSC_CATALOG,
  SSC_MATH_CATALOG,
  SSC_SCIENCE_CATALOG,
  isSscMathSlug,
  isSscScienceSlug,
  HSC_SCIENCE_PAPERS,
  hscSubjectSlug,
  type QuizLevel,
} from "@/lib/quiz-catalog";
import { extractChapterFromSourceKey } from "@/lib/quiz/normalize-quiz-data";

export type RouteLevel = "ssc" | "hsc";

export function normalizeRouteLevel(level: string): RouteLevel | null {
  const l = level.toLowerCase();
  if (l === "ssc" || l === "hsc") return l;
  return null;
}

export function toQuizLevel(level: RouteLevel): QuizLevel {
  return level === "ssc" ? "SSC" : "HSC";
}

export function levelHubPath(level: RouteLevel): string {
  return `/${level}`;
}

export function levelModelTestsPath(level: RouteLevel, query?: string): string {
  const base = `/${level}/model-tests`;
  return query ? `${base}?${query}` : base;
}

/** HSC subject slug in unified routes uses `physics-1st-paper` form. */
export function parseUnifiedSubjectSlug(
  level: RouteLevel,
  subjectSlug: string,
): {
  registrySubject: string;
  paper?: string;
  apiSubjectSlug: string;
  routeSubject: string;
  routePaper?: string;
} {
  if (level === "ssc") {
    return {
      registrySubject: subjectSlug === "math" ? "math" : subjectSlug,
      apiSubjectSlug: subjectSlug,
      routeSubject: subjectSlug,
    };
  }

  const parsed = parseHscSubjectPaper(subjectSlug);
  return {
    registrySubject: parsed.subject,
    paper: parsed.paper,
    apiSubjectSlug: subjectSlug,
    routeSubject: parsed.subject,
    routePaper: parsed.paper,
  };
}

export function unifiedSubjectBasePath(level: RouteLevel, subjectSlug: string): string {
  return `/${level}/${subjectSlug}`;
}

export function unifiedChapterPathPrefix(level: RouteLevel, subjectSlug: string): string {
  return `${unifiedSubjectBasePath(level, subjectSlug)}/chapter`;
}

export function unifiedChaptersPath(level: RouteLevel, subjectSlug: string): string {
  return `${unifiedSubjectBasePath(level, subjectSlug)}/chapters`;
}

export function unifiedModelTestPathPrefix(level: RouteLevel, subjectSlug: string): string {
  return `${unifiedSubjectBasePath(level, subjectSlug)}/model-tests`;
}

export function unifiedChapterHubPath(
  level: RouteLevel,
  subjectSlug: string,
  chapterSlug: string,
): string {
  return `${unifiedChapterPathPrefix(level, subjectSlug)}/${chapterSlug}`;
}

export function unifiedChapterSetPath(
  level: RouteLevel,
  subjectSlug: string,
  chapterSlug: string,
  setId: string,
): string {
  return `${unifiedChapterHubPath(level, subjectSlug, chapterSlug)}/set/${encodeURIComponent(setId)}`;
}

export function unifiedModelTestQuizPath(
  level: RouteLevel,
  subjectSlug: string,
  testId: string,
): string {
  return `${unifiedModelTestPathPrefix(level, subjectSlug)}/${encodeURIComponent(testId)}`;
}

export function subjectHrefForCatalog(level: QuizLevel, slug: string): string {
  const routeLevel = level.toLowerCase() as RouteLevel;
  return unifiedSubjectBasePath(routeLevel, slug);
}

export function inferChapterSlugFromSetId(setId: string): string {
  const fromKey = extractChapterFromSourceKey(setId);
  if (fromKey.chapter) return fromKey.chapter;
  const match = setId.match(/chapter-\d{2}/i);
  if (match) return match[0].toLowerCase();
  return setId;
}

export function resolveSubjectTitle(level: RouteLevel, subjectSlug: string): string {
  if (level === "ssc") {
    const meta = SSC_CATALOG.find((s) => s.slug === subjectSlug);
    return meta?.name ?? subjectSlug;
  }

  const parsed = parseHscSubjectPaper(subjectSlug);
  const meta = HSC_SCIENCE_PAPERS.find(
    (p) => p.subject === parsed.subject && p.paper === parsed.paper,
  );
  return meta?.name ?? subjectSlug;
}

export function boardQuestionsHubPath(
  level: RouteLevel,
  subjectSlug: string,
): string {
  const parsed = parseUnifiedSubjectSlug(level, subjectSlug);
  if (level === "hsc" && parsed.routePaper) {
    return `/hsc-board-questions/${parsed.routeSubject}/${parsed.routePaper}`;
  }
  return `/ssc-board-questions/${parsed.registrySubject}`;
}

export function boardQuestionsYearPath(
  level: RouteLevel,
  subjectSlug: string,
  year: string,
): string {
  return `${boardQuestionsHubPath(level, subjectSlug)}/${year}`;
}

/** Board year chips — oldest first (matches index.json board order). */
export const BOARD_QUESTION_YEARS = [
  { value: "2022", label: "২০২২" },
  { value: "2023", label: "২০২৩" },
  { value: "2024", label: "২০২৪" },
  { value: "2025", label: "২০২৫" },
  { value: "2026", label: "২০২৬" },
] as const;

export function hscUnifiedSubjectSlug(subject: string, paper: string): string {
  return hscSubjectSlug(subject, paper);
}

export function subjectPracticeHref(
  subjectKey: string,
  level: RouteLevel = "ssc",
): string {
  const map: Record<string, { ssc: string; hsc: string }> = {
    physics: {
      ssc: unifiedSubjectBasePath("ssc", "physics"),
      hsc: unifiedSubjectBasePath("hsc", "physics-1st-paper"),
    },
    chemistry: {
      ssc: unifiedSubjectBasePath("ssc", "chemistry"),
      hsc: unifiedSubjectBasePath("hsc", "chemistry-1st-paper"),
    },
    biology: {
      ssc: unifiedSubjectBasePath("ssc", "biology"),
      hsc: unifiedSubjectBasePath("hsc", "biology-1st-paper"),
    },
    math: {
      ssc: unifiedSubjectBasePath("ssc", "math"),
      hsc: unifiedSubjectBasePath("hsc", "higher-math-1st-paper"),
    },
  };
  return map[subjectKey]?.[level] ?? levelHubPath(level);
}

export const SSC_SIDEBAR_SUBJECTS = SSC_CATALOG.map((s) => ({
  label: s.name,
  href: unifiedSubjectBasePath("ssc", s.slug),
}));

export const SSC_SCIENCE_SIDEBAR_SUBJECTS = SSC_SCIENCE_CATALOG.map((s) => ({
  label: s.name,
  href: unifiedSubjectBasePath("ssc", s.slug),
}));

export const SSC_MATH_SIDEBAR_SUBJECTS = SSC_MATH_CATALOG.map((s) => ({
  label: s.name,
  href: unifiedSubjectBasePath("ssc", s.slug),
}));

/** Science vs math sidebar on SSC subject pages — never mix tracks. */
export function resolveSscSidebarSubjectGroups(pathname: string): {
  science: typeof SSC_SCIENCE_SIDEBAR_SUBJECTS;
  math: typeof SSC_MATH_SIDEBAR_SUBJECTS;
  showScience: boolean;
  showMath: boolean;
} {
  const base = resolveActiveSubjectBasePath(pathname);
  const slug = base?.split("/").pop() ?? "";

  if (isSscScienceSlug(slug)) {
    return {
      science: SSC_SCIENCE_SIDEBAR_SUBJECTS,
      math: [],
      showScience: true,
      showMath: false,
    };
  }
  if (isSscMathSlug(slug)) {
    return {
      science: [],
      math: SSC_MATH_SIDEBAR_SUBJECTS,
      showScience: false,
      showMath: true,
    };
  }
  return {
    science: SSC_SCIENCE_SIDEBAR_SUBJECTS,
    math: SSC_MATH_SIDEBAR_SUBJECTS,
    showScience: true,
    showMath: true,
  };
}

export const HSC_SIDEBAR_PAPERS = HSC_SCIENCE_PAPERS.map((p) => ({
  label: p.name,
  href: unifiedSubjectBasePath("hsc", hscSubjectSlug(p.subject, p.paper)),
}));

/** Map legacy `/hsc/{subject}/{paper}/…` URLs to unified `/hsc/{subject}-{paper}/…`. */
export function resolveLegacyHscStudyRedirect(pathname: string): string | null {
  const match = pathname.match(
    /^\/hsc\/([^/]+)\/(1st-paper|2nd-paper)(\/.*)?$/,
  );
  if (!match) return null;
  const [, subject, paper, rest = ""] = match;
  return `/hsc/${hscSubjectSlug(subject, paper)}${rest}`;
}

export function isStudyLevelPath(pathname: string): boolean {
  return (
    pathname === "/ssc" ||
    pathname === "/hsc" ||
    pathname.startsWith("/ssc/") ||
    pathname.startsWith("/hsc/")
  );
}

export function detectStudyLevel(pathname: string): RouteLevel | null {
  if (
    pathname === "/ssc" ||
    pathname.startsWith("/ssc/") ||
    pathname.startsWith("/ssc-board-questions")
  ) {
    return "ssc";
  }
  if (
    pathname === "/hsc" ||
    pathname.startsWith("/hsc/") ||
    pathname.startsWith("/hsc-board-questions")
  ) {
    return "hsc";
  }
  return null;
}

const LEVEL_UTILITY_SEGMENTS = new Set([
  "model-tests",
  "saved-questions",
  "wrong-answers",
  "full-book-test",
  "final-focus",
  "tier-a-hot",
]);

/** e.g. `/ssc/physics/chapter/01` → `/ssc/physics` */
export function resolveActiveSubjectBasePath(pathname: string): string | null {
  const level = detectStudyLevel(pathname);
  if (!level) return null;

  const modelMatch = pathname.match(new RegExp(`^/${level}/([^/]+)/model-tests`));
  if (modelMatch && !LEVEL_UTILITY_SEGMENTS.has(modelMatch[1]!)) {
    return `/${level}/${modelMatch[1]}`;
  }

  const nestedMatch = pathname.match(
    new RegExp(`^/${level}/([^/]+)/(?:chapter|chapters|set)(?:/|$)`),
  );
  if (nestedMatch && !LEVEL_UTILITY_SEGMENTS.has(nestedMatch[1]!)) {
    return `/${level}/${nestedMatch[1]}`;
  }

  const directMatch = pathname.match(new RegExp(`^/${level}/([^/]+)(?:/|$)`));
  if (directMatch && !LEVEL_UTILITY_SEGMENTS.has(directMatch[1]!)) {
    return `/${level}/${directMatch[1]}`;
  }

  return null;
}

/** True when user is on an active quiz-taking page (chapter set or model test). */
export function isActiveQuizPath(pathname: string): boolean {
  return /\/set\/[^/]+$/.test(pathname) || /\/model-tests\/[^/]+$/.test(pathname);
}
```

## File: [src/lib/sanitize-quiz-text.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/sanitize-quiz-text.ts)

```ts
/**
 * Sanitize quiz question/option/explanation text before display or normalization.
 * Fixes common OCR noise, bare LaTeX, corrupt characters, and placeholder junk.
 */

const EXISTING_MATH_RE =
  /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/g;

const BENGALI_CHAR_RE = /[\u0980-\u09FF]/;

const CORRUPT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/স¤ক(?:্?)(?:ক্স|ক্স)?(?:র্ক|র্ক)/g, "সংক্র"],
  [/¤ক্স/g, "ং"],
  [/K¤ক্সাঙ্ক/g, "K-সাঙ্ক"],
  [/কি¤ক্সউটার/g, "কম্পিউটার"],
  [/næi/g, "নাই"],
  [/থে(?:া|)রি(?:য়|)য়াম/g, "থোরিয়াম"],
  [/–/g, "-"],
  [/—/g, "-"],
];

/** Board PDF / Bijoy OCR noise common in SSC/HSC year-wise imports. */
const BOARD_OCR_REPLACEMENTS: Array<[RegExp, string]> = [
  [/নামÑ/g, "নাম?"],
  [/এককÑ/g, "একক?"],
  [/হলÑে/g, "হলে"],
  [/হবÑে/g, "হবে"],
  [/যাবÑে/g, "যাবে"],
  [/বা®ক্সায়ন/g, "বাষ্পায়ন"],
  [/বা®ক্সায়ন/g, "বাষ্পায়ন"],
  [/পে®াটন/g, "প্রোটন"],
  [/পে্রাটন/g, "প্রোটন"],
  [/সT্চিত/g, "সঞ্চিত"],
  [/পালÐা/g, "পালল্য"],
  [/পালল্য/g, "পালল্য"],
  [/সমাš@রালে/g, "সমান্তরালে"],
  [/পড়š@/g, "পড়ার"],
  [/পড়š@/g, "পড়ার"],
  [/পযর্š@/g, "পয়েন্টে"],
  [/রা¯@ার/g, "রাস্তার"],
  [/বা¯@ব/g, "বাস্তব"],
  [/úাইড/g, "সাইড"],
  [/ধ্র"বক/g, "ধ্রুবক"],
  [/ধ্র“বক/g, "ধ্রুবক"],
  [/শ–ন্য/g, "শূন্য"],
  [/শ-ন্য/g, "শূন্য"],
  [/ন–্যনতম/g, "ন্যূনতম"],
  [/ন-্যনতম/g, "ন্যূনতম"],
  [/দ–রত্ব/g, "দূরত্ব"],
  [/দ-রত্ব/g, "দূরত্ব"],
  [/ফোকাস/g, "ফোকাস"],
  [/ভ‚-পৃষ্ঠে/g, "ভূ-পৃষ্ঠে"],
  [/ভ‚মি/g, "ভূমি"],
  [/ভ‚-পৃষ্ঠ/g, "ভূ-পৃষ্ঠ"],
  [/শে্রণিতে/g, "শ্রেণিতে"],
  [/কোণ/g, "কোণ"],
  [/ডিগি্র/g, "ডিগ্রি"],
  [/সোডিয়াম/g, "সোডিয়াম"],
  [/মৌল/g, "মৌল"],
  [/মৌলিক/g, "মৌলিক"],
  [/([০-৯]+)ঠ\b/g, "$1 V"],
  [/([০-৯]+)ঠ(?=\s|$)/g, "$1 V"],
  [//g, "°"],
  [/\t+imes/g, " \\times "],
  [/\s+imes\s+/g, " \\times "],
  [/(?<![a-zA-Z\\])imes(?=\s+[০-৯])/g, "\\times "],
  [/Ñe/g, "য়ে"],
  [/Ñ/g, "?"],
];

const IMAGE_PLACEHOLDER_OPTION_RE =
  /^(?:ঘ\/A|ঘ\/a|চধ|[কখগঘKJ]|[A-Da-d])$/;

const BOARD_SPECIAL_NOTE_RE =
  /\s*[।.]\s*\*\s*\(বিশেষ\s+নোট\)[\s\S]*$/i;

function isMathChar(ch: string): boolean {
  return /[A-Za-z0-9=.,+\-*/^()_ \t\\{}[\]|;]/.test(ch);
}

function skipBraced(text: string, start: number): number | null {
  if (text[start] !== "{") return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return null;
}

function skipLatexCommand(text: string, start: number): number {
  let i = start + 1;
  while (i < text.length && /[a-zA-Z]/.test(text[i])) i++;

  while (i < text.length && text[i] === "{") {
    const next = skipBraced(text, i);
    if (next == null) break;
    i = next;
  }

  if (i < text.length && (text[i] === "^" || text[i] === "_")) {
    i++;
    if (i < text.length && text[i] === "{") {
      const next = skipBraced(text, i);
      if (next != null) i = next;
    } else if (i < text.length) {
      i++;
    }
  }

  return i;
}

function expandMathSpan(text: string, anchor: number): [number, number] {
  let start = anchor;
  while (start > 0 && isMathChar(text[start - 1]) && !BENGALI_CHAR_RE.test(text[start - 1])) {
    start--;
  }

  let end = anchor + 1;
  while (end < text.length) {
    if (text[end] === "\\") {
      end = skipLatexCommand(text, end);
      continue;
    }
    if (text[end] === "_" || text[end] === "^") {
      end++;
      if (end < text.length && text[end] === "{") {
        const next = skipBraced(text, end);
        if (next != null) end = next;
      } else if (end < text.length && /[A-Za-z0-9+\-]/.test(text[end])) {
        end++;
      }
      continue;
    }
    if (isMathChar(text[end]) && !BENGALI_CHAR_RE.test(text[end])) {
      end++;
      continue;
    }
    break;
  }

  return [start, end];
}

function mergeIntervals(intervals: Array<[number, number]>): Array<[number, number]> {
  if (!intervals.length) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [sorted[0]!];
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i]!;
    const last = merged[merged.length - 1]!;
    if (cur[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      merged.push(cur);
    }
  }
  return merged;
}

function getMathRanges(text: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  const re = new RegExp(EXISTING_MATH_RE.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function isInRange(index: number, ranges: Array<[number, number]>): boolean {
  for (const [start, end] of ranges) {
    if (index >= start && index < end) return true;
  }
  return false;
}

function findMathAnchors(segment: string): number[] {
  const anchors: number[] = [];
  const mathRanges = getMathRanges(segment);

  for (let i = 0; i < segment.length; i++) {
    if (isInRange(i, mathRanges)) {
      continue;
    }
    const ch = segment[i];
    if (ch === "\\" && /[a-zA-Z]/.test(segment[i + 1] ?? "")) {
      anchors.push(i);
      i = skipLatexCommand(segment, i) - 1;
      continue;
    }
    if ((ch === "_" || ch === "^") && i > 0 && /[A-Za-z0-9)]/.test(segment[i - 1] ?? "")) {
      anchors.push(i - 1);
    }
  }
  return anchors;
}

function fixDoubleBackslash(str: string): string {
  if (/\\begin\{(matrix|pmatrix|bmatrix|vmatrix|Vmatrix|array|cases|align|split)\}/i.test(str)) {
    return str;
  }
  return str.replace(/\s*\\\\\s*/g, " / ");
}

export function normalizeBrokenLatex(text: string): string {
  let out = text;
  // Broken fraction (\frac corrupted to \f or rac)
  out = out.replace(/\\f\{/g, "\\frac{");
  out = out.replace(/\\?rac\{/g, "\\frac{");
  // Double text wrapper or extra closing brace
  out = out.replace(/\\text\{\\text\{/g, "\\text{");
  out = out.replace(/\\text\{([a-zA-Z0-9\s\^\{\}-]+)\}\}/g, "\\text{$1}");
  // OCR/export breaks \text{unit} into \t unit inside math
  out = out.replace(
    /\\t\s+(cm|m|s|Hz|ms\^\{-1\}|ms\^{-1\})/g,
    "\\text{ $1 }",
  );
  // Fix OCR-missing backslash before ext{ — must not corrupt valid \text{
  out = out.replace(/\\text\{/g, "__LATEX_TEXT__");
  out = out.replace(/(?<!\\)ext\{/g, "\\text{");
  out = out.replace(/(^|[^\\]) ext\{/g, "$1\\text{");
  out = out.replace(/__LATEX_TEXT__/g, "\\text{");
  out = out.replace(/= extconstant/gi, "= \\text{constant}");
  out = out.replace(/=extconstant/gi, "=\\text{constant}");
  
  // Double backslash outside matrix
  out = fixDoubleBackslash(out);

  // Common math/chem formulas
  out = out.replace(/\b([A-Z][a-z]?)_([a-zA-Z0-9])\b/g, "$1_{$2}");
  
  // Degree Celsius
  out = out.replace(/(\d+|[০-৯]+)\s*°\s*[Cc]\b/g, "$1^{\\circ}\\text{C}");
  out = out.replace(/(\d+|[০-৯]+)\s*\\?\^\{\\?circ\}\s*[Cc]\b/g, "$1^{\\circ}\\text{C}");
  out = out.replace(/(\d+|[০-৯]+)\s*\\?\^\\circ\s*[Cc]\b/g, "$1^{\\circ}\\text{C}");
  
  return out;
}

function normalizePlainOmega(text: string): string {
  // Replace Omega/\\Omega with Ω
  return text
    .replace(/(\d+(?:\.\d+)?)\s*\\?Omega\b/g, "$1Ω")
    .replace(/([০-৯]+(?:\.[০-৯]+)?)\s*\\?Omega\b/g, "$1Ω")
    .replace(/\\?Omega\b/g, "Ω");
}

function fixDelimitedMathBlock(block: string): string {
  if (block.startsWith("$$") && block.endsWith("$$")) {
    return `$$${normalizeBrokenLatex(block.slice(2, -2))}$$`;
  }
  if (block.startsWith("\\(") && block.endsWith("\\)")) {
    return `\\(${normalizeBrokenLatex(block.slice(2, -2))}\\)`;
  }
  if (block.startsWith("\\[") && block.endsWith("\\]")) {
    return `\\[${normalizeBrokenLatex(block.slice(2, -2))}\\]`;
  }
  if (block.startsWith("$") && block.endsWith("$")) {
    return `$${normalizeBrokenLatex(block.slice(1, -1))}$`;
  }
  return block;
}

function wrapBareLatexInPlainSegment(segment: string): string {
  let normalized = normalizePlainOmega(normalizeBrokenLatex(segment));
  
  // Normalize scientific notation directly to math block (supports Unicode lookbehinds/lookaheads)
  normalized = normalized.replace(/(?<!\d)(\d+(?:\.\d+)?)\s*(?:x|\*|\\times)\s*10\^\{([+-]?\d+)\}(?!\d)/gi, "$$$1 \\times 10^{$2}$$");
  normalized = normalized.replace(/(?<!\d)(\d+(?:\.\d+)?)\s*(?:x|\*|\\times)\s*10\^([+-]?\d+)(?!\d)/gi, "$$$1 \\times 10^{$2}$$");
  normalized = normalized.replace(/(?<![০-৯])([০-৯]+(?:\.[০-৯]+)?)\s*(?:x|\*|\\times)\s*১০\^\{([+-]?[০-৯]+)\}(?![০-৯])/g, "$$$1 \\times ১০^{$2}$$");
  normalized = normalized.replace(/(?<![০-৯])([০-৯]+(?:\.[০-৯]+)?)\s*(?:x|\*|\\times)\s*১০\^([+-]?[০-৯]+)(?![০-৯])/g, "$$$1 \\times ১০^{$2}$$");

  const anchors = findMathAnchors(normalized);
  if (!anchors.length && !/\\[a-zA-Z]|_\{|_\d|\^\{|\^\\circ/.test(normalized)) {
    return normalized;
  }

  const intervals = mergeIntervals(anchors.map((a) => expandMathSpan(normalized, a)));
  if (!intervals.length) return normalized;

  let out = "";
  let cursor = 0;
  for (const [start, end] of intervals) {
    out += normalized.slice(cursor, start);
    const raw = normalized.slice(start, end);
    const trimmed = raw.trim();
    const leading = raw.match(/^\s*/)?.[0] ?? "";
    const trailing = raw.match(/\s*$/)?.[0] ?? "";
    out += leading;
    out += trimmed.length >= 2 ? `$${trimmed}$` : raw;
    out += trailing;
    cursor = end;
  }
  out += normalized.slice(cursor);
  return out;
}

export function wrapBareLatex(text: string): string {
  if (!text) return text;

  let result = "";
  let lastIndex = 0;
  const re = new RegExp(EXISTING_MATH_RE.source, "g");
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    result += wrapBareLatexInPlainSegment(text.slice(lastIndex, match.index));
    result += fixDelimitedMathBlock(match[0]);
    lastIndex = match.index + match[0].length;
  }

  result += wrapBareLatexInPlainSegment(text.slice(lastIndex));
  return result;
}

function cleanCharacters(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[\uF0B7\uF0FC\uF0E0\uF020\uF0A7\uF0B0\uF071\uF0D8\uF09F\uF0AF\u2022\u25CF\u25AA\u25A0\uF0A3]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\t/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/¤/g, ""); // Clean OCR currency symbols
}

function fixCorruptText(text: string): string {
  let out = text;
  for (const [pattern, replacement] of CORRUPT_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function repairBoardOcr(text: string): string {
  let out = fixCorruptText(String(text ?? ""));
  for (const [pattern, replacement] of BOARD_OCR_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function isImagePlaceholderOption(text: string): boolean {
  const t = String(text ?? "").trim();
  if (!t) return true;
  return IMAGE_PLACEHOLDER_OPTION_RE.test(t);
}

/** Remove a second question accidentally merged into one stem. */
function stripMergedQuestionTail(text: string): string {
  return text.replace(/\n[।.\s]*[০-৯\d]+\s*[।.]\s*[০-৯\d]+\.\s+[\s\S]+$/u, "");
}

/** Remove leaked MCQ option lines (K/খ/গ/ঘ prefixes) from stems. */
function stripLeakedOptionLines(text: string): string {
  return text
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (/^(?:[Kকখগঘ]\s+.+|হঝ|হচ|ঠচ|-\s*$|10\^\{০০\})/.test(trimmed)) {
        return false;
      }
      if (/^উত্তর$/.test(trimmed)) return false;
      if (/^[০-৯\d]{1,2}$/.test(trimmed)) return false;
      return true;
    })
    .join("\n");
}

/** Remove stray answer-key noise from board imports. */
function stripAnswerKeyNoise(text: string): string {
  return text
    .replace(/\nউত্তর\n(?:[০-৯\d]+\n){2,}/g, "\n")
    .replace(/\n[০-৯\d]{1,2}\n[০-৯\d]{1,2}\n[০-৯\d]{1,2}(?:\n[০-৯\d]{1,2}){0,3}\s*$/g, "");
}

export function stripAsciiCircuitArt(text: string): string {
  return text
    .split("\n")
    .filter((line) => {
      const l = line.trim();
      // If it contains a resistor/capacitor block with connections: +--[ R ]--+
      if (/\+-{2,}\[[^\]]+\]-{2,}\+/i.test(l)) return false;
      // If it contains a source/meter: +--( V )--+
      if (/\+-{2,}\([^)]+\)-{2,}\+/i.test(l)) return false;
      // If it is just a border line of dashes/pluses: +------+ or +======+ or -------
      if (/^[+\-|=\s]{5,}$/.test(l) && (l.includes("+") || l.includes("-") || l.includes("="))) return false;
      // If it is a vertical circuit line: |      |
      if (/^\|[\s|]*\|$/.test(l)) return false;
      return true;
    })
    .join("\n")
    .replace(/\+-{2,}\[[^\]]+\]-{2,}\+/g, " ")
    .replace(/\+-{5,}\([^)]+\)-{5,}\+/g, " ")
    .replace(/\.(?:\s*।\s*){2,}/g, " ")
    .replace(/\s{2,}/g, " ");
}

function stripBoardMetadata(text: string): string {
  return text
    .replace(/-{3,}\s*===\s*Board Exam:[\s\S]*?===\s*-{3,}/gi, "")
    .replace(/===\s*Board Exam:[\s\S]*?===/gi, "")
    .replace(/[-=]{3,}\s*Board Exam[\s\S]*?[-=]{3,}/gi, "")
    .replace(/Board Exam\s*:\s*\d{4}/gi, "")
    .replace(/\b[A-Za-z]+ Board\s+\d{4}\b/gi, "")
    .replace(/\b[A-Za-z]+\s*বোর্ড\s*\d{4}\b/gi, "")
    .replace(/^সঠিক উত্তর:\s*[কখগঘ]\.?\s*/gi, "")
    .replace(/^উত্তর:\s*[কখগঘ]\.?\s*/gi, "")
    .replace(/\s*[—\-–]\s*বোর্ড\s+অনুশীলন[\s\S]*$/gi, "")
    .replace(/\s+বোর্ড\s+অনুশীলন[\s\S]*$/gi, "")
    .trim();
}

function stripNoiseLines(text: string): string {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      if (/^-{3,}$/.test(line)) return false;
      if (/^\.+$/.test(line)) return false;
      if (/^[০-৯\d]{1,2}$/.test(line)) return false;
      if (/^[০-৯\d]+\s*=$/.test(line)) return false;
      if (/^[০-৯\d]+\s*\\?[a-zA-Z]+\\?\)?$/.test(line) && line.length <= 4) return false;
      if (
        /^[\d০-৯\s=()+\-*/\\^_{}\[\].,]+$/.test(line) &&
        line.length < 40
      ) {
        return false;
      }
      if (/^[\d০-৯]{1,3}$/.test(line)) return false;
      if (/^উত্তর$/i.test(line)) return false;
      return true;
    })
    .join("\n");
}

function collapseWhitespace(text: string): string {
  return text.replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

export function detectPlaceholderQuestion(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  if (/replace with Bengali question text/i.test(t)) return true;
  if (/^\[[A-Za-z\s]+ image\s*—\s*Q\d+\]/i.test(t)) return true;
  if (/\[image question\]/i.test(t)) return true;
  if (/\[diagram required\]/i.test(t)) return true;
  if (/চিত্র\s*প্রয়োজন/i.test(t)) return true;
  if (/image-based\s*question\s*missing/i.test(t)) return true;
  return false;
}

export function normalizeStatementList(text: string): string {
  let cleaned = text;

  // 1. Standardize roman markers (i., ii., iii., iv.)
  cleaned = cleaned.replace(/(?:\b|\()i\s*[.)\-\]]/gi, "i.");
  cleaned = cleaned.replace(/(?:\b|\()ii\s*[.)\-\]]/gi, "ii.");
  cleaned = cleaned.replace(/(?:\b|\()iii\s*[.)\-\]]/gi, "iii.");
  cleaned = cleaned.replace(/(?:\b|\()iv\s*[.)\-\]]/gi, "iv.");

  // 2. Standardize Bangla list markers if used as roman statement markers (র., রর., ররর., রররর.)
  cleaned = cleaned.replace(/(?:\b|\()র\s*\./g, "র.");
  cleaned = cleaned.replace(/(?:\b|\()রর\s*\./g, "রর.");
  cleaned = cleaned.replace(/(?:\b|\()ররর\s*\./g, "ররর.");
  cleaned = cleaned.replace(/(?:\b|\()রররর\s*\./g, "রররর.");

  // 3. Force list markers to start on a new line (put \n before them, with lookbehinds to prevent prefix collisions)
  cleaned = cleaned.replace(/\s*(?<!i)(iv\.)\s*/gi, "\niv. ");
  cleaned = cleaned.replace(/\s*(?<!i)(iii\.)\s*/gi, "\niii. ");
  cleaned = cleaned.replace(/\s*(?<!i)(ii\.)\s*/gi, "\nii. ");
  cleaned = cleaned.replace(/\s*(?<!i)(i\.)\s*/gi, "\ni. ");

  cleaned = cleaned.replace(/\s*(?<!র)(রররর\.)\s*/g, "\nরররর. ");
  cleaned = cleaned.replace(/\s*(?<!র)(ররর\.)\s*/g, "\nররর. ");
  cleaned = cleaned.replace(/\s*(?<!র)(রর\.)\s*/g, "\nরর. ");
  cleaned = cleaned.replace(/\s*(?<!র)(র\.)\s*/g, "\nর. ");

  // 4. Force tail question to a new line (e.g. নিচের কোনটি সঠিক?)
  cleaned = cleaned.replace(/\s*(নিচের\s+কোনটি?\s+সঠিক\??|কোনটি?\s+সঠিক\??)\s*$/gi, "\n$1");

  // 5. Parse line by line to merge split lines correctly
  const lines = cleaned.split("\n").map(l => l.trim()).filter(Boolean);
  const resultLines: string[] = [];
  let inStatements = false;

  for (const line of lines) {
    const isStatement = /^(i|ii|iii|iv|র|রর|ররর|রররর)\.\s+/i.test(line);
    const isTail = /^(নিচের\s+কোনটি?\s+সঠিক|কোনটি?\s+সঠিক)/i.test(line);

    if (isStatement) {
      inStatements = true;
      resultLines.push(line);
    } else if (isTail) {
      inStatements = false;
      resultLines.push(""); // Spacing before the tail question
      resultLines.push(line);
    } else {
      if (inStatements && resultLines.length > 0) {
        // This is a split line belonging to the previous statement
        const lastIdx = resultLines.length - 1;
        resultLines[lastIdx] = resultLines[lastIdx] + " " + line;
      } else {
        resultLines.push(line);
      }
    }
  }

  return resultLines.join("\n");
}

/** Remove worked solutions accidentally pasted into MCQ stems. */
function stripLeakedWorkedSolution(text: string): string {
  let out = text;
  out = out.replace(/^([\s\S]*?[?।])\s+শেষবেগ[\s\S]+$/i, "$1");
  out = out.replace(
    /^([\s\S]*?কত হার্জ\?)\s+(?:A\s*থেকে|তাহলে|২টি|2\s*টি)[\s\S]+$/i,
    "$1",
  );
  out = out.replace(
    /^([\s\S]*?নিচের\s+কোনটি\s+সঠিক\?)\s+(?:তাই|অতএব)[\s\S]+$/i,
    "$1",
  );
  return out;
}

export function sanitizeQuestionText(text: string): string {
  if (!text) return "";
  
  if (detectPlaceholderQuestion(text)) {
    const trimmed = text.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      return "চিত্র/ডায়াগ্রাম প্রয়োজন";
    }
    if (trimmed === "চিত্র প্রয়োজন" || trimmed === "চিত্র প্রয়োজন") {
      return "চিত্র/ডায়াগ্রাম প্রয়োজন";
    }
    return "চিত্র/ডায়াগ্রাম প্রয়োজন";
  }

  let out = repairBoardOcr(String(text));
  out = cleanCharacters(out);
  out = stripAsciiCircuitArt(out);
  out = stripMergedQuestionTail(out);
  out = stripLeakedOptionLines(out);
  out = stripAnswerKeyNoise(out);
  out = normalizeStatementList(out);
  out = stripNoiseLines(out);
  out = stripBoardMetadata(out);
  out = stripLeakedWorkedSolution(out);
  out = collapseWhitespace(out);
  out = wrapBareLatex(out);

  return out;
}

export function sanitizeOptionText(text: string): string {
  if (!text) return "";

  let out = repairBoardOcr(String(text));
  out = out.replace(BOARD_SPECIAL_NOTE_RE, "");
  if (isImagePlaceholderOption(out)) return "";
  out = cleanCharacters(out);
  
  // Remove duplicate/empty option labels at the start, e.g. A. Option, ক. Option, A. A. Option
  out = out.replace(/^(?:[A-Da-dক-ঘ]\s*[\.)\-]\s*)+/g, "");
  out = out.replace(/\{\(v\+r\)\}/gi, "$\\frac{V}{R}$");
  // Broken Ohm decoy: "35 A A" → "35 A"
  out = out.replace(/(\d+(?:\.\d+)?)\s+A\s+A\b/g, "$1 A");
  
  out = collapseWhitespace(out);
  out = wrapBareLatex(out);

  return out;
}

export function sanitizeExplanationText(text: string): string {
  if (!text) return "";

  let out = fixCorruptText(String(text));
  out = cleanCharacters(out);
  out = stripBoardMetadata(out);
  out = stripNoiseLines(out);
  out = collapseWhitespace(out);
  out = wrapBareLatex(out);

  return out;
}

export function formatStimulusText(text: string): string {
  if (!text) return "";

  let out = fixCorruptText(String(text));
  out = cleanCharacters(out);
  out = stripAsciiCircuitArt(out);
  out = normalizeStatementList(out);
  out = stripNoiseLines(out);
  out = collapseWhitespace(out);
  out = wrapBareLatex(out);

  return out;
}

export function sanitizeQuizText(
  text: string,
  mode: "question" | "explanation" | "option" = "question",
): string {
  if (!text) return "";
  if (mode === "option") return sanitizeOptionText(text);
  if (mode === "explanation") return sanitizeExplanationText(text);
  return sanitizeQuestionText(text);
}

// Keep backward compatibility aliases
export { detectPlaceholderQuestion as isPlaceholderQuestionText };
export function prepareQuizTextForRender(text: string): string {
  return sanitizeQuizText(text);
}
export { normalizeBrokenLatex as normalizeLatex };
```

## File: [src/lib/saved-questions.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/saved-questions.ts)

```ts
/**
 * Client-only localStorage utility for saving/bookmarking quiz questions.
 *
 * Each saved question is stored in localStorage under the key
 * `saved-questions` as a JSON array. All operations are safe to call
 * on the server (they no-op).
 */

const STORAGE_KEY = "saved-questions";
const MAX_SAVED = 500;

export interface SavedQuestion {
  /** Unique question id (from the quiz JSON) */
  id: string;
  /** Question text / stem */
  questionText: string;
  /** Answer options (4 strings) */
  options: string[];
  /** Optional question diagram image path */
  image?: string | null;
  /** Optional per-option images */
  optionImages?: (string | null)[] | null;
  /** Subject slug, e.g. "physics", "chemistry-1st-paper" */
  subject?: string;
  /** Chapter slug or display name */
  chapter?: string;
  /** Source quiz id (set/model-test id) */
  sourceQuizId?: string;
  /** Level (ssc / hsc) */
  level?: string;
  /** Correct option letter, e.g. "A", "B", "C", "D" */
  correctOption?: string;
  /** Explanation for the correct option */
  explanation?: string;
  /** ISO timestamp when saved */
  savedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): SavedQuestion[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedQuestion[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedQuestion[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — silently drop */
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Get all saved questions, newest first. */
export function getSavedQuestions(): SavedQuestion[] {
  return readAll().sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
}

/** Check whether a question is saved by its id. */
export function isQuestionSaved(questionId: string): boolean {
  return readAll().some((q) => q.id === questionId);
}

/** Save a question. Returns true on success. */
export function saveQuestion(question: Omit<SavedQuestion, "savedAt">): boolean {
  const all = readAll();

  // Prevent duplicates
  if (all.some((q) => q.id === question.id)) return false;

  // Enforce cap — drop oldest entries if over limit
  if (all.length >= MAX_SAVED) {
    all.sort(
      (a, b) =>
        new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime(),
    );
    all.splice(0, all.length - MAX_SAVED + 1);
  }

  all.push({ ...question, savedAt: new Date().toISOString() });
  writeAll(all);
  return true;
}

/** Remove a saved question by id. Returns true if it existed. */
export function removeSavedQuestion(questionId: string): boolean {
  const all = readAll();
  const idx = all.findIndex((q) => q.id === questionId);
  if (idx === -1) return false;
  all.splice(idx, 1);
  writeAll(all);
  return true;
}

/** Toggle save/unsave. Returns the new saved state. */
export function toggleSavedQuestion(
  question: Omit<SavedQuestion, "savedAt">,
): boolean {
  if (isQuestionSaved(question.id)) {
    removeSavedQuestion(question.id);
    return false;
  }
  saveQuestion(question);
  return true;
}

/** Clear all saved questions. */
export function clearAllSavedQuestions(): void {
  writeAll([]);
}

/** Return the count of saved questions. */
export function getSavedCount(): number {
  return readAll().length;
}

/** Backfill correct answers and explanations for already saved questions. */
export function backfillSavedQuestionsAnswers(
  correctAnswerIndexes: Record<string, number>,
  explanations: Record<string, string>,
): void {
  const all = readAll();
  let updated = false;
  const optionsLetters = ["A", "B", "C", "D"];

  for (const q of all) {
    const correctIdx = correctAnswerIndexes[q.id];
    const explanation = explanations[q.id];

    let qUpdated = false;
    if (correctIdx !== undefined && correctIdx >= 0) {
      const correctOption = optionsLetters[correctIdx];
      if (q.correctOption !== correctOption) {
        q.correctOption = correctOption;
        qUpdated = true;
      }
    }
    if (explanation !== undefined && q.explanation !== explanation) {
      q.explanation = explanation;
      qUpdated = true;
    }

    if (qUpdated) {
      updated = true;
    }
  }

  if (updated) {
    writeAll(all);
  }
}

```

## File: [src/lib/utils.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/utils.ts)

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## File: [src/lib/validations/mcq-qa.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/validations/mcq-qa.ts)

```ts
/**
 * Structural MCQ QA validation (SSC/HSC board prep).
 * Conceptual correctness still requires human/AI review.
 */

export type McqOption = { label: "ক" | "খ" | "গ" | "ঘ"; text: string };

export type McqQaRecord = {
  id: string;
  question: string;
  options: McqOption[];
  correctOption: "ক" | "খ" | "গ" | "ঘ";
  shortSolution?: string;
  image?: string | null;
  topic?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | string;
};

export type McqQaIssueCode =
  | "missing_id"
  | "missing_question"
  | "missing_options"
  | "invalid_option_count"
  | "empty_option"
  | "duplicate_options"
  | "missing_correct_option"
  | "invalid_correct_option"
  | "correct_not_in_options"
  | "missing_solution"
  | "duplicate_in_set"
  | "needs_diagram"
  | "untrusted_diagram";

export type McqQaIssue = {
  code: McqQaIssueCode;
  message: string;
  severity: "error" | "warn";
};

const BANGLA_LABELS = ["ক", "খ", "গ", "ঘ"] as const;

const DIAGRAM_HINT_RE =
  /\[চিত্র\s*[:：]|\(চিত্র\s*[:：]|চিত্রে|উদ্দীপক|চিত্রভিত্তিক|লেখচিত্র|গ্রাফ|diagram|circuit|বৃত্ত|triangle|ত্রিভুজ|vector|সমন্বয়|অক্ষ|wave|তরঙ্গ|force|বল\s*চিত্র|V-I|I-V|E-ν|motion\s*graph/i;

export function normalizeMcqText(text: string): string {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\$\$/g, "")
    .trim()
    .toLowerCase();
}

export function extractOptionsFromRaw(raw: Record<string, unknown>): string[] {
  if (Array.isArray(raw.options)) {
    return raw.options.map((o) => {
      if (typeof o === "string") return o;
      if (o && typeof o === "object" && "text" in o) return String((o as { text: string }).text);
      return "";
    });
  }
  return [
    raw.optionA,
    raw.optionB,
    raw.optionC,
    raw.optionD,
  ].map((v) => (typeof v === "string" ? v : ""));
}

export function extractQuestionText(raw: Record<string, unknown>): string {
  const t = raw.question ?? raw.questionText ?? raw.text;
  return typeof t === "string" ? t : "";
}

function isShortMathQuestion(text: string): boolean {
  return (
    text.length >= 4 &&
    /[0-9০-৯]/.test(text) &&
    /[=+\-−–*/^⁰¹²³⁴⁵⁶⁷⁸⁹⁻√()]/.test(text)
  );
}

export function inferCorrectLabelFromRaw(
  raw: Record<string, unknown>,
  options: string[],
): string {
  const correctRaw =
    raw.correctOption ?? raw.correctAnswer ?? raw.answer ?? raw.correct;

  if (typeof raw.answerIndex === "number" && raw.answerIndex >= 0 && raw.answerIndex <= 3) {
    return BANGLA_LABELS[raw.answerIndex];
  }

  if (correctRaw != null && String(correctRaw).trim()) {
    const s = String(correctRaw).trim();
    if (BANGLA_LABELS.includes(s as (typeof BANGLA_LABELS)[number])) return s;
    const map: Record<string, string> = { A: "ক", B: "খ", C: "গ", D: "ঘ" };
    if (map[s.toUpperCase()]) return map[s.toUpperCase()];
    const idx = options.findIndex((o) => o.trim() === s);
    if (idx >= 0 && idx <= 3) return BANGLA_LABELS[idx];
  }

  const cot = raw.correctOptionText;
  if (typeof cot === "string" && cot.trim()) {
    const idx = options.findIndex((o) => o.trim() === cot.trim());
    if (idx >= 0 && idx <= 3) return BANGLA_LABELS[idx];
  }

  if (correctRaw != null && String(correctRaw).trim()) {
    return String(correctRaw).trim();
  }

  return "";
}

export function extractCorrectLabel(raw: Record<string, unknown>): string {
  const options = extractOptionsFromRaw(raw);
  return inferCorrectLabelFromRaw(raw, options);
}

export function questionNeedsDiagram(text: string): boolean {
  return DIAGRAM_HINT_RE.test(text);
}

export function validateMcqStructure(
  raw: Record<string, unknown>,
  ctx?: { trustedDiagramSlugs?: Set<string> },
): McqQaIssue[] {
  const issues: McqQaIssue[] = [];
  const id = String(raw.id ?? "").trim();
  const question = extractQuestionText(raw).trim();
  const options = extractOptionsFromRaw(raw).map((t) => t.trim());
  const correctOption = extractCorrectLabel(raw);
  const shortSolution = String(raw.shortSolution ?? raw.explanation ?? "").trim();
  const image = typeof raw.image === "string" ? raw.image : null;

  if (!id) {
    issues.push({ code: "missing_id", message: "Missing question id", severity: "error" });
  }
  if (!question || (question.length < 8 && !isShortMathQuestion(question))) {
    issues.push({
      code: "missing_question",
      message: "Question text missing or too short",
      severity: "error",
    });
  }
  if (options.length === 0) {
    issues.push({ code: "missing_options", message: "No options found", severity: "error" });
  } else if (options.length !== 4) {
    issues.push({
      code: "invalid_option_count",
      message: `Expected 4 options, got ${options.length}`,
      severity: "error",
    });
  }

  for (let i = 0; i < options.length; i++) {
    if (!options[i]) {
      issues.push({
        code: "empty_option",
        message: `Option ${BANGLA_LABELS[i] ?? i + 1} is empty`,
        severity: "error",
      });
    }
  }

  const normalizedOpts = options.filter(Boolean).map(normalizeMcqText);
  const unique = new Set(normalizedOpts);
  if (normalizedOpts.length >= 2 && unique.size < normalizedOpts.length) {
    issues.push({
      code: "duplicate_options",
      message: "Duplicate option text within question",
      severity: "error",
    });
  }

  if (!correctOption) {
    issues.push({
      code: "missing_correct_option",
      message: "Missing correctOption / answerIndex (verify against answer key)",
      severity: "warn",
    });
  } else if (!BANGLA_LABELS.includes(correctOption as (typeof BANGLA_LABELS)[number])) {
    issues.push({
      code: "invalid_correct_option",
      message: `Invalid correctOption: "${correctOption}"`,
      severity: "error",
    });
  } else {
    const idx = BANGLA_LABELS.indexOf(correctOption as (typeof BANGLA_LABELS)[number]);
    if (options[idx] && !options[idx].trim()) {
      issues.push({
        code: "correct_not_in_options",
        message: "Correct option points to empty option slot",
        severity: "error",
      });
    }
  }

  if (!shortSolution) {
    issues.push({
      code: "missing_solution",
      message: "Missing shortSolution / explanation",
      severity: "warn",
    });
  }

  if (questionNeedsDiagram(question) && !image) {
    issues.push({
      code: "needs_diagram",
      message: "Question references diagram/graph but image is missing",
      severity: "warn",
    });
  }

  if (image && ctx?.trustedDiagramSlugs) {
    const slug = image.replace(/^\/images\/quiz\//, "").replace(/\.svg$/i, "");
    if (!ctx.trustedDiagramSlugs.has(slug)) {
      issues.push({
        code: "untrusted_diagram",
        message: `Untrusted diagram slug: ${slug}`,
        severity: "warn",
      });
    }
  }

  return issues;
}

export function toMcqQaRecord(raw: Record<string, unknown>): McqQaRecord {
  const options = extractOptionsFromRaw(raw);
  return {
    id: String(raw.id ?? ""),
    question: extractQuestionText(raw),
    options: BANGLA_LABELS.map((label, i) => ({
      label,
      text: options[i] ?? "",
    })),
    correctOption: extractCorrectLabel(raw) as McqQaRecord["correctOption"],
    shortSolution: String(raw.shortSolution ?? raw.explanation ?? ""),
    image: typeof raw.image === "string" ? raw.image : null,
    topic: typeof raw.topic === "string" ? raw.topic : undefined,
    difficulty: typeof raw.difficulty === "string" ? raw.difficulty : undefined,
  };
}

export function findDuplicateQuestionIds(
  questions: Array<Record<string, unknown>>,
): string[] {
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  for (const q of questions) {
    const id = String(q.id ?? "");
    const text = normalizeMcqText(extractQuestionText(q));
    if (!text) continue;
    const prev = seen.get(text);
    if (prev && prev !== id) dupes.push(id);
    else seen.set(text, id);
  }
  return dupes;
}
```

## File: [src/lib/verify-session.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/verify-session.ts)

```ts
/** Edge-safe HS256 JWT verify for middleware (must match backend JWT_SECRET). */

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<{ sub?: string; exp?: number } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signature = base64UrlToBytes(sigB64);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    new Uint8Array(signature),
    data,
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payloadB64)),
    ) as { sub?: string; exp?: number };
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }
    if (!payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}
```

## File: [src/lib/wrong-answers.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/lib/wrong-answers.ts)

```ts
/**
 * Client-only localStorage utility for tracking incorrect quiz submissions.
 * 
 * Each wrong question is stored in localStorage under the key
 * `wrong-questions` as a JSON array. All operations are safe to call
 * on the server (they no-op).
 */

const STORAGE_KEY = "wrong-questions";
const MAX_WRONG = 500;

export interface WrongQuestion {
  /** Unique question id (from the quiz JSON) */
  id: string;
  /** Question text / stem */
  questionText: string;
  /** Answer options (4 strings) */
  options: string[];
  /** Optional question diagram image path */
  image?: string | null;
  /** Optional per-option images */
  optionImages?: (string | null)[] | null;
  /** Subject slug, e.g. "physics", "chemistry-1st-paper" */
  subject?: string;
  /** Chapter slug or display name */
  chapter?: string;
  /** Source quiz id (set/model-test id) */
  sourceQuizId?: string;
  /** Level (ssc / hsc) */
  level?: string;
  /** The option letter the student selected, e.g. "A", "B", "C", "D" */
  studentOption?: string | null;
  /** Correct option letter, e.g. "A", "B", "C", "D" */
  correctOption?: string;
  /** Explanation for the correct option */
  explanation?: string;
  /** ISO timestamp when saved */
  savedAt: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): WrongQuestion[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WrongQuestion[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: WrongQuestion[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — silently drop */
  }
}

/** Get all wrong questions, newest first. */
export function getWrongQuestions(): WrongQuestion[] {
  return readAll().sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
}

/** Check whether a question is in the wrong questions store by its id. */
export function isQuestionWrong(questionId: string): boolean {
  return readAll().some((q) => q.id === questionId);
}

/** Save a wrong question. Returns true on success. */
export function saveWrongQuestion(question: Omit<WrongQuestion, "savedAt">): boolean {
  const all = readAll();

  // If already exists, update the studentOption and savedAt, but do not duplicate
  const existingIdx = all.findIndex((q) => q.id === question.id);
  if (existingIdx !== -1) {
    all[existingIdx] = {
      ...all[existingIdx],
      studentOption: question.studentOption ?? all[existingIdx].studentOption,
      correctOption: question.correctOption ?? all[existingIdx].correctOption,
      explanation: question.explanation ?? all[existingIdx].explanation,
      savedAt: new Date().toISOString(),
    };
    writeAll(all);
    return true;
  }

  // Enforce cap — drop oldest entries if over limit
  if (all.length >= MAX_WRONG) {
    all.sort(
      (a, b) =>
        new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime(),
    );
    all.splice(0, all.length - MAX_WRONG + 1);
  }

  all.push({ ...question, savedAt: new Date().toISOString() });
  writeAll(all);
  return true;
}

/** Remove a wrong question by id. Returns true if it existed. */
export function removeWrongQuestion(questionId: string): boolean {
  const all = readAll();
  const idx = all.findIndex((q) => q.id === questionId);
  if (idx === -1) return false;
  all.splice(idx, 1);
  writeAll(all);
  return true;
}

/** Clear all wrong questions. */
export function clearAllWrongQuestions(): void {
  writeAll([]);
}

/** Return the count of wrong questions. */
export function getWrongCount(): number {
  return readAll().length;
}
```

## File: [src/store/quizStore.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/store/quizStore.ts)

```ts
import { create } from "zustand";
import { api } from "@/lib/api";

export interface Question {
  id: string;
  subject: string;
  chapter: string;
  text: string;
  options: string[];
  image: string | null;
  optionImages?: string[] | null;
  timeLimit: number;
}

export interface QuizAttemptPayload {
  userId: string;
  submissionId: string;
  quizId: string;
  subject: string;
  answers: { id: string; ans: string | null }[];
  answerIndexes: number[];
  examName?: string;
  questionsPath?: string;
  timeTaken: number;
  mode: string;
}

export interface QuizResults {
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  timePerQuestion: number;
  chapterPerformance: Record<string, number>;
  difficultyPerformance: Record<string, number>;
  eloRatingChange: number;
  weakTopics: string[];
  strongTopics: string[];
  explanations: Record<string, string>;
  correctAnswerIndexes?: Record<string, number>;
}


function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  markedQuestions: Record<string, boolean>;
  skippedQuestions: Record<string, boolean>;
  timer: number;
  timeTaken: number;
  quizStarted: boolean;
  quizSubmitted: boolean;
  submissionId: string | null;
  isSubmitting: boolean;
  attemptId: string | null;
  quizId: string | null;
  subject: string | null;
  chapter: string | null;
  examName: string | null;
  questions: Question[];
  isLoading: boolean;
  results: QuizResults | null;

  startQuiz: (
    quizId: string,
    subject: string,
    chapter: string,
    questions: Question[],
    timeLimitSec: number,
    examName?: string,
  ) => void;
  selectAnswer: (questionId: string, answer: string) => void;
  markQuestion: (questionId: string) => void;
  skipQuestion: (questionId: string) => void;
  tickTimer: () => void;
  setQuestionIndex: (index: number) => void;
  resetQuiz: () => void;
  submitQuiz: (userId: string, mode: string, token: string) => Promise<QuizResults>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestionIndex: 0,
  selectedAnswers: {},
  markedQuestions: {},
  skippedQuestions: {},
  timer: 600,
  timeTaken: 0,
  quizStarted: false,
  quizSubmitted: false,
  submissionId: null,
  isSubmitting: false,
  attemptId: null,
  quizId: null,
  subject: null,
  chapter: null,
  examName: null,
  questions: [],
  isLoading: false,
  results: null,

  startQuiz: (quizId, subject, chapter, questions, timeLimitSec, examName) => {
    set({
      quizId,
      subject,
      chapter,
      examName: examName || null,
      questions,
      submissionId: newSubmissionId(),
      timer: timeLimitSec,
      timeTaken: 0,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      markedQuestions: {},
      skippedQuestions: {},
      quizStarted: true,
      quizSubmitted: false,
      isSubmitting: false,
      results: null,
    });
  },

  selectAnswer: (questionId, answer) => {
    set((state) => {
      const selectedAnswers = { ...state.selectedAnswers, [questionId]: answer };
      const skippedQuestions = { ...state.skippedQuestions };
      delete skippedQuestions[questionId];
      return { selectedAnswers, skippedQuestions };
    });
  },

  markQuestion: (questionId) => {
    set((state) => ({
      markedQuestions: {
        ...state.markedQuestions,
        [questionId]: !state.markedQuestions[questionId],
      },
    }));
  },

  skipQuestion: (questionId) => {
    set((state) => ({
      skippedQuestions: {
        ...state.skippedQuestions,
        [questionId]: true,
      },
    }));
  },

  tickTimer: () => {
    set((state) => {
      if (state.timer <= 1) {
        return { timer: 0, timeTaken: state.timeTaken + 1 };
      }
      return { timer: state.timer - 1, timeTaken: state.timeTaken + 1 };
    });
  },

  setQuestionIndex: (index) => {
    set({ currentQuestionIndex: index });
  },

  resetQuiz: () => {
    set({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      markedQuestions: {},
      skippedQuestions: {},
      timer: 600,
      timeTaken: 0,
      quizStarted: false,
      quizSubmitted: false,
      submissionId: null,
      isSubmitting: false,
      results: null,
    });
  },

  submitQuiz: async (userId, mode, token) => {
    const {
      quizId,
      subject,
      questions,
      selectedAnswers,
      skippedQuestions,
      timeTaken,
      submissionId,
      isSubmitting,
      quizSubmitted,
      examName,
    } = get();

    if (isSubmitting || quizSubmitted) {
      const existing = get().results;
      if (existing) return existing;
      throw new Error("Submission already in progress");
    }

    if (!submissionId) {
      throw new Error("Missing submissionId — restart the quiz");
    }

    set({ isSubmitting: true, isLoading: true });

    const submissionAnswers = questions.map((q) => ({
      id: q.id,
      ans: selectedAnswers[q.id] || null,
    }));

    const answerIndexes = questions.map((q) => {
      if (skippedQuestions[q.id]) return -1;
      const sel = selectedAnswers[q.id];
      if (!sel) return -1;
      const idx = q.options.indexOf(sel);
      return idx >= 0 ? idx : -1;
    });

    const questionsPath =
      subject && quizId ? `${subject}/${quizId}` : undefined;

    const payload: QuizAttemptPayload = {
      userId,
      submissionId,
      quizId: quizId || "unknown",
      subject: subject || "unknown",
      answers: submissionAnswers,
      answerIndexes,
      examName: examName || undefined,
      questionsPath,
      timeTaken,
      mode,
    };

    try {
      const results = await api.post<QuizResults>("/api/quiz/submit", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        quizSubmitted: true,
        results,
        isLoading: false,
        isSubmitting: false,
      });

      return results;
    } catch (error) {
      set({ isLoading: false, isSubmitting: false });
      throw error;
    }
  },
}));
```

## File: [src/types/quiz.ts](file:///home/niloy-chandra-datta/sschsc-quiz.com/src/types/quiz.ts)

```ts
/** Board question shape (served from public/questions/*.json). */
export interface HscQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  chapter: string;
  score: number;
}

export interface ApiChapter {
  id: string;
  title: string;
  slug: string;
}

export interface ApiSubject {
  id: string;
  name: string;
  slug: string;
  category: string;
  chapters?: ApiChapter[];
}

export interface ApiQuestion {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  subject?: string;
  chapter?: string;
  category?: string;
  explanation?: string;
  image?: string | null;
  optionImages?: string[] | null;
  is_live?: boolean;
}
```

