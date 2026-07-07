const statusClassMap = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Processing: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function EnquiryStatusBadge({ status = "Pending" }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClassMap[status] || statusClassMap.Pending}`}>
      {status}
    </span>
  );
}
