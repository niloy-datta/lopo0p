"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Flame,
  GraduationCap,
  ListChecks,
  Play,
  RotateCcw,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  buildMissionViewModel,
  type HomeMissionDashboard,
} from "@/lib/home/mission";
import { normalizeLevel } from "@/lib/profile-utils";
import type { RouteLevel } from "@/lib/quiz/unified-routes";
import { cn } from "@/lib/utils";

export function MissionCard() {
  const { user } = useAuth();
  const [level, setLevel] = useState<RouteLevel>("ssc");
  const [dashboard, setDashboard] = useState<HomeMissionDashboard | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLevel = normalizeLevel(user?.className, user?.level);
    if (savedLevel) setLevel(savedLevel);
  }, [user?.className, user?.level]);

  useEffect(() => {
    if (!user) {
      setDashboard(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api
      .get<HomeMissionDashboard>("/api/student/dashboard")
      .then((data) => {
        if (!cancelled) setDashboard(data);
      })
      .catch(() => {
        if (!cancelled) setDashboard(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const mission = useMemo(
    () => buildMissionViewModel({ level, user, dashboard }),
    [dashboard, level, user],
  );

  return (
    <div className="space-y-3 font-bangla">
      <h1 className="sr-only">
        ৫ মিনিট practice, দুর্বল chapter retake এবং science rank
      </h1>

      <div
        className="grid min-h-12 grid-cols-2 rounded-2xl border border-white/10 bg-slate-950/65 p-1"
        aria-label="শিক্ষার স্তর"
      >
        {(["ssc", "hsc"] as const).map((item) => {
          const selected = level === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-black uppercase transition",
                selected
                  ? "border border-cyan-300/45 bg-cyan-400/10 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                  : "text-slate-500 hover:text-slate-200",
              )}
              aria-pressed={selected}
            >
              <GraduationCap className="h-5 w-5" aria-hidden />
              {item}
            </button>
          );
        })}
      </div>

      <article className="overflow-hidden rounded-[1.65rem] border border-cyan-300/35 bg-[#081728]/95 shadow-[0_22px_70px_rgba(2,8,23,0.6)]">
        <div className="h-0.5 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400" />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex min-h-8 items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 text-xs font-black text-amber-300">
                <Zap className="h-4 w-4" aria-hidden />
                আজকের ৫ মিনিট মিশন
              </div>
              <p className="mt-3 text-xs font-bold text-slate-400">
                {mission.personalized ? "দুর্বল ফোকাস" : "আজকের ফোকাস"}
              </p>
              <h2 className="mt-0.5 text-xl font-black leading-tight text-white">
                {mission.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {loading ? "ফোকাস ঠিক করা হচ্ছে…" : mission.context}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <Target className="h-6 w-6" aria-hidden />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex min-h-14 items-center gap-2.5 rounded-2xl border border-white/10 bg-black/15 px-3">
              <ListChecks className="h-5 w-5 text-cyan-300" aria-hidden />
              <div>
                <p className="text-sm font-black text-white">১০টি MCQ</p>
                <p className="text-[11px] text-slate-500">বাছাইকৃত প্রশ্ন</p>
              </div>
            </div>
            <div className="flex min-h-14 items-center gap-2.5 rounded-2xl border border-white/10 bg-black/15 px-3">
              <Clock3 className="h-5 w-5 text-purple-300" aria-hidden />
              <div>
                <p className="text-sm font-black text-white">প্রায় ৫ মিনিট</p>
                <p className="text-[11px] text-slate-500">দ্রুত practice</p>
              </div>
            </div>
          </div>

          <Link
            href={mission.href}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 text-base font-black text-slate-950 shadow-[0_12px_30px_rgba(34,211,238,0.2)] transition hover:bg-cyan-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#081728]"
          >
            <Play className="h-5 w-5 fill-current" aria-hidden />
            মিশন শুরু করুন
          </Link>
        </div>
      </article>

      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-300" aria-hidden />
            <div>
              <p className="text-[11px] text-slate-500">৭ দিনের ধারাবাহিকতা</p>
              <p className="text-sm font-black text-white">
                {mission.streak > 0 ? mission.streak + " দিনের স্ট্রিক" : "আজ শুরু করুন"}
              </p>
            </div>
          </div>
          <Link
            href="/leaderboard"
            className="flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-xs font-black text-purple-200 hover:bg-purple-300/10"
          >
            <Trophy className="h-4 w-4" aria-hidden />
            {mission.rank ? "#" + mission.rank : "র‍্যাঙ্ক"}
          </Link>
        </div>
        <div className="mt-2.5 grid grid-cols-7 gap-1" aria-label="সাপ্তাহিক স্ট্রিক অগ্রগতি">
          {Array.from({ length: 7 }, (_, index) => {
            const complete = index < Math.min(mission.streak, 7);
            return complete ? (
              <CheckCircle2
                key={index}
                className="mx-auto h-6 w-6 text-cyan-300"
                aria-label="সম্পন্ন"
              />
            ) : (
              <Circle
                key={index}
                className="mx-auto h-6 w-6 text-slate-700"
                aria-label="বাকি"
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Link
          href={"/" + level + "/wrong-answers"}
          className="flex min-h-14 items-center gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.055] px-3.5 transition hover:border-cyan-300/35"
        >
          <RotateCcw className="h-5 w-5 text-cyan-300" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-white">ভুল উত্তর Retake</p>
            <p className="truncate text-[11px] text-slate-500">আগের ভুলগুলো আবার practice করুন</p>
          </div>
          <ChevronRight className="h-5 w-5 text-cyan-300" aria-hidden />
        </Link>
        <Link
          href="/leaderboard/college-wars"
          className="flex min-h-14 items-center gap-3 rounded-2xl border border-purple-300/15 bg-purple-300/[0.055] px-3.5 transition hover:border-purple-300/35"
        >
          <Swords className="h-5 w-5 text-purple-300" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-white">School/College Wars</p>
            <p className="truncate text-[11px] text-slate-500">প্রতিষ্ঠানের rank-এ অবদান রাখুন</p>
          </div>
          <ChevronRight className="h-5 w-5 text-purple-300" aria-hidden />
        </Link>
      </div>

      <Link
        href="#explore-subjects"
        className="flex min-h-11 items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-cyan-200"
      >
        <BookOpenCheck className="h-4 w-4" aria-hidden />
        অথবা অধ্যায় বেছে practice করুন
      </Link>
    </div>
  );
}
