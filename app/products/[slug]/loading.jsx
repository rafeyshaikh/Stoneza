export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#EAE8E2] animate-pulse">
      {/* Hero Section */}
      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Breadcrumbs Skeleton */}
          <div className="mb-8 h-4 w-48 bg-stone-300 rounded" />

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Gallery Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full">
              {/* Thumbnails */}
              <div className="order-2 lg:order-1 grid grid-cols-4 lg:flex lg:flex-col gap-3 lg:w-24 shrink-0">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square w-full bg-stone-300 rounded" />
                ))}
              </div>
              {/* Main Image */}
              <div className="order-1 lg:order-2 relative w-full lg:flex-1 aspect-square bg-stone-300 rounded-lg" />
            </div>

            {/* Info Skeleton */}
            <div className="space-y-6 flex flex-col justify-start">
              <div className="h-10 w-3/4 bg-stone-300 rounded" />
              <div className="h-6 w-1/4 bg-stone-300 rounded" />
              <hr className="border-stone-300" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-stone-300/80 rounded" />
                <div className="h-4 w-5/6 bg-stone-300/80 rounded" />
                <div className="h-4 w-4/5 bg-stone-300/80 rounded" />
              </div>
              <div className="h-12 w-1/2 bg-stone-300 rounded mt-4" />
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-stone-300">
                <div className="space-y-2">
                  <div className="h-3 w-1/3 bg-stone-300 rounded" />
                  <div className="h-4 w-2/3 bg-stone-300 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-1/3 bg-stone-300 rounded" />
                  <div className="h-4 w-2/3 bg-stone-300 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 border-t border-stone-300">
        <div className="flex gap-8 border-b border-stone-300 pb-3">
          <div className="h-5 w-24 bg-stone-300 rounded" />
          <div className="h-5 w-24 bg-stone-300 rounded" />
          <div className="h-5 w-24 bg-stone-300 rounded" />
        </div>
        <div className="space-y-3 mt-6">
          <div className="h-4 w-full bg-stone-300/80 rounded" />
          <div className="h-4 w-5/6 bg-stone-300/80 rounded" />
        </div>
      </div>
    </div>
  );
}
