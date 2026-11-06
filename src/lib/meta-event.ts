// Regras da rota /api/meta (API de Conversões).
// Este arquivo não importa nada para poder ser testado direto com `node --test`.

function hostDe(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return undefined;
  }
}

/**
 * Só aceita eventos enviados pelo próprio site. Impede que outro site use a rota
 * e bloqueia envios casuais de eventos falsos. Não é autenticação: quem forjar os
 * cabeçalhos manualmente ainda passa.
 */
export function origemPermitida(
  origin: string | null | undefined,
  host: string | null | undefined,
  eventUrl?: string,
): boolean {
  const esperado = host?.toLowerCase();
  if (!esperado || hostDe(origin) !== esperado) return false;
  return eventUrl === undefined || hostDe(eventUrl) === esperado;
}

/**
 * Usa o cookie `_fbc` do Pixel. Sem ele (Pixel bloqueado), monta o valor a partir
 * do `fbclid` da URL, no formato definido pelo Meta: fb.1.<timestamp em ms>.<fbclid>.
 * O fbclid não pode ser alterado (diferencia maiúsculas de minúsculas).
 */
export function fbcDoClique(
  cookieFbc: string | undefined,
  eventUrl: string,
  agoraMs: number,
): string | undefined {
  if (cookieFbc) return cookieFbc;
  try {
    const fbclid = new URL(eventUrl).searchParams.get("fbclid");
    return fbclid ? `fb.1.${agoraMs}.${fbclid}` : undefined;
  } catch {
    return undefined;
  }
}
