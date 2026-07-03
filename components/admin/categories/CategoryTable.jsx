export default function CategoryTable({ categories = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-300/70 bg-stone-50/80 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-300/70 text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <th className="pb-3 pr-3 font-medium">Category</th>
            <th className="pb-3 pr-3 font-medium">Parent</th>
            <th className="pb-3 pr-3 font-medium">Slug</th>
            <th className="pb-3 pr-3 font-medium">Featured</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="border-b border-stone-200/70 dark:border-stone-900">
              <td className="py-3 pr-3 text-stone-900 dark:text-stone-100">{category.name}</td>
              <td className="py-3 pr-3">{category.parentCategory?.name || "Root"}</td>
              <td className="py-3 pr-3">{category.slug}</td>
              <td className="py-3 pr-3">{category.isActive ? "Enabled" : "Disabled"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!categories.length ? <p className="py-8 text-center text-sm text-stone-500">No categories found.</p> : null}
    </div>
  );
}
