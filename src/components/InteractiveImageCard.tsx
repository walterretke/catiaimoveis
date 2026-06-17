"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveImageCardProps {
  title: string;
  originalSrc: string;
  furnishedSrc: string;
}

export function InteractiveImageCard({
  title, originalSrc, furnishedSrc,
}: InteractiveImageCardProps) {
  const [showFurnished, setShowFurnished] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
      <div 
        className="relative aspect-video w-full cursor-pointer overflow-hidden"
        onClick={() => setShowFurnished(!showFurnished)}
      >
        {/* Base Image */}
        <Image
          src={originalSrc}
          alt={`${title} original`}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            showFurnished ? "opacity-0" : "opacity-100"
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Furnished Overlay Image */}
        <Image
          src={furnishedSrc}
          alt={`${title} mobiliado`}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            showFurnished ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Simple Label */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(
            "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md shadow-lg",
            showFurnished ? "bg-yellow-400 text-black" : "bg-white text-slate-900"
          )}>
            {showFurnished ? "Projeto Mobiliado" : "Foto Real"}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <h3 className="text-lg font-black text-white leading-tight">{title}</h3>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
            <Eye className="size-5" />
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50">
        <Button
          onClick={() => setShowFurnished(!showFurnished)}
          variant="outline"
          className={cn(
            "w-full h-12 rounded-xl transition-all gap-2 text-sm font-black border-2",
            showFurnished 
              ? "bg-slate-900 text-white border-slate-900" 
              : "border-slate-300 text-slate-700 bg-white"
          )}
        >
          {showFurnished ? <Home className="size-4" /> : <Sparkles className="size-4 text-blue-600" />}
          {showFurnished ? "Ver Foto Real" : "Ver Projeto Mobiliado"}
        </Button>
      </div>
    </div>
  );
}
