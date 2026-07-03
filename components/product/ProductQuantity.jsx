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
        className="h-12 w-12 text-xl"
      >
        −
      </button>

      <span className="w-14 text-center">
        {quantity}
      </span>

      <button
        onClick={() =>
          setQuantity((prev) => prev + 1)
        }
        className="h-12 w-12 text-xl"
      >
        +
      </button>
    </div>
  );
}