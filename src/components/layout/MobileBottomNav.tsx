"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { normalizeLevel } from "@/lib/profile-utils";
import {
  resolveMobilePracticeHref,
  shouldShowMobileBottomNav,
} from "@/lib/layout/mobile-shell";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!shouldShowMobileBottomNav(pathname)) {
    return null;
  }

  const savedLevel = normalizeLevel(user?.className, user?.level);
  const practiceHref = resolveMobilePracticeHref(pathname, savedLevel);
  const navItems = [
    { href: "/", label: "হোম", icon: Home, active: pathname === "/" },
    {
      href: practiceHref,
      label: "প্র্যাকটিস",
      icon: BookOpen,
      active: pathname.startsWith("/ssc") || pathname.startsWith("/hsc"),
    },
    {
      href: "/leaderboard",
      label: "র‍্যাঙ্ক",
      icon: Trophy,
      active: pathname.startsWith("/leaderboard"),
    },
    {
      href: "/profile",
      label: "প্রোফাইল",
      icon: User,
      active: pathname === "/profile" || pathname === "/dashboard",
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cyan-300/15 bg-[#06101d]/95 shadow-[0_-12px_32px_rgba(2,8,23,0.55)] backdrop-blur-xl pb-safe lg:hidden"
      aria-label="মোবাইল নেভিগেশন"
    >
      <div className="mx-auto grid min-h-16 max-w-lg grid-cols-4 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 font-bangla transition-colors active:scale-95",
                item.active
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-400 hover:text-slate-200",
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="text-[11px] font-bold leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
