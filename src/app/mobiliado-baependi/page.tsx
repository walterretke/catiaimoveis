import Image from "next/image";
import Link from "next/link";
import { CheckCircle, MapPin, Flame, Sofa } from "lucide-react";
import dynamic from "next/dynamic";
import { MobiliadoQualifyingForm } from "@/components/MobiliadoQualifyingForm";
import { PROPERTY_DETAILS } from "@/lib/constants";
import type { Metadata } from "next";

const StickyWhatsAppButton = dynamic(() => import("@/components/StickyWhatsAppButton").then((mod) => mod.StickyWhatsAppButton));
const MobiliadoGallery = dynamic(() => import("@/components/MobiliadoGallery").then((mod) => mod.MobiliadoGallery));

// Custom Instagram SVG for compatibility
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Apartamento Mobiliado Baependi | R$ 348.000 - Jaraguá do Sul",
  description: "Oportunidade única! Apartamento 100% mobiliado, decorado e equipado na Rua Baependi, Jaraguá do Sul. 2 dormitórios, acabamento premium, a 5 min do Centro. Aceita financiamento!",
};

export default function MobiliadoPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white overflow-x-hidden antialiased">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] w-full flex flex-col justify-end overflow-hidden px-6 pb-12 pt-16">
        <Image
          src="/images/100mobiliado-album/principal.jpg"
          alt="Apartamento Mobiliado Baependi - Visão Geral"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 md:bg-black/40" />
        
        {/* Modern Header Badge */}
        <div className="absolute top-8 left-6 right-6 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-2xl ring-1 ring-white/20">
            <div className="relative size-10 overflow-hidden rounded-lg border border-white/40">
              <Image
                src="/images/foto-corretora.jpg"
                alt={PROPERTY_DETAILS.broker.name}
                fill
                priority
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest text-white leading-none">
                {PROPERTY_DETAILS.broker.name}
              </span>
              <span className="text-[8px] font-bold text-amber-400 leading-none mt-1">
                CRECI 66755-F
              </span>
            </div>
            <a 
              href={PROPERTY_DETAILS.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 p-1.5 rounded-lg bg-white/10 text-white hover:bg-amber-600 transition-colors"
            >
              <InstagramIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="mb-6 flex flex-col">
            <div className="inline-flex w-fit items-center gap-2 bg-amber-600/90 backdrop-blur-sm px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] text-white mb-3 shadow-lg animate-pulse">
              <Flame className="size-3" />
              Oportunidade Única
            </div>
            <div className="inline-flex w-fit items-center gap-2 bg-emerald-600/90 backdrop-blur-sm px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] text-white mb-6 shadow-lg">
              <Sofa className="size-3" />
              100% Mobiliado, Decorado e Equipado
            </div>
            
            <h1 className="text-4xl font-black leading-[0.9] text-white md:text-7xl tracking-tighter drop-shadow-2xl">
              Mobiliado<br />
              <span className="text-amber-400">Baependi</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-6 md:gap-12 mb-8 md:mb-12">
            <div className="flex flex-col border-l-4 border-amber-500 pl-4 md:pl-6">
              <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 tracking-widest">Dormitórios</span>
              <span className="text-3xl md:text-5xl font-black text-white leading-tight">2</span>
            </div>
            <div className="flex flex-col border-l-4 border-amber-500 pl-4 md:pl-6">
              <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 tracking-widest">Localização</span>
              <span className="text-xl md:text-3xl font-black text-white leading-tight">5 min do Centro</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col">
               <div className="flex items-center gap-3 mb-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-through">De R$ 368.000</span>
               </div>
               <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Valor Especial</span>
               <span className="text-5xl font-black text-white leading-none md:text-7xl tracking-tighter">
                 R$ 348.000
               </span>
               <p className="text-[11px] text-[#64748b] mt-1 font-medium">
                 *Aceita Financiamento! Entrada sugerida a partir de R$ 69.600
               </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <MobiliadoQualifyingForm />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Photo Gallery - Conheça cada ambiente */}
      <section className="py-16 md:py-24 px-6 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 md:mb-16 text-center md:text-left">
             <div className="inline-flex items-center gap-2 text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                <div className="h-1 w-10 bg-amber-600 rounded-full" />
                Fotos Reais do Imóvel
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
               É só trazer <br className="hidden md:block" /> suas malas.
             </h2>
             <p className="text-slate-500 font-medium mt-4 max-w-2xl text-lg">
               Este apartamento impecável e com acabamento premium (gesso e piso vinílico) está sendo vendido 100% mobiliado, decorado e equipado. Veja cada detalhe.
             </p>
          </div>
          
          {/* Image grid preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
            {[
              { src: "/images/100mobiliado-album/sala de tv.jpg", label: "Sala" },
              { src: "/images/100mobiliado-album/cozinha 2.jpg", label: "Cozinha" },
              { src: "/images/100mobiliado-album/quarto 1.jpg", label: "Quarto 1" },
              { src: "/images/100mobiliado-album/banheiro.jpg", label: "Banheiro" },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg">
                <Image 
                  src={img.src} 
                  alt={img.label} 
                  fill 
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  sizes="(max-width: 768px) 50vw, 25vw" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-bold uppercase tracking-widest">{img.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
             <div className="max-w-2xl mx-auto mb-10">
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                  Quer ver cada detalhe?
                </h3>
                <p className="text-slate-600 font-medium">
                  Preparamos um álbum completo com fotos reais de todos os ângulos para você ter certeza que este é o seu novo lar.
                </p>
             </div>
             <MobiliadoGallery />
          </div>
        </div>
      </section>

      {/* 3. What&apos;s Included + Location */}
      <section className="py-16 md:py-24 px-6 bg-white overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                O que fica<br />para você.
              </h2>
              <p className="text-slate-500 font-medium mb-10 text-base">
                Tudo o que está no imóvel já é seu. Sem dor de cabeça, sem gastos extras.
              </p>
              <div className="grid gap-2">
                {[
                  "Cozinha planejada completa (Geladeira Bosch, Forno, Cooktop, Coifa)",
                  "Lavanderia sob medida com Máquina Electrolux 10kg",
                  "Sofá retrátil, TV Smart Philco 40\", Painel e Mesa de Jantar",
                  "2 Dormitórios climatizados com Ar-condicionado",
                  "2 Camas de casal e roupeiro",
                  "Churrasqueira interna planejada",
                  "Garagem coberta",
                  "Acabamento premium: Gesso e Piso Vinílico",
                  "Torneira elétrica na cozinha",
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-slate-100 py-4 group hover:bg-slate-50 px-2 transition-all rounded-lg">
                    <span className="text-base font-bold text-slate-700 tracking-tight">{item}</span>
                    <CheckCircle className="size-5 text-amber-500 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
               <div className="relative group h-[400px] md:h-[550px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
                  <Image
                    src="/images/100mobiliado-album/cozinha 3.jpg"
                    alt="Cozinha planejada completa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
                  
                  <div className="absolute bottom-6 left-6 right-6 p-8 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border border-white/20">
                    <div className="flex items-start gap-4">
                       <div className="flex size-12 shrink-0 items-center justify-center bg-slate-900 rounded-2xl text-white">
                          <MapPin className="size-6" />
                       </div>
                       <div>
                          <p className="font-black text-xl leading-none uppercase tracking-tighter text-slate-900">Jaraguá do Sul</p>
                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-2">5 min do Centro • Portaria da WEG II</p>
                          <p className="text-slate-500 mt-3 text-sm font-medium leading-relaxed">
                            Localização estratégica, colado na portaria da WEG II e a apenas 5 minutos do Centro da cidade.
                          </p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer - Domus Compliance */}
      <footer className="py-16 px-6 bg-slate-950 text-white border-t border-white/5">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-10 flex justify-center">
            <div className="relative size-32 md:size-40 overflow-hidden rounded-[2rem] border-2 border-white/10 shadow-2xl">
              <Image
                src="/images/foto-corretora.jpg"
                alt={PROPERTY_DETAILS.broker.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          </div>
          
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{PROPERTY_DETAILS.broker.name}</h3>
          <p className="text-amber-400 text-xs font-black uppercase tracking-[0.3em] mb-12">
            CRECI 66755-F • Domus Associados
          </p>
          
          <div className="max-w-2xl mx-auto mb-16">
             <p className="text-xl md:text-2xl font-bold text-slate-300 leading-relaxed italic">
               &quot;{PROPERTY_DETAILS.broker.bio}&quot;
             </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10 border-t border-white/5">
             <Link href="/privacidade" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                Política de Privacidade
             </Link>
             <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                Página da Corretora
             </Link>
             <a 
               href={PROPERTY_DETAILS.instagram}
               target="_blank" 
               rel="noopener noreferrer"
               className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2"
             >
                <InstagramIcon className="size-3.5" />
                Siga no Instagram
             </a>
          </div>
        </div>
      </footer>

      {/* Fixed UI Elements */}
      <StickyWhatsAppButton />
    </main>
  );
}
