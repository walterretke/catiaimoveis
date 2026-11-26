// Ferramentas do conector do Claude para a Cátia gerenciar os imóveis do site
// conversando. Usam o mesmo armazenamento e a mesma validação do painel /admin.
//
// De propósito, NÃO há ferramenta para excluir imóveis, trocar o link (slug)
// nem enviar fotos: excluir é irreversível, o link é o destino dos anúncios,
// e fotos são enviadas pelo painel.

import { revalidatePath, revalidateTag } from "next/cache";
import { entradaMinimaDe, formatPreco, type Imovel, type ImovelStatus } from "@/content/imoveis";
import { siteUrl } from "@/content/site";
import { normalizeImovel } from "@/lib/imovel-normalize";
import { IMOVEIS_TAG, desfazerUltima, lerImoveis, salvarImoveis, storageDisponivel } from "@/lib/store";
import { texto, type ServerInfo, type Tool } from "./protocol";

export const SERVER_INFO: ServerInfo = {
  name: "catia-imoveis",
  version: "1.0.0",
  instructions: [
    "Imóveis do site da corretora Cátia Manske (Jaraguá do Sul/SC).",
    "Antes de alterar qualquer coisa, confirme com a usuária o que vai mudar.",
    "O 'slug' é o link da página e é usado nos anúncios: nunca peça para trocá-lo.",
    "Imóvel novo e fotos são cadastrados pelo painel /admin do site; depois disso, os textos podem ser completados aqui.",
    "Preços são em reais, números inteiros (ex.: 385000).",
    "Toda alteração entra no site na hora e pode ser revertida com desfazer_ultima_alteracao.",
  ].join(" "),
};

const STATUS: ImovelStatus[] = ["disponivel", "vendido", "oculto"];
const STATUS_TEXTO: Record<ImovelStatus, string> = {
  disponivel: "disponível (no site e na lista)",
  vendido: "vendido (página mostra selo de vendido)",
  oculto: "oculto (fora da lista; a página continua no ar)",
};

const SEM_STORAGE = "O armazenamento do site não está configurado (Vercel Blob).";

function publicar() {
  revalidateTag(IMOVEIS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

const link = (i: Imovel) => `${siteUrl()}/${i.slug}`;

function resumo(i: Imovel): string {
  const bairro = i.localizacao.bairro ? ` - ${i.localizacao.bairro}` : "";
  return `• ${i.nome} (${i.tipo}${bairro}) | ${formatPreco(i.preco)} | ${i.status} | slug: ${i.slug} | ${link(i)}`;
}

async function encontrar(slug: unknown): Promise<{ lista: Imovel[]; idx: number }> {
  const lista = await lerImoveis();
  const idx = lista.findIndex((i) => i.slug === slug);
  if (idx < 0) throw new Error(`Imóvel "${String(slug)}" não encontrado. Use listar_imoveis para ver os slugs.`);
  return { lista, idx };
}

async function gravar(lista: Imovel[]) {
  if (!storageDisponivel()) throw new Error(SEM_STORAGE);
  await salvarImoveis(lista);
  publicar();
}

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

/** Junta as alterações ao imóvel atual (objetos aninhados são mesclados um nível). */
export function mesclar(atual: Imovel, campos: Record<string, unknown>): Record<string, unknown> {
  const base = structuredClone(atual) as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries(campos)) {
    const antes = base[k];
    base[k] = antes && typeof antes === "object" && !Array.isArray(antes) && v && typeof v === "object" && !Array.isArray(v)
      ? { ...(antes as Record<string, unknown>), ...(v as Record<string, unknown>) }
      : v;
  }
  return base;
}

/** Quando o preço muda, atualiza os textos que repetiam o preço ou a entrada antigos. */
export function atualizarPrecoNosTextos(antes: Imovel, depois: Imovel): Imovel {
  if (antes.preco === depois.preco && entradaMinimaDe(antes) === entradaMinimaDe(depois)) return depois;
  const trocas: [string, string][] = [
    [formatPreco(antes.preco), formatPreco(depois.preco)],
    [formatPreco(entradaMinimaDe(antes)), formatPreco(entradaMinimaDe(depois))],
  ].filter(([a, b]) => a !== b) as [string, string][];
  const troca = (s: string) => trocas.reduce((acc, [a, b]) => acc.split(a).join(b), s);
  return {
    ...depois,
    notaPreco: troca(depois.notaPreco),
    resumo: troca(depois.resumo),
    seo: { title: troca(depois.seo.title), description: troca(depois.seo.description) },
  };
}

export const IMOVEIS_TOOLS: Tool[] = [
  {
    name: "listar_imoveis",
    title: "Listar imóveis do site",
    description: "Lista todos os imóveis do site com nome, preço, status, slug e link da página.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    async run() {
      const lista = await lerImoveis();
      if (!lista.length) return texto("Nenhum imóvel cadastrado.");
      return texto(`${lista.length} imóveis (na ordem da página inicial):\n${lista.map(resumo).join("\n")}`);
    },
  },
  {
    name: "ver_imovel",
    title: "Ver um imóvel",
    description: "Mostra todos os dados de um imóvel (textos, preço, fotos, localização, SEO) em JSON.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Slug do imóvel (veja listar_imoveis)." } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    async run({ slug }) {
      const { lista, idx } = await encontrar(slug);
      return texto(`Página: ${link(lista[idx])}\n\n${JSON.stringify(lista[idx], null, 2)}`);
    },
  },
  {
    name: "atualizar_imovel",
    title: "Atualizar dados de um imóvel",
    description: [
      "Altera campos de um imóvel existente: preco, precoAntigo (preço riscado), entradaMinima, notaPreco, nome, titulo [linha1, linha2],",
      "tipo, selos (até 3), specs (até 4 {label, valor}), resumo, galeria {titulo, texto, fotos[].legenda}, destaques {titulo, texto, itens},",
      "localizacao {bairro, cidade, referencia, texto}, seo {title, description}.",
      "Envie só o que muda; objetos são mesclados com os dados atuais (listas são substituídas inteiras).",
      "galeria.fotos só altera legendas, por posição (as fotos em si não mudam).",
      "Se o preço mudar, os textos que repetiam o preço antigo são ajustados; uma entradaMinima definida não muda sozinha, então pergunte se ela também muda.",
      "Não troca o slug.",
    ].join(" "),
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Slug do imóvel." },
        campos: { type: "object", description: "Campos a alterar, no formato de ver_imovel." },
      },
      required: ["slug", "campos"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    async run({ slug, campos }) {
      const { lista, idx } = await encontrar(slug);
      const atual = lista[idx];
      const pedido = { ...obj(campos) };
      delete pedido.slug;
      delete pedido.status; // status tem ferramenta própria
      if (!Object.keys(pedido).length) throw new Error("Nenhum campo para alterar.");
      for (const k of ["preco", "precoAntigo", "entradaMinima"]) {
        const v = pedido[k];
        if (v !== undefined && v !== null && !(typeof v === "number" && Number.isInteger(v) && v >= 1000)) {
          throw new Error(`"${k}" deve ser um número inteiro em reais (ex.: 385000).`);
        }
      }
      const galeria = obj(pedido.galeria);
      if (Array.isArray(galeria.fotos)) {
        // Aqui só mudam legendas, por posição. Fotos não citadas continuam como estão;
        // incluir, remover e reordenar fotos é no painel /admin.
        const novas = galeria.fotos.map(obj);
        pedido.galeria = {
          ...galeria,
          fotos: atual.galeria.fotos.map((f, n) => ({
            src: f.src,
            legenda: typeof novas[n]?.legenda === "string" ? novas[n].legenda : f.legenda,
          })),
        };
      }

      const norm = normalizeImovel({ ...mesclar(atual, pedido), slug: atual.slug, status: atual.status });
      if (!norm.ok) throw new Error(norm.erro);
      const novo = atualizarPrecoNosTextos(atual, norm.imovel);

      await gravar(lista.map((i, n) => (n === idx ? novo : i)));
      return texto(`Imóvel "${novo.nome}" atualizado. Já está no site: ${link(novo)}`);
    },
  },
  {
    name: "alterar_status",
    title: "Marcar como disponível, vendido ou oculto",
    description:
      "Muda o status de um imóvel: 'disponivel' (no site e na lista), 'vendido' (selo de vendido e sugestão de outros imóveis) ou 'oculto' (sai da lista, mas a página continua no ar para anúncios).",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Slug do imóvel." },
        status: { type: "string", enum: STATUS },
      },
      required: ["slug", "status"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    async run({ slug, status }) {
      if (!STATUS.includes(status as ImovelStatus)) throw new Error(`Status inválido. Use: ${STATUS.join(", ")}.`);
      const { lista, idx } = await encontrar(slug);
      const novo: Imovel = { ...lista[idx], status: status as ImovelStatus };
      await gravar(lista.map((i, n) => (n === idx ? novo : i)));
      return texto(`"${novo.nome}" agora está ${STATUS_TEXTO[novo.status]}.`);
    },
  },
  {
    name: "desfazer_ultima_alteracao",
    title: "Desfazer a última alteração",
    description: "Volta os imóveis do site para a versão anterior à última alteração (feita aqui ou no painel /admin).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: true },
    async run() {
      if (!storageDisponivel()) throw new Error(SEM_STORAGE);
      if (!(await desfazerUltima())) return texto("Não há alteração para desfazer.", true);
      publicar();
      return texto("Última alteração desfeita. O site já mostra a versão anterior.");
    },
  },
];
