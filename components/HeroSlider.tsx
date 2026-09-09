"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import Image from "next/image";
import { slides } from "@/data/media";

const INTERVAL_MS = 5500;
const SWIPE_THRESHOLD = 45;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [index]);

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
      if (delta < 0) goTo(index + 1);
      else goTo(index - 1);
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
        {slides.map((slide, i) => {
          const active = i === index;

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
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al anuncio ${i + 1}`}
              aria-current={i === index}
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
