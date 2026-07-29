import Image from "next/image";
import Link from "next/link";
import { MessageCircle, CheckCircle2, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { GenericQualifyingForm } from "@/components/GenericQualifyingForm";
import { PROPERTY_DETAILS } from "@/lib/constants";

const StickyWhatsAppButton = dynamic(() => import("@/components/StickyWhatsAppButton").then((mod) => mod.StickyWhatsAppButton));

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GenericHomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Accept both 'nome' and 'imovel' for retro-compatibility
  const paramNome = params.nome || params.imovel;
  const paramValor = params.valor;

  const imovelName = typeof paramNome === "string" && paramNome.trim() !== "" 
    ? paramNome 
    : "seu próximo imóvel";
    
  const imovelValor = typeof paramValor === "string" && paramValor.trim() !== "" 
    ? paramValor 
    : undefined;

  return (
    <main className="flex min-h-screen flex-col bg-[#FAFAFA] overflow-x-hidden antialiased selection:bg-blue-100">
      
      {/* Subtle Immersive Background (Bright & Clean) */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/Fachada.JPG"
          alt="Background"
          fill
          priority
          className="object-cover scale-105 opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center w-full min-h-[100vh] px-4 py-12 md:py-16">
        
        <div className="w-full max-w-[500px] mx-auto flex flex-col items-center">
          
          {/* Header - Broker Identity */}
          <div className="flex flex-col items-center mb-6 z-20 translate-y-6">
            <div className="relative size-20 md:size-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
               <Image src="/images/foto-corretora.jpg" alt={PROPERTY_DETAILS.broker.name} fill className="object-cover" />
               <div className="absolute inset-0 ring-1 ring-black/10 rounded-full"></div>
            </div>
            <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-2 mt-[-10px] z-10">
              <ShieldCheck className="size-3.5 text-blue-600" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{PROPERTY_DETAILS.broker.name}</span>
            </div>
          </div>

          {/* Clean Elegant Card */}
          <div className="w-full bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative">
            
            {/* Title & Context */}
            <div className="text-center mb-8 pt-4">
              <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-slate-900 mb-3">
                Atendimento Exclusivo
              </h1>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left relative">
                 {/* Small triangle for chat bubble effect */}
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 rotate-45"></div>
                 <p className="text-slate-600 text-[14px] md:text-[15px] leading-relaxed relative z-10">
                   "Olá! Estou pronta para te passar todas as informações do <strong>{imovelName}</strong>
                   {imovelValor ? ` (R$ ${imovelValor})` : ""}. Responda rápido as duas perguntas abaixo para liberar nosso contato no WhatsApp."
                 </p>
              </div>
            </div>

            {/* Form */}
            <div className="w-full">
              <GenericQualifyingForm 
                imovelNome={imovelName !== "seu próximo imóvel" ? imovelName : undefined}
                imovelValor={imovelValor}
              />
            </div>
            
          </div>
          
          {/* Trust Elements */}
          <div className="mt-8 flex items-center justify-center gap-4 w-full text-slate-400">
             <div className="flex items-center gap-1.5 text-[11px] font-medium">
               <Lock className="size-3.5" /> Suas informações estão seguras
             </div>
             <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
             <div className="flex items-center gap-1.5 text-[11px] font-medium">
               CRECI {PROPERTY_DETAILS.broker.creci || "66755-F"}
             </div>
          </div>

        </div>
      </section>

      <StickyWhatsAppButton />
    </main>
  );
}
