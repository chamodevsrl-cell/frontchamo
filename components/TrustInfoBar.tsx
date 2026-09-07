"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { Package, Truck, Users, Wallet } from "lucide-react";
import { trustItems } from "@/data/home";

const icons = {
  truck: Truck,
  package: Package,
  wallet: Wallet,
  users: Users,
} as const;

const INTERVAL_MS = 4000;
const SWIPE_THRESHOLD = 40;

export default function TrustInfoBar() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((next: number) => {
    setIndex((next + trustItems.length) % trustItems.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % trustItems.length);
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
    <section className="bg-brand-dark text-white" aria-label="Beneficios">
      {/* Móvil: carrusel */}
      <div
        className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carrusel"
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          {trustItems.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Beneficio ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-brand-gold"
                  : "w-2 bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>

        <div className="relative min-h-[4.5rem] overflow-hidden">
          {trustItems.map((item, i) => {
            const Icon = icons[item.icon];
            const active = i === index;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-center gap-4 transition-all duration-500 ease-out ${
                  active
                    ? "relative translate-x-0 opacity-100"
                    : "pointer-events-none absolute inset-0 translate-x-6 opacity-0"
                }`}
                aria-hidden={!active}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-display text-base font-bold tracking-wide">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-white/70">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop / tablet ancha: grilla */}
      <div className="mx-auto hidden max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:px-8 xl:px-10">
        {trustItems.map((item) => {
          const Icon = icons[item.icon];
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display text-sm font-bold tracking-wide">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-white/70">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
