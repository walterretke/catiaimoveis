import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPreco, type Imovel } from "@/content/imoveis";

export function ImovelCard({ imovel }: { imovel: Imovel }) {
  return (
    <Link
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
        <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
          {imovel.titulo.filter(Boolean).join(" ")}
        </h3>
        {imovel.resumo && <p className="mt-2 line-clamp-2 text-sm text-muted">{imovel.resumo}</p>}
        <div className="mt-4 flex items-center justify-between">
          <p className="font-display text-xl font-semibold text-ink">{formatPreco(imovel.preco)}</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold">
            Ver imóvel <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
