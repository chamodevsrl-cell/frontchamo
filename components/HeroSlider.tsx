"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import Image from "next/image";
import { slides as defaultSlides } from "@/data/media";
import { useSiteContent } from "@/components/ContentProvider";

const INTERVAL_MS = 5500;
const SWIPE_THRESHOLD = 45;

export default function HeroSlider() {
  const { slides } = useSiteContent();
  const banners = slides.length > 0 ? slides : defaultSlides;
  const [index, setIndex] = useState(0);
  const safeIndex = banners.length ? index % banners.length : 0;
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((next: number) => {
    setIndex((next + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % banners.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [index, banners.length]);

  function onTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  }

  function onTouchMove(event: TouchEvent) {
    if (touchStartX.current === null) return;
    touchDeltaX.current =
      (event.touches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
  }

  function onTouchEnd() {
    if (touchStartX.current === null) return;
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta < 0) goTo(safeIndex + 1);
      else goTo(safeIndex - 1);
    }
  }

  return (
    <section
      className="relative w-full overflow-hidden touch-pan-y"
      aria-roledescription="carrusel"
      aria-label="Anuncios destacados"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full">
        {banners.map((slide, i) => {
          const active = i === safeIndex;

          return (
            <div
              key={slide.id}
              className={`${
                active
                  ? "relative z-10"
                  : "pointer-events-none absolute inset-0 z-0"
              } transition-opacity duration-700 ease-out ${
                active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!active}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
                sizes="100vw"
                className={`block w-full select-none object-contain ${
                  active ? "relative h-auto" : "absolute inset-0 h-full"
                }`}
              />
            </div>
          );
        })}

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-4">
          {banners.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al anuncio ${i + 1}`}
              aria-current={i === safeIndex}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-7 bg-brand-gold"
                  : "w-2.5 bg-white/55 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
