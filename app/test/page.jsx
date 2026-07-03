"use client";


import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { PiPlus } from "react-icons/pi";
import { PiStarFill, PiStarLight } from "react-icons/pi";
import { PiMinus, PiCaretDown } from "react-icons/pi";

function getPlaceholderProduct() {
  return {
    name: "Cato Brown & Antique Mirror Block Console",
    sku: "AH21783",
    price: 59990,
    discountPrice: null,
    stock: 1,
    disclaimer:
      "Disclaimer: Please note that this product is currently in production and will require a lead time of 30 days for delivery from the date of order placement. We appreciate your understanding and patience as we craft this exquisite piece to perfection.",
    description:
      "Architectural and luminous, the Cato Block Console showcases a refined blend of sculptural geometry with fluidity. Its structured stepped base with curved mirror facets creates a striking visual rhythm. Finished with brown and antique accents, this console doubles as functional furniture and statement art — perfect for entryways, living spaces, or luxury interiors.",
    dimensions: { length: 121, width: 35, height: 81 },
    color: "Brown & Antique",
    material: "Mirror",
    detailsList: [
      "Sculptural Architectural Console Design",
      "Premium Mirror Cladding Construction",
      "Stepped Block Base Structure",
      "Elegant Curved Mirror Facet Detailing",
      "Brown & Antique Accent Finish",
      "Sleek Rectangular Tabletop",
      "Modern Statement Furniture Piece",
      "Ideal for Entryways & Living Rooms",
      "Reflective Mirror Surface for Light Play",
      "Designed for Luxury Interiors",
      "Care instruction: Clean with a soft damp cloth",
    ],
    shippingNote:
      "Extra shipping charges apply for high-volume items like furniture, mirrors, clocks, dinner sets, planters & decorative items. Normal delivery takes 7-10 business days. See full shipping table at checkout.",
    images: [
      { url: "/assets/small_banners3/Small_Banner_1.webp", publicId: "1" },
      { url: "/assets/small_banners3/Small_Banner_2.webp", publicId: "2" },
      { url: "/assets/small_banners3/Small_Banner_3.webp", publicId: "3" },
    ],
  };
}

function getPlaceholderRelated() {
  return [
    {
      id: 1,
      name: "Rustic Wood & Iron Console",
      price: 32990,
      slug: "rustic-wood-iron-console",
      image: "/assets/placeholder/related-1.webp",
      imageHover: "/assets/placeholder/related-1-hover.webp",
    },
    {
      id: 2,
      name: "Aria Mirror X-Frame Console",
      price: 45990,
      slug: "aria-mirror-x-frame-console",
      image: "/assets/placeholder/related-2.webp",
      imageHover: "/assets/placeholder/related-2-hover.webp",
    },
    {
      id: 3,
      name: "Orbis Stacked Mirror Console",
      price: 52990,
      slug: "orbis-stacked-mirror-console",
      image: "/assets/placeholder/related-3.webp",
      imageHover: "/assets/placeholder/related-3-hover.webp",
    },
    {
      id: 4,
      name: "Le' Floret Luxe Console",
      price: 61900,
      slug: "le-floret-luxe-console",
      image: "/assets/placeholder/related-4.webp",
      imageHover: "/assets/placeholder/related-4-hover.webp",
    },
  ];
}

function getPlaceholderReviews() {
  return [
    {
      id: 1,
      author: "Ritika S.",
      date: "2 weeks ago",
      rating: 5,
      comment:
        "Stunning piece — the mirror detailing catches light beautifully in our entryway. Worth the wait for delivery.",
    },
  ];
}

function ProductGallery({ images = [], productName = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex gap-4">
      {/* Vertical thumbnail strip */}
      <div className="flex w-20 flex-shrink-0 flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={image.publicId || index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square w-full overflow-hidden border bg-[#eae8e2] transition-colors ${
              activeIndex === index
                ? "border-black"
                : "border-[#cbc9c4] hover:border-black"
            }`}
          >
            <Image
              src={image.url}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-contain p-1"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="group relative aspect-square w-full flex-1 cursor-zoom-in overflow-hidden bg-[#eae8e2]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {activeImage && (
          <Image
            src={activeImage.url}
            alt={productName}
            fill
            priority
            className="object-contain"
          />
        )}

        {isHovering && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-white/90 text-black shadow-md">
              <PiPlus className="text-lg" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


function AccordionItem({ title, children, defaultOpen = false, onTriggerClick }) {
  const [open, setOpen] = useState(defaultOpen);

  const handleClick = () => {
    if (onTriggerClick) {
      onTriggerClick();
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="border-b border-[#cbc9c4]">
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center justify-between py-4 text-left font-heading text-[13px] uppercase tracking-[2px] text-[#393938]"
      >
        {title}
        {!onTriggerClick && (
          <span
            className={`text-lg transition-transform duration-200 ${
              open ? "rotate-45" : ""
            }`}
          >
            <PiPlus />
          </span>
        )}
      </button>

      {!onTriggerClick && open && (
        <div className="pb-5 font-body text-[14px] leading-relaxed text-[#6a6a6a]">
          {children}
        </div>
      )}
    </div>
  );
}

function ProductBuyBox({ product }) {
  const [quantity, setQuantity] = useState(1);

  const {
    name,
    sku,
    price,
    discountPrice,
    disclaimer,
    stock,
    description,
    dimensions,
    color,
    material,
    detailsList = [],
    shippingNote,
  } = product;

  const inStock = stock > 0;

  const scrollToReviews = () => {
    document
      .getElementById("reviews")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col">
      <p className="mb-1 text-[13px] text-[#6a6a6a]">
        <span className="hover:underline cursor-pointer">Home</span>
        {" / "}
        <span className="hover:underline cursor-pointer">Console Tables</span>
        {" / "}
        <span className="text-[#393938]">{name}</span>
      </p>

      <h1 className="font-heading text-2xl font-medium uppercase tracking-[1px] text-[#1a1a1a] md:text-[28px]">
        {name}
      </h1>

      <p className="mt-2 text-[13px] text-[#6a6a6a]">SKU: {sku}</p>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-heading text-2xl text-[#1a1a1a]">
          ₹ {price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
        {discountPrice && (
          <span className="text-[14px] text-[#a1a1a1] line-through">
            ₹ {discountPrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>
      <p className="text-[12px] text-[#6a6a6a]">MRP inclusive of all taxes</p>

      <hr className="my-5 border-[#cbc9c4]" />

      {disclaimer && (
        <p className="mb-4 text-[13px] italic leading-relaxed text-[#6a6a6a]">
          {disclaimer}
        </p>
      )}

      <p className="mb-5 text-[13px] italic text-[#6a6a6a]">
        {inStock ? `${stock} piece${stock > 1 ? "s" : ""} in stock.` : "Out of stock"}
      </p>

      <p className="mb-2 text-[13px] uppercase tracking-[1px] text-[#393938]">
        Quantity:
      </p>

      <div className="mb-5 flex h-11 w-32 items-center justify-between border border-[#cbc9c4]">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-full w-10 items-center justify-center text-[#393938] hover:bg-[#eae8e2]"
        >
          <PiMinus />
        </button>
        <span className="text-[14px]">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
          className="flex h-full w-10 items-center justify-center text-[#393938] hover:bg-[#eae8e2]"
        >
          <PiPlus />
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <button
          type="button"
          disabled={!inStock}
          className="h-12 w-full border border-black font-heading text-[12px] uppercase tracking-[2px] text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to Bag
        </button>
        <button
          type="button"
          disabled={!inStock}
          className="h-12 w-full bg-black font-heading text-[12px] uppercase tracking-[2px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>

      <p className="mb-4 text-[14px] leading-relaxed text-[#393938]">
        {description}
      </p>

      <div className="mb-2 space-y-1 text-[14px] text-[#393938]">
        {dimensions && (
          <p>
            Size: {dimensions.length} x {dimensions.width} x {dimensions.height} cm
          </p>
        )}
        {color && <p>Color: {color}</p>}
        {material && <p>Material: {material}</p>}
      </div>

      <div className="mt-4 border-t border-[#cbc9c4]">
        {detailsList.length > 0 && (
          <AccordionItem title="Details & Care">
            <ul className="space-y-2">
              {detailsList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </AccordionItem>
        )}

        {shippingNote && (
          <AccordionItem title="Shipping and Returns">
            <p>{shippingNote}</p>
          </AccordionItem>
        )}

        <AccordionItem title="Reviews" onTriggerClick={scrollToReviews}>
          {null}
        </AccordionItem>
      </div>
    </div>
  );
}


function RelatedProducts({ title = "You May Also Like", products = [] }) {
  const scrollRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section className="border-t border-[#cbc9c4] px-6 py-14 md:px-10">
      <h2 className="mb-10 text-center font-heading text-2xl uppercase tracking-[2px] text-[#1a1a1a]">
        {title}
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="w-[75%] flex-shrink-0 snap-start sm:w-[45%] lg:w-[30%]"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative mb-4 aspect-square w-full bg-[#eae8e2]">
                <Image
                  src={
                    hoveredId === item.id && item.imageHover
                      ? item.imageHover
                      : item.image
                  }
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-center font-body text-[14px] text-[#393938]">
                {item.name}
              </p>
              <p className="text-center font-body text-[14px] text-[#6a6a6a]">
                ₹{item.price.toLocaleString("en-IN")}
              </p>
            </Link>
          ))}
        </div>

        {products.length > 3 && (
          <>
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              aria-label="Previous products"
              className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-[#cbc9c4] bg-white p-2 shadow-md md:flex"
            >
              <PiCaretLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              aria-label="Next products"
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-[#cbc9c4] bg-white p-2 shadow-md md:flex"
            >
              <PiCaretRight />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-[14px] text-[#1a1a1a]">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? <PiStarFill key={i} /> : <PiStarLight key={i} />,
      )}
    </div>
  );
}

function ProductReviews({ reviews = [] }) {
  const count = reviews.length;
  const average = count
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;

  return (
    <section
      id="reviews"
      className="scroll-mt-28 border-t border-[#cbc9c4] px-6 py-14 md:px-10"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h2 className="font-heading text-2xl uppercase tracking-[2px] text-[#1a1a1a]">
            Customer Reviews
          </h2>

          {count > 0 ? (
            <>
              <Stars rating={Math.round(average)} />
              <p className="text-[13px] text-[#6a6a6a]">
                Based on {count} review{count > 1 ? "s" : ""}
              </p>
            </>
          ) : (
            <p className="text-[13px] text-[#6a6a6a]">
              Be the first to review this product
            </p>
          )}

          <button
            type="button"
            className="mt-3 border border-black px-6 py-2.5 font-heading text-[12px] uppercase tracking-[2px] text-black transition-colors hover:bg-black hover:text-white"
          >
            Write a Review
          </button>
        </div>

        {count > 0 && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-[#cbc9c4] pb-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-heading text-[13px] uppercase tracking-[1px] text-[#1a1a1a]">
                    {review.author}
                  </p>
                  <span className="text-[12px] text-[#a1a1a1]">
                    {review.date}
                  </span>
                </div>
                <Stars rating={review.rating} />
                <p className="mt-2 text-[14px] leading-relaxed text-[#393938]">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductPage() {
  const product = getPlaceholderProduct();
  const related = getPlaceholderRelated();
  const reviews = getPlaceholderReviews();

  return (
    <div className="w-full bg-white">
      <div className="grid gap-10 px-6 py-10 md:px-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductBuyBox product={product} />
      </div>

      <RelatedProducts products={related} />

      <ProductReviews reviews={reviews} />
    </div>
  );
}


