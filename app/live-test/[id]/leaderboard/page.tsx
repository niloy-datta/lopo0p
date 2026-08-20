"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { LiveLeaderboardEntry, LiveTest } from "@/lib/live-tests";

export default function LiveTestLeaderboardPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{ event: LiveTest; entries: LiveLeaderboardEntry[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<{ event: LiveTest; entries: LiveLeaderboardEntry[] }>(`/api/live-tests/${id}/leaderboard`)
      .then(setData)
      .catch(() => setError("ফলাফল লোড করা যায়নি।"));
  }, [id]);

  return (
    <main className="min-h-screen bg-[#07111F] px-1 py-3 pb-24 font-bangla text-white sm:px-4 sm:py-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <header className="text-center">
          <Trophy className="mx-auto mb-2 h-10 w-10 text-amber-400" />
          <h1 className="text-3xl font-black">{data?.event.title || "লাইভ টেস্ট ফলাফল"}</h1>
        </header>
        {error ? <Card variant="glass" className="p-6 text-center text-red-300">{error}</Card> : !data ? (
          <Card variant="glass" className="p-6 text-center text-slate-400">ফলাফল লোড হচ্ছে…</Card>
        ) : data.entries.length === 0 ? (
          <Card variant="glass" className="p-6 text-center text-slate-400">এখনো কেউ টেস্ট জমা দেয়নি।</Card>
        ) : (
          <Card variant="glass" className="overflow-hidden">
            {data.entries.map((entry) => (
              <div key={entry.userId} className="flex items-center justify-between border-b border-white/10 p-4 last:border-0">
                <div><span className="mr-3 font-black text-amber-400">#{entry.rank}</span><span className="font-bold">{entry.name}</span><p className="ml-9 text-xs text-slate-500">{entry.collegeName || "প্রতিষ্ঠান দেওয়া নেই"}</p></div>
                <p className="text-right font-bold">{entry.score}/{entry.total}<span className="block text-xs font-normal text-slate-500">{entry.timeTaken} সেকেন্ড</span></p>
              </div>
            ))}
          </Card>
        )}
        <div className="text-center"><Link href="/live-test"><Button variant="secondary">সময়সূচিতে ফিরুন</Button></Link></div>
      </div>
    </main>
  );
}
