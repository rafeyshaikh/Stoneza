"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PiXBold, PiCaretLeftBold, PiCaretRightBold, PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { FaInstagram, FaPlay, FaCopy, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function InstagramGrid({ posts }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const openModal = (index) => {
    setSelectedIndex(index);
    setActiveSlideIndex(0);
    setIsMuted(true);
    setIsPlaying(true);
  };

  const closeModal = () => {
    setSelectedIndex(null);
    setActiveSlideIndex(0);
    setIsMuted(true);
    setIsPlaying(true);
  };

  const nextPost = () => {
    setSelectedIndex((prev) => {
      const nextIdx = (prev + 1) % posts.length;
      setActiveSlideIndex(0);
      setIsMuted(true);
      setIsPlaying(true);
      return nextIdx;
    });
  };

  const prevPost = () => {
    setSelectedIndex((prev) => {
      const prevIdx = (prev - 1 + posts.length) % posts.length;
      setActiveSlideIndex(0);
      setIsMuted(true);
      setIsPlaying(true);
      return prevIdx;
    });
  };

  const selectedPost =
    selectedIndex !== null ? posts[selectedIndex] : null;

  // Compute slides for the current post: use children if present (for CAROUSEL_ALBUM), otherwise fallback to single media
  const slides = selectedPost
    ? selectedPost.children && selectedPost.children.length > 0
      ? selectedPost.children
      : [
          {
            id: selectedPost.id,
            media_type: selectedPost.media_type,
            media_url: selectedPost.media_url,
            thumbnail_url: selectedPost.thumbnail_url,
          },
        ]
    : [];

  const activeSlide = selectedPost ? slides[activeSlideIndex] : null;

  // Auto-play/reset video when slide or post changes
  useEffect(() => {
    if (selectedPost && activeSlide && activeSlide.media_type === "VIDEO" && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.error("Autoplay failed:", e);
          setIsPlaying(false);
        });
    }
  }, [selectedIndex, activeSlideIndex, activeSlide]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {posts.map((post, index) => {
          const displayImage =
            post.media_type === "VIDEO"
              ? post.thumbnail_url || post.media_url
              : post.media_url;

          const altText = post.caption
            ? post.caption.slice(0, 120)
            : "Stoneza Instagram post";

          return (
            <button
              key={post.id}
              onClick={() => openModal(index)}
              aria-label={`View Instagram post: ${altText}`}
              className="group relative aspect-square overflow-hidden bg-stone-300 transition-all duration-300 shadow-sm border border-[#DDDCD6]/50 cursor-pointer"
            >
              <Image
                src={displayImage}
                alt={altText}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Media Indicator icons in the top-right corner */}
              <div className="absolute right-2.5 top-2.5 z-10 flex items-center justify-center rounded bg-black/45 p-1 text-white opacity-85 transition-opacity duration-300 group-hover:opacity-0">
                {post.media_type === "VIDEO" && (
                  <FaPlay size={10} aria-hidden="true" title="Video Post" />
                )}
                {post.media_type === "CAROUSEL_ALBUM" && (
                  <FaCopy size={10} aria-hidden="true" title="Carousel Album" />
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <FaInstagram className="text-3xl text-white mb-1.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/95 font-medium">
                  View Post
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={closeModal}
              aria-label="Close modal"
              className="absolute right-6 top-6 text-[32px] text-white transition hover:opacity-70 focus:outline-none z-50 cursor-pointer"
            >
              <PiXBold />
            </button>

            {/* OUTER PREV BUTTON (For navigating POSTS) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPost();
              }}
              aria-label="Previous post"
              className="absolute left-4 md:left-8 top-1/2 z-50 -translate-y-1/2 text-[32px] text-white transition hover:opacity-70 focus:outline-none cursor-pointer bg-black/35 hover:bg-black/60 rounded-full p-2.5"
            >
              <PiCaretLeftBold />
            </button>

            {/* OUTER NEXT BUTTON (For navigating POSTS) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPost();
              }}
              aria-label="Next post"
              className="absolute right-4 md:right-8 top-1/2 z-50 -translate-y-1/2 text-[32px] text-white transition hover:opacity-70 focus:outline-none cursor-pointer bg-black/35 hover:bg-black/60 rounded-full p-2.5"
            >
              <PiCaretRightBold />
            </button>

            {/* MODAL CARD */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col md:flex-row h-auto max-h-[90vh] md:h-[650px] w-[1000px] max-w-[92vw] bg-[#EAE8E2] overflow-hidden rounded-[16px] shadow-2xl relative border border-[#DDDCD6]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* LEFT IMAGE / VIDEO PREVIEW (SLIDES) */}
              <div className="relative w-full md:w-[50%] h-[300px] md:h-full bg-black flex-shrink-0 group/media">
                {activeSlide && (
                  activeSlide.media_type === "VIDEO" ? (
                    <div className="relative w-full h-full cursor-pointer bg-black" onClick={togglePlayPause}>
                      <video
                        ref={videoRef}
                        src={activeSlide.media_url}
                        poster={activeSlide.thumbnail_url}
                        muted={isMuted}
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />

                      {/* PLAY OVERLAY INDICATOR */}
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
                          <FaPlay className="text-4xl text-white/90 drop-shadow-md" />
                        </div>
                      )}

                      {/* MUTE OVERLAY TOGGLE */}
                      <button
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                        className="absolute right-4 bottom-14 z-30 flex items-center justify-center bg-black/60 hover:bg-black/85 text-white rounded-full p-2.5 shadow-md transition duration-200 cursor-pointer"
                      >
                        {isMuted ? (
                          <FaVolumeMute size={16} />
                        ) : (
                          <FaVolumeUp size={16} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <Image
                      src={activeSlide.media_url}
                      alt={selectedPost.caption ? selectedPost.caption.slice(0, 120) : "Instagram Post Image"}
                      fill
                      priority
                      className="object-cover"
                    />
                  )
                )}

                {/* INNER PREV/NEXT NAVIGATION (For surfing slides in CAROUSEL_ALBUM posts) */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlideIndex((i) => (i - 1 + slides.length) % slides.length);
                      }}
                      aria-label="Previous slide"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-[20px] text-black bg-white/75 hover:bg-white transition duration-200 rounded-full p-2 shadow-md cursor-pointer opacity-0 group-hover/media:opacity-100"
                    >
                      <PiCaretLeft />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlideIndex((i) => (i + 1) % slides.length);
                      }}
                      aria-label="Next slide"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-[20px] text-black bg-white/75 hover:bg-white transition duration-200 rounded-full p-2 shadow-md cursor-pointer opacity-0 group-hover/media:opacity-100"
                    >
                      <PiCaretRight />
                    </button>
                  </>
                )}

                {/* DOTS representing CAROUSEL SLIDES navigation */}
                {slides.length > 1 && (
                  <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5 z-10 bg-black/25 px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSlideIndex(index);
                        }}
                        className={`h-1.5 w-1.5 rounded-full transition-colors cursor-pointer ${
                          index === activeSlideIndex ? "bg-white" : "bg-white/40"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT CONTENT PANEL */}
              <div className="flex w-full md:w-[50%] flex-col h-[350px] md:h-full bg-white">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-300 flex-shrink-0">
                      <Image
                        src="/assets/logo/logo_circle.jpg"
                        alt="Stoneza logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-[#1C1B1B] leading-none">
                        stoneza.in
                      </span>
                      <span className="text-[10px] text-gray-500 tracking-wider uppercase mt-0.5 font-heading">
                        Instagram
                      </span>
                    </div>
                  </div>
                  {/* Media Indicator indicator badge */}
                  {selectedPost.media_type === "CAROUSEL_ALBUM" && (
                    <span className="text-[11px] text-[#8C8375] font-heading font-medium uppercase bg-[#EAE8E2] px-2.5 py-1 rounded">
                      Slide {activeSlideIndex + 1} of {slides.length}
                    </span>
                  )}
                </div>

                {/* SCROLLABLE BODY */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
                  <div className="space-y-4">
                    {selectedPost.caption ? (
                      selectedPost.caption
                        .trim()
                        .split("\n")
                        .map((line, index) => (
                          <p key={index} className="text-[14px] leading-[1.6] text-[#4b433c] font-body">
                            {line}
                          </p>
                        ))
                    ) : (
                      <p className="text-[14px] leading-[1.6] text-gray-400 italic">
                        No caption.
                      </p>
                    )}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-gray-100 p-6 bg-gray-50/70 flex-shrink-0 flex flex-col gap-4">
                  <a
                    href={selectedPost.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-5 py-3 bg-[#1C1B1B] hover:bg-black text-white font-heading text-[11px] uppercase tracking-[2px] transition-colors rounded-[4px] font-medium"
                  >
                    View on Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
