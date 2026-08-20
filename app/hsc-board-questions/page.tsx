import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { levelHubPath } from "@/lib/quiz/unified-routes";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";

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
    <div className="min-h-screen bg-[#07111F] px-1 py-3 font-bangla text-white sm:px-4 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-5 sm:space-y-8">
        <MobilePageHeader
          eyebrow="এইচএসসি বোর্ড প্রশ্ন"
          title="HSC বোর্ড প্রশ্ন ব্যাংক"
          description="বিগত বছরের বোর্ড প্রশ্নগুলো নিয়ে কুইজ দাও অথবা সরাসরি স্ক্যান করা প্রশ্ন ও সমাধান দেখে প্রস্তুতি নাও।"
          icon={BookOpen}
          tone="purple"
        />

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
          {subjects.map((subject) => {
            const label = SUBJECT_MAP[subject] || subject;
            const Icon = SUBJECT_ICONS[subject] || BookOpen;

            return (
              <Link key={subject} href={`/hsc-board-questions/${subject}`}>
                <Card
                  variant="glass"
                  hoverable
                  className="flex min-h-[76px] items-center justify-between border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-purple-500/30 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 sm:h-12 sm:w-12">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold leading-snug text-white sm:text-xl">
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

        <div className="pt-1 text-center sm:pt-4">
          <Link href={levelHubPath("hsc")} className="inline-flex min-h-11 items-center text-sm text-slate-400 underline hover:text-white">
            HSC হাব-এ ফিরে যাও
          </Link>
        </div>
      </div>
    </div>
  );
}
