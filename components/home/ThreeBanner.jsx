import Image from "next/image";

export default function ThreeBanner() {
    return (
        <div className="flex mt-20">
            <div className="relative overflow-hidden">
                <Image
                    src="/assets/others/Below_Banner_1.jpg"
                    alt="Description"
                    width={500}
                    height={400}
                    className="object-cover transition-transform duration-1500 hover:scale-110"
                />
            </div>
            <div className="relative h-150 overflow-hidden">
                <Image
                    src="/assets/others/Below_Banner_2.jpg"
                    alt="Description"
                    width={500}
                    height={400}
                    className="object-cover transition-transform duration-1500 hover:scale-110"
                />
            </div>
            <div className="relative overflow-hidden">
                <Image
                    src="/assets/others/Below_Banner_3.jpg"
                    alt="Description"
                    width={500}
                    height={400}
                    className="object-cover transition-transform duration-1500 hover:scale-110"
                />
            </div>
        </div>
    )}