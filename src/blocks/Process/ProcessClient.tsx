"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { twMerge } from "tailwind-merge";

export type ProcessStepData = {
  description: string | null;
  id: string | number | null;
  image: {
    alt?: string | null;
    url?: string | null;
  } | null;
  imageAlt: string;
  imageUrl: string | null;
  layoutVariant: number;
  number: string | null;
  title: string | null;
};

type ProcessClientProps = {
  steps: ProcessStepData[];
  dark?: boolean | null;
};

const ProcessClient: React.FC<ProcessClientProps> = ({ steps, dark }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Update slide state when swiper changes
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      const updateSlideState = () => {
        setIsFirstSlide(swiper.isBeginning);
        setIsLastSlide(swiper.isEnd);
        setCurrentIndex(swiper.activeIndex);
      };

      swiper.on("slideChange", updateSlideState);
      updateSlideState();

      return () => {
        swiper.off("slideChange", updateSlideState);
      };
    }
  }, []);

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Swiper */}
      <Swiper
        style={{
          overflow: "visible",
          paddingRight: "calc(100% - 512px)",
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation]}
        centeredSlides={false}
        slidesPerView="auto"
        spaceBetween={24}
        speed={800}
        slideToClickedSlide={true}
        grabCursor={true}
        navigation={{
          nextEl: ".swiper-button-next-process",
          prevEl: ".swiper-button-prev-process",
        }}
        breakpoints={{
          640: {
            spaceBetween: 40,
          },
          1024: {
            spaceBetween: 60,
          },
        }}
      >
        {steps.map((step, index) => {
          return (
            <SwiperSlide
              key={step.id || index}
              className="w-auto"
              style={{ width: "auto" }}
            >
              {/* Step content */}
              <motion.div
                initial={{
                  opacity: 0.5,
                  x: 100,
                  scale: 0.7,
                  rotate: -5,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  rotate: 0,
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 0.8,
                  delay: index * 0.15,
                }}
                className={twMerge(
                  "p-4 overflow-hidden",
                  step.layoutVariant === 0
                    ? "w-[360px] de:w-[480px]"
                    : step.layoutVariant === 1
                      ? "w-[400px] de:w-[520px]"
                      : "w-[320px] de:w-[420px]",
                )}
              >
                {step.layoutVariant === 0 ? (
                  <div className="relative group">
                    {/* Image */}
                    {step.imageUrl && (
                      <div
                        className={twMerge(
                          "relative w-full max-w-full h-72",
                          "overflow-hidden mb-6 rounded-xl",
                        )}
                      >
                        <Image
                          className={twMerge(
                            "object-cover transition-transform duration-700",
                            "group-hover:scale-110",
                          )}
                          src={step.imageUrl}
                          alt={step.imageAlt}
                          fill={true}
                          sizes="(max-width: 768px) 360px, 480px"
                          loading={index < 2 ? "eager" : "lazy"}
                        />

                        {/* Gradient overlay */}
                        <div
                          className={twMerge(
                            "absolute inset-0",
                            "bg-linear-to-br from-primary-purple/20",
                            "via-transparent to-dark/40",
                          )}
                        />

                        {/* Step number */}
                        {step.number && (
                          <div
                            className={twMerge(
                              "z-20 absolute top-4 left-4",
                              "flex items-center justify-center",
                              "w-16 h-16 rounded-full bg-primary-purple",
                              "shadow-lg shadow-primary-purple/30",
                            )}
                          >
                            <span className="text-[20px] font-bold text-white">
                              {step.number}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Text content */}
                    <div className="relative">
                      {/* Title */}
                      {step.title && (
                        <h3
                          className={twMerge(
                            "font-bold text-[24px] mb-3 text-primary-purple",
                            "transition-transform duration-300",
                            "group-hover:translate-x-2",
                          )}
                        >
                          {step.title}
                        </h3>
                      )}

                      {/* Description */}
                      {step.description && (
                        <p
                          className={twMerge(
                            "text-[15px] leading-relaxed max-w-xs",
                            dark ? "text-white/80" : "text-dark/80",
                          )}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ) : step.layoutVariant === 1 ? (
                  <div className="flex flex-col gap-6 group">
                    {/* Text content */}
                    <div className="flex-1">
                      {/* Title */}
                      {step.title && (
                        <h3
                          className={twMerge(
                            "font-semibold text-[20px] mb-4",
                            "text-primary-purple",
                          )}
                        >
                          {step.title}
                        </h3>
                      )}

                      {/* Description */}
                      {step.description && (
                        <p
                          className={twMerge(
                            "text-[15px] leading-relaxed max-w-md",
                            dark ? "text-white/80" : "text-dark/80",
                          )}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>

                    {/* Image */}
                    {step.imageUrl && (
                      <div
                        className={twMerge(
                          "relative w-full max-w-full h-72 shrink-0",
                          "overflow-hidden rounded-xl",
                        )}
                      >
                        <Image
                          className={twMerge(
                            "object-cover transition-transform duration-500",
                            "group-hover:scale-105",
                          )}
                          src={step.imageUrl}
                          alt={step.imageAlt}
                          fill={true}
                          sizes="(max-width: 768px) 400px, 520px"
                          loading={index < 2 ? "eager" : "lazy"}
                        />

                        {/* Step number */}
                        {step.number && (
                          <div
                            className={twMerge(
                              "z-20 absolute top-4 left-4",
                              "flex items-center justify-center",
                              "w-16 h-16 rounded-full bg-primary-purple",
                              "shadow-lg shadow-primary-purple/30",
                            )}
                          >
                            <span className="text-white text-[20px] font-bold">
                              {step.number}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group flex flex-col">
                    {/* Title */}
                    {step.title && (
                      <h3
                        className={twMerge(
                          "font-bold text-[20px] mb-4",
                          "text-primary-purple",
                        )}
                      >
                        {step.title}
                      </h3>
                    )}

                    {/* Description */}
                    {step.description && (
                      <p
                        className={twMerge(
                          "text-[15px] leading-relaxed mb-6 max-w-xs",
                          dark ? "text-white/80" : "text-dark/80",
                        )}
                      >
                        {step.description}
                      </p>
                    )}

                    {/* Image */}
                    {step.imageUrl && (
                      <div
                        className={twMerge(
                          "relative w-full max-w-full h-72",
                          "overflow-hidden rounded-xl",
                        )}
                      >
                        <Image
                          className={twMerge(
                            "object-cover transition-transform duration-700",
                            "group-hover:scale-110",
                          )}
                          src={step.imageUrl}
                          alt={step.imageAlt}
                          fill={true}
                          sizes="(max-width: 768px) 320px, 420px"
                          loading={index < 2 ? "eager" : "lazy"}
                        />

                        {/* Gradient overlay */}
                        <div
                          className={twMerge(
                            "absolute inset-0",
                            "bg-linear-to-t from-dark/60 to-transparent",
                          )}
                        />

                        {/* Step number */}
                        {step.number && (
                          <div
                            className={twMerge(
                              "z-20 absolute top-4 left-4",
                              "flex items-center justify-center",
                              "w-16 h-16 rounded-full bg-primary-purple",
                              "shadow-lg shadow-primary-purple/30",
                            )}
                          >
                            <span className="text-white text-[20px] font-bold">
                              {step.number}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation controls */}
      <div
        className={twMerge(
          "flex justify-center items-center gap-16 mt-2",
          "de:mt-6",
        )}
      >
        {/* Previous button */}
        <button
          className={twMerge(
            "swiper-button-prev-process",
            "flex items-center justify-center w-12 h-12 rounded-full border",
            "hover:scale-110 active:scale-95 transition-all",
            "disabled:opacity-20 disabled:cursor-not-allowed",
            "disabled:hover:scale-100",
            dark
              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
              : "bg-dark/10 border-dark/20 text-dark hover:bg-dark/20",
          )}
          disabled={isFirstSlide}
          aria-label="Previous step"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Pagination dots */}
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              className={twMerge(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-primary-purple w-8"
                  : dark
                    ? "bg-white/30 hover:bg-white/50"
                    : "bg-dark/30 hover:bg-dark/50",
              )}
              onClick={() => swiperRef.current?.slideTo(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          className={twMerge(
            "swiper-button-next-process",
            "flex items-center justify-center w-12 h-12 rounded-full border",
            "hover:scale-110 active:scale-95 transition-all",
            "disabled:opacity-20 disabled:cursor-not-allowed",
            "disabled:hover:scale-100",
            dark
              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
              : "bg-dark/10 border-dark/20 text-dark hover:bg-dark/20",
          )}
          disabled={isLastSlide}
          aria-label="Next step"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProcessClient;
