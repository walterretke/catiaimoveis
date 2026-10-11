"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  ImagePlus,
  Lightbulb,
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
    specs: i?.specs.length
      ? i.specs
      : [
          { label: "Dormitórios", valor: "" },
          { label: "Área privativa", valor: "" },
          { label: "Garagem", valor: "" },
        ],
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

// ---------- peças visuais ----------

const inputCls =
  "h-12 w-full rounded-xl border border-line bg-white px-3 text-base outline-none transition focus:border-gold";

/** Campo com título, explicação em linguagem simples e "onde aparece". */
function Field({
  label,
  obrigatorio,
  explica,
  ondeAparece,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  explica?: React.ReactNode;
  ondeAparece?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[15px] font-semibold">
        {label}
        {obrigatorio ? (
          <span className="ml-1.5 rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-600">
            obrigatório
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-muted">(pode deixar em branco)</span>
        )}
      </span>
      {explica && <span className="mt-0.5 block text-sm text-ink-soft">{explica}</span>}
      <div className="mt-1.5">{children}</div>
      {ondeAparece && <span className="mt-1 block text-xs text-muted">📍 Onde aparece: {ondeAparece}</span>}
    </label>
  );
}

function Card({
  numero,
  titulo,
  descricao,
  children,
}: {
  numero: number;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
          {numero}
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">{titulo}</h2>
          {descricao && <p className="mt-0.5 text-sm text-muted">{descricao}</p>}
        </div>
      </div>
      <div className="mt-5 space-y-6">{children}</div>
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

const SITUACOES: { valor: ImovelStatus; titulo: string; texto: string }[] = [
  { valor: "disponivel", titulo: "Disponível", texto: "Aparece no site e na página inicial." },
  { valor: "vendido", titulo: "Vendido", texto: "Continua no site com o selo “Vendido” e mostra outros imóveis." },
  {
    valor: "oculto",
    titulo: "Escondido",
    texto: "Não aparece na página inicial. Só abre por quem tem o link. Bom para revisar antes de anunciar.",
  },
];

// ---------- formulário ----------

export function ImovelForm({ imovel }: { imovel?: Imovel }) {
  const router = useRouter();
  const editando = !!imovel;
  const [d, setD] = useState<Draft>(() => toDraft(imovel));
  const [alterado, setAlterado] = useState(false);
  const [salvando, startSave] = useTransition();
  const [enviando, setEnviando] = useState(0);
  const [erro, setErro] = useState("");
  const [salvoEm, setSalvoEm] = useState("");
  const [copiado, setCopiado] = useState(false);
  // domínio atual (só existe no navegador)
  const origem = useSyncExternalStore(
    () => () => {},
    () => window.location.host,
    () => "",
  );
  const fileRef = useRef<HTMLInputElement>(null);

  // Avisa antes de sair da página com alterações não salvas
  useEffect(() => {
    if (!alterado) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [alterado]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setAlterado(true);
    setSalvoEm("");
  };

  const slugEfetivo = d.slug || slugify(d.nome);
  const slugPublicado = imovel?.slug ?? "";
  const linkPagina = `${origem}/${slugPublicado || slugEfetivo}`;
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
        setAlterado(true);
      } catch (e) {
        setErro(`Não consegui enviar a foto ${file.name}: ${(e as Error).message}`);
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
    setAlterado(true);
  }

  async function copiarLink() {
    await navigator.clipboard.writeText(`https://${linkPagina}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function salvar() {
    setErro("");
    startSave(async () => {
      const res = await salvarImovel(fromDraft(d), imovel?.slug ?? "");
      if (!res.ok) {
        setErro(res.erro);
        return;
      }
      setAlterado(false);
      setSalvoEm(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      if (!editando || res.slug !== imovel?.slug) router.replace(`/admin/editar/${res.slug}`);
      else router.refresh();
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 pb-36 md:py-10">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Voltar para a lista
      </Link>
      <h1 className="mb-4 font-display text-3xl font-semibold">
        {editando ? `Editar: ${imovel.nome}` : "Cadastrar novo imóvel"}
      </h1>

      <div className="mb-4 flex gap-3 rounded-2xl bg-gold-soft p-4 text-sm leading-relaxed">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-gold" />
        <p>
          <strong>Para cadastrar rápido:</strong> preencha o <strong>nome</strong>, o <strong>preço</strong> e o{" "}
          <strong>bairro</strong>, envie as <strong>fotos</strong> e toque em <strong>Salvar</strong> lá embaixo. O
          resto é opcional: o que ficar em branco, o site preenche sozinho. Dá para voltar e completar depois.
        </p>
      </div>

      <div className="space-y-4">
        {/* ---------- 1. PRINCIPAL ---------- */}
        <Card numero={1} titulo="Informações principais">
          <Field
            label="Nome do imóvel"
            obrigatorio
            explica="Como você chama este imóvel. Ex.: Apartamento Mobiliado Baependi"
            ondeAparece="na mensagem que o cliente te manda no WhatsApp e na lista de imóveis."
          >
            <input className={inputCls} value={d.nome} onChange={(e) => set("nome", e.target.value)} />
          </Field>

          <Field
            label="Preço"
            obrigatorio
            explica="Só os números. Os pontos aparecem sozinhos."
            ondeAparece="em destaque no topo da página do imóvel."
          >
            <div className="flex items-center rounded-xl border border-line bg-white focus-within:border-gold">
              <span className="pl-3 text-muted">R$</span>
              <input
                className="h-12 w-full rounded-xl px-2 text-base outline-none"
                inputMode="numeric"
                value={d.preco}
                placeholder="385.000"
                onChange={(e) => set("preco", moeda(Number(digits(e.target.value))))}
              />
            </div>
          </Field>

          <Field
            label="Bairro"
            explica="Ex.: Três Rios do Norte"
            ondeAparece="embaixo do título e no card da página inicial."
          >
            <input className={inputCls} value={d.bairro} onChange={(e) => set("bairro", e.target.value)} />
          </Field>

          <Field label="Tipo de imóvel" explica="Escolha da lista ou escreva. Ex.: Apartamento, Casa." ondeAparece="no card da página inicial.">
            <input className={inputCls} list="tipos" value={d.tipo} placeholder="Toque para escolher" onChange={(e) => set("tipo", e.target.value)} />
            <datalist id="tipos">
              {TIPOS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>

          <Field
            label="Entrada mínima"
            explica={
              <>
                Quanto o cliente precisa ter para dar de entrada.{" "}
                {entradaPadrao ? (
                  <>
                    Se deixar em branco, uso <strong>20% do preço ({formatPreco(entradaPadrao)})</strong>.
                  </>
                ) : (
                  "Se deixar em branco, uso 20% do preço."
                )}{" "}
                Esse valor monta a pergunta que aparece antes do WhatsApp. Quem tiver pelo menos a metade dele conta
                como cliente interessado no Facebook.
              </>
            }
          >
            <div className="flex items-center rounded-xl border border-line bg-white focus-within:border-gold">
              <span className="pl-3 text-muted">R$</span>
              <input
                className="h-12 w-full rounded-xl px-2 text-base outline-none"
                inputMode="numeric"
                value={d.entradaMinima}
                placeholder={entradaPadrao ? moeda(entradaPadrao) : ""}
                onChange={(e) => set("entradaMinima", moeda(Number(digits(e.target.value))))}
              />
            </div>
          </Field>

          <Field
            label="Preço antigo (só se baixou o preço)"
            explica="Se o imóvel teve desconto, coloque o valor anterior. Ele aparece riscado: “De R$ 368.000”. Sem desconto, deixe em branco."
          >
            <div className="flex items-center rounded-xl border border-line bg-white focus-within:border-gold">
              <span className="pl-3 text-muted">R$</span>
              <input
                className="h-12 w-full rounded-xl px-2 text-base outline-none"
                inputMode="numeric"
                value={d.precoAntigo}
                onChange={(e) => set("precoAntigo", moeda(Number(digits(e.target.value))))}
              />
            </div>
          </Field>

          <div>
            <span className="text-[15px] font-semibold">Situação do imóvel</span>
            <div className="mt-1.5 grid gap-2">
              {SITUACOES.map((s) => (
                <button
                  key={s.valor}
                  type="button"
                  onClick={() => set("status", s.valor)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition ${d.status === s.valor ? "border-ink bg-sand" : "border-line bg-white"}`}
                >
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${d.status === s.valor ? "border-ink bg-ink text-white" : "border-line"}`}
                  >
                    {d.status === s.valor && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span>
                    <span className="block font-semibold">{s.titulo}</span>
                    <span className="block text-sm text-muted">{s.texto}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {(d.nome || slugPublicado) && origem && (
            <div className="rounded-xl bg-sand p-3">
              <p className="text-sm font-semibold">Link da página deste imóvel</p>
              <p className="text-xs text-muted">
                É este link que vai no anúncio do Facebook/Instagram.
                {!editando && " Ele passa a funcionar depois que você salvar."}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 text-sm">{linkPagina}</code>
                <button type="button" onClick={copiarLink} className="btn-admin h-10 bg-white">
                  {copiado ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copiado ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* ---------- 2. FOTOS ---------- */}
        <Card
          numero={2}
          titulo="Fotos"
          descricao="Pode escolher várias de uma vez, direto da galeria do celular. O tamanho é ajustado automaticamente."
        >
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => adicionarFotos(e.target.files)} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={enviando > 0}
            className="flex h-28 w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gold/60 bg-gold-soft/40 text-base font-semibold transition hover:border-gold"
          >
            {enviando > 0 ? (
              <>
                <Loader2 className="size-7 animate-spin" /> Enviando {enviando} foto(s)… aguarde
              </>
            ) : (
              <>
                <ImagePlus className="size-7 text-gold" /> Toque aqui para adicionar fotos
              </>
            )}
          </button>

          {d.fotos.length === 0 ? (
            <p className="text-sm text-muted">Precisa de pelo menos uma foto para salvar.</p>
          ) : (
            <>
              <ul className="space-y-1.5 rounded-xl bg-sand p-3 text-sm text-ink-soft">
                <li>
                  ⭐ A foto marcada como <strong>Capa</strong> é a foto grande do topo. Para trocar, toque em “Usar
                  como capa” em outra foto.
                </li>
                <li>✏️ Escreva embaixo de cada foto o que ela mostra (Sala, Cozinha…). Aparece na galeria.</li>
                <li>↔️ Use as setas para mudar a ordem. A ordem aqui é a ordem da galeria do site.</li>
              </ul>
              <datalist id="legendas">
                {LEGENDAS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {d.fotos.map((f, idx) => {
                  const isCapa = f.src === capaAtual;
                  return (
                    <li key={f.src} className={`overflow-hidden rounded-xl border-2 ${isCapa ? "border-gold" : "border-line"}`}>
                      <div className="relative aspect-[4/3] bg-sand">
                        <img src={f.src} alt="" className="size-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
                          {idx + 1}
                        </span>
                        {isCapa && (
                          <span className="absolute top-1.5 left-1.5 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-white">
                            ⭐ Capa
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Remover esta foto?")) removerFoto(idx);
                          }}
                          className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1.5 text-white"
                          aria-label="Remover foto"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5 p-2">
                        <input
                          className="h-10 w-full rounded-lg border border-line px-2 text-sm outline-none focus:border-gold"
                          list="legendas"
                          placeholder="O que mostra? Ex.: Sala"
                          value={f.legenda}
                          onChange={(e) => set("fotos", d.fotos.map((x, n) => (n === idx ? { ...x, legenda: e.target.value } : x)))}
                        />
                        <div className="flex items-center gap-1">
                          <button type="button" className="btn-admin px-2" onClick={() => moverFoto(idx, -1)} disabled={idx === 0} aria-label="Mover para trás">
                            <ChevronLeft className="size-4" />
                          </button>
                          <button type="button" className="btn-admin px-2" onClick={() => moverFoto(idx, 1)} disabled={idx === d.fotos.length - 1} aria-label="Mover para frente">
                            <ChevronRight className="size-4" />
                          </button>
                          {!isCapa && (
                            <button
                              type="button"
                              className="btn-admin ml-auto px-2 text-xs"
                              onClick={() => {
                                setD((p) => ({ ...p, capa: f.src, ogImage: "" }));
                                setAlterado(true);
                              }}
                            >
                              <Star className="size-3.5" /> Usar como capa
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Card>

        {/* ---------- 3. TOPO ---------- */}
        <Card
          numero={3}
          titulo="Topo da página"
          descricao="É a primeira coisa que o cliente vê quando clica no anúncio, por cima da foto de capa."
        >
          <Field
            label="Título grande"
            explica="O nome em letras grandes. Pode dividir em duas linhas: a segunda fica dourada. Em branco, uso o nome do imóvel."
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={inputCls} value={d.titulo1} placeholder={`1ª linha. Ex.: ${d.nome ? d.nome.split(" ")[0] : "Mobiliado"}`} onChange={(e) => set("titulo1", e.target.value)} />
              <input className={inputCls} value={d.titulo2} placeholder="2ª linha, dourada. Ex.: Baependi" onChange={(e) => set("titulo2", e.target.value)} />
            </div>
          </Field>

          <Field
            label="Etiquetas (até 3)"
            explica="Frases curtas que chamam atenção. A primeira fica dourada. Ex.: Oportunidade única, Aceita FGTS, Pronto para morar."
            ondeAparece="acima do título, e a primeira também no card da página inicial."
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {d.selos.map((s, n) => (
                <input
                  key={n}
                  className={inputCls}
                  placeholder={`Etiqueta ${n + 1}`}
                  value={s}
                  onChange={(e) => set("selos", d.selos.map((x, k) => (k === n ? e.target.value : x)))}
                />
              ))}
            </div>
          </Field>

          <div>
            <span className="text-[15px] font-semibold">
              Números do imóvel (até 4)
              <span className="ml-1.5 text-xs font-normal text-muted">(pode deixar em branco)</span>
            </span>
            <span className="mt-0.5 block text-sm text-ink-soft">
              Na esquerda, o que é; na direita, o valor. Ex.: <em>Dormitórios → 2</em>, <em>Garagem → 2 carros</em>,{" "}
              <em>Área privativa → 80 m²</em>. Linhas sem valor não aparecem no site.
            </span>
            <div className="mt-2 space-y-2">
              {d.specs.map((s, n) => (
                <div key={n} className="flex items-center gap-2">
                  <input
                    className={`${inputCls} min-w-0 flex-[3]`}
                    list="specs"
                    placeholder="O quê"
                    value={s.label}
                    onChange={(e) => set("specs", d.specs.map((x, k) => (k === n ? { ...x, label: e.target.value } : x)))}
                  />
                  <span className="text-muted">→</span>
                  <input
                    className={`${inputCls} min-w-0 flex-[2]`}
                    placeholder="Valor"
                    value={s.valor}
                    onChange={(e) => set("specs", d.specs.map((x, k) => (k === n ? { ...x, valor: e.target.value } : x)))}
                  />
                  <button type="button" className="btn-admin h-12 px-2.5" onClick={() => set("specs", d.specs.filter((_, k) => k !== n))} aria-label="Remover linha">
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
                <button type="button" className="btn-admin h-10" onClick={() => set("specs", [...d.specs, { label: "", valor: "" }])}>
                  <Plus className="size-4" /> Adicionar linha
                </button>
              )}
            </div>
            <span className="mt-1 block text-xs text-muted">📍 Onde aparece: numa faixa embaixo do título.</span>
          </div>

          <Field
            label="Frase embaixo do preço"
            explica={
              <>
                Uma frase curta sobre pagamento. Ex.: <em>Aceita financiamento e FGTS</em>. Em branco, aparece “Aceita
                financiamento. Entrada a partir de {entradaPadrao ? formatPreco(Number(digits(d.entradaMinima)) || entradaPadrao) : "R$ …"}”.
              </>
            }
          >
            <input className={inputCls} value={d.notaPreco} onChange={(e) => set("notaPreco", e.target.value)} />
          </Field>
        </Card>

        {/* ---------- 4. DESCRIÇÃO ---------- */}
        <Card numero={4} titulo="Descrição do imóvel" descricao="Textos que aparecem mais para baixo na página.">
          <Field
            label="Lista de diferenciais"
            explica="Escreva um diferencial por linha (no celular, toque em Enter/↵ para pular linha). Cada linha vira um item com ✓ na página."
            ondeAparece="na seção de diferenciais, no meio da página."
          >
            <textarea
              className={`${inputCls} h-44 py-2`}
              value={d.destaquesItens}
              placeholder={"Sacada com churrasqueira\nVaga de garagem coberta\nAcabamento com gesso\nPerto do centro"}
              onChange={(e) => set("destaquesItens", e.target.value)}
            />
          </Field>

          <Field
            label="Frase curta para a página inicial"
            explica="Uma frase que resume o imóvel. Ex.: Apartamento novo com suíte e sacada com churrasqueira."
            ondeAparece="no card deste imóvel na página inicial e em “Outros imóveis”."
          >
            <input className={inputCls} value={d.resumo} onChange={(e) => set("resumo", e.target.value)} />
          </Field>

          <Field
            label="Título acima das fotos"
            explica="Em branco, aparece “Conheça cada ambiente.”"
            ondeAparece="em cima da galeria de fotos."
          >
            <input className={inputCls} value={d.galeriaTitulo} placeholder="Ex.: É só trazer suas malas." onChange={(e) => set("galeriaTitulo", e.target.value)} />
          </Field>

          <Field label="Texto acima das fotos" explica="Um parágrafo curto apresentando o imóvel. Em branco, aparece “Fotos reais do imóvel.”" ondeAparece="embaixo do título da galeria.">
            <textarea className={`${inputCls} h-24 py-2`} value={d.galeriaTexto} onChange={(e) => set("galeriaTexto", e.target.value)} />
          </Field>

          <Field label="Título dos diferenciais" explica="Em branco, aparece “Diferenciais”. Ex.: O que fica para você." ondeAparece="em cima da lista de diferenciais.">
            <input className={inputCls} value={d.destaquesTitulo} onChange={(e) => set("destaquesTitulo", e.target.value)} />
          </Field>

          <Field label="Frase embaixo do título dos diferenciais" explica="Opcional. Ex.: Tudo o que está no imóvel já é seu.">
            <input className={inputCls} value={d.destaquesTexto} onChange={(e) => set("destaquesTexto", e.target.value)} />
          </Field>

          {d.fotos.length > 1 && (
            <Field label="Foto ao lado dos diferenciais" explica="Em branco, uso a 2ª foto da lista.">
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

        {/* ---------- 5. LOCALIZAÇÃO ---------- */}
        <Card numero={5} titulo="Localização" descricao="Aparece num quadro branco sobre uma foto, perto dos diferenciais.">
          <Field label="Cidade">
            <input className={inputCls} value={d.cidade} onChange={(e) => set("cidade", e.target.value)} />
          </Field>
          <Field label="Ponto de referência" explica="Algo que ajude a pessoa a se localizar. Ex.: 5 min do Centro, Perto da WEG II.">
            <input className={inputCls} value={d.referencia} onChange={(e) => set("referencia", e.target.value)} />
          </Field>
          <Field label="Sobre a região" explica="Uma ou duas frases sobre o bairro. Ex.: Bairro tranquilo, em crescimento, perto de escolas e mercado.">
            <textarea className={`${inputCls} h-24 py-2`} value={d.locTexto} onChange={(e) => set("locTexto", e.target.value)} />
          </Field>
        </Card>

        {/* ---------- 6. EXTRAS ---------- */}
        <details className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
          <summary className="cursor-pointer">
            <span className="font-display text-xl font-semibold">Opções extras</span>
            <span className="block text-sm text-muted">
              Pode pular esta parte. Tudo aqui é preenchido sozinho se ficar em branco.
            </span>
          </summary>
          <div className="mt-6 space-y-6">
            <Field
              label="Final do link da página"
              explica={
                editando
                  ? "⚠️ Só mude se for realmente necessário. Se mudar, os anúncios e links já divulgados com o endereço antigo param de funcionar."
                  : "Criado a partir do nome do imóvel. Só letras minúsculas, números e hífen. Normalmente não precisa mexer."
              }
            >
              <div className="flex items-center rounded-xl border border-line bg-white focus-within:border-gold">
                <span className="pl-3 text-sm text-muted">{origem}/</span>
                <input
                  className="h-12 w-full rounded-xl px-1 text-base outline-none"
                  value={d.slug}
                  placeholder={slugify(d.nome)}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                />
              </div>
            </Field>

            <Field
              label="Título no Google e na aba do navegador"
              explica="O título que aparece quando alguém pesquisa no Google ou compartilha o link. Em branco, uso nome + preço + bairro."
            >
              <input className={inputCls} value={d.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
            </Field>

            <Field
              label="Descrição ao compartilhar o link"
              explica="O textinho que aparece embaixo do título quando o link é enviado no WhatsApp ou aparece no Google. Em branco, é montado sozinho."
            >
              <textarea className={`${inputCls} h-24 py-2`} value={d.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
            </Field>

            <div>
              <span className="text-[15px] font-semibold">
                Antes e depois mobiliado (feito por IA)
                <span className="ml-1.5 text-xs font-normal text-muted">(pode deixar em branco)</span>
              </span>
              <span className="mt-0.5 block text-sm text-ink-soft">
                Serve para mostrar como um cômodo <strong>vazio</strong> ficaria mobiliado. Para cada cômodo, envie a
                foto real dele vazio e a mesma foto com móveis criada num aplicativo de inteligência artificial. Na
                página, o cliente toca num botão para alternar entre as duas. Se não tiver essas imagens, ignore.
              </span>
              <div className="mt-3 space-y-2">
                {d.comparativo.map((c, n) => (
                  <div key={n} className="space-y-2 rounded-xl border border-line p-3">
                    <input
                      className={inputCls}
                      placeholder="Nome do cômodo. Ex.: Sala"
                      value={c.titulo}
                      onChange={(e) => set("comparativo", d.comparativo.map((x, k) => (k === n ? { ...x, titulo: e.target.value } : x)))}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <ComparativoFoto valor={c.real} rotulo="Foto real (vazio)" slug={slugEfetivo} onChange={(src) => set("comparativo", d.comparativo.map((x, k) => (k === n ? { ...x, real: src } : x)))} />
                      <ComparativoFoto valor={c.mobiliado} rotulo="Foto com móveis (IA)" slug={slugEfetivo} onChange={(src) => set("comparativo", d.comparativo.map((x, k) => (k === n ? { ...x, mobiliado: src } : x)))} />
                    </div>
                    <button type="button" className="btn-admin h-9 text-red-600" onClick={() => set("comparativo", d.comparativo.filter((_, k) => k !== n))}>
                      <Trash2 className="size-4" /> Remover este cômodo
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-admin h-10" onClick={() => set("comparativo", [...d.comparativo, { titulo: "", real: "", mobiliado: "" }])}>
                  <Plus className="size-4" /> Adicionar cômodo
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
              <p className="font-medium text-red-600">⚠️ {erro}</p>
            ) : salvoEm ? (
              <p className="font-medium text-wa-dark">✓ Salvo às {salvoEm}. Já está no site.</p>
            ) : alterado ? (
              <p className="text-gold">Alterações ainda não salvas</p>
            ) : (
              <p className="text-muted">Nenhuma alteração</p>
            )}
          </div>
          {editando && (
            <a href={`/${imovel.slug}`} target="_blank" rel="noopener noreferrer" className="btn-admin h-12">
              <ExternalLink className="size-4" /> Ver
            </a>
          )}
          <button
            type="button"
            onClick={salvar}
            disabled={salvando || enviando > 0}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-7 text-base font-semibold text-white disabled:opacity-60"
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
    <label className="flex cursor-pointer flex-col items-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-line p-2 text-center text-xs">
      <span className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-sand">
        {enviando ? (
          <Loader2 className="size-5 animate-spin" />
        ) : valor ? (
          <img src={valor} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-6 text-muted" />
        )}
      </span>
      <span className="font-medium">{rotulo}</span>
      <span className="text-muted">{valor ? "Toque para trocar" : "Toque para enviar"}</span>
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
