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
  cloneCms,
  emptyCmsState,
  mergeCategories,
  mergePageBanners,
  mergeSlides,
  parseCms,
  visibleTeam,
  type CmsFooter,
  type CmsState,
  type CmsTeamMember,
  type ResolvedPageBanner,
} from "@/lib/cms";

type ContentContextValue = {
  ready: boolean;
  cms: CmsState;
  slides: Slide[];
  categories: MainCategory[];
  footer: CmsFooter;
  pageBanners: ResolvedPageBanner[];
  team: CmsTeamMember[];
  saveCms: (patch: Partial<CmsState>) => void;
  resetCms: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [cms, setCms] = useState<CmsState>(() => cloneCms(emptyCmsState));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // TODO Backend: Reemplazar con fetch('/api/v1/site-content') — ver API_CONTRACT_TIENDA.md §1.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setCms(parseCms(window.localStorage.getItem(CMS_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // TODO Backend: Reemplazar con fetch('/api/v1/site-content', { method: 'PUT', body: patch }) — ver API_CONTRACT_TIENDA.md §1.
    window.localStorage.setItem(CMS_KEY, JSON.stringify(cms));
  }, [cms, ready]);

  const saveCms = useCallback((patch: Partial<CmsState>) => {
    setCms((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetCms = useCallback(() => {
    setCms(cloneCms(emptyCmsState));
  }, []);

  const slides = useMemo(
    () => mergeSlides(defaultSlides, cms.slides),
    [cms.slides],
  );
  const categories = useMemo(
    () => mergeCategories(mainCategories, cms.categories, cms.customCategories),
    [cms.categories, cms.customCategories],
  );
  const pageBanners = useMemo(
    () => mergePageBanners(cms.pageBanners),
    [cms.pageBanners],
  );
  const team = useMemo(() => visibleTeam(cms.team), [cms.team]);

  const value = useMemo(
    () => ({
      ready,
      cms,
      slides,
      categories,
      footer: cms.footer,
      pageBanners,
      team,
      saveCms,
      resetCms,
    }),
    [ready, cms, slides, categories, pageBanners, team, saveCms, resetCms],
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
