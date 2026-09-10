"use client";

import { useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HOLD_MS = 2500;

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip overlay if the user prefers reduced motion
      setVisible(false);
      return;
    }

    document.documentElement.classList.add("intro-playing");
    const timer = window.setTimeout(() => setVisible(false), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove("intro-playing");
      }}
    >
      {visible ? (
        <motion.div
          key="chamo-preloader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B3554]"
          role="status"
          aria-live="polite"
          aria-label="Cargando Chamo Import"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/logo.png"
            alt="Chamo Import S.R.L."
            className="h-auto w-[min(82vw,24rem)] object-contain"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.img
            src="/engranaje.png"
            alt=""
            width={60}
            height={60}
            aria-hidden
            className="mt-8 h-[60px] w-[60px] object-contain"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
          />

          <p className="mt-3 font-display text-sm font-extrabold tracking-[0.32em] text-[#E4B714]">
            CARGANDO...
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
