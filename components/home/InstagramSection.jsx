"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PiXBold, PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { FaInstagram } from "react-icons/fa";

import Container from "@/components/common/Container";
import { instagramData } from "@/data/InstagramData";

export default function InstagramSection() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const nextPost = () => {
    setSelectedIndex((prev) => (prev + 1) % instagramData.length);
  };

  const prevPost = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + instagramData.length) % instagramData.length,
    );
  };

  const selectedPost =
    selectedIndex !== null ? instagramData[selectedIndex] : null;

  return (
    <section className="py-20 border-t border-gray-200">
      <Container>
        {/* HEADING */}

        <h2 className="mb-12 text-center font-display text-[28px] uppercase tracking-[6px] text-[#1C1B1B]">
          Stoneza Insta
        </h2>

        {/* GRID */}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {instagramData.map((post, index) => (
            <button
              key={post.id}
              onClick={() => openModal(index)}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={post.image}
                alt={`Instagram ${post.id}`}
                fill
                className=" object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* HOVER OVERLAY */}

              <div
                className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100"
              >
                <FaInstagram className="text-4xl text-white" />
              </div>
            </button>
          ))}
        </div>
      </Container>

      {/* MODAL */}

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
          >
            {/* CLOSE BUTTON */}

            <button
              onClick={closeModal}
              className="absolute right-8 top-8 text-[34px] text-white transition hover:opacity-70"
            >
              <PiXBold />
            </button>

            {/* PREV BUTTON */}

            <button
              onClick={prevPost}
              className="absolute left-[40px] top-1/2 z-50 -translate-y-1/2 text-[32px] text-white transition hover:opacity-70"
            >
              <PiCaretLeftBold />
            </button>

            {/* NEXT BUTTON */}

            <button
              onClick={nextPost}
              className="absolute right-[40px] top-1/2 z-50 -translate-y-1/2 text-[32px] text-white transition hover:opacity-70"
            >
              <PiCaretRightBold />
            </button>

            {/* MODAL CARD */}

            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className=" flex h-[700px] w-[1050px] max-w-[92vw] bg-white overflow-hidden rounded-[24px] shadow-2xl"
            >
              {/* LEFT IMAGE */}

              <div className="relative hidden w-[50%] bg-black md:block rounded-l-lg">
                <Image
                  src={selectedPost.image}
                  alt="Instagram Post"
                  fill
                  priority
                  className="object-cover rounded-l-[24px]"
                />

                {/* DOTS */}

                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-4">
                  {instagramData.map((_, index) => (
                    <div
                      key={index}
                      className={`h-[7px] w-[7px] rounded-full ${
                        index === selectedIndex ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT CONTENT */}

              <div className="flex w-full flex-col md:w-[45%]">
                {/* HEADER */}

                <div className="flex items-center gap-3 border-b border-gray-300 px-6 py-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border-b border-gray-300">
                    <Image
                      src="/assets/logo/logo_circle.jpg"
                      alt="Address Home"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <span className="text-[16px] font-semibold text-[#262626]">
                    addresshomedecor
                  </span>
                </div>

                {/* BODY */}

                <div className="flex-1 overflow-y-auto px-7 py-8 ">
                  <div className="space-y-6">
                    {selectedPost.caption
                      .trim()
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, index) => (
                        <p
                          key={index}
                          className="
                          text-[16px]
                          leading-[1.6]
                          text-[#6B6B6B]
                          font-body
                          "
                        >
                          {line}
                        </p>
                      ))}
                  </div>
                </div>

                {/* FOOTER */}

                <div className="border-t py-3 text-center text-[13px] text-[#8E8E8E]">
                  {selectedPost.date}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
