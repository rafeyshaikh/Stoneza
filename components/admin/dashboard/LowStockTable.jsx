export default function LowStockTable({ products = [] }) {
  return (
    <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Low Stock Products</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[460px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <th className="pb-2 pr-3 font-medium">Product</th>
              <th className="pb-2 pr-3 font-medium">SKU</th>
              <th className="pb-2 pr-3 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-stone-200/80 dark:border-stone-900">
                <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">{product.name}</td>
                <td className="py-3 pr-3">{product.sku}</td>
                <td className="py-3 pr-3">
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    {product.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length ? <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">No low-stock products.</p> : null}
      </div>
    </div>
  );
}
