import { Button } from "@/components/ui/button";

export default function ReviewsTable({ reviews = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <table className="w-full min-w-[840px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <th className="pb-3 pr-3 font-medium">Product</th>
            <th className="pb-3 pr-3 font-medium">Customer</th>
            <th className="pb-3 pr-3 font-medium">Rating</th>
            <th className="pb-3 pr-3 font-medium">Status</th>
            <th className="pb-3 pr-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="border-b border-stone-200/70 dark:border-stone-900">
              <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">{review.productName}</td>
              <td className="py-3 pr-3">{review.customerName}</td>
              <td className="py-3 pr-3">{review.rating}/5</td>
              <td className="py-3 pr-3">{review.status}</td>
              <td className="py-3 pr-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Approve</Button>
                  <Button variant="destructive" size="sm">Reject</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!reviews.length ? <p className="py-8 text-center text-sm text-stone-500">No reviews pending moderation.</p> : null}
    </div>
  );
}
