import Link from "next/link";
import { categoryMeta } from "@/constants/category-meta";
import { getCategoryColors } from "@/lib/category-color";

// Curated top categories to display in the strip
const STRIP_SLUGS = [
  "ai-ml",
  "web-development",
  "web3",
  "startup",
  "fintech",
  "design-ux",
  "hackathon",
  "cybersecurity",
  "mobile-development",
  "cloud-devops",
  "data-science",
  "women-in-tech",
];

export function CategoryBrowseStrip() {
  const strips = STRIP_SLUGS.map((slug) =>
    categoryMeta.find((m) => m.slug === slug)
  ).filter(Boolean) as typeof categoryMeta;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-0.5 min-w-max">
          {strips.map((meta) => {
            const colors = getCategoryColors(meta.dbKeywords);
            return (
              <Link
                key={meta.slug}
                href={`/category/${meta.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all hover:shadow-sm hover:-translate-y-px"
                style={{
                  borderColor: `${colors.solid}30`,
                  color: colors.solid,
                  background: colors.overlay,
                }}
              >
                {meta.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
