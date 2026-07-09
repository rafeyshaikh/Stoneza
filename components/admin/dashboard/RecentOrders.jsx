import OrderStatusBadge from "@/components/admin/enquiries/EnquiryStatusBadge";

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Recent Orders</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <th className="pb-2 pr-3 font-medium">Order</th>
              <th className="pb-2 pr-3 font-medium">Customer</th>
              <th className="pb-2 pr-3 font-medium">Amount</th>
              <th className="pb-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-stone-200/80 dark:border-stone-900">
                <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">#{String(order._id).slice(-6)}</td>
                <td className="py-3 pr-3">{order.customerName}</td>
                <td className="py-3 pr-3">INR {Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                <td className="py-3 pr-3"><OrderStatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length ? <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">No recent orders yet.</p> : null}
      </div>
    </div>
  );
}
