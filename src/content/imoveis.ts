// Tipos e helpers dos imóveis. Os dados em si vêm do painel /admin
// (ver src/lib/store.ts); src/content/imoveis-seed.ts é só o ponto de partida.

import { ENTRADA_PADRAO } from "@/lib/lead";

export interface Foto {
  src: string;
  legenda: string;
}

export interface ComparativoIA {
  titulo: string;
  real: string;
  mobiliado: string;
}

export type ImovelStatus = "disponivel" | "vendido" | "oculto";

export interface Imovel {
  slug: string;
  /** disponivel: no ar e listado | vendido: selo + sugere outros | oculto: no ar, mas fora da home/sitemap */
  status: ImovelStatus;
  /** Usado na mensagem do WhatsApp e nos cards. */
  nome: string;
  /** Título do hero: [linha principal, linha destacada (opcional)]. */
  titulo: [string, string];
  tipo: string;
  preco: number;
  precoAntigo?: number;
  /** Entrada mínima em R$. Vazio = 20% do preço. Define as faixas da enquete. */
  entradaMinima?: number;
  /** Texto pequeno abaixo do preço. */
  notaPreco: string;
  selos: string[];
  specs: { label: string; valor: string }[];
  /** Uma frase para o card da home. */
  resumo: string;
  capa: string;
  /** Imagem da prévia do link (WhatsApp/Facebook). Vazio = capa. */
  ogImage?: string;
  galeria: {
    titulo: string;
    texto: string;
    fotos: Foto[];
  };
  comparativoIA?: ComparativoIA[];
  destaques: {
    titulo: string;
    texto?: string;
    itens: string[];
    imagem: string;
  };
  localizacao: {
    bairro: string;
    cidade: string;
    referencia: string;
    texto: string;
  };
  seo: { title: string; description: string };
}

/** Slugs que não podem ser usados por imóveis (rotas do próprio site). */
export const SLUGS_RESERVADOS = new Set([
  "admin",
  "api",
  "imovel",
  "privacidade",
  "sitemap.xml",
  "robots.txt",
  "uploads",
  "imoveis",
  "_next",
]);

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** 385000 -> "R$ 385.000" */
export function formatPreco(valor: number): string {
  return brl.format(valor).replace(/ /g, " ");
}

export function entradaMinimaDe(imovel: Pick<Imovel, "preco" | "entradaMinima">): number {
  return imovel.entradaMinima && imovel.entradaMinima > 0
    ? imovel.entradaMinima
    : Math.round((imovel.preco * ENTRADA_PADRAO) / 100) * 100;
}

/** Assunto usado na mensagem do WhatsApp: "Mirage (R$ 385.000)". */
export function assuntoWhatsApp(imovel: Imovel): string {
  return `${imovel.nome} (${formatPreco(imovel.preco)})`;
}

export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const isPublicado = (i: Imovel) => i.status !== "oculto";
export const isListado = (i: Imovel) => i.status === "disponivel";
