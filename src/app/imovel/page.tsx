import type { Metadata } from "next";
import Image from "next/image";
import { Lock } from "lucide-react";
import { CORRETORA } from "@/content/site";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { LeadButton } from "@/components/lead/LeadButton";

// Página genérica para anúncios de imóveis sem landing própria:
//   /imovel?nome=Casa%20no%20Centro&valor=450.000

export const metadata: Metadata = {
  title: "Atendimento exclusivo",
  robots: { index: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function param(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim().slice(0, 120) : undefined;
}

export default async function ImovelGenericoPage({ searchParams }: Props) {
  const params = await searchParams;
  const nome = param(params.nome) ?? param(params.imovel); // `imovel` = links antigos
  const valor = param(params.valor);
  const assunto = nome ? `${nome}${valor ? ` (R$ ${valor})` : ""}` : undefined;

  return (
    <LeadProvider assunto={assunto} contentName="imovel-generico">
      <main className="flex min-h-dvh items-center justify-center bg-sand px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white p-6 text-center shadow-xl shadow-ink/5 md:p-8">
            <div className="relative mx-auto -mt-16 size-24 overflow-hidden rounded-full ring-4 ring-white">
              <Image src={CORRETORA.foto} alt={CORRETORA.nome} fill priority sizes="96px" className="object-cover object-top" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">{CORRETORA.nome}</p>
            <p className="text-xs text-muted">Corretora • CRECI {CORRETORA.creci}</p>

            <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Atendimento exclusivo</h1>
            <p className="mt-3 rounded-2xl bg-sand p-4 text-left text-[15px] leading-relaxed text-ink-soft">
              Olá! Estou pronta para te passar todas as informações {nome ? (
                <>
                  do <strong>{nome}</strong>
                  {valor && ` (R$ ${valor})`}
                </>
              ) : (
                "do seu próximo imóvel"
              )}
              . Clique abaixo para falar comigo diretamente no WhatsApp.
            </p>

            <LeadButton className="mt-6 w-full">Falar no WhatsApp</LeadButton>
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="size-3.5" /> Sem cadastro. Você conversa direto comigo.
          </p>
        </div>
      </main>
    </LeadProvider>
  );
}
