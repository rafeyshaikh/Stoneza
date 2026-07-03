export default function RobotsEditor() {
  return (
    <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">Robots.txt Management</h3>
      <textarea
        className="mt-3 min-h-40 w-full rounded-xl border border-stone-300 bg-white/80 p-3 text-sm outline-none focus:ring-2 focus:ring-stone-400/40 dark:border-stone-700 dark:bg-stone-900/60"
        defaultValue={"User-agent: *\nAllow: /\nSitemap: https://stoneza.com/sitemap.xml"}
      />
    </section>
  );
}
