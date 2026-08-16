import { api } from "@/lib/api";

export type LiveTestState = "upcoming" | "active" | "ended";

export interface LiveTest {
  id: string;
  title: string;
  level: "ssc" | "hsc";
  subject: string;
  quizId: string;
  quizHref: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  state: LiveTestState;
}

export interface LiveLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  collegeName: string;
  score: number;
  total: number;
  accuracy: number;
  timeTaken: number;
}

export const fetchLiveTests = () => api.get<LiveTest[]>("/api/live-tests");

export function formatLiveDate(value: string): string {
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
