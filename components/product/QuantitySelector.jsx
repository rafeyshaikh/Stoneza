"use client";

export default function QuantitySelector({
  quantity,
  setQuantity,
}) {
  return (
    <div className="flex items-center border border-[#d4cfc9] w-fit">
      <button
        onClick={() =>
          setQuantity((prev) => Math.max(1, prev - 1))
        }
        className="w-12 h-12 text-xl hover:bg-gray-50 transition"
      >
        −
      </button>

      <span className="w-14 text-center text-sm">
        {quantity}
      </span>

      <button
        onClick={() =>
          setQuantity((prev) => prev + 1)
        }
        className="w-12 h-12 text-xl hover:bg-gray-50 transition"
      >
        +
      </button>
    </div>
  );
}