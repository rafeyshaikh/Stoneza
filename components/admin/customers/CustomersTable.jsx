export default function CustomersTable({ customers = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <th className="pb-3 pr-3 font-medium">Name</th>
            <th className="pb-3 pr-3 font-medium">Email</th>
            <th className="pb-3 pr-3 font-medium">Orders</th>
            <th className="pb-3 pr-3 font-medium">Total Spend</th>
            <th className="pb-3 pr-3 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="border-b border-stone-200/70 dark:border-stone-900">
              <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">{customer.name}</td>
              <td className="py-3 pr-3">{customer.email}</td>
              <td className="py-3 pr-3">{customer.orderCount || 0}</td>
              <td className="py-3 pr-3">INR {Number(customer.totalSpend || 0).toLocaleString("en-IN")}</td>
              <td className="py-3 pr-3">{new Date(customer.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!customers.length ? <p className="py-8 text-center text-sm text-stone-500">No customers available.</p> : null}
    </div>
  );
}
