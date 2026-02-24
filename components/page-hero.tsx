import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeroProps {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHero({
  backHref = "/",
  backLabel = "Back",
  eyebrow,
  title,
  subtitle,
  children,
}: PageHeroProps) {
  return (
    <div className="bg-[#070809] pt-14 pb-10 relative overflow-hidden">
      {/* Subtle grain */}
      <div className="hero-grain absolute inset-0 pointer-events-none" aria-hidden="true" />
      {/* Accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,102,204,0.4) 30%, #c9f72f 50%, rgba(107,70,193,0.4) 70%, transparent)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {backLabel}
        </Link>
        {(eyebrow || children) && (
          <div className="flex items-center gap-2 text-[#c9f72f] text-xs font-mono uppercase tracking-[0.12em] mb-3">
            {children}
            {eyebrow && <span>{eyebrow}</span>}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-white/50 text-base leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
