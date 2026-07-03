const bars = [32, 48, 44, 70, 68, 81, 76, 88, 79, 95, 90, 100];

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Revenue Trend</h3>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Last 12 months (visual placeholder)</p>
      <div className="mt-6 flex h-56 items-end gap-2">
        {bars.map((bar, idx) => (
          <div key={idx} className="group relative flex-1">
            <div
              style={{ height: `${bar}%` }}
              className="w-full rounded-t-lg bg-gradient-to-t from-stone-600 to-amber-300/80 transition-opacity group-hover:opacity-90 dark:from-stone-700 dark:to-amber-400/70"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
