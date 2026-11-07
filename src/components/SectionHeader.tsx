import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Voir tout",
  accent,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  accent?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink sm:text-2xl">
          {accent}
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-zaya transition-colors hover:text-zaya-600"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
