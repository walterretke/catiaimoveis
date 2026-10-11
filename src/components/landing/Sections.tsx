import Image from "next/image";
import { CalendarCheck, Calculator, MessageCircle } from "lucide-react";
import { CORRETORA } from "@/content/site";
import { LeadButton } from "@/components/lead/LeadButton";

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
      <h2 className="font-display text-3xl leading-tight font-semibold text-ink md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{text}</p>}
    </div>
  );
}

const PASSOS = [
  {
    icon: MessageCircle,
    titulo: "Me chame no WhatsApp",
    texto: "Tiro suas dúvidas e envio mais fotos e vídeos do imóvel.",
  },
  {
    icon: Calculator,
    titulo: "Simulação sem compromisso",
    texto: "Calculo entrada e parcelas do financiamento para o seu perfil.",
  },
  {
    icon: CalendarCheck,
    titulo: "Visita agendada",
    texto: "Você conhece o imóvel pessoalmente, no horário que preferir.",
  },
];

export function ComoFunciona() {
  return (
    <section className="bg-sand px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Como funciona" title="Do primeiro “oi” até a chave na mão." />
        <ol className="grid gap-4 md:grid-cols-3">
          {PASSOS.map(({ icon: Icon, titulo, texto }, i) => (
            <li key={titulo} className="rounded-2xl bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-gold">
                  <Icon className="size-5" />
                </span>
                <span className="font-display text-sm font-semibold text-muted">Passo {i + 1}</span>
              </div>
              <p className="font-semibold text-ink">{titulo}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CtaFinal({ titulo, texto, botao }: { titulo: string; texto: string; botao?: string }) {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-3xl bg-ink px-6 py-12 text-center md:flex-row md:px-12 md:text-left">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-full ring-4 ring-gold/40 md:size-36">
          <Image src={CORRETORA.foto} alt={CORRETORA.nome} fill sizes="144px" className="object-cover object-top" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-3xl leading-tight font-semibold text-white md:text-4xl">{titulo}</h2>
          <p className="mt-3 text-white/70">{texto}</p>
          <LeadButton className="mt-6 w-full md:w-auto">{botao}</LeadButton>
          <p className="mt-3 text-xs text-white/50">
            Atendimento direto com {CORRETORA.nome} • <span className="whitespace-nowrap">CRECI {CORRETORA.creci}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
