"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Dispara PageView nas navegações internas (ex.: clicar em "Outros imóveis").
 * O primeiro PageView já sai no script do pixel, então o primeiro render é ignorado.
 */
export function PixelPageView() {
  const pathname = usePathname();
  const primeiro = useRef(true);

  useEffect(() => {
    if (primeiro.current) {
      primeiro.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
