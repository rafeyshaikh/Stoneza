import EnquiryStatusBadge from "@/components/admin/enquiries/EnquiryStatusBadge";

export default function EnquiriesTable({ enquiries = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <th className="pb-3 pr-3 font-medium">Name</th>
            <th className="pb-3 pr-3 font-medium">Number</th>
            <th className="pb-3 pr-3 font-medium">Total Area</th>
            <th className="pb-3 pr-3 font-medium">Project Type</th>
            <th className="pb-3 pr-3 font-medium">City/Site</th>
            <th className="pb-3 pr-3 font-medium">Stone Type</th>
            <th className="pb-3 pr-3 font-medium">Status</th>
            <th className="pb-3 text-right font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry._id} className="border-b border-stone-200/70 dark:border-stone-900">
              <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">#{String(enquiry._id).slice(-8)}</td>
              <td className="py-3 pr-3">{enquiry.customerName}</td>
              <td className="py-3 pr-3">{enquiry.customerNumber}</td>
              <td className="py-3 pr-3">{Number(enquiry.totalArea || 0).toLocaleString("en-IN")}</td>
              <td className="py-3 pr-3">{enquiry.projectType}</td>
              <td className="py-3 pr-3"><EnquiryStatusBadge status={enquiry.status} /></td>
              <td className="py-3 pr-3">{new Date(enquiry.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!enquiries.length ? <p className="py-8 text-center text-sm text-stone-500">No enquiries available.</p> : null}
    </div>
  );
}
