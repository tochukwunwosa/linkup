"use client";

import React from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { cn } from "@/lib/utils";

type AnimatedCardProps = {
  children: React.ReactNode;
  className?: string;
  animationClass?: string;
  delay?: number; // in milliseconds (ms)
};

export default function AnimatedCard({
  children,
  className,
  animationClass = "animate-fadeInUp",
  delay = 0,
}: AnimatedCardProps) {
  const { ref, inView } = useInViewAnimation<HTMLDivElement>();

  // If the user prefers reduced motion, skip the IntersectionObserver animation
  // entirely and render children immediately at full opacity.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "opacity-0 translate-y-10 transition-opacity duration-500 ease-out",
        inView && animationClass,
        className
      )}
    >
      {children}
    </div>
  );
}
