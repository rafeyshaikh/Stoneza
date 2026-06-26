import Image from "next/image";

export default function ThreeBanner() {
    return (
        <div className="flex mt-20">
            <div className="relative h-125 overflow-hidden flex items-center justify-center">
                <Image
                    src="/assets/others/Below_Banner_1.jpg"
                    alt="Description"
                    width={500}
                    height={400}
                    className="object-cover transition-transform duration-4000 hover:scale-120"
                />
                <div className="absolute bottom-5 left-2/7 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <button className="mt-6 border border-white px-8 py-3 font-heading text-[12px] font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:border-[#5F554F] text-white cursor-pointer">
                    Photo Frames
                </button>
                </div>
            </div>
            <div className="relative w-auto h-125 overflow-hidden flex items-center justify-center">
                <Image
                    src="/assets/others/Below_Banner_2.jpg"
                    alt="Description"
                    width={500}
                    height={400}
                    className="object-cover transition-transform duration-4000 hover:scale-120"
                />
                <div className="absolute bottom-5 left-2/7 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <button className="mt-6 border border-white px-8 py-3 font-heading text-[12px] font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:border-[#5F554F] text-white cursor-pointer">
                    Decor Object
                </button>
                </div>
            </div>
            <div className="relative h-125 overflow-hidden flex items-center justify-center">
                <Image
                    src="/assets/others/Below_Banner_3.jpg"
                    alt="Description"
                    width={500}
                    height={400}
                    className="object-cover transition-transform duration-4000 hover:scale-120"
                />
                <div className="absolute bottom-5 left-2/7 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <button className="mt-6 border border-white px-8 py-3 font-heading text-[12px] font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:border-[#5F554F] text-white cursor-pointer">
                    Book Boxes
                </button>
                </div>
            </div>
        </div>
    )}