const statusClassMap = {
  new: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  contacted: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "in-progress": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  converted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  closed: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function EnquiryStatusBadge({ status = "new" }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClassMap[status] || statusClassMap.new}`}>
      {status}
    </span>
  );
}
