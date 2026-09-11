"use client";

import { useLayoutEffect, useState } from "react";
import BrandLoader, { BRAND_LOADER_MS } from "@/components/BrandLoader";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip overlay if the user prefers reduced motion
      setVisible(false);
      return;
    }

    document.documentElement.classList.add("intro-playing");
    const timer = window.setTimeout(() => setVisible(false), BRAND_LOADER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <BrandLoader
      visible={visible}
      onExited={() => {
        document.documentElement.classList.remove("intro-playing");
      }}
    />
  );
}
