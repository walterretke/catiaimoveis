"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QualifyingForm() {
  const [renda, setRenda] = useState("");
  const [entrada, setEntrada] = useState("");

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!renda || !entrada) {
      alert("Por favor, preencha as duas opções para ver as condições.");
      return;
    }

    const mensagem = `Olá Cátia! Tenho interesse no Mirage (R$ 385.000). Minha renda familiar é ${renda} e sobre a entrada: ${entrada}. Gostaria de mais informações.`;
    const urlWa = `https://api.whatsapp.com/send?phone=5547996174283&text=${encodeURIComponent(mensagem)}`;

    const eventId = crypto.randomUUID();
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;

    // Dispara evento de Pixel e redireciona
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

    window.open(urlWa, "_blank");
  };

  return (
    <div id="qualifying-form" className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 w-full md:w-fit bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/20 shadow-xl">
      <div className="flex flex-col gap-2 w-full md:w-[260px]">
        <label className="text-xs font-bold text-white uppercase tracking-wider">Qual a sua renda familiar aproximada?</label>
        <select 
          className="h-12 px-3 rounded-xl bg-white text-slate-900 text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={renda}
          onChange={(e) => setRenda(e.target.value)}
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
          onChange={(e) => setEntrada(e.target.value)}
        >
          <option value="" disabled>Selecione...</option>
          <option value="Sim, tenho FGTS/Economias">Sim, tenho FGTS/Economias</option>
          <option value="Não, preciso de 100% financiado">Não, preciso de 100% financiado</option>
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
  );
}
