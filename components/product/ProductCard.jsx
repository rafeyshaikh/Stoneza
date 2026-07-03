import Link from "next/link";
import ImageWithLoader from "@/components/common/Loader";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f6f3]">
        <ImageWithLoader
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="pt-4">
        <h3 className="text-[15px] text-[#2c2c2c] line-clamp-2">
          {product.name}
        </h3>

        <p className="mt-2 text-[16px] font-medium text-[#665b54]">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}