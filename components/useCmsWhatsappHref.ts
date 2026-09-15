"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { cmsWhatsappUrl, footerWhatsapp } from "@/lib/cms";

export function useCmsWhatsappHref() {
  const { footer } = useSiteContent();
  return (text: string) => cmsWhatsappUrl(footerWhatsapp(footer), text);
}
