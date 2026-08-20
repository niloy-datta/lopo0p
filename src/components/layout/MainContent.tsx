"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { StudySidebar } from "@/components/layout/StudySidebar";
import { cn } from "@/lib/utils";
import {
  getMobileShellVariant,
  shouldShowStudySidebar,
} from "@/lib/layout/mobile-shell";

function SidebarFallback() {
  return <aside className="hidden w-[280px] shrink-0 lg:block" aria-hidden />;
}

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const variant = getMobileShellVariant(pathname);
  const showSidebar = shouldShowStudySidebar(pathname);
  const bottomPadding =
    variant === "default" || variant === "study" ? "pb-20 lg:pb-0" : "";
  const minimumHeight =
    variant === "quiz"
      ? "min-h-screen"
      : "min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-4.5rem)]";

  if (!showSidebar) {
    return (
      <div className={cn("relative", minimumHeight, bottomPadding)}>{children}</div>
    );
  }

  return (
    <div className={cn("relative bg-[#030712]", minimumHeight, bottomPadding)}>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_top_left,rgba(147,51,234,0.12),transparent_30%),linear-gradient(180deg,#020617,#020617)]" />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 px-3 py-3 sm:px-6 sm:py-4 lg:grid-cols-[280px_1fr] lg:gap-6 lg:px-8">
        <Suspense fallback={<SidebarFallback />}>
          <StudySidebar />
        </Suspense>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
