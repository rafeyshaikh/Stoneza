import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PageHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-stone-300/60 bg-stone-50/80 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
        {description ? <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p> : null}
      </div>
      {actionLabel ? <Link href={onAction ? onAction : "#"} className="px-2 py-1 border cursor-pointer rounded-md hover:bg-stone-200 dark:hover:bg-stone-800">
        <Button className="cursor-pointer">{actionLabel}</Button>
      </Link> : null}
    </div>
  );
}
