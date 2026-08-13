import React from "react";
import { cn } from "@/lib/utils";

type HomeSectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/80">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-2 text-sm leading-6 text-slate-400",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
