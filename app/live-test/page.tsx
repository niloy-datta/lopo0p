"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Radio, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApiError, api } from "@/lib/api";
import { fetchLiveTests, formatLiveDate, type LiveTest } from "@/lib/live-tests";

const labels = { active: "এখন চলছে", upcoming: "আসন্ন", ended: "শেষ হয়েছে" } as const;

export default function LiveTestPage() {
  const router = useRouter();
  const [events, setEvents] = useState<LiveTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLiveTests()
      .then(setEvents)
      .catch(() => setError("লাইভ টেস্টের সময়সূচি এখন লোড করা যাচ্ছে না।"))
      .finally(() => setLoading(false));
  }, []);

  const start = async (event: LiveTest) => {
    setStarting(event.id);
    setError("");
    try {
      await api.post(`/api/live-tests/${event.id}/start`);
      const separator = event.quizHref.includes("?") ? "&" : "?";
      router.push(`${event.quizHref}${separator}liveTest=${encodeURIComponent(event.id)}`);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/live-test")}`);
        return;
      }
      setError(reason instanceof Error ? reason.message : "টেস্ট শুরু করা যায়নি।");
    } finally {
      setStarting(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111F] px-4 py-10 pb-24 font-bangla text-white">
      <div className="mx-auto max-w-3xl space-y-7">
        <header className="text-center">
          <Badge variant="premium" className="mb-3 inline-flex items-center gap-2">
            <Radio className="h-4 w-4" /> নির্ধারিত লাইভ পরীক্ষা
          </Badge>
          <h1 className="text-3xl font-black md:text-4xl">লাইভ টেস্ট</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            প্রকাশিত সময়সূচিতে একবার অংশ নাও। স্কোর ও সময় অনুযায়ী ফলাফল তৈরি হবে।
          </p>
        </header>

        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {loading ? (
          <Card variant="glass" className="p-8 text-center text-slate-400">সময়সূচি লোড হচ্ছে…</Card>
        ) : events.length === 0 ? (
          <Card variant="glass" className="p-8 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-500" />
            <p className="font-bold">এখন কোনো প্রকাশিত লাইভ টেস্ট নেই</p>
            <p className="mt-1 text-sm text-slate-400">নতুন সময়সূচি প্রকাশ হলে এখানে দেখা যাবে।</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} variant="glass" className="p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant={event.state === "active" ? "premium" : "default"}>{labels[event.state]}</Badge>
                      <span className="text-xs uppercase text-slate-400">{event.level} · {event.subject}</span>
                    </div>
                    <h2 className="text-lg font-bold">{event.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatLiveDate(event.startsAt)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{event.durationMinutes} মিনিট</span>
                    </div>
                  </div>
                  {event.state === "active" ? (
                    <Button onClick={() => start(event)} disabled={starting === event.id} className="min-h-[44px]">
                      {starting === event.id ? "শুরু হচ্ছে…" : "টেস্ট শুরু করো"}
                    </Button>
                  ) : event.state === "ended" ? (
                    <Link href={`/live-test/${event.id}/leaderboard`}>
                      <Button variant="secondary" className="min-h-[44px]"><Trophy className="mr-2 h-4 w-4" />ফলাফল</Button>
                    </Link>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
