// Regras de qualificação de lead.
//
// REGRA DE NEGÓCIO: só conta como `Lead` no Meta (Pixel + API de Conversões)
// quem informa que TEM entrada (total ou parcial).
//
// Quem não tem entrada vai ao WhatsApp normalmente e gera apenas o evento
// personalizado `SemEntrada` — ele NÃO conta como Lead e serve para criar um
// público de exclusão nos anúncios (ou de inclusão, para imóveis de MCMV).
//
// Este arquivo não importa nada para poder ser testado direto com `node --test`.

export type EntradaId = "completa" | "parcial" | "sem-entrada";

export interface EntradaOpcao {
  id: EntradaId;
  /** Texto do botão na enquete. */
  label: string;
  /** Linha menor abaixo do label (opcional). */
  detalhe?: string;
  /** Como a resposta aparece na mensagem do WhatsApp para a Cátia. */
  resposta: string;
  /** `true` = dispara Lead no Meta. */
  qualificado: boolean;
}

/** Percentual de entrada usado quando o imóvel não informa a entrada mínima. */
export const ENTRADA_PADRAO = 0.2;

/** Abaixo desta fração da entrada mínima, a pessoa não é considerada lead. */
export const FRACAO_PARCIAL = 0.5;

/** 77000 -> "R$ 77 mil"; 69600 -> "R$ 69,6 mil" */
export function formatMil(valor: number): string {
  const mil = valor / 1000;
  return `R$ ${mil.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
}

const OPCOES_GENERICAS: readonly EntradaOpcao[] = [
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

/**
 * Opções da enquete. Com `entradaMinima`, as faixas usam valores concretos
 * (números reduzem o "chute otimista" de quem responde "tenho uma parte").
 */
export function entradaOpcoes(entradaMinima?: number): readonly EntradaOpcao[] {
  if (!entradaMinima || entradaMinima <= 0) return OPCOES_GENERICAS;

  const minimo = formatMil(entradaMinima);
  const metade = formatMil(Math.round((entradaMinima * FRACAO_PARCIAL) / 1000) * 1000);

  return [
    {
      id: "completa",
      label: `Tenho ${minimo} ou mais`,
      detalhe: "Somando FGTS e economias",
      resposta: `Tenho ${minimo} ou mais (FGTS/economias)`,
      qualificado: true,
    },
    {
      id: "parcial",
      label: `Tenho entre ${metade} e ${minimo}`,
      resposta: `Tenho entre ${metade} e ${minimo}`,
      qualificado: true,
    },
    {
      id: "sem-entrada",
      label: `Tenho menos de ${metade} ou não tenho`,
      resposta: `Tenho menos de ${metade} ou não tenho entrada`,
      qualificado: false,
    },
  ];
}

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

export type ServerEventName = "Lead" | "SemEntrada";

export interface LeadEventPayload {
  event_name: ServerEventName;
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
 * Qualificado: dispara `Lead` (Pixel + CAPI, deduplicados pelo event_id).
 * Não qualificado: dispara só o evento personalizado `SemEntrada`.
 * Retorna se foi Lead.
 */
export function trackEntrada(
  opcao: EntradaOpcao,
  ctx: TrackingContext,
  deps: TrackingDeps,
): boolean {
  const customData = { content_name: ctx.contentName, entrada: opcao.id };
  const eventName: ServerEventName = opcao.qualificado ? "Lead" : "SemEntrada";

  deps.fbq?.(opcao.qualificado ? "track" : "trackCustom", eventName, customData, {
    eventID: ctx.eventId,
  });
  deps.sendServerEvent({
    event_name: eventName,
    event_id: ctx.eventId,
    event_url: ctx.url,
    client_user_agent: ctx.userAgent,
    custom_data: customData,
  });
  return opcao.qualificado;
}

/** Evento de funil (só Pixel): abriu a pergunta da entrada. */
export function trackAbriuEnquete(contentName: string, fbq?: (...args: unknown[]) => void) {
  fbq?.("trackCustom", "AbriuEnquete", { content_name: contentName });
}
