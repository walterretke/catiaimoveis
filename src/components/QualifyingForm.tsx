"use client";

import { useState } from "react";
import { MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QualifyingForm() {
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

    const mensagem = `Olá Cátia! Tenho interesse no Mirage (R$ 385.000). Minha renda familiar é ${renda} e sobre a entrada: ${entrada}. Gostaria de mais informações.`;
    const urlWa = `https://api.whatsapp.com/send?phone=5547996174283&text=${encodeURIComponent(mensagem)}`;

    const eventId = crypto.randomUUID();
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;

    const isQualifiedForPixel = (renda === "Entre R$ 6.000 e R$ 10.000" || renda === "Acima de R$ 10.000") && entrada === "Sim, possuo os 20% necessários (FGTS/Economias)";

    if (isQualifiedForPixel) {
      // Dispara evento de Pixel e redireciona apenas para qualificados
      if ((window as any).fbq) {
        (window as any).fbq("track", "Lead", {}, { eventID: eventId });
      }

      fetch("/api/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          event_url: currentUrl,
          client_user_agent: userAgent,
        }),
      }).catch(console.error);
    }

    window.open(urlWa, "_blank");
  };

  return (
    <div className="flex flex-col w-full md:w-fit">
      <div id="qualifying-form" className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 w-full bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/20 shadow-xl">
        <div className="flex flex-col gap-2 w-full md:w-[260px]">
          <label className="text-xs font-bold text-white uppercase tracking-wider">Qual a sua renda familiar aproximada?</label>
          <select 
            className="h-12 px-3 rounded-xl bg-white text-slate-900 text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={renda}
            onChange={(e) => {
              setRenda(e.target.value);
              setMensagemDesqualificada(false);
            }}
          >
            <option value="" disabled>Selecione...</option>
            <option value="Abaixo de R$ 6.000">Abaixo de R$ 6.000</option>
            <option value="Entre R$ 6.000 e R$ 10.000">Entre R$ 6.000 e R$ 10.000</option>
            <option value="Acima de R$ 10.000">Acima de R$ 10.000</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[260px]">
          <label className="text-xs font-bold text-white uppercase tracking-wider">Possui valor para entrada?</label>
          <select 
            className="h-12 px-3 rounded-xl bg-white text-slate-900 text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={entrada}
            onChange={(e) => {
              setEntrada(e.target.value);
              setMensagemDesqualificada(false);
            }}
          >
            <option value="" disabled>Selecione...</option>
            <option value="Sim, possuo os 20% necessários (FGTS/Economias)">Sim, possuo os 20% necessários (FGTS/Economias)</option>
            <option value="Tenho apenas uma parte do valor">Tenho apenas uma parte do valor</option>
            <option value="Não possuo entrada (100% financiado)">Não possuo entrada (100% financiado)</option>
          </select>
        </div>

        <Button
          onClick={handleWhatsAppClick}
          size="lg"
          className="w-full md:w-[240px] h-14 mt-2 md:mt-0 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-base font-black shadow-[0_20px_50px_rgba(37,211,102,0.3)] transition-all transform active:scale-95 gap-2 uppercase tracking-widest"
        >
          <MessageCircle className="size-6" />
          Ver Condições
        </Button>
      </div>

      {mensagemDesqualificada && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-md w-full flex items-start gap-3 text-white shadow-lg animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">
            As condições de financiamento para este imóvel específico exigem uma composição de renda maior ou entrada em dinheiro.
          </p>
        </div>
      )}
    </div>
  );
}
