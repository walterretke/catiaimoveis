import Image from "next/image";
import Link from "next/link";
import { CheckCircle, MapPin, Info, Sparkles, Star, Eye, Timer } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StickyWhatsAppButton } from "@/components/StickyWhatsAppButton";
import { InteractiveImageCard } from "@/components/InteractiveImageCard";
import { PropertyGallery } from "@/components/PropertyGallery";
import { PROPERTY_DETAILS } from "@/lib/constants";

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

export default function LoteamentoMiragePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white overflow-x-hidden antialiased">
      {/* 1. Hero Section - Refined Proportions for PC */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] w-full flex flex-col justify-end overflow-hidden px-6 pb-12 pt-16">
        <Image
          src="/images/Fachada.JPG"
          alt="Fachada do Loteamento Mirage"
          fill
          priority
          className="object-cover object-center scale-105"
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
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest text-white leading-none">
                {PROPERTY_DETAILS.broker.name}
              </span>
              <span className="text-[8px] font-bold text-blue-400 leading-none mt-1">
                CRECI 66755-F
              </span>
            </div>
            <a 
              href={PROPERTY_DETAILS.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 p-1.5 rounded-lg bg-white/10 text-white hover:bg-blue-600 transition-colors"
            >
              <InstagramIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="mb-6 flex flex-col">
            <div className="inline-flex w-fit items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] text-white mb-6 shadow-lg animate-pulse">
              <Sparkles className="size-3" />
              Últimas unidades disponíveis
            </div>
            
            <h1 className="text-5xl font-black leading-[0.9] text-white md:text-7xl tracking-tighter drop-shadow-2xl">
              {PROPERTY_DETAILS.name}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-6 md:gap-12 mb-8 md:mb-12">
            <div className="flex flex-col border-l-4 border-blue-600 pl-4 md:pl-6">
              <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 tracking-widest">Área Privativa</span>
              <span className="text-3xl md:text-5xl font-black text-white leading-tight">80m²</span>
            </div>
            <div className="flex flex-col border-l-4 border-blue-600 pl-4 md:pl-6">
              <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 tracking-widest">Dormitórios</span>
              <span className="text-3xl md:text-5xl font-black text-white leading-tight">1 Suíte + 2</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Investimento</span>
               <span className="text-5xl font-black text-white leading-none md:text-7xl tracking-tighter">
                 R$ 385.000
               </span>
            </div>
            
            <div className="flex flex-col gap-3">
              <WhatsAppButton className="w-full h-16 md:h-16 text-base rounded-xl md:w-[320px] font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(37,211,102,0.3)]" />
              <div className="inline-flex items-center justify-center md:justify-start gap-2 text-yellow-400 text-[10px] font-black uppercase tracking-widest">
                <Info className="size-4 shrink-0" />
                <span>PODE SER FINANCIADO PELO MINHA CASA MINHA VIDA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Experience - Refined Spacing */}
      <section className="py-16 md:py-24 px-6 bg-[#F8FAFC]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 md:mb-16 text-center md:text-left">
             <div className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                <div className="h-1 w-10 bg-blue-600 rounded-full" />
                Interatividade
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
               Imagine o <br className="hidden md:block" /> seu futuro.
             </h2>
          </div>
          
          <div className="grid gap-10 md:grid-cols-3">
            <InteractiveImageCard
              title="Área Social"
              originalSrc="/images/Sala e Cozinha.JPG"
              furnishedSrc="/images/Sala e Cozinha - Mobiliado.png"
            />
            <InteractiveImageCard
              title="Suíte Master"
              originalSrc="/images/Quarto.JPG"
              furnishedSrc="/images/Quarto - Imobiliado.png"
            />
            <InteractiveImageCard
              title="Detalhes & Banho"
              originalSrc="/images/Banheiro.JPG"
              furnishedSrc="/images/Banheiro - Imobiliado.png"
            />
          </div>

          <div className="mt-20 text-center">
             <div className="max-w-2xl mx-auto mb-10">
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                  Quer ver cada detalhe?
                </h3>
                <p className="text-slate-600 font-medium">
                  Preparamos um álbum completo com fotos reais de todos os ângulos para você ter certeza que este é o seu novo lar.
                </p>
             </div>
             <PropertyGallery />
          </div>
        </div>
      </section>

      {/* 3. Specs & Location - Balanced Columns */}
      <section className="py-16 md:py-24 px-6 bg-white overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-10">
                O Prédio.
              </h2>
              <div className="grid gap-2">
                {[
                  "Sacada com Churrasqueira a carvão",
                  "1 Suíte + 2 Dormitórios amplos",
                  "Vaga de Garagem Privativa",
                  "Fino Acabamento com Gesso",
                  "Localização em Plena Valorização"
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-slate-100 py-4 group hover:bg-slate-50 px-2 transition-all rounded-lg">
                    <span className="text-base font-bold text-slate-700 tracking-tight">{item}</span>
                    <CheckCircle className="size-5 text-blue-600" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
               <div className="relative group h-[400px] md:h-[550px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
                  <Image
                    src="/images/Fachada.JPG"
                    alt="Localização"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
                  
                  <div className="absolute bottom-6 left-6 right-6 p-8 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border border-white/20">
                    <div className="flex items-start gap-4">
                       <div className="flex size-12 shrink-0 items-center justify-center bg-slate-900 rounded-2xl text-white">
                          <MapPin className="size-6" />
                       </div>
                       <div>
                          <p className="font-black text-xl leading-none uppercase tracking-tighter text-slate-900">Três Rios do Norte</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-2">Jaraguá do Sul / SC</p>
                          <p className="text-slate-500 mt-3 text-sm font-medium leading-relaxed">
                            Bairro em constante crescimento, unindo a paz da natureza com a conveniência da cidade.
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
              />
            </div>
          </div>
          
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{PROPERTY_DETAILS.broker.name}</h3>
          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-12">
            CRECI 66755-F • Domus Associados
          </p>
          
          <div className="max-w-2xl mx-auto mb-16">
             <p className="text-xl md:text-2xl font-bold text-slate-300 leading-relaxed italic">
               "{PROPERTY_DETAILS.broker.bio}"
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
