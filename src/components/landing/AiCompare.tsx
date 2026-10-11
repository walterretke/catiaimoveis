"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { ComparativoIA } from "@/content/imoveis";
import { cn } from "@/lib/utils";

function CompareCard({ item }: { item: ComparativoIA }) {
  const [mobiliado, setMobiliado] = useState(false);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[4/3] bg-sand">
        <Image src={item.real} alt={`${item.titulo} — foto real`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        <Image
          src={item.mobiliado}
          alt={`${item.titulo} — projeto mobiliado (ilustrativo)`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn("object-cover transition-opacity duration-500", mobiliado ? "opacity-100" : "opacity-0")}
        />
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold",
            mobiliado ? "bg-gold text-white" : "bg-white text-ink",
          )}
        >
          {mobiliado ? "Ilustração por IA" : "Foto real"}
        </span>
      </div>
      <figcaption className="flex items-center justify-between gap-3 p-3">
        <span className="font-medium text-ink">{item.titulo}</span>
        <div className="flex rounded-full bg-sand p-1 text-xs font-semibold" role="group" aria-label={`Visualização de ${item.titulo}`}>
          <button
            type="button"
            onClick={() => setMobiliado(false)}
            aria-pressed={!mobiliado}
            className={cn("rounded-full px-3 py-1.5 transition", !mobiliado ? "bg-white text-ink shadow-sm" : "text-muted")}
          >
            Real
          </button>
          <button
            type="button"
            onClick={() => setMobiliado(true)}
            aria-pressed={mobiliado}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition",
              mobiliado ? "bg-white text-ink shadow-sm" : "text-muted",
            )}
          >
            <Sparkles className="size-3" /> Mobiliado
          </button>
        </div>
      </figcaption>
    </figure>
  );
}

export function AiCompare({ itens }: { itens: ComparativoIA[] }) {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {itens.map((item) => (
          <CompareCard key={item.titulo} item={item} />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        As versões mobiliadas são ilustrações geradas por IA, apenas para inspiração.
      </p>
    </div>
  );
}
