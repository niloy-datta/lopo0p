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
