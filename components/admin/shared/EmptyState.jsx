export default function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-6 text-center dark:border-stone-700 dark:bg-stone-900/60">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">{description}</p> : null}
    </div>
  );
}
