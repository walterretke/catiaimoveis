"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const IMAGES = [
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.56 (1).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.56.jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.57 (1).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.57 (2).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.57 (3).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.57 (4).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.57.jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.58 (1).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.58 (2).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.58 (3).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.58 (4).jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.58.jpeg",
  "/images/mirage-album/WhatsApp Image 2026-06-16 at 20.09.59.jpeg",
];

export function PropertyGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prevent scroll when gallery is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  return (
    <>
      {/* Gallery Entry Button - Emotional Hook */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex -space-x-4 mb-2">
           {[0, 1, 2, 3].map((i) => (
             <div key={i} className="relative size-16 md:size-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
               <Image src={IMAGES[i]} alt="Preview" fill className="object-cover" />
             </div>
           ))}
        </div>
        
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <ImageIcon className="size-5" />
          Ver todas as {IMAGES.length} fotos
        </Button>
      </div>

      {/* Modern Lightbox Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="size-8" />
          </button>

          {/* Navigation Controls */}
          <button 
            onClick={prev}
            className="absolute left-4 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all active:scale-90 md:left-10"
          >
            <ChevronLeft className="size-10" />
          </button>
          
          <button 
            onClick={next}
            className="absolute right-4 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all active:scale-90 md:right-10"
          >
            <ChevronRight className="size-10" />
          </button>

          {/* Main Image Container */}
          <div className="relative w-full max-w-6xl h-full max-h-[80vh] px-4 md:px-20 flex items-center justify-center">
            <div className="relative w-full h-full animate-in zoom-in-95 duration-300">
              <Image
                src={IMAGES[currentIndex]}
                alt={`Property Image ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Thumbnails & Counter */}
          <div className="absolute bottom-8 left-0 right-0 z-[110] flex flex-col items-center gap-6">
            <div className="bg-white/10 px-4 py-1.5 rounded-full text-white font-black text-xs uppercase tracking-widest backdrop-blur-md">
              {currentIndex + 1} / {IMAGES.length}
            </div>
            
            <div className="flex gap-2 overflow-x-auto max-w-[90vw] px-4 no-scrollbar pb-2">
              {IMAGES.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "relative size-16 md:size-20 rounded-xl overflow-hidden shrink-0 transition-all border-2",
                    currentIndex === index ? "border-blue-500 scale-110 opacity-100" : "border-transparent opacity-40 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
