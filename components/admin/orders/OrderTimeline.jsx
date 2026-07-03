const timelineSteps = ["Pending", "Paid", "Processing", "Shipped", "Delivered"];

export default function OrderTimeline({ status = "Pending" }) {
  const currentIndex = timelineSteps.findIndex((item) => item === status);

  return (
    <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Order Timeline</h3>
      <ol className="mt-4 space-y-3">
        {timelineSteps.map((step, index) => {
          const completed = index <= currentIndex;

          return (
            <li key={step} className="flex items-center gap-3">
              <span className={`size-3 rounded-full ${completed ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-700"}`} />
              <span className={completed ? "text-stone-900 dark:text-stone-100" : "text-stone-500 dark:text-stone-400"}>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
