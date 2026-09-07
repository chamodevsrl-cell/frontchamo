"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { ImageIcon } from "lucide-react";
import { slides } from "@/data/media";

const INTERVAL_MS = 5500;
const SWIPE_THRESHOLD = 45;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [failed, setFailed] = useState<Record<number, boolean>>({});
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
      className="animate-hero-enter relative w-full overflow-hidden bg-brand-primary touch-pan-y"
      aria-roledescription="carrusel"
      aria-label="Anuncios destacados"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative mx-auto aspect-[21/9] min-h-[220px] w-full max-w-[1600px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[420px]">
        {slides.map((slide, i) => {
          const active = i === index;
          const showImage = loaded[slide.id] && !failed[slide.id];

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                active
                  ? "z-10 translate-x-0 scale-100 opacity-100"
                  : "pointer-events-none z-0 translate-x-4 scale-[1.02] opacity-0"
              }`}
              aria-hidden={!active}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-[#0f6fb3] to-brand-dark">
                {!failed[slide.id] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className={`h-full w-full object-cover transition-opacity duration-500 select-none ${
                      showImage ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() =>
                      setLoaded((prevState) => ({
                        ...prevState,
                        [slide.id]: true,
                      }))
                    }
                    onError={() =>
                      setFailed((prevState) => ({
                        ...prevState,
                        [slide.id]: true,
                      }))
                    }
                  />
                )}

                {!showImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-dashed border-white/20 bg-brand-dark/30">
                    <ImageIcon
                      className="h-10 w-10 text-white/35 sm:h-12 sm:w-12"
                      strokeWidth={1.5}
                    />
                    <p className="font-display text-sm font-semibold tracking-wide text-white/50 uppercase sm:text-base">
                      Imagen del anuncio
                    </p>
                    <p className="max-w-xs px-4 text-center text-xs text-white/40">
                      Coloca{" "}
                      <span className="font-medium text-brand-gold/80">
                        {slide.src.replace("/images/slider/", "")}
                      </span>{" "}
                      en{" "}
                      <code className="text-white/55">public/images/slider/</code>
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/70 via-brand-dark/35 to-transparent" />
              </div>

              <div
                className={`relative z-10 flex h-full max-w-xl flex-col justify-end px-6 pb-12 sm:px-10 sm:pb-14 lg:px-14 ${
                  active
                    ? "translate-y-0 opacity-100 transition-all delay-150 duration-700"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-gold uppercase sm:text-sm">
                  Chamo Import
                </p>
                <h2 className="font-display text-2xl font-bold text-white sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-2 text-sm text-white/85 sm:text-base lg:text-lg">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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
