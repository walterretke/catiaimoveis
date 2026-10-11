import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { assuntoWhatsApp, entradaMinimaDe, formatPreco, type Imovel } from "@/content/imoveis";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { LeadButton } from "@/components/lead/LeadButton";
import { StickyLeadBar } from "@/components/lead/StickyLeadBar";
import { AiCompare } from "./AiCompare";
import { BrokerPill } from "./BrokerPill";
import { Gallery } from "./Gallery";
import { ComoFunciona, CtaFinal, SectionHeading } from "./Sections";
import { SiteFooter } from "./SiteFooter";

const SPEC_COLS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"];

interface Props {
  imovel: Imovel;
  /** Imóveis listados no site (para o rodapé e para sugerir quando vendido). */
  listados: Imovel[];
}

export function ImovelPage({ imovel, listados }: Props) {
  const vendido = imovel.status === "vendido";
  const preco = formatPreco(imovel.preco);
  const outros = listados.filter((i) => i.slug !== imovel.slug);

  return (
    <LeadProvider
      contentName={imovel.slug}
      entradaMinima={entradaMinimaDe(imovel)}
      assunto={vendido ? `imóvel parecido com o ${imovel.nome}` : assuntoWhatsApp(imovel)}
    >
      <main>
        {/* HERO */}
        <section className="relative flex min-h-[92svh] flex-col bg-ink md:min-h-[85vh]">
          <Image
            src={imovel.capa}
            alt={`${imovel.tipo} ${imovel.nome}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

          <header className="relative z-10 mx-auto flex w-full max-w-6xl px-4 pt-4 md:pt-6">
            <BrokerPill />
          </header>

          <div className="relative z-10 mx-auto mt-auto w-full max-w-6xl px-4 pb-8 md:pb-14">
            <div className="mb-4 flex flex-wrap gap-2">
              {vendido ? (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Vendido</span>
              ) : (
                imovel.selos.map((selo, i) => (
                  <span
                    key={selo}
                    className={
                      i === 0
                        ? "rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white"
                        : "rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                    }
                  >
                    {selo}
                  </span>
                ))
              )}
            </div>

            <h1 className="font-display text-5xl leading-[0.95] font-semibold text-white md:text-7xl">
              {imovel.titulo[0]}{" "}
              {imovel.titulo[1] && <span className="block text-gold-soft">{imovel.titulo[1]}</span>}
            </h1>

            <p className="mt-3 flex items-center gap-1.5 text-sm text-white/75">
              <MapPin className="size-4" /> {imovel.localizacao.bairro}, {imovel.localizacao.cidade}
            </p>

            {imovel.specs.length > 0 && (
            <dl
              className={`mt-6 grid max-w-xl ${SPEC_COLS[imovel.specs.length]} divide-x divide-white/15 rounded-2xl bg-white/10 py-3 backdrop-blur-md`}
            >
              {imovel.specs.map((s) => (
                <div key={s.label} className="px-3 text-center">
                  <dt className="text-[11px] text-white/60">{s.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-white md:text-base">{s.valor}</dd>
                </div>
              ))}
            </dl>
            )}

            <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                {imovel.precoAntigo && !vendido && (
                  <p className="text-sm text-white/50 line-through">De {formatPreco(imovel.precoAntigo)}</p>
                )}
                <p className={`font-display text-5xl font-semibold text-white md:text-6xl ${vendido ? "line-through opacity-60" : ""}`}>
                  {preco}
                </p>
                {!vendido && <p className="mt-1 text-sm text-white/70">{imovel.notaPreco}</p>}
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <LeadButton className="w-full md:w-auto">
                  {vendido ? "Quero opções parecidas" : "Quero mais informações"}
                </LeadButton>
                <p className="text-center text-xs text-white/60 md:text-right">
                  Resposta rápida, direto com a corretora
                </p>
              </div>
            </div>
          </div>
        </section>

        {vendido && outros.length > 0 && (
          <section className="border-b border-line bg-gold-soft px-4 py-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="font-medium text-ink">Este imóvel já foi vendido. Veja outras oportunidades:</p>
              <div className="flex flex-wrap gap-2">
                {outros.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/${o.slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink"
                  >
                    {o.titulo.join(" ")} <ArrowRight className="size-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALERIA */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Fotos reais" title={imovel.galeria.titulo} text={imovel.galeria.texto} />
            <Gallery fotos={imovel.galeria.fotos} />
          </div>
        </section>

        {imovel.comparativoIA && (
          <section className="px-4 pb-16 md:pb-24">
            <div className="mx-auto max-w-6xl">
              <SectionHeading
                eyebrow="Imagine morando aqui"
                title="Veja os ambientes mobiliados."
                text="Toque em “Mobiliado” para ver uma sugestão de decoração."
              />
              <AiCompare itens={imovel.comparativoIA} />
            </div>
          </section>
        )}

        {/* DESTAQUES + LOCALIZAÇÃO */}
        <section className="bg-white px-4 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading eyebrow="Diferenciais" title={imovel.destaques.titulo} text={imovel.destaques.texto} />
              <ul className="divide-y divide-line border-y border-line">
                {imovel.destaques.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3 py-3.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-[420px] overflow-hidden rounded-3xl bg-sand md:h-[560px] lg:sticky lg:top-8">
              <Image
                src={imovel.destaques.imagem}
                alt={imovel.nome}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-5 backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{imovel.localizacao.bairro}</p>
                    <p className="text-xs font-medium text-gold">
                      {imovel.localizacao.referencia || imovel.localizacao.cidade}
                    </p>
                    {imovel.localizacao.texto && (
                      <p className="mt-2 text-sm leading-relaxed text-muted">{imovel.localizacao.texto}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ComoFunciona />

        <CtaFinal
          titulo={vendido ? "Vamos achar outro para você?" : "Gostou? Vamos conversar."}
          texto={
            vendido
              ? "Tenho outras opções com o mesmo perfil. Me chame e eu te envio."
              : `Te envio mais fotos, vídeos e uma simulação do ${imovel.nome}.`
          }
          botao={vendido ? "Quero opções parecidas" : undefined}
        />
      </main>

      <SiteFooter imoveis={listados} />
      <StickyLeadBar preco={vendido ? undefined : preco} nota={vendido ? undefined : imovel.notaPreco} />
    </LeadProvider>
  );
}
