"use client";

import { useState } from "react";
import { MessageCircle, CheckCircle2, X, Loader2 } from "lucide-react";

interface GenericQualifyingFormProps {
  imovelNome?: string;
  imovelValor?: string;
}

export function GenericQualifyingForm({ imovelNome, imovelValor }: GenericQualifyingFormProps) {
  const [showPoll, setShowPoll] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const whatsappUrl = (entrada: string) => {
    const nomeMensagem = imovelNome || "seu próximo imóvel";
    const valorMensagem = imovelValor ? ` (R$ ${imovelValor})` : "";
    const mensagem = `Olá Cátia! Tenho interesse no ${nomeMensagem}${valorMensagem}. Sobre a entrada: ${entrada}. Gostaria de mais informações.`;
    return `https://api.whatsapp.com/send?phone=5547996174283&text=${encodeURIComponent(mensagem)}`;
  };

  const firePixelAndRedirect = (entrada: string) => {
    // Marca visualmente a opção selecionada
    setSelectedOption(entrada);

    const eventId = crypto.randomUUID();
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;
    const urlWa = whatsappUrl(entrada);

    const isQualifiedForPixel = entrada !== "Não possuo entrada (100% financiado)";

    console.log("[PIXEL DEBUG] entrada:", entrada);
    console.log("[PIXEL DEBUG] qualificado:", isQualifiedForPixel);
    console.log("[PIXEL DEBUG] fbq:", typeof (window as any).fbq);

    if (isQualifiedForPixel) {
      if ((window as any).fbq) {
        (window as any).fbq("track", "Lead", {}, { eventID: eventId });
        console.log("[PIXEL DEBUG] ✅ fbq Lead disparado:", eventId);
      } else {
        console.error("[PIXEL DEBUG] ❌ fbq não encontrado");
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
      })
        .then((res) => res.json())
        .then((data) => console.log("[PIXEL DEBUG] ✅ API:", data))
        .catch((err) => console.error("[PIXEL DEBUG] ❌ API:", err));
    }

    // Aguarda 1.2s mostrando feedback visual antes de redirecionar
    setTimeout(() => {
      window.location.href = urlWa;
    }, 1200);
  };

  const options = [
    { label: "Sim, possuo os 20% (FGTS/Economias)", value: "Sim, possuo os 20% necessários (FGTS/Economias)", qualified: true },
    { label: "Tenho apenas uma parte do valor", value: "Tenho apenas uma parte do valor", qualified: true },
    { label: "Não possuo entrada (100% financiado)", value: "Não possuo entrada (100% financiado)", qualified: false },
  ];

  return (
    <>
      {/* Botão principal do WhatsApp */}
      <button
        onClick={() => setShowPoll(true)}
        className="w-full h-[60px] bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-[15px] font-black shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest"
      >
        <MessageCircle className="size-6" />
        Conectar WhatsApp
      </button>

      {/* Modal de Enquete */}
      {showPoll && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !selectedOption && setShowPoll(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {!selectedOption && (
              <button
                onClick={() => setShowPoll(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            )}

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center size-12 bg-[#25D366]/10 rounded-2xl mb-3">
                <MessageCircle className="size-6 text-[#25D366]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {selectedOption ? "Conectando ao WhatsApp..." : "Só mais uma coisa..."}
              </h3>
              <p className="text-sm text-slate-500">
                {selectedOption ? "Você será redirecionado em instantes" : "Você possui valor para entrada?"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {options.map((opt) => {
                const isSelected = selectedOption === opt.value;
                const isDisabled = selectedOption !== null && !isSelected;

                return (
                  <button
                    key={opt.value}
                    onClick={() => !selectedOption && firePixelAndRedirect(opt.value)}
                    disabled={!!selectedOption}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                      isSelected
                        ? "border-[#25D366] bg-[#25D366]/10 scale-[1.02]"
                        : isDisabled
                        ? "border-slate-100 bg-slate-50 opacity-40 scale-[0.98]"
                        : opt.qualified
                        ? "border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/5"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isSelected
                        ? "border-[#25D366] bg-[#25D366]"
                        : "border-slate-300"
                    }`}>
                      {isSelected ? (
                        <CheckCircle2 className="size-3 text-white" />
                      ) : null}
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-300 ${
                      isSelected ? "text-[#25D366]" : "text-slate-700"
                    }`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <Loader2 className="size-4 text-[#25D366] animate-spin ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-5">
              {selectedOption ? "Preparando sua conversa personalizada..." : "Ao selecionar, você será direcionado ao WhatsApp."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
