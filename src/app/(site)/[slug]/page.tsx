import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPreco, isListado, isPublicado } from "@/content/imoveis";
import { getImovel, getImoveis } from "@/lib/store";
import { CORRETORA, siteUrl } from "@/content/site";
import { ImovelPage } from "@/components/landing/ImovelPage";

type Props = { params: Promise<{ slug: string }> };

// Imóveis criados depois do deploy são gerados na primeira visita.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getImoveis()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const imovel = await getImovel((await params).slug);
  if (!imovel) return {};
  const og = imovel.ogImage || imovel.capa;
  return {
    title: { absolute: imovel.seo.title },
    description: imovel.seo.description,
    alternates: { canonical: `/${imovel.slug}` },
    ...(!isPublicado(imovel) && { robots: { index: false } }),
    openGraph: {
      title: imovel.seo.title,
      description: imovel.seo.description,
      url: `/${imovel.slug}`,
      images: [{ url: og }],
    },
  };
}

export default async function Page({ params }: Props) {
  const imovel = await getImovel((await params).slug);
  if (!imovel) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: imovel.seo.title,
    description: imovel.seo.description,
    url: `${siteUrl()}/${imovel.slug}`,
    image: imovel.galeria.fotos.slice(0, 5).map((f) => (f.src.startsWith("http") ? f.src : `${siteUrl()}${f.src}`)),
    offers: {
      "@type": "Offer",
      price: imovel.preco,
      priceCurrency: "BRL",
      availability:
        imovel.status === "vendido" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      description: formatPreco(imovel.preco),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaraguá do Sul",
      addressRegion: "SC",
      addressCountry: "BR",
    },
    broker: { "@type": "RealEstateAgent", name: CORRETORA.nome, telephone: CORRETORA.telefone },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImovelPage imovel={imovel} listados={(await getImoveis()).filter(isListado)} />
    </>
  );
}
