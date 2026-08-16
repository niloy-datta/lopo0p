"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AdminEvent = {
  id: string;
  title: string;
  level: "ssc" | "hsc";
  subject: string;
  quizId: string;
  quizHref: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  status: "draft" | "published" | "cancelled";
  state: string;
};

const initial = {
  title: "",
  level: "ssc",
  subject: "physics",
  quizId: "",
  quizHref: "",
  startsAt: "",
  endsAt: "",
  durationMinutes: 30,
  status: "draft",
};

export default function AdminLiveTestsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get<AdminEvent[]>("/api/live-tests/admin/all").then(setEvents).catch((reason) => setError(reason instanceof Error ? reason.message : "লোড করা যায়নি"));
  useEffect(() => {
    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/api/live-tests/admin", {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      });
      setForm(initial);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "সংরক্ষণ করা যায়নি");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (event: AdminEvent, status: AdminEvent["status"]) => {
    setError("");
    try {
      await api.put(`/api/live-tests/admin/${event.id}`, {
        title: event.title,
        level: event.level,
        subject: event.subject,
        quizId: event.quizId,
        quizHref: event.quizHref,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        durationMinutes: event.durationMinutes,
        status,
      });
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Status বদলানো যায়নি");
    }
  };

  return (
    <main className="min-h-screen bg-[#07111F] px-4 py-10 font-bangla text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between"><h1 className="text-3xl font-black">লাইভ টেস্ট পরিচালনা</h1><Link href="/admin"><Button variant="secondary">Admin-এ ফিরুন</Button></Link></div>
        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">{error}</p>}
        <Card variant="glass" className="p-5">
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <input required minLength={3} placeholder="টেস্টের শিরোনাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 md:col-span-2" />
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3"><option value="ssc">SSC</option><option value="hsc">HSC</option></select>
            <input required placeholder="subject slug" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3" />
            <input required placeholder="quiz id" value={form.quizId} onChange={(e) => setForm({ ...form, quizId: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3" />
            <input required placeholder="quiz path, যেমন /quiz/..." value={form.quizHref} onChange={(e) => setForm({ ...form, quizHref: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3" />
            <label className="text-sm text-slate-400">শুরুর সময়<input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
            <label className="text-sm text-slate-400">শেষের সময়<input required type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
            <input required type="number" min={5} max={180} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-slate-950 p-3" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3"><option value="draft">Draft</option><option value="published">Publish</option><option value="cancelled">Cancelled</option></select>
            <Button type="submit" disabled={saving} className="md:col-span-2">{saving ? "সংরক্ষণ হচ্ছে…" : "লাইভ টেস্ট তৈরি করুন"}</Button>
          </form>
        </Card>
        <div className="space-y-3">{events.map((event) => <Card key={event.id} variant="glass" className="p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="font-bold">{event.title}</p><p className="text-xs text-slate-400">{new Date(event.startsAt).toLocaleString("bn-BD")} — {new Date(event.endsAt).toLocaleString("bn-BD")}</p><span className="text-sm text-cyan-300">{event.status} · {event.state}</span></div><div className="flex gap-2">{event.status !== "published" && <Button size="sm" onClick={() => updateStatus(event, "published")}>Publish</Button>}{event.status !== "cancelled" && <Button size="sm" variant="secondary" onClick={() => updateStatus(event, "cancelled")}>Cancel</Button>}</div></div></Card>)}</div>
      </div>
    </main>
  );
}
