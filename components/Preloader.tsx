"use client";

import { useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cog } from "lucide-react";

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B3554]"
          key="chamo-preloader"
          role="status"
          aria-live="polite"
          aria-label="Cargando Chamo Import"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-24%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="font-display text-center text-3xl font-extrabold tracking-[0.18em] text-white uppercase sm:text-4xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Chamo Import
          </motion.p>

          <motion.div
            className="mt-6"
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
          >
            <Cog
              className="h-12 w-12 text-[#E4B714] sm:h-14 sm:w-14"
              strokeWidth={1.6}
            />
          </motion.div>

          <div className="absolute inset-x-8 bottom-8 h-1 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full bg-[#127EC9]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: HOLD_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
