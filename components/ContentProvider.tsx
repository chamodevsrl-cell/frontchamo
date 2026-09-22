"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

/**
 * `null` si se guardó bien; un mensaje para mostrar al admin si no (p. ej.
 * `localStorage` sin espacio por fotos muy pesadas) — nunca lanza, para no
 * tumbar la página con una excepción no atrapada.
 */
type SaveCmsResult = string | null;

type ContentContextValue = {
  ready: boolean;
  cms: CmsState;
  slides: Slide[];
  categories: MainCategory[];
  footer: CmsFooter;
  pageBanners: ResolvedPageBanner[];
  team: CmsTeamMember[];
  saveCms: (patch: Partial<CmsState>) => SaveCmsResult;
  resetCms: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function persistCms(next: CmsState): SaveCmsResult {
  try {
    window.localStorage.setItem(CMS_KEY, JSON.stringify(next));
    return null;
  } catch (cause) {
    if (cause instanceof DOMException && (cause.name === "QuotaExceededError" || cause.code === 22)) {
      return "No se pudo guardar: las imágenes son muy pesadas para el almacenamiento de este navegador. Usa fotos más livianas o menos imágenes e intenta de nuevo.";
    }
    return "No se pudo guardar los cambios en este navegador.";
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [cms, setCms] = useState<CmsState>(() => cloneCms(emptyCmsState));
  const [ready, setReady] = useState(false);
  const cmsRef = useRef(cms);
  useEffect(() => {
    cmsRef.current = cms;
  }, [cms]);

  useEffect(() => {
    // TODO Backend: Reemplazar con fetch('/api/v1/site-content') — ver API_CONTRACT_TIENDA.md §1.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setCms(parseCms(window.localStorage.getItem(CMS_KEY)));
    setReady(true);
  }, []);

  // TODO Backend: Reemplazar con fetch('/api/v1/site-content', { method: 'PUT', body: patch }) — ver API_CONTRACT_TIENDA.md §1.
  const saveCms = useCallback((patch: Partial<CmsState>): SaveCmsResult => {
    const next = { ...cmsRef.current, ...patch };
    setCms(next);
    return persistCms(next);
  }, []);

  const resetCms = useCallback(() => {
    const next = cloneCms(emptyCmsState);
    setCms(next);
    persistCms(next);
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
