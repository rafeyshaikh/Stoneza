import Image from 'next/image';

export default function BigBanner() {
    return (
        <div className="relative w-full h-auto">
        <Image src="/assets/hero/Big_Banner_Ethereal_Forms.jpg" alt="Description" height={800} width={1550} />
        <div className={`absolute left-9 bottom-18 text-left z-10 flex flex-col items-center justify-center px-6 text-white`}>
            <div className="text-left">
                <h1 className="font-heading font-display text-[52px] font-light tracking-wide md:text-[48px] ml-2">
                Onde Éternelle
                </h1>
                <button className="mt-6 border border-white px-8 py-3 font-heading text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:bg-white hover:text-black">
                    Home Decor
                </button>
            </div>
        </div>
      </div>
    );
}