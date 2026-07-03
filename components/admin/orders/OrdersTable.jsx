import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";

export default function OrdersTable({ orders = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <th className="pb-3 pr-3 font-medium">Order</th>
            <th className="pb-3 pr-3 font-medium">Customer</th>
            <th className="pb-3 pr-3 font-medium">Payment</th>
            <th className="pb-3 pr-3 font-medium">Amount</th>
            <th className="pb-3 pr-3 font-medium">Status</th>
            <th className="pb-3 pr-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-stone-200/70 dark:border-stone-900">
              <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">#{String(order._id).slice(-8)}</td>
              <td className="py-3 pr-3">{order.customerName}</td>
              <td className="py-3 pr-3">{order.paymentMethod}</td>
              <td className="py-3 pr-3">INR {Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
              <td className="py-3 pr-3"><OrderStatusBadge status={order.status} /></td>
              <td className="py-3 pr-3">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!orders.length ? <p className="py-8 text-center text-sm text-stone-500">No orders available.</p> : null}
    </div>
  );
}
