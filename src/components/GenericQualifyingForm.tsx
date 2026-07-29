"use client";

import { useState } from "react";
import { MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenericQualifyingFormProps {
  imovelNome?: string;
  imovelValor?: string;
}

export function GenericQualifyingForm({ imovelNome, imovelValor }: GenericQualifyingFormProps) {
  const [renda, setRenda] = useState("");
  const [entrada, setEntrada] = useState("");
  const [mensagemDesqualificada, setMensagemDesqualificada] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!renda || !entrada) {
      alert("Por favor, preencha as duas opções para ver as condições.");
      return;
    }

    if (renda === "Abaixo de R$ 6.000" && entrada === "Não possuo entrada (100% financiado)") {
      setMensagemDesqualificada(true);
      return;
    }

    setMensagemDesqualificada(false);

    const nomeMensagem = imovelNome || "seu próximo imóvel";
    const valorMensagem = imovelValor ? ` (R$ ${imovelValor})` : "";
    
    const mensagem = `Olá Cátia! Tenho interesse no ${nomeMensagem}${valorMensagem}. Minha renda familiar é ${renda} e sobre a entrada: ${entrada}. Gostaria de mais informações.`;
    const urlWa = `https://api.whatsapp.com/send?phone=5547996174283&text=${encodeURIComponent(mensagem)}`;

    const eventId = crypto.randomUUID();
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;

    const isQualifiedForPixel = entrada !== "Não possuo entrada (100% financiado)";

    if (isQualifiedForPixel) {
      // Dispara evento de Pixel e redireciona apenas para qualificados
      if ((window as any).fbq) {
        (window as any).fbq("track", "Lead", {}, { eventID: eventId });
      }

      fetch("/api/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "Lead",
          event_id: eventId,
          event_url: currentUrl,
          client_user_agent: userAgent,
        }),
      }).catch(console.error);
    }

    window.open(urlWa, "_blank");
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <div id="qualifying-form" className="flex flex-col gap-5 w-full bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Qual a sua renda familiar aproximada?</label>
          <select 
            className="h-14 px-4 rounded-xl bg-slate-50 text-slate-900 text-base font-semibold border border-slate-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all shadow-sm"
            value={renda}
            onChange={(e) => {
              setRenda(e.target.value);
              setMensagemDesqualificada(false);
            }}
          >
            <option value="" disabled>Selecione sua renda...</option>
            <option value="Abaixo de R$ 6.000">Abaixo de R$ 6.000</option>
            <option value="Entre R$ 6.000 e R$ 10.000">Entre R$ 6.000 e R$ 10.000</option>
            <option value="Acima de R$ 10.000">Acima de R$ 10.000</option>
          </select>
        </div>

        <div className="relative z-10 flex flex-col gap-2 text-left mt-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Possui valor para entrada?</label>
          <select 
            className="h-14 px-4 rounded-xl bg-slate-50 text-slate-900 text-base font-semibold border border-slate-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all shadow-sm"
            value={entrada}
            onChange={(e) => {
              setEntrada(e.target.value);
              setMensagemDesqualificada(false);
            }}
          >
            <option value="" disabled>Selecione uma opção...</option>
            <option value="Sim, possuo os 20% necessários (FGTS/Economias)">Sim, possuo os 20% (FGTS/Economias)</option>
            <option value="Tenho apenas uma parte do valor">Tenho apenas uma parte do valor</option>
            <option value="Não possuo entrada (100% financiado)">Não possuo entrada (100% financiado)</option>
          </select>
        </div>

        <Button
          onClick={handleWhatsAppClick}
          size="lg"
          className="relative z-10 w-full h-16 mt-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-lg font-black shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95 gap-3 uppercase tracking-wider"
        >
          <MessageCircle className="size-6" />
          LIBERAR WHATSAPP AGORA
        </Button>
      </div>

      {mensagemDesqualificada && (
        <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-2xl w-full flex items-start gap-4 text-slate-800 shadow-sm animate-in fade-in slide-in-from-top-4 text-left">
          <AlertCircle className="size-6 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">
            As condições de financiamento podem exigir uma composição de renda maior ou entrada em dinheiro dependendo do imóvel. Converse com a corretora para analisar seu caso.
          </p>
        </div>
      )}
    </div>
  );
}
