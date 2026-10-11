// Regras de qualificação de lead.
//
// REGRA DE NEGÓCIO: só conta como `Lead` no Meta (Pixel + API de Conversões)
// quem informa que TEM entrada (total ou parcial). Quem não tem entrada é
// levado ao WhatsApp normalmente, mas NENHUM evento é disparado — assim o
// algoritmo de anúncios otimiza só para quem pode comprar.
//
// Este arquivo não importa nada para poder ser testado direto com `node --test`.

export type EntradaId = "completa" | "parcial" | "sem-entrada";

export interface EntradaOpcao {
  id: EntradaId;
  /** Texto do botão na enquete. */
  label: string;
  /** Como a resposta aparece na mensagem do WhatsApp para a Cátia. */
  resposta: string;
  /** `true` = dispara Lead no Meta. */
  qualificado: boolean;
}

export const ENTRADA_OPCOES: readonly EntradaOpcao[] = [
  {
    id: "completa",
    label: "Sim, possuo os 20% (FGTS/Economias)",
    resposta: "Sim, possuo os 20% necessários (FGTS/Economias)",
    qualificado: true,
  },
  {
    id: "parcial",
    label: "Tenho apenas uma parte do valor",
    resposta: "Tenho apenas uma parte do valor",
    qualificado: true,
  },
  {
    id: "sem-entrada",
    label: "Não possuo entrada (100% financiado)",
    resposta: "Não possuo entrada (100% financiado)",
    qualificado: false,
  },
];

export function buildWhatsAppUrl(phone: string, mensagem: string): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensagem)}`;
}

/** `assunto` ex.: "Apartamento Mobiliado Baependi (R$ 348.000)". Sem assunto = contato geral. */
export function buildLeadMessage(entrada: EntradaOpcao, assunto?: string): string {
  const abertura = assunto
    ? `Olá Cátia! Tenho interesse no ${assunto}.`
    : "Olá Cátia! Estou procurando imóveis e gostaria do seu auxílio.";
  return `${abertura} Sobre a entrada: ${entrada.resposta}. Gostaria de mais informações.`;
}

export interface LeadEventPayload {
  event_name: "Lead";
  event_id: string;
  event_url: string;
  client_user_agent: string;
  custom_data: { content_name: string; entrada: EntradaId };
}

export interface TrackingDeps {
  /** `window.fbq` (pode não existir se o pixel foi bloqueado). */
  fbq?: (...args: unknown[]) => void;
  /** Envia para `/api/meta` em background (sem await). */
  sendServerEvent: (payload: LeadEventPayload) => void;
}

export interface TrackingContext {
  eventId: string;
  contentName: string;
  url: string;
  userAgent: string;
}

/**
 * Dispara o Lead (Pixel + CAPI, deduplicados pelo mesmo event_id)
 * apenas se a opção for qualificada. Retorna se disparou.
 */
export function trackEntrada(
  opcao: EntradaOpcao,
  ctx: TrackingContext,
  deps: TrackingDeps,
): boolean {
  if (!opcao.qualificado) return false;

  const customData = { content_name: ctx.contentName, entrada: opcao.id };

  deps.fbq?.("track", "Lead", customData, { eventID: ctx.eventId });
  deps.sendServerEvent({
    event_name: "Lead",
    event_id: ctx.eventId,
    event_url: ctx.url,
    client_user_agent: ctx.userAgent,
    custom_data: customData,
  });
  return true;
}
