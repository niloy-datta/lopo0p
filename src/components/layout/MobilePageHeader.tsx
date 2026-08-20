import React from "react";
import { cn } from "@/lib/utils";

type MobilePageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  tone?: "cyan" | "purple" | "gold";
  className?: string;
};

const toneClasses = {
  cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  purple: "border-purple-300/20 bg-purple-300/10 text-purple-200",
  gold: "border-amber-300/20 bg-amber-300/10 text-amber-200",
};

export function MobilePageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = "cyan",
  className,
}: MobilePageHeaderProps) {
  return (
    <header className={cn("text-left sm:text-center", className)}>
      <div
        className={cn(
          "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-xs font-black",
          toneClasses[tone],
        )}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden />}
        {eyebrow}
      </div>
      <h1 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400 sm:mx-auto sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
