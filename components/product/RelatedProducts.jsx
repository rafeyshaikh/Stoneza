import ProductCard from "./ProductCard";

export default function RelatedProducts({ products }) {
  return (
    <section className="py-20 border-t border-[#ece8e3]">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="text-sm tracking-[3px] text-[#8c857d] uppercase mb-3">
            You May Also Like
          </p>

          <h2 className="font-display text-4xl text-[#2c2c2c]">
            Related Products
          </h2>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}