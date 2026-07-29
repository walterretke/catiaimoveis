import Image from "next/image";
import Link from "next/link";
import { MessageCircle, CheckCircle2, Lock, ShieldCheck, Star } from "lucide-react";
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
    <main className="flex min-h-screen flex-col bg-[#F3F4F6] overflow-x-hidden antialiased">
      {/* 1. Hero Section - Best Practices Applied: Focused, Conversational, Mobile-First */}
      <section className="relative flex flex-col justify-center items-center w-full min-h-[100vh] px-4 md:px-6 py-12 md:py-20 bg-[url('/images/pattern.svg')] bg-repeat bg-opacity-50">
        
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center mt-2 md:mt-0">
          
          {/* WhatsApp Connection Indicator - Reduced friction visually */}
          <div className="flex flex-col items-center mb-6 w-full px-4">
            <div className="relative flex items-center justify-center size-16 md:size-20 bg-[#25D366] rounded-full shadow-[0_0_30px_rgba(37,211,102,0.3)] mb-4 animate-bounce-slow">
              <MessageCircle className="size-8 md:size-10 text-white" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <CheckCircle2 className="size-4 md:size-5 text-[#25D366]" />
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black leading-[1.1] text-slate-800 tracking-tight mb-2">
              Quase lá! Falta só 1 passo.
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xs">
              Conexão segura com o WhatsApp de {PROPERTY_DETAILS.broker.name}.
            </p>
          </div>

          {/* Conversational UI - Simulates chat */}
          <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none shadow-sm border border-slate-200 text-left mb-6 w-full max-w-sm relative self-start ml-2 md:ml-0 mt-4">
             <div className="absolute -top-6 -left-2 size-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image src="/images/foto-corretora.jpg" alt="Corretora" fill className="object-cover" />
             </div>
             <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
               "Olá! Vi que você tem interesse no <strong>{imovelName}</strong>
               {imovelValor ? ` (R$ ${imovelValor})` : ""}. Para eu te passar todas as informações e as melhores condições de forma rápida, responda só essas duas perguntinhas abaixo:"
             </p>
          </div>
          
          <div className="w-full">
            <GenericQualifyingForm 
              imovelNome={imovelName !== "seu próximo imóvel" ? imovelName : undefined}
              imovelValor={imovelValor}
            />
          </div>
          
          {/* Social Proof & Trust Badges (Best Practices) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 w-full">
             <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-semibold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
               <ShieldCheck className="size-4 text-[#25D366]" /> CRECI {PROPERTY_DETAILS.broker.creci || "66755-F"}
             </div>
             <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
               <Lock className="size-3" /> Respostas 100% confidenciais
             </div>
          </div>
        </div>
      </section>

      {/* Fixed UI Elements */}
      <StickyWhatsAppButton />
    </main>
  );
}
