"use client";

import { AnimatePresence, motion } from "framer-motion";

export const BRAND_LOADER_MS = 2500;

type BrandLoaderProps = {
  visible: boolean;
  onExited?: () => void;
};

export default function BrandLoader({ visible, onExited }: BrandLoaderProps) {
  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible ? (
        <motion.div
          key="chamo-brand-loader"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#0B3554]"
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
