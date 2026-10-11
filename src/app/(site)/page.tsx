import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Home, MapPin, ShieldCheck, Star, TreePine, Waves } from "lucide-react";
import { formatPreco, isListado } from "@/content/imoveis";
import { getImoveis } from "@/lib/store";
import { CORRETORA } from "@/content/site";
import { InstagramIcon } from "@/components/icons";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { LeadButton } from "@/components/lead/LeadButton";
import { StickyLeadBar } from "@/components/lead/StickyLeadBar";
import { ComoFunciona, CtaFinal, SectionHeading } from "@/components/landing/Sections";
import { SiteFooter } from "@/components/landing/SiteFooter";

const PERFIS = [
  { icon: Home, titulo: "Casas & aptos", texto: "Sua nova moradia com conforto." },
  { icon: TreePine, titulo: "Chácaras", texto: "Paz e natureza no interior." },
  { icon: Waves, titulo: "Litoral", texto: "O refúgio perfeito no mar." },
  { icon: Star, titulo: "Investimentos", texto: "Oportunidades com potencial de valorização." },
];

export default async function HomePage() {
  const disponiveis = (await getImoveis()).filter(isListado);

  return (
    <LeadProvider contentName="home">
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-ink px-4 pt-14 pb-16 md:pt-24 md:pb-24">
          <div className="pointer-events-none absolute -top-40 -right-40 size-[480px] rounded-full bg-gold/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <div className="text-center md:text-left">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold text-gold-soft">
                <Award className="size-3.5" /> +20 anos de experiência
              </p>
              <h1 className="font-display text-5xl leading-[1.02] font-semibold text-white md:text-7xl">
                {CORRETORA.nome}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70 md:mx-0">
                Corretora de imóveis em Jaraguá do Sul e região norte de Santa Catarina. Te ajudo a encontrar o
                imóvel certo para o seu momento — e a fazer a conta fechar.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <LeadButton>Falar no WhatsApp</LeadButton>
                <a
                  href={CORRETORA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 font-semibold text-white transition hover:bg-white/10"
                >
                  <InstagramIcon className="size-5" /> Instagram
                </a>
              </div>
              <p className="mt-4 text-xs text-white/50">
                CRECI {CORRETORA.creci} • {CORRETORA.rede}
              </p>
            </div>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] ring-1 ring-white/10">
              <Image
                src={CORRETORA.foto}
                alt={CORRETORA.nome}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 400px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* IMÓVEIS */}
        <section className="px-4 py-16 md:py-24" id="imoveis">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Oportunidades" title="Imóveis disponíveis" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {disponiveis.map((imovel) => (
                <Link
                  key={imovel.slug}
                  href={`/${imovel.slug}`}
                  className="group overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-sand">
                    <Image
                      src={imovel.capa}
                      alt={imovel.nome}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">
                      {imovel.selos[0] ?? imovel.tipo}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-muted">
                      {imovel.tipo} • {imovel.localizacao.bairro}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{imovel.titulo.join(" ")}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{imovel.resumo}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-display text-xl font-semibold text-ink">{formatPreco(imovel.preco)}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold">
                        Ver imóvel <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              Não encontrou o que procura? Tenho outras opções que não estão no site — é só me chamar.
            </p>
          </div>
        </section>

        {/* SOBRE */}
        <section className="bg-white px-4 pb-16 md:pb-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <SectionHeading
                eyebrow="Rede Domus"
                title="Segurança para comprar, agilidade para financiar."
                text="Como parte dos Corretores Associados Domus, ofereço segurança jurídica e as melhores oportunidades de Jaraguá do Sul."
              />
              <ul className="grid gap-3">
                {[
                  "Processos de financiamento ágeis",
                  "Consultoria para investimentos",
                  "Atendimento personalizado",
                  "Amplo portfólio de imóveis selecionados",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-ink">
                    <ShieldCheck className="size-5 shrink-0 text-gold" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PERFIS.map(({ icon: Icon, titulo, texto }) => (
                <div key={titulo} className="rounded-2xl bg-sand p-5">
                  <Icon className="mb-3 size-6 text-gold" />
                  <p className="font-semibold text-ink">{titulo}</p>
                  <p className="mt-1 text-sm text-muted">{texto}</p>
                </div>
              ))}
              <div className="col-span-2 flex items-start gap-3 rounded-2xl bg-ink p-5 text-white">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm text-white/80">
                  <strong className="text-white">Jaraguá do Sul</strong> e região: Joinville, Guaramirim, Schroeder e
                  litoral catarinense.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ComoFunciona />

        <CtaFinal
          titulo="Vamos encontrar o seu imóvel?"
          texto="Me conte o que você procura e eu te envio as melhores opções."
        />
      </main>

      <SiteFooter imoveis={disponiveis} />
      <StickyLeadBar />
    </LeadProvider>
  );
}
