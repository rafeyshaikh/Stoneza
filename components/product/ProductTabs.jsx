"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const tabClass = `
  relative
  rounded-none
  bg-transparent
  px-0
  py-5
  mr-12
  text-[17px]
  font-medium
  text-[#8A8178]
  transition-colors
  duration-300
  hover:text-[#2E2A27]
  data-[state=active]:border-b-2
  data-[state=active]:border-[#2E2A27]
  data-[state=active]:text-[#2E2A27]

  after:absolute
  after:left-0
  after:bottom-0
  after:h-px
  after:w-0
  after:bg-[#2E2A27]
  after:transition-all
  after:duration-300

  data-[state=active]:after:w-full
`;

export default function ProductTabs({ product }) {
  return (
    <section className="border-t border-[#ECE7E1] py-24">
      <div className="mx-auto max-w-[1280px] px-5">
        <Tabs
          defaultValue="description"
          className="w-full"
        >
          {/* Tabs */}
          <TabsList className="h-auto w-full justify-start rounded-none border-b border-[#ECE7E1] bg-transparent p-0">
            <TabsTrigger
              value="description"
              className={tabClass}
            >
              Description
            </TabsTrigger>

            <TabsTrigger
              value="specifications"
              className={tabClass}
            >
              Specifications
            </TabsTrigger>

            <TabsTrigger
              value="shipping"
              className={tabClass}
            >
              Shipping
            </TabsTrigger>

            <TabsTrigger
              value="care"
              className={tabClass}
            >
              Care Instructions
            </TabsTrigger>
          </TabsList>

          {/* Description */}
          <TabsContent
            value="description"
            className="pt-14"
          >
            <div className="max-w-4xl">
              <p className="whitespace-pre-line text-[16px] leading-[2] text-[#5F5954]">
                {product.description}
              </p>
            </div>
          </TabsContent>

          {/* Specifications */}
          <TabsContent
            value="specifications"
            className="pt-14"
          >
            <div className="max-w-4xl overflow-hidden rounded-sm border border-[#ECE7E1]">
              {product.specifications?.map((item, index) => (
                <div
                  key={item.label}
                  className={`grid md:grid-cols-[240px_1fr] ${
                    index !== product.specifications.length - 1
                      ? "border-b border-[#ECE7E1]"
                      : ""
                  }`}
                >
                  <div className="bg-[#FAF8F5] px-8 py-6 text-[#2E2A27] font-medium">
                    {item.label}
                  </div>

                  <div className="px-8 py-6 text-[#5F5954] leading-8">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Shipping */}
          <TabsContent
            value="shipping"
            className="pt-14"
          >
            <div className="max-w-4xl">
              <p className="text-[16px] leading-[2] text-[#5F5954]">
                {product.shippingInfo}
              </p>
            </div>
          </TabsContent>

          {/* Care */}
          <TabsContent
            value="care"
            className="pt-14"
          >
            <div className="max-w-4xl">
              <p className="text-[16px] leading-[2] text-[#5F5954]">
                {product.careInstructions}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}