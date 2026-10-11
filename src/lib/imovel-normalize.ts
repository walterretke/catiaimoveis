// Valida e completa um imóvel vindo do painel. Tudo que não é essencial
// recebe um valor padrão, para o cadastro ser rápido.

import {
  SLUGS_RESERVADOS,
  entradaMinimaDe,
  formatPreco,
  slugify,
  type ComparativoIA,
  type Foto,
  type Imovel,
  type ImovelStatus,
} from "@/content/imoveis";

type Result = { ok: true; imovel: Imovel } | { ok: false; erro: string };

const STATUS: ImovelStatus[] = ["disponivel", "vendido", "oculto"];

function txt(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function num(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/\D/g, "")) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
}

/** Aceita caminhos locais (/imoveis/..., /uploads/...) e URLs https. */
function imagem(v: unknown): string {
  const s = txt(v, 1000);
  return s.startsWith("/") || s.startsWith("https://") ? s : "";
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function lista(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

export function normalizeImovel(input: unknown): Result {
  const d = obj(input);

  const nome = txt(d.nome, 120);
  if (!nome) return { ok: false, erro: "Informe o nome do imóvel." };

  const preco = num(d.preco);
  if (!preco) return { ok: false, erro: "Informe o preço." };

  const slug = slugify(txt(d.slug) || nome);
  if (!slug) return { ok: false, erro: "Endereço da página (slug) inválido." };
  if (SLUGS_RESERVADOS.has(slug)) return { ok: false, erro: `O endereço "/${slug}" é reservado. Escolha outro.` };

  const galeria = obj(d.galeria);
  const fotos: Foto[] = lista(galeria.fotos)
    .map((f) => ({ src: imagem(obj(f).src), legenda: txt(obj(f).legenda, 80) }))
    .filter((f) => f.src);
  if (fotos.length === 0) return { ok: false, erro: "Adicione pelo menos uma foto." };

  const status = STATUS.includes(d.status as ImovelStatus) ? (d.status as ImovelStatus) : "disponivel";
  const tipo = txt(d.tipo, 40) || "Imóvel";
  const titulo = lista(d.titulo);
  const loc = obj(d.localizacao);
  const dest = obj(d.destaques);
  const seo = obj(d.seo);

  const precoAntigo = num(d.precoAntigo);
  const entradaMinima = num(d.entradaMinima);
  const entrada = entradaMinimaDe({ preco, entradaMinima });

  const capa = imagem(d.capa) || fotos[0].src;
  const bairro = txt(loc.bairro, 60);
  const cidade = txt(loc.cidade, 60) || "Jaraguá do Sul / SC";

  const comparativoIA: ComparativoIA[] = lista(d.comparativoIA)
    .map((c) => ({ titulo: txt(obj(c).titulo, 60), real: imagem(obj(c).real), mobiliado: imagem(obj(c).mobiliado) }))
    .filter((c) => c.real && c.mobiliado);

  const imovel: Imovel = {
    slug,
    status,
    nome,
    titulo: [txt(titulo[0], 40) || nome, txt(titulo[1], 40)],
    tipo,
    preco,
    ...(precoAntigo && precoAntigo > preco && { precoAntigo }),
    ...(entradaMinima && { entradaMinima }),
    notaPreco: txt(d.notaPreco, 140) || `Aceita financiamento. Entrada a partir de ${formatPreco(entrada)}`,
    selos: lista(d.selos).map((s) => txt(s, 40)).filter(Boolean).slice(0, 3),
    specs: lista(d.specs)
      .map((s) => ({ label: txt(obj(s).label, 30), valor: txt(obj(s).valor, 30) }))
      .filter((s) => s.label && s.valor)
      .slice(0, 4),
    resumo: txt(d.resumo, 200),
    capa,
    ...(imagem(d.ogImage) && { ogImage: imagem(d.ogImage) }),
    galeria: {
      titulo: txt(galeria.titulo, 100) || "Conheça cada ambiente.",
      texto: txt(galeria.texto, 400) || "Fotos reais do imóvel.",
      fotos,
    },
    ...(comparativoIA.length > 0 && { comparativoIA }),
    destaques: {
      titulo: txt(dest.titulo, 80) || "Diferenciais",
      ...(txt(dest.texto, 300) && { texto: txt(dest.texto, 300) }),
      itens: lista(dest.itens).map((i) => txt(i, 140)).filter(Boolean).slice(0, 20),
      imagem: imagem(dest.imagem) || fotos[1]?.src || capa,
    },
    localizacao: {
      bairro: bairro || cidade.split("/")[0].trim(),
      cidade,
      referencia: txt(loc.referencia, 80),
      texto: txt(loc.texto, 300),
    },
    seo: {
      title: txt(seo.title, 90) || `${nome} | ${formatPreco(preco)}${bairro ? ` - ${bairro}` : ""}`,
      description:
        txt(seo.description, 200) ||
        `${tipo} ${bairro ? `no ${bairro}, ` : "em "}${cidade}. ${formatPreco(preco)}. Fale direto com a corretora pelo WhatsApp.`,
    },
  };

  return { ok: true, imovel };
}
