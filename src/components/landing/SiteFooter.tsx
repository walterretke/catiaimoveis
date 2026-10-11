import Link from "next/link";
import { CORRETORA } from "@/content/site";
import type { Imovel } from "@/content/imoveis";
import { InstagramIcon } from "@/components/icons";

export function SiteFooter({ imoveis }: { imoveis: Imovel[] }) {
  return (
    <footer className="bg-ink px-4 pt-14 pb-28 text-white/80 md:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold text-white">{CORRETORA.nome}</p>
          <p className="mt-1 text-sm text-gold">
            CRECI {CORRETORA.creci} • {CORRETORA.rede}
          </p>
          <div className="mt-5 space-y-0.5 text-sm text-white/60">
            {CORRETORA.endereco.map((linha) => (
              <p key={linha}>{linha}</p>
            ))}
            <p>CNPJ: {CORRETORA.cnpj}</p>
          </div>
        </div>

        <nav aria-label="Imóveis">
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/50 uppercase">Imóveis</p>
          <ul className="space-y-2.5 text-sm">
            {imoveis.map((i) => (
              <li key={i.slug}>
                <Link href={`/${i.slug}`} className="transition hover:text-white">
                  {i.titulo.join(" ")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/50 uppercase">Contato</p>
          <ul className="space-y-2.5 text-sm">
            <li>{CORRETORA.telefone}</li>
            <li>
              <a
                href={CORRETORA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <InstagramIcon className="size-4" /> {CORRETORA.instagramHandle}
              </a>
            </li>
            <li>
              <Link href="/" className="transition hover:text-white">
                Página da corretora
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="transition hover:text-white">
                Política de privacidade
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} {CORRETORA.nome} Imóveis • CRECI {CORRETORA.creci}
      </p>
    </footer>
  );
}
