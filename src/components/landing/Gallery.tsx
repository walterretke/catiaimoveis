"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import type { Foto } from "@/content/imoveis";
import { cn } from "@/lib/utils";

const PREVIEW = 5;

export function Gallery({ fotos }: { fotos: Foto[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + fotos.length) % fotos.length)),
    [fotos.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  const preview = fotos.slice(0, PREVIEW);
  const restantes = fotos.length - PREVIEW;

  return (
    <>
      {/* Mosaico: 1 grande + 4 pequenas no desktop; carrossel no celular */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:grid-rows-2 md:gap-3 md:overflow-visible md:px-0">
        {preview.map((foto, i) => (
          <button
            key={foto.src}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "group relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl bg-sand md:w-auto",
              i === 0 && "md:col-span-2 md:row-span-2 md:aspect-auto",
            )}
          >
            <Image
              src={foto.src}
              alt={foto.legenda}
              fill
              sizes={i === 0 ? "(max-width: 768px) 82vw, 50vw" : "(max-width: 768px) 82vw, 25vw"}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {foto.legenda}
            </span>
            {i === PREVIEW - 1 && restantes > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-lg font-semibold text-white">
                +{restantes} fotos
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="inline-flex h-12 items-center gap-2 rounded-2xl border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-ink"
        >
          <Images className="size-4" />
          Ver todas as {fotos.length} fotos
        </button>
      </div>

      <Dialog.Root open={isOpen} onOpenChange={(o) => !o && setIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/95 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex flex-col outline-none"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            {index !== null && (
              <>
                <div className="flex items-center justify-between px-4 py-3 text-white">
                  <Dialog.Title className="text-sm font-medium">
                    {fotos[index].legenda}
                    <span className="ml-2 text-white/50">
                      {index + 1}/{fotos.length}
                    </span>
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">Galeria de fotos do imóvel</Dialog.Description>
                  <Dialog.Close className="rounded-full p-2 hover:bg-white/10" aria-label="Fechar galeria">
                    <X className="size-6" />
                  </Dialog.Close>
                </div>

                <div className="relative flex-1">
                  <Image
                    key={fotos[index].src}
                    src={fotos[index].src}
                    alt={fotos[index].legenda}
                    fill
                    sizes="100vw"
                    className="object-contain animate-in fade-in-0 duration-200"
                    priority
                  />
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute top-1/2 left-2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:block"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="size-7" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:block"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="size-7" />
                  </button>
                </div>

                <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4">
                  {fotos.map((foto, i) => (
                    <button
                      key={foto.src}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={cn(
                        "relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition md:size-16",
                        i === index ? "border-gold opacity-100" : "border-transparent opacity-50 hover:opacity-100",
                      )}
                      aria-label={`Ver ${foto.legenda}`}
                    >
                      <Image src={foto.src} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
