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
        keepalive: true,
      }).catch(console.error);

      // Aguarda 400ms para garantir que o disparo do Pixel e da API aconteçam antes do redirecionamento
      setTimeout(() => {
        window.location.href = urlWa;
      }, 400);
    } else {
      window.location.href = urlWa;
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      <div id="qualifying-form" className="flex flex-col gap-5 w-full">
        
        <div className="relative z-10 flex flex-col gap-2 text-left">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Renda Familiar Aproximada</label>
          <div className="relative">
            <select 
              className="h-14 w-full px-4 rounded-xl bg-white text-slate-900 text-sm md:text-base font-medium border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm appearance-none cursor-pointer"
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-2 text-left mt-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Valor para Entrada</label>
          <div className="relative">
            <select 
              className="h-14 w-full px-4 rounded-xl bg-white text-slate-900 text-sm md:text-base font-medium border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm appearance-none cursor-pointer"
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <Button
          onClick={handleWhatsAppClick}
          size="lg"
          className="relative z-10 w-full h-[60px] mt-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-[15px] font-black shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] gap-3 uppercase tracking-widest overflow-hidden"
        >
          <MessageCircle className="size-6 relative z-10" />
          <span className="relative z-10">Conectar WhatsApp</span>
        </Button>
      </div>

      {mensagemDesqualificada && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl w-full flex items-start gap-4 text-slate-800 shadow-sm animate-in fade-in slide-in-from-top-4 text-left">
          <AlertCircle className="size-6 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm font-medium leading-relaxed">
            As condições para este imóvel exigem uma composição de renda maior ou entrada em dinheiro. Converse com a corretora para analisar alternativas.
          </p>
        </div>
      )}
    </div>
  );
}
