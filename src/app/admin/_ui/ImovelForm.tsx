"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Loader2,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  entradaMinimaDe,
  formatPreco,
  slugify,
  type ComparativoIA,
  type Foto,
  type Imovel,
  type ImovelStatus,
} from "@/content/imoveis";
import { salvarImovel } from "../actions";
import { enviarFoto } from "./foto-utils";
import { STATUS_AJUDA, STATUS_LABEL } from "./status";

// ---------- rascunho do formulário ----------

interface Draft {
  slug: string;
  status: ImovelStatus;
  nome: string;
  tipo: string;
  preco: string;
  precoAntigo: string;
  entradaMinima: string;
  notaPreco: string;
  titulo1: string;
  titulo2: string;
  selos: string[];
  specs: { label: string; valor: string }[];
  resumo: string;
  fotos: Foto[];
  capa: string;
  ogImage: string;
  galeriaTitulo: string;
  galeriaTexto: string;
  destaquesTitulo: string;
  destaquesTexto: string;
  destaquesItens: string;
  destaquesImagem: string;
  bairro: string;
  cidade: string;
  referencia: string;
  locTexto: string;
  seoTitle: string;
  seoDescription: string;
  comparativo: ComparativoIA[];
}

const digits = (v: string) => v.replace(/\D/g, "");
const moeda = (n?: number) => (n ? n.toLocaleString("pt-BR") : "");

function toDraft(i?: Imovel): Draft {
  return {
    slug: i?.slug ?? "",
    status: i?.status ?? "disponivel",
    nome: i?.nome ?? "",
    tipo: i?.tipo ?? "",
    preco: moeda(i?.preco),
    precoAntigo: moeda(i?.precoAntigo),
    entradaMinima: moeda(i?.entradaMinima),
    notaPreco: i?.notaPreco ?? "",
    titulo1: i?.titulo[0] ?? "",
    titulo2: i?.titulo[1] ?? "",
    selos: [0, 1, 2].map((n) => i?.selos[n] ?? ""),
    specs: i?.specs.length ? i.specs : [{ label: "Dormitórios", valor: "" }, { label: "Área privativa", valor: "" }, { label: "Garagem", valor: "" }],
    resumo: i?.resumo ?? "",
    fotos: i?.galeria.fotos ?? [],
    capa: i?.capa ?? "",
    ogImage: i?.ogImage ?? "",
    galeriaTitulo: i?.galeria.titulo ?? "",
    galeriaTexto: i?.galeria.texto ?? "",
    destaquesTitulo: i?.destaques.titulo ?? "",
    destaquesTexto: i?.destaques.texto ?? "",
    destaquesItens: i?.destaques.itens.join("\n") ?? "",
    destaquesImagem: i?.destaques.imagem ?? "",
    bairro: i?.localizacao.bairro ?? "",
    cidade: i?.localizacao.cidade ?? "Jaraguá do Sul / SC",
    referencia: i?.localizacao.referencia ?? "",
    locTexto: i?.localizacao.texto ?? "",
    seoTitle: i?.seo.title ?? "",
    seoDescription: i?.seo.description ?? "",
    comparativo: i?.comparativoIA ?? [],
  };
}

function fromDraft(d: Draft) {
  return {
    slug: d.slug,
    status: d.status,
    nome: d.nome,
    tipo: d.tipo,
    preco: digits(d.preco),
    precoAntigo: digits(d.precoAntigo),
    entradaMinima: digits(d.entradaMinima),
    notaPreco: d.notaPreco,
    titulo: [d.titulo1, d.titulo2],
    selos: d.selos,
    specs: d.specs,
    resumo: d.resumo,
    capa: d.capa,
    ogImage: d.ogImage,
    galeria: { titulo: d.galeriaTitulo, texto: d.galeriaTexto, fotos: d.fotos },
    comparativoIA: d.comparativo,
    destaques: {
      titulo: d.destaquesTitulo,
      texto: d.destaquesTexto,
      itens: d.destaquesItens.split("\n"),
      imagem: d.destaquesImagem,
    },
    localizacao: { bairro: d.bairro, cidade: d.cidade, referencia: d.referencia, texto: d.locTexto },
    seo: { title: d.seoTitle, description: d.seoDescription },
  };
}

// ---------- campos ----------

const inputCls =
  "h-11 w-full rounded-xl border border-line bg-white px-3 text-[15px] outline-none transition focus:border-gold";

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Card({ titulo, descricao, children }: { titulo: string; descricao?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <h2 className="font-display text-xl font-semibold">{titulo}</h2>
      {descricao && <p className="mt-0.5 text-sm text-muted">{descricao}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

const TIPOS = ["Apartamento", "Casa", "Casa geminada", "Sobrado", "Terreno", "Chácara", "Sala comercial"];
const LEGENDAS = [
  "Fachada",
  "Sala",
  "Cozinha",
  "Sala e cozinha",
  "Suíte",
  "Dormitório",
  "Banheiro",
  "Área gourmet",
  "Sacada",
  "Lavanderia",
  "Garagem",
  "Quintal",
  "Planta",
];
const SPECS_SUGERIDAS = ["Dormitórios", "Suítes", "Área privativa", "Garagem", "Banheiros", "Terreno"];

// ---------- formulário ----------

export function ImovelForm({ imovel }: { imovel?: Imovel }) {
  const router = useRouter();
  const editando = !!imovel;
  const [d, setD] = useState<Draft>(() => toDraft(imovel));
  const [salvando, startSave] = useTransition();
  const [enviando, setEnviando] = useState(0);
  const [erro, setErro] = useState("");
  const [salvoEm, setSalvoEm] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setSalvoEm("");
  };

  const slugEfetivo = d.slug || slugify(d.nome);
  const precoNum = Number(digits(d.preco)) || 0;
  const entradaPadrao = precoNum ? entradaMinimaDe({ preco: precoNum }) : 0;
  const capaAtual = d.capa || d.fotos[0]?.src;

  async function adicionarFotos(files: FileList | null) {
    if (!files?.length) return;
    setErro("");
    const lista = Array.from(files);
    setEnviando(lista.length);
    for (const file of lista) {
      try {
        const src = await enviarFoto(file, slugEfetivo || "novo");
        setD((prev) => ({ ...prev, fotos: [...prev.fotos, { src, legenda: "" }] }));
      } catch (e) {
        setErro(`Erro ao enviar ${file.name}: ${(e as Error).message}`);
      }
      setEnviando((n) => n - 1);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  function moverFoto(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= d.fotos.length) return;
    const fotos = [...d.fotos];
    [fotos[idx], fotos[j]] = [fotos[j], fotos[idx]];
    set("fotos", fotos);
  }

  function removerFoto(idx: number) {
    const src = d.fotos[idx].src;
    setD((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, n) => n !== idx),
      capa: prev.capa === src ? "" : prev.capa,
      destaquesImagem: prev.destaquesImagem === src ? "" : prev.destaquesImagem,
    }));
  }

  function salvar() {
    setErro("");
    startSave(async () => {
      const res = await salvarImovel(fromDraft(d), imovel?.slug ?? "");
      if (!res.ok) {
        setErro(res.erro);
        return;
      }
      setSalvoEm(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      if (!editando || res.slug !== imovel?.slug) router.replace(`/admin/editar/${res.slug}`);
      else router.refresh();
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 pb-32 md:py-10">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Voltar para a lista
      </Link>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        {editando ? `Editar: ${imovel.nome}` : "Novo imóvel"}
      </h1>

      <div className="space-y-4">
        {/* ---------- BÁSICO ---------- */}
        <Card titulo="O essencial" descricao="Só nome, preço e fotos são obrigatórios. O resto tem padrão.">
          <Field label="Nome do imóvel *" hint="Aparece na mensagem do WhatsApp. Ex.: Apartamento Mobiliado Baependi">
            <input className={inputCls} value={d.nome} onChange={(e) => set("nome", e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo">
              <input className={inputCls} list="tipos" value={d.tipo} placeholder="Apartamento" onChange={(e) => set("tipo", e.target.value)} />
              <datalist id="tipos">
                {TIPOS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>
            <Field label="Bairro">
              <input className={inputCls} value={d.bairro} placeholder="Três Rios do Norte" onChange={(e) => set("bairro", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Preço (R$) *">
              <input
                className={inputCls}
                inputMode="numeric"
                value={d.preco}
                placeholder="385.000"
                onChange={(e) => set("preco", moeda(Number(digits(e.target.value))))}
              />
            </Field>
            <Field label="Preço antigo (R$)" hint="Mostra “De … por …”">
              <input
                className={inputCls}
                inputMode="numeric"
                value={d.precoAntigo}
                onChange={(e) => set("precoAntigo", moeda(Number(digits(e.target.value))))}
              />
            </Field>
            <Field label="Entrada mínima (R$)" hint={entradaPadrao ? `Vazio = 20% (${formatPreco(entradaPadrao)})` : "Vazio = 20% do preço"}>
              <input
                className={inputCls}
                inputMode="numeric"
                value={d.entradaMinima}
                placeholder={entradaPadrao ? moeda(entradaPadrao) : ""}
                onChange={(e) => set("entradaMinima", moeda(Number(digits(e.target.value))))}
              />
            </Field>
          </div>
          <p className="-mt-2 text-xs text-muted">
            A entrada mínima define as faixas da pergunta do WhatsApp. Só vira <strong>Lead</strong> quem tem pelo
            menos metade dela.
          </p>

          <Field label="Situação">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(STATUS_LABEL) as ImovelStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={`h-10 rounded-xl border text-sm font-medium ${d.status === s ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </Field>
          <p className="-mt-2 text-xs text-muted">{STATUS_AJUDA[d.status]}</p>
        </Card>

        {/* ---------- FOTOS ---------- */}
        <Card titulo="Fotos *" descricao="Pode mandar direto do celular — o tamanho é ajustado automaticamente.">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => adicionarFotos(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={enviando > 0}
            className="flex h-24 w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line text-sm font-medium text-muted transition hover:border-gold hover:text-ink"
          >
            {enviando > 0 ? (
              <>
                <Loader2 className="size-6 animate-spin" /> Enviando {enviando} foto(s)…
              </>
            ) : (
              <>
                <ImagePlus className="size-6" /> Adicionar fotos
              </>
            )}
          </button>

          {d.fotos.length > 0 && (
            <>
              <datalist id="legendas">
                {LEGENDAS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {d.fotos.map((f, idx) => {
                  const isCapa = f.src === capaAtual;
                  return (
                    <li key={f.src} className="overflow-hidden rounded-xl border border-line">
                      <div className="relative aspect-[4/3] bg-sand">
                        <img src={f.src} alt="" className="size-full object-cover" />
                        {isCapa && (
                          <span className="absolute top-1.5 left-1.5 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-white">
                            Capa
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removerFoto(idx)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white"
                          aria-label="Remover foto"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5 p-2">
                        <input
                          className="h-9 w-full rounded-lg border border-line px-2 text-sm outline-none focus:border-gold"
                          list="legendas"
                          placeholder="Legenda (ex.: Sala)"
                          value={f.legenda}
                          onChange={(e) =>
                            set(
                              "fotos",
                              d.fotos.map((x, n) => (n === idx ? { ...x, legenda: e.target.value } : x)),
                            )
                          }
                        />
                        <div className="flex items-center gap-1">
                          <button type="button" className="btn-admin px-1.5" onClick={() => moverFoto(idx, -1)} disabled={idx === 0} aria-label="Mover para a esquerda">
                            <ChevronLeft className="size-4" />
                          </button>
                          <button type="button" className="btn-admin px-1.5" onClick={() => moverFoto(idx, 1)} disabled={idx === d.fotos.length - 1} aria-label="Mover para a direita">
                            <ChevronRight className="size-4" />
                          </button>
                          {!isCapa && (
                            <button
                              type="button"
                              className="btn-admin ml-auto px-2 text-xs"
                              onClick={() => setD((p) => ({ ...p, capa: f.src, ogImage: "" }))}
                            >
                              <Star className="size-3.5" /> Capa
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-muted">A ordem aqui é a ordem da galeria. A capa é a foto grande do topo.</p>
            </>
          )}
        </Card>

        {/* ---------- TOPO DA PÁGINA ---------- */}
        <Card titulo="Topo da página" descricao="O que a pessoa vê primeiro ao chegar do anúncio.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título — linha 1">
              <input className={inputCls} value={d.titulo1} placeholder={d.nome || "Ex.: Loteamento"} onChange={(e) => set("titulo1", e.target.value)} />
            </Field>
            <Field label="Título — linha 2 (dourada)">
              <input className={inputCls} value={d.titulo2} placeholder="Ex.: Mirage (opcional)" onChange={(e) => set("titulo2", e.target.value)} />
            </Field>
          </div>

          <Field label="Selos (até 3)" hint="O primeiro fica em destaque. Ex.: Últimas unidades, Aceita FGTS">
            <div className="grid gap-2 sm:grid-cols-3">
              {d.selos.map((s, n) => (
                <input
                  key={n}
                  className={inputCls}
                  value={s}
                  onChange={(e) => set("selos", d.selos.map((x, k) => (k === n ? e.target.value : x)))}
                />
              ))}
            </div>
          </Field>

          <div>
            <span className="text-sm font-medium">Características (até 4)</span>
            <div className="mt-1 space-y-2">
              {d.specs.map((s, n) => (
                <div key={n} className="flex gap-2">
                  <input
                    className={inputCls}
                    list="specs"
                    placeholder="Ex.: Dormitórios"
                    value={s.label}
                    onChange={(e) => set("specs", d.specs.map((x, k) => (k === n ? { ...x, label: e.target.value } : x)))}
                  />
                  <input
                    className={inputCls}
                    placeholder="Ex.: 2"
                    value={s.valor}
                    onChange={(e) => set("specs", d.specs.map((x, k) => (k === n ? { ...x, valor: e.target.value } : x)))}
                  />
                  <button type="button" className="btn-admin h-11 px-2" onClick={() => set("specs", d.specs.filter((_, k) => k !== n))} aria-label="Remover">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <datalist id="specs">
                {SPECS_SUGERIDAS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              {d.specs.length < 4 && (
                <button type="button" className="btn-admin" onClick={() => set("specs", [...d.specs, { label: "", valor: "" }])}>
                  <Plus className="size-4" /> Adicionar
                </button>
              )}
            </div>
          </div>

          <Field label="Texto abaixo do preço" hint="Vazio = “Aceita financiamento. Entrada a partir de …”">
            <input className={inputCls} value={d.notaPreco} onChange={(e) => set("notaPreco", e.target.value)} />
          </Field>
        </Card>

        {/* ---------- DESCRIÇÃO ---------- */}
        <Card titulo="Descrição">
          <Field label="Resumo para o card da página inicial" hint="Uma frase curta.">
            <input className={inputCls} value={d.resumo} onChange={(e) => set("resumo", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título da galeria">
              <input className={inputCls} value={d.galeriaTitulo} placeholder="Conheça cada ambiente." onChange={(e) => set("galeriaTitulo", e.target.value)} />
            </Field>
            <Field label="Título dos diferenciais">
              <input className={inputCls} value={d.destaquesTitulo} placeholder="Diferenciais" onChange={(e) => set("destaquesTitulo", e.target.value)} />
            </Field>
          </div>
          <Field label="Texto da galeria">
            <textarea className={`${inputCls} h-20 py-2`} value={d.galeriaTexto} placeholder="Fotos reais do imóvel." onChange={(e) => set("galeriaTexto", e.target.value)} />
          </Field>
          <Field label="Diferenciais" hint="Um por linha.">
            <textarea
              className={`${inputCls} h-40 py-2`}
              value={d.destaquesItens}
              placeholder={"Sacada com churrasqueira\nVaga de garagem privativa\nAcabamento com gesso"}
              onChange={(e) => set("destaquesItens", e.target.value)}
            />
          </Field>
          <Field label="Texto curto acima dos diferenciais (opcional)">
            <input className={inputCls} value={d.destaquesTexto} onChange={(e) => set("destaquesTexto", e.target.value)} />
          </Field>
          {d.fotos.length > 1 && (
            <Field label="Foto ao lado dos diferenciais">
              <select className={inputCls} value={d.destaquesImagem} onChange={(e) => set("destaquesImagem", e.target.value)}>
                <option value="">Automática (2ª foto)</option>
                {d.fotos.map((f, n) => (
                  <option key={f.src} value={f.src}>
                    Foto {n + 1}
                    {f.legenda ? ` — ${f.legenda}` : ""}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </Card>

        {/* ---------- LOCALIZAÇÃO ---------- */}
        <Card titulo="Localização">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cidade">
              <input className={inputCls} value={d.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </Field>
            <Field label="Referência" hint="Ex.: 5 min do Centro • Portaria da WEG II">
              <input className={inputCls} value={d.referencia} onChange={(e) => set("referencia", e.target.value)} />
            </Field>
          </div>
          <Field label="Sobre a região">
            <textarea className={`${inputCls} h-20 py-2`} value={d.locTexto} onChange={(e) => set("locTexto", e.target.value)} />
          </Field>
        </Card>

        {/* ---------- AVANÇADO ---------- */}
        <details className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
          <summary className="cursor-pointer font-display text-xl font-semibold">Avançado</summary>
          <div className="mt-4 space-y-4">
            <Field
              label="Endereço da página"
              hint={
                editando
                  ? "Cuidado: mudar o endereço quebra anúncios e links que já apontam para a página atual."
                  : "Gerado a partir do nome. Use no link do anúncio."
              }
            >
              <div className="flex items-center rounded-xl border border-line bg-white focus-within:border-gold">
                <span className="pl-3 text-sm text-muted">/</span>
                <input
                  className="h-11 w-full rounded-xl px-1 text-[15px] outline-none"
                  value={d.slug}
                  placeholder={slugify(d.nome)}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                />
              </div>
            </Field>
            <Field label="Título no Google / aba do navegador" hint="Vazio = gerado automaticamente.">
              <input className={inputCls} value={d.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
            </Field>
            <Field label="Descrição no Google / prévia do link">
              <textarea className={`${inputCls} h-20 py-2`} value={d.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
            </Field>

            <div>
              <span className="text-sm font-medium">Antes/depois mobiliado (IA)</span>
              <p className="text-xs text-muted">
                Opcional. Para cada ambiente, envie a foto real e uma versão mobiliada gerada por IA.
              </p>
              <div className="mt-2 space-y-2">
                {d.comparativo.map((c, n) => (
                  <div key={n} className="grid gap-2 rounded-xl border border-line p-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                    <input className={inputCls} placeholder="Ambiente" value={c.titulo} onChange={(e) => set("comparativo", d.comparativo.map((x, k) => (k === n ? { ...x, titulo: e.target.value } : x)))} />
                    <ComparativoFoto valor={c.real} rotulo="Foto real" slug={slugEfetivo} onChange={(src) => set("comparativo", d.comparativo.map((x, k) => (k === n ? { ...x, real: src } : x)))} />
                    <ComparativoFoto valor={c.mobiliado} rotulo="Mobiliada (IA)" slug={slugEfetivo} onChange={(src) => set("comparativo", d.comparativo.map((x, k) => (k === n ? { ...x, mobiliado: src } : x)))} />
                    <button type="button" className="btn-admin h-11 px-2" onClick={() => set("comparativo", d.comparativo.filter((_, k) => k !== n))} aria-label="Remover">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-admin" onClick={() => set("comparativo", [...d.comparativo, { titulo: "", real: "", mobiliado: "" }])}>
                  <Plus className="size-4" /> Adicionar par
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* ---------- BARRA DE SALVAR ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1 text-sm">
            {erro ? (
              <p className="text-red-600">{erro}</p>
            ) : salvoEm ? (
              <p className="text-wa-dark">Salvo às {salvoEm}. Já está no site.</p>
            ) : (
              <p className="truncate text-muted">/{slugEfetivo || "…"}</p>
            )}
          </div>
          {editando && (
            <a href={`/${imovel.slug}`} target="_blank" rel="noopener noreferrer" className="btn-admin h-11">
              <ExternalLink className="size-4" /> Ver
            </a>
          )}
          <button
            type="button"
            onClick={salvar}
            disabled={salvando || enviando > 0}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-6 font-semibold text-white disabled:opacity-60"
          >
            {salvando && <Loader2 className="size-4 animate-spin" />} Salvar
          </button>
        </div>
      </div>
    </main>
  );
}

function ComparativoFoto({
  valor,
  rotulo,
  slug,
  onChange,
}: {
  valor: string;
  rotulo: string;
  slug: string;
  onChange: (src: string) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  return (
    <label className="flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-xl border border-line px-2 text-sm">
      {enviando ? (
        <Loader2 className="size-4 animate-spin" />
      ) : valor ? (
        <img src={valor} alt="" className="size-8 rounded object-cover" />
      ) : (
        <ImagePlus className="size-4 text-muted" />
      )}
      <span className="truncate text-muted">{rotulo}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setEnviando(true);
          try {
            onChange(await enviarFoto(file, slug || "novo"));
          } catch (err) {
            alert((err as Error).message);
          }
          setEnviando(false);
        }}
      />
    </label>
  );
}
