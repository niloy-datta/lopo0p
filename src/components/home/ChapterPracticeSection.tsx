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
  icon: React.ComponentType<{ className?: string }>;
  color: SubjectCardColor;
  href: string;
};

const subjects: SubjectCard[] = [
  {
    id: "physics",
    name: "পদার্থবিজ্ঞান",
    icon: Atom,
    color: "cyan",
    href: unifiedSubjectBasePath("hsc", "physics-1st-paper"),
  },
  {
    id: "chemistry",
    name: "রসায়ন",
    icon: FlaskConical,
    color: "purple",
    href: unifiedSubjectBasePath("hsc", "chemistry-1st-paper"),
  },
  {
    id: "biology",
    name: "জীববিজ্ঞান",
    icon: Dna,
    color: "green",
    href: unifiedSubjectBasePath("hsc", "biology-1st-paper"),
  },
  {
    id: "math",
    name: "উচ্চতর গণিত",
    icon: Calculator,
    color: "gold",
    href: unifiedSubjectBasePath("hsc", "higher-math-1st-paper"),
  },
  {
    id: "general-math",
    name: "সাধারণ গণিত",
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

              <p className="mb-4 text-sm text-slate-400">উপলভ্য অধ্যায় ও প্রশ্নসেট থেকে অনুশীলন করো।</p>

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
