import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import ProductCard from "@/components/product/ProductCard";

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find({ deletedAt: null, status: "published" }).lean();

  return (
    <div className="w-full min-h-screen bg-[#EAE8E2] py-16 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-[#2c2c2c] tracking-wider uppercase mb-4">
            Our Collection
          </h1>
          <p className="text-sm md:text-base text-[#6f6f6f] leading-relaxed">
            Discover our carefully curated selection of premium natural stones, tiles, wall cladding, and handcrafted outdoor features.
          </p>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                product={JSON.parse(JSON.stringify(product))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
