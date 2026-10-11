"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { Check, Loader2, X } from "lucide-react";
import { CORRETORA } from "@/content/site";
import {
  ENTRADA_OPCOES,
  buildLeadMessage,
  buildWhatsAppUrl,
  trackEntrada,
  type EntradaOpcao,
} from "@/lib/lead";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Tempo para o Pixel/CAPI saírem antes de trocar de página. O fetch usa
// keepalive, então mesmo se o navegador sair antes ele é concluído.
const REDIRECT_DELAY_MS = 700;

const LeadContext = createContext<{ open: () => void } | null>(null);

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead precisa estar dentro de <LeadProvider>");
  return ctx;
}

function newEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface LeadProviderProps {
  /** Ex.: "Mirage (R$ 385.000)". Vazio = contato geral. */
  assunto?: string;
  /** Identifica a página no evento (content_name). */
  contentName: string;
  children: React.ReactNode;
}

export function LeadProvider({ assunto, contentName, children }: LeadProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<EntradaOpcao | null>(null);

  // Ao voltar do WhatsApp com o botão "voltar", o navegador pode restaurar a
  // página do cache com o modal travado em "Abrindo WhatsApp…". Reseta.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setSelected(null);
        setIsOpen(false);
      }
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const open = useCallback(() => {
    setSelected(null);
    setIsOpen(true);
  }, []);

  const choose = (opcao: EntradaOpcao) => {
    if (selected) return;
    setSelected(opcao);

    trackEntrada(
      opcao,
      {
        eventId: newEventId(),
        contentName,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      {
        fbq: window.fbq,
        sendServerEvent: (payload) => {
          fetch("/api/meta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        },
      },
    );

    const url = buildWhatsAppUrl(CORRETORA.whatsapp, buildLeadMessage(opcao, assunto));
    setTimeout(() => {
      window.location.href = url;
    }, REDIRECT_DELAY_MS);
  };

  return (
    <LeadContext.Provider value={{ open }}>
      {children}

      <Dialog.Root open={isOpen} onOpenChange={(o) => !selected && setIsOpen(o)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <Dialog.Content
            className={cn(
              "fixed z-50 bg-white shadow-2xl outline-none",
              // celular: sobe de baixo, fácil de alcançar com o polegar
              "inset-x-0 bottom-0 rounded-t-3xl px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300",
              "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom",
              // desktop: centralizado
              "sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-8",
              "sm:data-[state=open]:slide-in-from-bottom-4 sm:data-[state=open]:zoom-in-95",
            )}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />

            {!selected && (
              <Dialog.Close
                className="absolute top-4 right-4 rounded-full p-2 text-muted transition hover:bg-sand hover:text-ink"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </Dialog.Close>
            )}

            <div className="mb-5 flex items-center gap-3 pr-8">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-wa/10 text-wa-dark">
                <WhatsAppIcon className="size-6" />
              </span>
              <div>
                <Dialog.Title className="text-lg font-semibold text-ink">
                  {selected ? "Abrindo o WhatsApp…" : "Só uma pergunta rápida"}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted">
                  {selected
                    ? "Sua conversa com a Cátia já vai começar."
                    : "Você possui valor para entrada?"}
                </Dialog.Description>
              </div>
            </div>

            <div className="flex flex-col gap-2.5" role="list">
              {ENTRADA_OPCOES.map((opcao) => {
                const isSelected = selected?.id === opcao.id;
                return (
                  <button
                    key={opcao.id}
                    type="button"
                    role="listitem"
                    onClick={() => choose(opcao)}
                    disabled={!!selected}
                    className={cn(
                      "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[15px] font-medium transition-all",
                      isSelected
                        ? "border-wa bg-wa/10 text-wa-dark"
                        : selected
                          ? "border-line opacity-40"
                          : "border-line text-ink hover:border-wa hover:bg-wa/5 active:scale-[0.99]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                        isSelected ? "border-wa bg-wa text-white" : "border-line",
                      )}
                    >
                      {isSelected && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <span className="flex-1">{opcao.label}</span>
                    {isSelected && <Loader2 className="size-4 animate-spin" />}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              Um toque e você vai direto para o WhatsApp. Sem cadastro.
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </LeadContext.Provider>
  );
}
