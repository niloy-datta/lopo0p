import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Check } from "lucide-react";
import { levelHubPath } from "@/lib/quiz/unified-routes";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";

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
    <div className="mx-auto max-w-2xl px-4 py-4 font-bangla text-white sm:py-12">
      <MobilePageHeader
        eyebrow="১০০% ফ্রি"
        title="সব প্রস্তুতি ফ্রি!"
        description="বিজ্ঞান র্যাঙ্কার-এর কোনো সাবস্ক্রিপশন ফি নেই। সব ফিচার সবার জন্য সম্পূর্ণ ফ্রি।"
        icon={Sparkles}
        className="mb-5 sm:mb-8"
      />

      <Card variant="glass" className="space-y-5 border-cyan-500/20 bg-gradient-to-br from-[#07111F] via-[#0E1726] to-[#07111F] p-5 sm:space-y-6 sm:p-8">
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
