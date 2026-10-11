"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LeadButton } from "./LeadButton";

/** Barra fixa no rodapé (celular) que aparece depois que o hero sai da tela. */
export function StickyLeadBar({ preco, nota }: { preco?: string; nota?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3">
        {preco && (
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-none font-semibold text-ink">{preco}</p>
            {nota && <p className="mt-1 truncate text-[11px] text-muted">{nota}</p>}
          </div>
        )}
        <LeadButton size="md" className={preco ? "shrink-0" : "w-full"}>
          WhatsApp
        </LeadButton>
      </div>
    </div>
  );
}
