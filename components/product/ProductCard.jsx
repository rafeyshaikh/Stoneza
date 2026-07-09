import { useRouter } from "next/navigation";
import Image from "next/image";
import { redirectToWhatsApp } from "@/lib/whatsapp";

export default function ProductCard({ item, setHoveredId, hoveredId, slug }) {
  const router = useRouter();

  const name = item?.name || "";
  const productSlug = item?.slug || "";
  const productId = (item?.id || item?._id)?.toString();

  const image = item?.image || (item?.images?.length ? item?.images[0].url : "/assets/placeholder.jpg");
  const imageHover = item?.imageHover || item?.hoverImage?.url || image;

  const targetUrl = slug
    ? `/collections/${slug}/products/${productSlug}`
    : `/products/${productSlug}`;

  return (
    <div className="w-full h-auto cursor-pointer" onClick={() => {
      router.push(targetUrl);
    }}>
      <div className="flex flex-col items-center">
        <div
          className="group relative mb-5 w-full h-full aspect-square bg-[#F4F1EB]"
          onMouseEnter={() => setHoveredId && setHoveredId(productId)}
          onMouseLeave={() => setHoveredId && setHoveredId(null)}
        >
          <Image
            src={setHoveredId && hoveredId === productId ? imageHover : image}
            alt={name}
            fill
            className="h-full w-full object-contain"
          />

          {setHoveredId && hoveredId === productId && (
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center bg-white py-2">
              <button
                onClick={()=>router.push(targetUrl)}
                className="w-full border-r border-[#cbc9c4] py-2 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                View Product
              </button>

              <button
                onClick={() => {
                  redirectToWhatsApp(item);
                }}
                className="w-full py-2 text-[12px] uppercase tracking-[3px] font-heading cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                Enquiry Now
              </button>
            </div>
          )}
        </div>

        <h3 className="text-center font-body text-[14px] text-[#393938] capitalize">
          {name}
        </h3>
      </div>
    </div>
  );
}