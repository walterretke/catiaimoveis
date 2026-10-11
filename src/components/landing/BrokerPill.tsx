import Image from "next/image";
import Link from "next/link";
import { CORRETORA } from "@/content/site";
import { InstagramIcon } from "@/components/icons";

/** Identificação da corretora no topo das páginas (sobre a foto do hero). */
export function BrokerPill() {
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-black/30 py-1.5 pr-1.5 pl-1.5 ring-1 ring-white/20 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2.5" aria-label="Página da corretora">
        <span className="relative size-9 overflow-hidden rounded-full ring-2 ring-white/60">
          <Image src={CORRETORA.foto} alt={CORRETORA.nome} fill sizes="36px" className="object-cover object-top" priority />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white">{CORRETORA.nome}</span>
          <span className="text-[11px] text-white/70">Corretora • CRECI {CORRETORA.creci}</span>
        </span>
      </Link>
      <a
        href={CORRETORA.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram da corretora"
        className="ml-1 rounded-full p-2 text-white transition hover:bg-white/15"
      >
        <InstagramIcon className="size-4" />
      </a>
    </div>
  );
}
