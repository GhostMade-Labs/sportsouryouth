"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ImpactGallerySlide = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

type ImpactGallerySliderProps = {
  slides: ImpactGallerySlide[];
  autoPlayMs?: number;
};

export function ImpactGallerySlider({ slides, autoPlayMs = 2000 }: ImpactGallerySliderProps) {
  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slideCount <= 1 || isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, autoPlayMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoPlayMs, isPaused, slideCount]);

  useEffect(() => {
    if (activeIndex > slideCount - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, slideCount]);

  if (slideCount === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex] ?? slides[0];

  const goToSlide = (index: number) => {
    setActiveIndex((index + slideCount) % slideCount);
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl border-border/70 bg-card shadow-xl">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Impact photo gallery"
        className="relative h-[19rem] sm:h-[23rem] lg:h-[28rem]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (!event.currentTarget.contains(nextTarget)) {
            setIsPaused(false);
          }
        }}
      >
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((slide, index) => (
            <div key={slide.src} className="relative h-full w-full shrink-0 bg-muted/45">
              <Image
                src={slide.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1024px) 100vw, 1120px"
                className="object-cover object-center opacity-70 blur-[2px] brightness-75"
              />
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 1120px"
                className="object-contain object-center p-3 sm:p-4 md:p-6"
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
            </div>
          ))}
        </div>

        {slideCount > 1 ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => goToSlide(activeIndex - 1)}
              aria-label="Previous gallery image"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 border border-white/35 bg-black/30 text-white backdrop-blur hover:bg-black/45"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => goToSlide(activeIndex + 1)}
              aria-label="Next gallery image"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border border-white/35 bg-black/30 text-white backdrop-blur hover:bg-black/45"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-border/70 bg-card px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{activeSlide.title}</p>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{activeSlide.caption}</p>
        </div>
        {slideCount > 1 ? (
          <div className="flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.src}-indicator`}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-7 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
