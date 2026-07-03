import { TrendingUp } from "lucide-react";

export default function StatsCard({ label, value, delta }) {
  return (
    <article className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-stone-900 dark:text-stone-100">{value}</p>
      {delta ? (
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="size-3" /> {delta}
        </p>
      ) : null}
    </article>
  );
}
