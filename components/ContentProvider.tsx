"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mainCategories, type MainCategory } from "@/data/home";
import { slides as defaultSlides, type Slide } from "@/data/media";
import {
  CMS_KEY,
  emptyCmsState,
  mergeCategories,
  mergeSlides,
  parseCms,
  type CmsState,
} from "@/lib/cms";

type ContentContextValue = {
  ready: boolean;
  cms: CmsState;
  slides: Slide[];
  categories: MainCategory[];
  saveCms: (next: CmsState) => void;
  resetCms: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [cms, setCms] = useState<CmsState>(emptyCmsState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setCms(parseCms(window.localStorage.getItem(CMS_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CMS_KEY, JSON.stringify(cms));
  }, [cms, ready]);

  const saveCms = useCallback((next: CmsState) => {
    setCms(next);
  }, []);

  const resetCms = useCallback(() => {
    setCms(emptyCmsState);
  }, []);

  const slides = useMemo(
    () => mergeSlides(defaultSlides, cms.slides),
    [cms.slides],
  );
  const categories = useMemo(
    () => mergeCategories(mainCategories, cms.categories),
    [cms.categories],
  );

  const value = useMemo(
    () => ({ ready, cms, slides, categories, saveCms, resetCms }),
    [ready, cms, slides, categories, saveCms, resetCms],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useSiteContent debe usarse dentro de ContentProvider");
  }
  return ctx;
}
